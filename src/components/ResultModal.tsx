'use client';

import { useEffect, useState } from 'react';
import type { GameState, PlayerStats, Achievement } from '@/types/game';
import type { Athlete } from '@/types/game';
import { ACHIEVEMENT_META } from '@/types/game';
import { getLevelTitle, buildShareText } from '@/lib/storage';
import Confetti from './Confetti';
import { getDayNumber } from '@/data/athletes';

interface ResultModalProps {
  gameState: GameState;
  athlete: Athlete;
  stats: PlayerStats;
  newAchievements: Achievement[];
  onClose: () => void;
}

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    function update() {
      const now = new Date();
      const tomorrow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
      const diff = tomorrow.getTime() - now.getTime();
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1000);
      setTimeLeft(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center gap-1 p-4 rounded-apple bg-apple-bg dark:bg-apple-card2-dark">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-apple-secondary dark:text-apple-secondary-dark">
        Next Puzzle In
      </span>
      <span className="text-[28px] font-black tabular-nums text-apple-label dark:text-apple-label-dark">
        {timeLeft}
      </span>
    </div>
  );
}

export default function ResultModal({ gameState, athlete, stats, newAchievements, onClose }: ResultModalProps) {
  const [copied, setCopied] = useState(false);
  const won = gameState.status === 'won';
  const dayNumber = getDayNumber();

  async function handleShare() {
    const text = buildShareText(gameState, dayNumber);
    try {
      if (navigator.share) {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback: do nothing silently
    }
  }

  const scoreColor =
    gameState.score >= 800 ? 'text-apple-green dark:text-apple-green-dark' :
    gameState.score >= 400 ? 'text-apple-orange dark:text-apple-orange-dark' :
    gameState.score > 0    ? 'text-apple-red dark:text-apple-red-dark' :
    'text-apple-secondary dark:text-apple-secondary-dark';

  return (
    <>
      {won && <Confetti />}

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden
      />

      {/* Modal */}
      <div className="
        fixed inset-x-4 bottom-4 z-50 max-w-lg mx-auto
        bg-apple-card dark:bg-apple-card-dark
        rounded-apple-2xl shadow-apple-lg
        animate-slide-up overflow-hidden
        safe-bottom
      ">
        {/* Header band */}
        <div className={`px-6 pt-6 pb-4 text-center ${won ? 'result-header-win' : 'result-header-loss'}`}>
          <div className="text-4xl mb-2">{won ? '🏆' : '😔'}</div>
          <h2 className="text-white text-[22px] font-black tracking-tight">
            {won ? 'You got it!' : 'Better luck tomorrow'}
          </h2>
          <p className="text-white/70 text-[13px] mt-1">
            {won
              ? `Guessed in ${gameState.revealedClues} clue${gameState.revealedClues !== 1 ? 's' : ''}`
              : 'The answer was…'
            }
          </p>
        </div>

        <div className="px-5 pb-5 pt-4 flex flex-col gap-4">
          {/* Athlete reveal */}
          <div className="flex items-center gap-4 p-4 rounded-apple bg-apple-bg dark:bg-apple-card2-dark">
            <div className="w-12 h-12 rounded-full bg-apple-separator dark:bg-apple-separator-dark flex items-center justify-center text-2xl flex-shrink-0">
              {athlete.emoji}
            </div>
            <div className="min-w-0">
              <p className="text-[17px] font-bold text-apple-label dark:text-apple-label-dark truncate">
                {athlete.name}
              </p>
              <p className="text-[13px] text-apple-secondary dark:text-apple-secondary-dark">
                {athlete.sport} · {athlete.country} · b. {athlete.birthYear}
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center gap-1 p-3 rounded-apple bg-apple-bg dark:bg-apple-card2-dark">
              <span className={`text-[26px] font-black tabular-nums leading-none ${scoreColor}`}>
                {gameState.score.toLocaleString()}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-apple-secondary dark:text-apple-secondary-dark">
                Score
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 p-3 rounded-apple bg-apple-bg dark:bg-apple-card2-dark">
              <span className="text-[26px] font-black tabular-nums leading-none text-apple-orange dark:text-apple-orange-dark">
                {stats.currentStreak > 0 ? `🔥${stats.currentStreak}` : '0'}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-apple-secondary dark:text-apple-secondary-dark">
                Streak
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 p-3 rounded-apple bg-apple-bg dark:bg-apple-card2-dark">
              <span className="text-[26px] font-black tabular-nums leading-none text-apple-blue dark:text-apple-blue-dark">
                {stats.wins}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-apple-secondary dark:text-apple-secondary-dark">
                Total Wins
              </span>
            </div>
          </div>

          {/* New achievements */}
          {newAchievements.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-apple-secondary dark:text-apple-secondary-dark">
                🎉 New Achievement{newAchievements.length > 1 ? 's' : ''}
              </p>
              {newAchievements.map((a) => {
                const meta = ACHIEVEMENT_META[a.id];
                return (
                  <div key={a.id} className="flex items-center gap-3 p-3 rounded-apple bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-900/30 animate-bounce-in">
                    <span className="text-2xl">{meta.icon}</span>
                    <div>
                      <p className="text-[14px] font-bold text-apple-label dark:text-apple-label-dark">{meta.title}</p>
                      <p className="text-[11px] text-apple-secondary dark:text-apple-secondary-dark">{meta.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Countdown */}
          <CountdownTimer />

          {/* Level */}
          <div className="text-center">
            <span className="text-[12px] text-apple-secondary dark:text-apple-secondary-dark">
              Level {stats.level} · {getLevelTitle(stats.level)} · {stats.totalScore.toLocaleString()} pts total
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleShare}
              className="
                flex-1 flex items-center justify-center gap-2
                py-3.5 rounded-apple
                bg-apple-blue dark:bg-apple-blue-dark text-white
                font-semibold text-[15px]
                active:scale-95 transition-transform duration-150
                shadow-apple-blue
              "
            >
              {copied ? (
                <>✓ Copied!</>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1v9M4.5 5.5L8 2l3.5 3.5M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Share Result
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="
                px-5 py-3.5 rounded-apple
                bg-apple-bg dark:bg-apple-card2-dark
                text-apple-label dark:text-apple-label-dark
                font-semibold text-[15px]
                border border-apple-separator dark:border-apple-separator-dark
                active:scale-95 transition-transform duration-150
              "
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
