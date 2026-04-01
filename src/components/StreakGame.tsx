'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ATHLETES } from '@/data/athletes';
import type { Athlete } from '@/types/game';
import {
  loadPersonalBest,
  savePersonalBest,
  loadLeaderboard,
  saveLeaderboardEntry,
  type StreakScore,
} from '@/lib/streakStorage';

const QUESTION_TIME = 10; // seconds per question
const CORRECT_DELAY = 700; // ms to show green before next question
const WRONG_DELAY = 1200; // ms to show red before game over

type Phase = 'idle' | 'question' | 'correct' | 'wrong' | 'timeout' | 'gameover';

// Build a deduplicated list of countries from the athlete pool
const ALL_COUNTRIES = ATHLETES.map((a) => a.country).filter((c, i, arr) => arr.indexOf(c) === i);

function getDistractors(correct: string, count = 3): string[] {
  const pool = ALL_COUNTRIES.filter((c) => c !== correct);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function pickNextAthlete(usedIds: Set<string>): Athlete {
  const available = ATHLETES.filter((a) => !usedIds.has(a.id));
  // If we've gone through all athletes, reset the used pool
  const pool = available.length > 0 ? available : ATHLETES;
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function StreakGame() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [athlete, setAthlete] = useState<Athlete | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [personalBest, setPersonalBest] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState<StreakScore[]>([]);
  const usedIds = useRef<Set<string>>(new Set());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load personal best on mount
  useEffect(() => {
    setPersonalBest(loadPersonalBest());
    setLeaderboard(loadLeaderboard());
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const loadNextAthlete = useCallback(() => {
    const next = pickNextAthlete(usedIds.current);
    usedIds.current.add(next.id);
    const distractors = getDistractors(next.country);
    setAthlete(next);
    setOptions(shuffleArray([next.country, ...distractors]));
    setSelectedAnswer(null);
    setTimeLeft(QUESTION_TIME);
    setPhase('question');
  }, []);

  const endGame = useCallback((finalStreak: number) => {
    clearTimer();
    savePersonalBest(finalStreak);
    saveLeaderboardEntry(finalStreak);
    setPersonalBest(loadPersonalBest());
    setLeaderboard(loadLeaderboard());
    setPhase('gameover');
  }, [clearTimer]);

  // Countdown timer
  useEffect(() => {
    if (phase !== 'question') return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearTimer();
          setPhase('timeout');
          setTimeout(() => endGame(streak), WRONG_DELAY);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return clearTimer;
  }, [phase, streak, clearTimer, endGame]);

  const handleAnswer = useCallback((answer: string) => {
    if (phase !== 'question' || !athlete) return;
    clearTimer();
    setSelectedAnswer(answer);

    if (answer === athlete.country) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setPhase('correct');
      setTimeout(() => loadNextAthlete(), CORRECT_DELAY);
    } else {
      setPhase('wrong');
      setTimeout(() => endGame(streak), WRONG_DELAY);
    }
  }, [phase, athlete, streak, clearTimer, loadNextAthlete, endGame]);

  const handleStart = useCallback(() => {
    usedIds.current = new Set();
    setStreak(0);
    setSelectedAnswer(null);
    loadNextAthlete();
  }, [loadNextAthlete]);

  const timerPct = (timeLeft / QUESTION_TIME) * 100;
  const timerColor = timeLeft <= 3
    ? 'bg-apple-red dark:bg-apple-red-dark'
    : timeLeft <= 5
      ? 'bg-apple-orange dark:bg-apple-orange-dark'
      : 'bg-apple-green dark:bg-apple-green-dark';

  const getButtonStyle = (option: string) => {
    if (!selectedAnswer && phase === 'question') {
      return 'bg-apple-card dark:bg-apple-card-dark border-apple-separator dark:border-apple-separator-dark text-apple-label dark:text-apple-label-dark hover:border-apple-blue dark:hover:border-apple-blue-dark active:scale-95';
    }
    if (athlete && option === athlete.country) {
      return 'bg-apple-green/15 dark:bg-apple-green-dark/15 border-apple-green dark:border-apple-green-dark text-apple-green dark:text-apple-green-dark';
    }
    if (option === selectedAnswer && option !== athlete?.country) {
      return 'bg-apple-red/15 dark:bg-apple-red-dark/15 border-apple-red dark:border-apple-red-dark text-apple-red dark:text-apple-red-dark';
    }
    return 'bg-apple-card dark:bg-apple-card-dark border-apple-separator dark:border-apple-separator-dark text-apple-secondary dark:text-apple-secondary-dark opacity-40';
  };

  return (
    <div className="min-h-screen bg-apple-bg dark:bg-apple-bg-dark flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 safe-top">
        <div className="header-blur border-b border-apple-separator dark:border-apple-separator-dark">
          <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
            <Link
              href="/"
              className="btn-icon flex items-center gap-1.5 text-[13px] font-medium text-apple-secondary dark:text-apple-secondary-dark"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Daily
            </Link>

            <div className="flex flex-col items-center gap-0.5">
              <h1 className="text-[15px] font-bold tracking-tight text-apple-label dark:text-apple-label-dark leading-none">
                Streak Mode
              </h1>
              <span className="text-[11px] text-apple-secondary dark:text-apple-secondary-dark leading-none">
                Guess the origin
              </span>
            </div>

            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-apple-yellow/20 dark:bg-apple-yellow-dark/20">
              <span className="text-[12px]">⭐</span>
              <span className="text-[12px] font-bold text-apple-label dark:text-apple-label-dark tabular-nums">
                {personalBest}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6 pb-24 flex flex-col gap-5">

        {/* ── IDLE STATE ── */}
        {phase === 'idle' && (
          <div className="flex flex-col items-center gap-6 py-8 text-center animate-slide-up">
            <div className="text-7xl animate-float">⚡</div>
            <div>
              <h2 className="text-[26px] font-black text-apple-label dark:text-apple-label-dark tracking-tight">
                Streak Mode
              </h2>
              <p className="text-[15px] text-apple-secondary dark:text-apple-secondary-dark mt-2 leading-relaxed">
                An athlete&apos;s name is shown. Pick the country they&apos;re from — before the timer runs out.
              </p>
            </div>

            <div className="w-full grid grid-cols-3 gap-3">
              {[
                { icon: '🌍', label: 'Pick country', sub: '4 choices' },
                { icon: '⏱️', label: '10 seconds', sub: 'per question' },
                { icon: '💥', label: 'One mistake', sub: 'ends the run' },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-1 p-3 rounded-apple bg-apple-card dark:bg-apple-card-dark">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-[12px] font-semibold text-apple-label dark:text-apple-label-dark">{item.label}</span>
                  <span className="text-[10px] text-apple-secondary dark:text-apple-secondary-dark">{item.sub}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleStart}
              className="w-full py-4 rounded-apple-lg bg-apple-blue dark:bg-apple-blue-dark text-white font-bold text-[17px] shadow-apple-blue active:scale-95 transition-transform"
            >
              Start Streak
            </button>

            {leaderboard.length > 0 && (
              <button
                onClick={() => setShowLeaderboard((s) => !s)}
                className="text-[14px] font-medium text-apple-blue dark:text-apple-blue-dark"
              >
                {showLeaderboard ? 'Hide' : 'View'} Leaderboard
              </button>
            )}
          </div>
        )}

        {/* ── GAME OVER STATE ── */}
        {phase === 'gameover' && (
          <div className="flex flex-col items-center gap-5 py-6 text-center animate-slide-up">
            <div className="text-6xl">{streak === 0 ? '😅' : streak >= 10 ? '🏆' : streak >= 5 ? '🔥' : '💪'}</div>

            <div>
              <p className="text-[14px] font-medium text-apple-secondary dark:text-apple-secondary-dark uppercase tracking-wider">
                {streak > personalBest ? 'New Personal Best!' : 'Game Over'}
              </p>
              <p className="text-[52px] font-black tabular-nums text-apple-label dark:text-apple-label-dark leading-none mt-1">
                {streak}
              </p>
              <p className="text-[14px] text-apple-secondary dark:text-apple-secondary-dark mt-1">
                correct in a row
              </p>
            </div>

            {athlete && (
              <div className="w-full p-4 rounded-apple bg-apple-card dark:bg-apple-card-dark border border-apple-separator dark:border-apple-separator-dark text-left">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-apple-secondary dark:text-apple-secondary-dark mb-1">
                  The answer was
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{athlete.emoji}</span>
                  <div>
                    <p className="text-[15px] font-bold text-apple-label dark:text-apple-label-dark">{athlete.name}</p>
                    <p className="text-[13px] text-apple-secondary dark:text-apple-secondary-dark">{athlete.country} · {athlete.sport}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="w-full flex gap-3">
              <button
                onClick={handleStart}
                className="flex-1 py-4 rounded-apple-lg bg-apple-blue dark:bg-apple-blue-dark text-white font-bold text-[15px] shadow-apple-blue active:scale-95 transition-transform"
              >
                Play Again
              </button>
              <button
                onClick={() => setShowLeaderboard((s) => !s)}
                className="px-5 py-4 rounded-apple-lg bg-apple-card dark:bg-apple-card-dark border border-apple-separator dark:border-apple-separator-dark text-apple-label dark:text-apple-label-dark font-semibold text-[14px] active:scale-95 transition-transform"
              >
                🏆 Scores
              </button>
            </div>
          </div>
        )}

        {/* ── ACTIVE GAME (question / correct / wrong / timeout) ── */}
        {(phase === 'question' || phase === 'correct' || phase === 'wrong' || phase === 'timeout') && athlete && (
          <>
            {/* Streak counter */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-apple-secondary dark:text-apple-secondary-dark uppercase tracking-wider">
                  Streak
                </span>
                <span className="text-[26px] font-black tabular-nums text-apple-label dark:text-apple-label-dark leading-none">
                  {streak}
                </span>
                {streak > 0 && streak % 5 === 0 && (
                  <span className="text-xl animate-bounce-in">🔥</span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-[13px] text-apple-secondary dark:text-apple-secondary-dark">
                <span>⭐ Best:</span>
                <span className="font-bold text-apple-label dark:text-apple-label-dark">{personalBest}</span>
              </div>
            </div>

            {/* Timer bar */}
            <div className="w-full h-1.5 bg-apple-separator dark:bg-apple-separator-dark rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 linear ${timerColor}`}
                style={{ width: `${timerPct}%` }}
              />
            </div>

            {/* Athlete card */}
            <div
              className={`
                relative overflow-hidden rounded-apple-xl p-6 text-center
                transition-colors duration-300
                ${phase === 'correct'
                  ? 'bg-apple-green/10 dark:bg-apple-green-dark/10 border border-apple-green/30 dark:border-apple-green-dark/30'
                  : phase === 'wrong' || phase === 'timeout'
                    ? 'bg-apple-red/10 dark:bg-apple-red-dark/10 border border-apple-red/30 dark:border-apple-red-dark/30'
                    : 'bg-apple-card dark:bg-apple-card-dark border border-apple-separator dark:border-apple-separator-dark'
                }
              `}
            >
              <div className="text-4xl mb-3">{athlete.emoji}</div>
              <h2 className="text-[26px] font-black text-apple-label dark:text-apple-label-dark tracking-tight leading-tight">
                {athlete.name}
              </h2>
              <p className="text-[13px] text-apple-secondary dark:text-apple-secondary-dark mt-1">
                {athlete.sport}
              </p>

              {/* Feedback overlay */}
              {phase === 'correct' && (
                <div className="absolute inset-0 flex items-center justify-center animate-bounce-in pointer-events-none">
                  <span className="text-6xl">✓</span>
                </div>
              )}
              {(phase === 'wrong' || phase === 'timeout') && (
                <div className="absolute inset-0 flex items-center justify-center animate-bounce-in pointer-events-none">
                  <span className="text-6xl">{phase === 'timeout' ? '⏰' : '✗'}</span>
                </div>
              )}
            </div>

            {/* Timer label */}
            <div className="text-center">
              <span className={`text-[14px] font-semibold tabular-nums ${
                timeLeft <= 3 ? 'text-apple-red dark:text-apple-red-dark' : 'text-apple-secondary dark:text-apple-secondary-dark'
              }`}>
                {phase === 'question' ? `${timeLeft}s remaining` : phase === 'timeout' ? 'Time\'s up!' : ''}
              </span>
            </div>

            {/* Answer buttons */}
            <div className="grid grid-cols-2 gap-3">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={phase !== 'question'}
                  className={`
                    py-4 px-3 rounded-apple-lg border text-[15px] font-semibold
                    transition-all duration-200 active:scale-95
                    ${getButtonStyle(option)}
                  `}
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        )}

        {/* ── LEADERBOARD ── */}
        {showLeaderboard && leaderboard.length > 0 && (
          <div className="flex flex-col gap-2 animate-slide-up">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-semibold text-apple-label dark:text-apple-label-dark uppercase tracking-wider">
                🏆 Your Best Runs
              </p>
              <button
                onClick={() => setShowLeaderboard(false)}
                className="text-[13px] text-apple-secondary dark:text-apple-secondary-dark"
              >
                Hide
              </button>
            </div>
            <div className="rounded-apple overflow-hidden border border-apple-separator dark:border-apple-separator-dark">
              {leaderboard.map((entry, i) => (
                <div
                  key={entry.timestamp}
                  className={`flex items-center justify-between px-4 py-3 ${
                    i !== leaderboard.length - 1 ? 'border-b border-apple-separator dark:border-apple-separator-dark' : ''
                  } ${i % 2 === 0 ? 'bg-apple-card dark:bg-apple-card-dark' : 'bg-apple-bg dark:bg-apple-card2-dark'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[14px] font-black text-apple-secondary dark:text-apple-secondary-dark w-5 text-right">
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                    </span>
                    <span className="text-[15px] font-bold text-apple-label dark:text-apple-label-dark tabular-nums">
                      {entry.streak} streak
                    </span>
                  </div>
                  <span className="text-[12px] text-apple-secondary dark:text-apple-secondary-dark">
                    {entry.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
