'use client';

import { useEffect, useRef } from 'react';
import type { Athlete } from '@/types/game';
import { CLUE_TYPES } from '@/types/game';

interface ClueRevealProps {
  athlete: Athlete;
  revealedClues: number; // how many clues are shown (1–6)
  isNew?: boolean; // if the latest clue was just revealed (for animation)
}

const CLUE_COLOR_CLASSES: Record<string, { bg: string; iconBg: string; text: string }> = {
  'apple-blue':   { bg: 'bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/40',   iconBg: 'bg-apple-blue/10 dark:bg-apple-blue-dark/10',   text: 'text-apple-blue dark:text-apple-blue-dark' },
  'apple-purple': { bg: 'bg-purple-50 dark:bg-purple-950/30 border-purple-100 dark:border-purple-900/40', iconBg: 'bg-apple-purple/10 dark:bg-apple-purple-dark/10', text: 'text-apple-purple dark:text-apple-purple-dark' },
  'apple-green':  { bg: 'bg-green-50 dark:bg-green-950/30 border-green-100 dark:border-green-900/40',  iconBg: 'bg-apple-green/10 dark:bg-apple-green-dark/10',  text: 'text-apple-green dark:text-apple-green-dark' },
  'apple-orange': { bg: 'bg-orange-50 dark:bg-orange-950/30 border-orange-100 dark:border-orange-900/40', iconBg: 'bg-apple-orange/10 dark:bg-apple-orange-dark/10', text: 'text-apple-orange dark:text-apple-orange-dark' },
  'apple-pink':   { bg: 'bg-pink-50 dark:bg-pink-950/30 border-pink-100 dark:border-pink-900/40',   iconBg: 'bg-apple-pink/10 dark:bg-apple-pink-dark/10',   text: 'text-apple-pink dark:text-apple-pink-dark' },
  'apple-red':    { bg: 'bg-red-50 dark:bg-red-950/30 border-red-100 dark:border-red-900/40',    iconBg: 'bg-apple-red/10 dark:bg-apple-red-dark/10',    text: 'text-apple-red dark:text-apple-red-dark' },
};

interface ClueCardProps {
  index: number; // 0-based
  clue: string;
  isNewest: boolean;
}

function ClueCard({ index, clue, isNewest }: ClueCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const meta = CLUE_TYPES[index];
  const colors = CLUE_COLOR_CLASSES[meta.color] ?? CLUE_COLOR_CLASSES['apple-blue'];

  useEffect(() => {
    if (isNewest && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isNewest]);

  return (
    <div
      ref={ref}
      className={`
        clue-card flex items-start gap-3 p-4 rounded-apple border
        ${colors.bg}
        ${isNewest ? 'animate-slide-up' : ''}
      `}
      style={{ animationDelay: '0ms' }}
    >
      {/* Icon */}
      <div className={`flex-shrink-0 w-9 h-9 rounded-[10px] flex items-center justify-center ${colors.iconBg}`}>
        <span className="text-[18px] leading-none">{meta.icon}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[11px] font-semibold uppercase tracking-wider ${colors.text}`}>
            Clue {index + 1}
          </span>
          <span className={`text-[10px] font-medium ${colors.text} opacity-60`}>
            · {meta.label}
          </span>
        </div>
        <p className="text-[14px] font-medium text-apple-label dark:text-apple-label-dark leading-relaxed">
          {clue}
        </p>
      </div>
    </div>
  );
}

export default function ClueReveal({ athlete, revealedClues, isNew }: ClueRevealProps) {
  if (revealedClues === 0) return null;

  return (
    <div className="flex flex-col gap-2.5">
      {Array.from({ length: revealedClues }, (_, i) => (
        <ClueCard
          key={i}
          index={i}
          clue={athlete.clues[i]}
          isNewest={isNew ? i === revealedClues - 1 : false}
        />
      ))}
    </div>
  );
}
