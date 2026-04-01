'use client';

import type { Athlete, GameState, PlayerStats, PowerUpId } from '@/types/game';
import { POWER_UP_META } from '@/types/game';
import { canUsePowerUp } from '@/lib/storage';

interface PowerUpBarProps {
  athlete: Athlete;
  gameState: GameState;
  stats: PlayerStats;
  onUsePowerUp: (id: PowerUpId) => void;
}

const POWER_UPS: PowerUpId[] = ['sport_hint', 'country_hint'];

export default function PowerUpBar({ athlete, gameState, stats, onUsePowerUp }: PowerUpBarProps) {
  const isGameOver = gameState.status !== 'playing';

  // Revealed hints for already-used power-ups
  const revealedSport = gameState.usedPowerUps.includes('sport_hint');
  const revealedCountry = gameState.usedPowerUps.includes('country_hint');
  const hasAnyReveal = revealedSport || revealedCountry;

  return (
    <div className="flex flex-col gap-2">
      {/* Power-up buttons */}
      {!isGameOver && (
        <div className="flex gap-2">
          {POWER_UPS.map((id) => {
            const meta = POWER_UP_META[id];
            const used = gameState.usedPowerUps.includes(id);
            const affordable = canUsePowerUp(id, gameState, stats);

            return (
              <button
                key={id}
                onClick={() => !used && affordable && onUsePowerUp(id)}
                disabled={used || !affordable}
                title={used ? `${meta.title} used` : `${meta.title}: ${meta.desc} (${meta.cost} coins)`}
                className={`
                  flex items-center gap-1.5 px-3 py-2 rounded-apple text-[13px] font-semibold
                  transition-all duration-150 active:scale-95
                  border
                  ${used
                    ? 'bg-apple-separator/30 dark:bg-apple-separator-dark/30 text-apple-secondary dark:text-apple-secondary-dark border-apple-separator dark:border-apple-separator-dark opacity-60 cursor-default'
                    : affordable
                      ? 'bg-apple-card dark:bg-apple-card-dark text-apple-label dark:text-apple-label-dark border-apple-separator dark:border-apple-separator-dark hover:border-apple-blue dark:hover:border-apple-blue-dark'
                      : 'bg-apple-card dark:bg-apple-card-dark text-apple-secondary dark:text-apple-secondary-dark border-apple-separator dark:border-apple-separator-dark opacity-50 cursor-not-allowed'
                  }
                `}
              >
                <span>{meta.icon}</span>
                <span className="hidden sm:inline">{used ? `${meta.title} ✓` : meta.title}</span>
                {!used && (
                  <span className={`flex items-center gap-0.5 ${affordable ? 'text-apple-orange dark:text-apple-orange-dark' : 'text-apple-secondary dark:text-apple-secondary-dark'}`}>
                    <span>🪙</span>
                    <span>{meta.cost}</span>
                  </span>
                )}
              </button>
            );
          })}

          {/* Coin balance */}
          <div className="ml-auto flex items-center gap-1 px-3 py-2 rounded-apple bg-apple-card dark:bg-apple-card-dark border border-apple-separator dark:border-apple-separator-dark">
            <span>🪙</span>
            <span className="text-[13px] font-semibold text-apple-orange dark:text-apple-orange-dark tabular-nums">
              {stats.coins}
            </span>
          </div>
        </div>
      )}

      {/* Revealed hints */}
      {hasAnyReveal && (
        <div className="flex gap-2 flex-wrap">
          {revealedSport && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-apple bg-apple-blue/10 dark:bg-apple-blue-dark/10 border border-apple-blue/20 dark:border-apple-blue-dark/20 animate-slide-up">
              <span>🏅</span>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-apple-blue dark:text-apple-blue-dark">
                  Sport
                </span>
                <p className="text-[13px] font-semibold text-apple-label dark:text-apple-label-dark leading-tight">
                  {athlete.sport}
                </p>
              </div>
            </div>
          )}
          {revealedCountry && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-apple bg-apple-green/10 dark:bg-apple-green-dark/10 border border-apple-green/20 dark:border-apple-green-dark/20 animate-slide-up">
              <span>🌍</span>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-apple-green dark:text-apple-green-dark">
                  Country
                </span>
                <p className="text-[13px] font-semibold text-apple-label dark:text-apple-label-dark leading-tight">
                  {athlete.country}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
