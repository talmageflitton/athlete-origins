'use client';

import type { PlayerStats } from '@/types/game';
import { ACHIEVEMENT_META, LEVELS } from '@/types/game';
import { getLevelTitle, getNextLevelInfo } from '@/lib/storage';

interface StatsModalProps {
  stats: PlayerStats;
  onClose: () => void;
}

export default function StatsModal({ stats, onClose }: StatsModalProps) {
  const winRate = stats.totalGames > 0 ? Math.round((stats.wins / stats.totalGames) * 100) : 0;
  const levelTitle = getLevelTitle(stats.level);
  const nextLevel = getNextLevelInfo(stats.totalScore);
  const maxDist = Math.max(...stats.guessDist.slice(1), 1);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} aria-hidden />

      {/* Modal */}
      <div className="fixed inset-x-4 top-16 bottom-4 z-50 max-w-lg mx-auto bg-apple-card dark:bg-apple-card-dark rounded-apple-2xl shadow-apple-lg overflow-y-auto overscroll-contain safe-bottom animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-apple-card dark:bg-apple-card-dark border-b border-apple-separator dark:border-apple-separator-dark px-5 py-4 flex items-center justify-between z-10 rounded-t-apple-2xl">
          <h2 className="text-[17px] font-bold text-apple-label dark:text-apple-label-dark">Statistics</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-apple-bg dark:bg-apple-card2-dark flex items-center justify-center text-apple-secondary dark:text-apple-secondary-dark"
          >
            ×
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-5">
          {/* Key stats */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Played', value: stats.totalGames },
              { label: 'Win %', value: `${winRate}%` },
              { label: 'Streak', value: `🔥${stats.currentStreak}` },
              { label: 'Best', value: `🔥${stats.maxStreak}` },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1 p-3 rounded-apple bg-apple-bg dark:bg-apple-card2-dark">
                <span className="text-[22px] font-black text-apple-label dark:text-apple-label-dark leading-none">
                  {s.value}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-apple-secondary dark:text-apple-secondary-dark text-center">
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* Level progress */}
          <div className="p-4 rounded-apple bg-apple-bg dark:bg-apple-card2-dark">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-[15px] font-bold text-apple-label dark:text-apple-label-dark">
                  Level {stats.level} · {levelTitle}
                </p>
                <p className="text-[12px] text-apple-secondary dark:text-apple-secondary-dark">
                  {stats.totalScore.toLocaleString()} total points
                </p>
              </div>
              <div className="text-[28px]">
                {stats.level >= 7 ? '🐐' : stats.level >= 5 ? '⭐' : stats.level >= 3 ? '🏅' : '🎯'}
              </div>
            </div>
            {nextLevel && (() => {
              const currentLevelDef = LEVELS.find((l) => l.level === stats.level);
              const span = nextLevel.pointsNeeded + (currentLevelDef ? stats.totalScore - currentLevelDef.minScore : 0);
              const progress = span > 0 ? Math.min(100, ((span - nextLevel.pointsNeeded) / span) * 100) : 0;
              return (
                <>
                  <div className="h-2 rounded-full bg-apple-separator dark:bg-apple-separator-dark overflow-hidden">
                    <div
                      className="h-full rounded-full bg-apple-blue dark:bg-apple-blue-dark transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-apple-secondary dark:text-apple-secondary-dark mt-1.5">
                    {nextLevel.pointsNeeded.toLocaleString()} pts to {nextLevel.nextTitle}
                  </p>
                </>
              );
            })()}
          </div>

          {/* Guess distribution */}
          <div>
            <p className="text-[13px] font-semibold text-apple-label dark:text-apple-label-dark mb-3">Guess Distribution</p>
            <div className="flex flex-col gap-1.5">
              {/* Lost */}
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-medium text-apple-secondary dark:text-apple-secondary-dark w-4 text-center">✗</span>
                <div className="flex-1 h-6 rounded-[6px] bg-apple-bg dark:bg-apple-card2-dark overflow-hidden">
                  <div
                    className="h-full rounded-[6px] bg-apple-red dark:bg-apple-red-dark flex items-center justify-end pr-2 transition-all duration-700"
                    style={{ width: `${Math.max(8, (stats.guessDist[0] / Math.max(maxDist, stats.guessDist[0], 1)) * 100)}%` }}
                  >
                    <span className="text-[11px] font-bold text-white">{stats.guessDist[0]}</span>
                  </div>
                </div>
              </div>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="flex items-center gap-2">
                  <span className="text-[12px] font-medium text-apple-secondary dark:text-apple-secondary-dark w-4 text-center">{n}</span>
                  <div className="flex-1 h-6 rounded-[6px] bg-apple-bg dark:bg-apple-card2-dark overflow-hidden">
                    <div
                      className="h-full rounded-[6px] bg-apple-blue dark:bg-apple-blue-dark flex items-center justify-end pr-2 transition-all duration-700"
                      style={{ width: `${Math.max(stats.guessDist[n] > 0 ? 8 : 0, (stats.guessDist[n] / maxDist) * 100)}%` }}
                    >
                      {stats.guessDist[n] > 0 && (
                        <span className="text-[11px] font-bold text-white">{stats.guessDist[n]}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div>
            <p className="text-[13px] font-semibold text-apple-label dark:text-apple-label-dark mb-3">
              Achievements ({stats.achievements.length}/{Object.keys(ACHIEVEMENT_META).length})
            </p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(ACHIEVEMENT_META).map(([id, meta]) => {
                const unlocked = stats.achievements.some((a) => a.id === id);
                return (
                  <div
                    key={id}
                    className={`flex items-center gap-3 p-3 rounded-apple border transition-all duration-200 ${
                      unlocked
                        ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-100 dark:border-yellow-900/30'
                        : 'bg-apple-bg dark:bg-apple-card2-dark border-transparent opacity-40'
                    }`}
                  >
                    <span className="text-xl flex-shrink-0">{unlocked ? meta.icon : '🔒'}</span>
                    <div className="min-w-0">
                      <p className="text-[12px] font-bold text-apple-label dark:text-apple-label-dark truncate">{meta.title}</p>
                      <p className="text-[10px] text-apple-secondary dark:text-apple-secondary-dark leading-tight">{meta.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Coins */}
          <div className="flex items-center justify-between p-4 rounded-apple bg-apple-bg dark:bg-apple-card2-dark">
            <div>
              <p className="text-[15px] font-bold text-apple-label dark:text-apple-label-dark">Coin Balance</p>
              <p className="text-[12px] text-apple-secondary dark:text-apple-secondary-dark">Earn coins by winning games</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl">🪙</span>
              <span className="text-[22px] font-black text-apple-orange dark:text-apple-orange-dark">{stats.coins}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
