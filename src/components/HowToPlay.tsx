'use client';

interface HowToPlayProps {
  onClose: () => void;
}

const STEPS = [
  {
    icon: '🔍',
    title: 'Reveal Clues',
    desc: "Tap \"Reveal Clue\" to uncover progressive hints about today's mystery athlete.",
  },
  {
    icon: '💡',
    title: 'Guess Early, Score Big',
    desc: 'The fewer clues you use, the higher your score. First clue = 1000 pts. Sixth clue = 100 pts.',
  },
  {
    icon: '✍️',
    title: 'Make Your Guess',
    desc: 'Type an athlete\'s name in the search box. Autocomplete helps — pick from the dropdown or type freely.',
  },
  {
    icon: '🔥',
    title: 'Build Your Streak',
    desc: 'Play every day to maintain your win streak. Streaks unlock achievements and bonus coins.',
  },
  {
    icon: '🪙',
    title: 'Earn Coins',
    desc: 'Win games to earn coins. Use them for power-ups like extra hints (coming soon).',
  },
  {
    icon: '📤',
    title: 'Share Your Result',
    desc: 'After each game, share your spoiler-free result with friends — just like Wordle.',
  },
];

const SCORE_TABLE = [
  { clue: '1', pts: '1,000', emoji: '💎' },
  { clue: '2', pts: '800', emoji: '🥇' },
  { clue: '3', pts: '600', emoji: '🥈' },
  { clue: '4', pts: '400', emoji: '🥉' },
  { clue: '5', pts: '200', emoji: '⭐' },
  { clue: '6', pts: '100', emoji: '🎯' },
];

export default function HowToPlay({ onClose }: HowToPlayProps) {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} aria-hidden />

      {/* Modal */}
      <div className="fixed inset-x-4 top-16 bottom-4 z-50 max-w-lg mx-auto bg-apple-card dark:bg-apple-card-dark rounded-apple-2xl shadow-apple-lg overflow-y-auto overscroll-contain safe-bottom animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-apple-card dark:bg-apple-card-dark border-b border-apple-separator dark:border-apple-separator-dark px-5 py-4 flex items-center justify-between z-10 rounded-t-apple-2xl">
          <h2 className="text-[17px] font-bold text-apple-label dark:text-apple-label-dark">How to Play</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-apple-bg dark:bg-apple-card2-dark flex items-center justify-center text-apple-label2 dark:text-apple-label2-dark text-[18px] font-medium"
          >
            ×
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-5">
          {/* Intro */}
          <div className="text-center p-4 rounded-apple bg-apple-blue/5 dark:bg-apple-blue-dark/5 border border-apple-blue/10 dark:border-apple-blue-dark/10">
            <p className="text-[15px] font-semibold text-apple-label dark:text-apple-label-dark">
              Guess today&apos;s mystery athlete using as few clues as possible.
            </p>
            <p className="text-[13px] text-apple-secondary dark:text-apple-secondary-dark mt-1">
              A new athlete every day.
            </p>
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-3">
            {STEPS.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-apple bg-apple-bg dark:bg-apple-card2-dark flex items-center justify-center text-xl">
                  {step.icon}
                </div>
                <div className="pt-0.5">
                  <p className="text-[14px] font-semibold text-apple-label dark:text-apple-label-dark">{step.title}</p>
                  <p className="text-[13px] text-apple-secondary dark:text-apple-secondary-dark leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Score table */}
          <div>
            <p className="text-[13px] font-semibold text-apple-label dark:text-apple-label-dark mb-2">Scoring</p>
            <div className="rounded-apple overflow-hidden border border-apple-separator dark:border-apple-separator-dark">
              {SCORE_TABLE.map((row, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between px-4 py-3 ${
                    i !== SCORE_TABLE.length - 1 ? 'border-b border-apple-separator dark:border-apple-separator-dark' : ''
                  } ${i % 2 === 0 ? 'bg-apple-card dark:bg-apple-card-dark' : 'bg-apple-bg dark:bg-apple-card2-dark'}`}
                >
                  <span className="text-[13px] text-apple-secondary dark:text-apple-secondary-dark">
                    Clue {row.clue}
                  </span>
                  <span className="text-[13px] font-semibold text-apple-label dark:text-apple-label-dark">
                    {row.emoji} {row.pts} pts
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between px-4 py-3 bg-red-50 dark:bg-red-950/20 border-t border-apple-separator dark:border-apple-separator-dark">
                <span className="text-[13px] text-apple-red dark:text-apple-red-dark">Wrong guess penalty</span>
                <span className="text-[13px] font-semibold text-apple-red dark:text-apple-red-dark">–50 pts</span>
              </div>
            </div>
          </div>

          {/* Got it button */}
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-apple bg-apple-blue dark:bg-apple-blue-dark text-white font-semibold text-[15px] active:scale-95 transition-transform duration-150 shadow-apple-blue"
          >
            Got it &mdash; Let&apos;s Play!
          </button>
        </div>
      </div>
    </>
  );
}
