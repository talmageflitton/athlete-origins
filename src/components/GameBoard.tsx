'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { GameState, PlayerStats, Achievement, PowerUpId } from '@/types/game';
import {
  loadGameState,
  saveGameState,
  loadStats,
  saveStats,
  revealNextClue,
  submitGuess,
  giveUp,
  processGameResult,
  applyPowerUp,
} from '@/lib/storage';
import { getDailyAthlete, getDayNumber } from '@/data/athletes';
import Header from './Header';
import MysteryCard from './MysteryCard';
import ClueReveal from './ClueReveal';
import GuessInput from './GuessInput';
import ScoreDisplay from './ScoreDisplay';
import PowerUpBar from './PowerUpBar';
import ResultModal from './ResultModal';
import StatsModal from './StatsModal';
import HowToPlay from './HowToPlay';

export default function GameBoard() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [isNewClue, setIsNewClue] = useState(false);
  const [shakeInput, setShakeInput] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [isRevealing, setIsRevealing] = useState(false);
  const [hasShownResult, setHasShownResult] = useState(false);
  const resultShownRef = useRef(false);

  // Hydrate from localStorage on client
  useEffect(() => {
    const savedGame = loadGameState();
    const savedStats = loadStats();
    setGameState(savedGame);
    setStats(savedStats);

    // Show how-to-play on first ever visit
    if (savedStats.totalGames === 0 && savedGame.status === 'playing') {
      setShowHowToPlay(true);
    }

    // If game was already completed today, show result
    if (savedGame.status !== 'playing' && !resultShownRef.current) {
      resultShownRef.current = true;
      setTimeout(() => setShowResult(true), 300);
    }
  }, []);

  // Persist game state changes
  useEffect(() => {
    if (gameState) saveGameState(gameState);
  }, [gameState]);

  // When game ends, update stats and show result
  useEffect(() => {
    if (!gameState || !stats) return;
    if (gameState.status === 'playing') return;
    if (hasShownResult) return;

    setHasShownResult(true);
    const { updatedStats, newAchievements: unlocked } = processGameResult(stats, gameState);
    setStats(updatedStats);
    saveStats(updatedStats);
    setNewAchievements(unlocked);

    // Delay result modal for satisfying reveal
    setTimeout(() => setShowResult(true), gameState.status === 'won' ? 800 : 400);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState?.status]);

  const handleRevealClue = useCallback(() => {
    if (!gameState || gameState.status !== 'playing' || isRevealing) return;
    if (gameState.revealedClues >= 6) return;

    setIsRevealing(true);
    setIsNewClue(true);
    setGameState((prev) => prev ? revealNextClue(prev) : prev);

    setTimeout(() => {
      setIsNewClue(false);
      setIsRevealing(false);
    }, 600);
  }, [gameState, isRevealing]);

  const handleGuess = useCallback((guess: string) => {
    if (!gameState || gameState.status !== 'playing') return;
    if (gameState.revealedClues === 0) {
      // Must reveal at least one clue first
      setShakeInput(true);
      setTimeout(() => setShakeInput(false), 600);
      return;
    }

    const nextState = submitGuess(gameState, guess);
    const wasWrong = nextState.guesses.length > gameState.guesses.length && nextState.status === 'playing';

    if (wasWrong) {
      setShakeInput(true);
      setTimeout(() => setShakeInput(false), 600);
    }

    setGameState(nextState);
  }, [gameState]);

  const handleGiveUp = useCallback(() => {
    if (!gameState || gameState.status !== 'playing') return;
    setGameState(giveUp(gameState));
  }, [gameState]);

  const handlePowerUp = useCallback((id: PowerUpId) => {
    if (!gameState || !stats) return;
    const result = applyPowerUp(id, gameState, stats);
    if (!result) return;
    setGameState(result.gameState);
    setStats(result.stats);
    saveStats(result.stats);
  }, [gameState, stats]);

  if (!gameState || !stats) {
    return (
      <div className="min-h-screen bg-apple-bg dark:bg-apple-bg-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-apple-blue dark:border-apple-blue-dark border-t-transparent animate-spin" />
          <p className="text-[13px] text-apple-secondary dark:text-apple-secondary-dark">Loading…</p>
        </div>
      </div>
    );
  }

  const athlete = getDailyAthlete();
  const dayNumber = getDayNumber();
  const isGameOver = gameState.status !== 'playing';
  const canReveal = gameState.revealedClues < 6 && !isGameOver;
  const showGiveUp = gameState.guesses.length >= 2 || gameState.revealedClues >= 4;

  return (
    <div className="min-h-screen bg-apple-bg dark:bg-apple-bg-dark">
      <Header
        stats={stats}
        onShowStats={() => setShowStats(true)}
        onShowHowToPlay={() => setShowHowToPlay(true)}
      />

      <main className="max-w-lg mx-auto px-4 py-5 pb-24 flex flex-col gap-4">
        {/* Mystery card */}
        <MysteryCard
          athlete={athlete}
          revealed={isGameOver}
          dayNumber={dayNumber}
        />

        {/* Score tracker */}
        <ScoreDisplay
          revealedClues={gameState.revealedClues}
          wrongGuesses={gameState.guesses.length}
          status={gameState.status}
          finalScore={gameState.score}
        />

        {/* Power-ups */}
        {stats && (
          <PowerUpBar
            athlete={athlete}
            gameState={gameState}
            stats={stats}
            onUsePowerUp={handlePowerUp}
          />
        )}

        {/* Clues */}
        {gameState.revealedClues > 0 && (
          <ClueReveal
            athlete={athlete}
            revealedClues={gameState.revealedClues}
            isNew={isNewClue}
          />
        )}

        {/* No clues yet callout */}
        {gameState.revealedClues === 0 && !isGameOver && (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <span className="text-4xl">👇</span>
            <p className="text-[15px] font-medium text-apple-secondary dark:text-apple-secondary-dark">
              Reveal your first clue to start guessing
            </p>
          </div>
        )}

        {/* Action buttons */}
        {!isGameOver && (
          <div className="flex gap-3">
            <button
              onClick={handleRevealClue}
              disabled={!canReveal || isRevealing}
              className="
                flex-1 flex items-center justify-center gap-2
                py-4 rounded-apple-lg font-semibold text-[15px]
                bg-apple-blue dark:bg-apple-blue-dark text-white
                disabled:opacity-40 disabled:cursor-not-allowed
                active:scale-95 transition-all duration-150
                shadow-apple-blue
              "
            >
              {isRevealing ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>💡</span>
                  <span>
                    {gameState.revealedClues === 0 ? 'Reveal First Clue' : `Reveal Clue ${gameState.revealedClues + 1}`}
                  </span>
                </>
              )}
            </button>

            {showGiveUp && (
              <button
                onClick={handleGiveUp}
                className="
                  px-4 py-4 rounded-apple-lg font-semibold text-[14px]
                  bg-apple-card dark:bg-apple-card-dark
                  text-apple-red dark:text-apple-red-dark
                  border border-apple-red/20 dark:border-apple-red-dark/20
                  active:scale-95 transition-all duration-150
                "
              >
                Give Up
              </button>
            )}
          </div>
        )}

        {/* Guess input */}
        {gameState.revealedClues > 0 && !isGameOver && (
          <GuessInput
            onGuess={handleGuess}
            disabled={isGameOver}
            shake={shakeInput}
            wrongGuesses={gameState.guesses}
          />
        )}

        {/* View result button if game is over */}
        {isGameOver && (
          <button
            onClick={() => setShowResult(true)}
            className="w-full py-4 rounded-apple-lg font-semibold text-[15px] bg-apple-blue dark:bg-apple-blue-dark text-white shadow-apple-blue active:scale-95 transition-transform"
          >
            {gameState.status === 'won' ? '🏆 See Your Result' : '📊 See Result'}
          </button>
        )}
      </main>

      {/* Modals */}
      {showResult && stats && (
        <ResultModal
          gameState={gameState}
          athlete={athlete}
          stats={stats}
          newAchievements={newAchievements}
          onClose={() => setShowResult(false)}
        />
      )}

      {showStats && stats && (
        <StatsModal
          stats={stats}
          onClose={() => setShowStats(false)}
        />
      )}

      {showHowToPlay && (
        <HowToPlay onClose={() => setShowHowToPlay(false)} />
      )}
    </div>
  );
}
