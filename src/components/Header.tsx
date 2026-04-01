'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { PlayerStats } from '@/types/game';
import { getLevelTitle } from '@/lib/storage';

interface HeaderProps {
  stats: PlayerStats;
  onShowStats: () => void;
  onShowHowToPlay: () => void;
}

export default function Header({ stats, onShowStats, onShowHowToPlay }: HeaderProps) {
  const [coinsFlash, setCoinsFlash] = useState(false);

  const levelTitle = getLevelTitle(stats.level);

  return (
    <header className="sticky top-0 z-40 safe-top">
      <div className="header-blur border-b border-apple-separator dark:border-apple-separator-dark">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          {/* Left: How to play + Streak link */}
          <div className="flex items-center gap-1">
            <button
              onClick={onShowHowToPlay}
              className="btn-icon"
              aria-label="How to play"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10 9v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="10" cy="6.5" r="0.75" fill="currentColor" />
              </svg>
            </button>
            <Link
              href="/streak"
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-apple-blue/10 dark:bg-apple-blue-dark/10 text-apple-blue dark:text-apple-blue-dark text-[12px] font-semibold"
              aria-label="Streak mode"
            >
              <span>⚡</span>
              <span className="hidden sm:inline">Streak</span>
            </Link>
          </div>

          {/* Center: Logo + level */}
          <div className="flex flex-col items-center gap-0.5">
            <h1 className="text-[15px] font-bold tracking-tight text-apple-label dark:text-apple-label-dark leading-none">
              Athlete Origins
            </h1>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-apple-blue dark:text-apple-blue-dark leading-none">
                {levelTitle}
              </span>
              <span className="text-[9px] text-apple-secondary dark:text-apple-secondary-dark">•</span>
              <button
                onClick={() => setCoinsFlash(true)}
                onAnimationEnd={() => setCoinsFlash(false)}
                className={`flex items-center gap-0.5 text-[11px] font-medium leading-none ${coinsFlash ? 'animate-bounce-in' : ''}`}
                aria-label={`${stats.coins} coins`}
              >
                <span>🪙</span>
                <span className="text-apple-orange dark:text-apple-orange-dark">{stats.coins}</span>
              </button>
            </div>
          </div>

          {/* Right: Streak + Stats */}
          <button
            onClick={onShowStats}
            className="btn-icon flex items-center gap-1.5"
            aria-label="View stats"
          >
            {stats.currentStreak > 0 && (
              <span className="flex items-center gap-0.5 text-[13px] font-semibold text-apple-orange dark:text-apple-orange-dark animate-streak-fire">
                🔥 {stats.currentStreak}
              </span>
            )}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="13" width="3" height="5" rx="1" fill="currentColor" opacity="0.4" />
              <rect x="8.5" y="9" width="3" height="9" rx="1" fill="currentColor" opacity="0.7" />
              <rect x="15" y="5" width="3" height="13" rx="1" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
