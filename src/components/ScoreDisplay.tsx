'use client';

import { useEffect, useRef, useState } from 'react';
import { SCORE_BY_CLUE } from '@/types/game';

interface ScoreDisplayProps {
  revealedClues: number;
  wrongGuesses: number;
  status: 'playing' | 'won' | 'lost';
  finalScore: number;
}

function AnimatedNumber({ value }: { value: number }) {
  const [displayed, setDisplayed] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    if (prev.current === value) return;
    const start = prev.current;
    const end = value;
    const duration = 600;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    prev.current = value;
  }, [value]);

  return <span>{displayed.toLocaleString()}</span>;
}

export default function ScoreDisplay({ revealedClues, wrongGuesses, status, finalScore }: ScoreDisplayProps) {
  const potentialScore = revealedClues > 0
    ? Math.max(0, (SCORE_BY_CLUE[revealedClues] ?? 0) - wrongGuesses * 50)
    : 0;

  const displayScore = status !== 'playing' ? finalScore : potentialScore;

  const scoreColor =
    displayScore >= 800 ? 'text-apple-green dark:text-apple-green-dark' :
    displayScore >= 400 ? 'text-apple-orange dark:text-apple-orange-dark' :
    displayScore > 0    ? 'text-apple-red dark:text-apple-red-dark' :
    'text-apple-secondary dark:text-apple-secondary-dark';

  const clueProgress = Math.min(6, revealedClues);

  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-apple bg-apple-card dark:bg-apple-card-dark border border-apple-separator dark:border-apple-separator-dark shadow-apple">
      {/* Score */}
      <div className="flex flex-col items-center gap-0">
        <span className={`text-[28px] font-black tabular-nums leading-none ${scoreColor}`}>
          <AnimatedNumber value={displayScore} />
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-apple-secondary dark:text-apple-secondary-dark mt-0.5">
          {status === 'playing' ? 'Potential' : 'Score'}
        </span>
      </div>

      {/* Clue progress dots */}
      <div className="flex flex-col items-center gap-1.5">
        <div className="flex gap-1.5">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className={`
                w-2 h-2 rounded-full transition-all duration-300
                ${i < clueProgress
                  ? 'bg-apple-blue dark:bg-apple-blue-dark scale-110'
                  : 'bg-apple-tertiary dark:bg-apple-tertiary-dark'
                }
              `}
            />
          ))}
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-apple-secondary dark:text-apple-secondary-dark">
          {clueProgress}/6 Clues
        </span>
      </div>

      {/* Wrong guesses */}
      <div className="flex flex-col items-center gap-0">
        <span className={`text-[28px] font-black tabular-nums leading-none ${wrongGuesses > 0 ? 'text-apple-red dark:text-apple-red-dark' : 'text-apple-secondary dark:text-apple-secondary-dark'}`}>
          {wrongGuesses}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-apple-secondary dark:text-apple-secondary-dark mt-0.5">
          Misses
        </span>
      </div>
    </div>
  );
}
