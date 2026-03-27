'use client';

import type { Athlete } from '@/types/game';

interface MysteryCardProps {
  athlete: Athlete;
  revealed: boolean; // true after game ends
  dayNumber: number;
}

export default function MysteryCard({ athlete, revealed, dayNumber }: MysteryCardProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-apple-xl">
      {/* Card background */}
      <div
        className={`mystery-card relative flex flex-col items-center justify-center min-h-[160px] p-6 transition-all duration-700 ${
          revealed ? 'mystery-card--revealed' : ''
        }`}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 mystery-bg" aria-hidden />
        <div className="absolute inset-0 mystery-shimmer" aria-hidden />

        {/* Day badge */}
        <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-1">
          <span className="text-white text-[11px] font-semibold tracking-wide">
            Day #{dayNumber}
          </span>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-3 text-center">
          {revealed ? (
            <>
              <div className="text-5xl animate-bounce-in">{athlete.emoji}</div>
              <div className="animate-slide-up">
                <p className="text-white text-[22px] font-bold tracking-tight leading-tight">
                  {athlete.name}
                </p>
                <p className="text-white/70 text-[13px] mt-0.5">
                  {athlete.sport} · {athlete.country}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center animate-float">
                <span className="text-4xl font-black text-white/60 select-none">?</span>
              </div>
              <div>
                <p className="text-white text-[17px] font-semibold">
                  Who is this athlete?
                </p>
                <p className="text-white/50 text-[12px] mt-0.5">
                  Reveal clues to find out
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
