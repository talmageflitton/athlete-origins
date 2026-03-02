interface ScoreBarProps {
  score: number;
  current: number;
  total: number;
}

export function ScoreBar({ score, current, total }: ScoreBarProps) {
  const progress = (current / total) * 100;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-5 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="text-sm text-slate-500">
          Question <span className="font-bold text-slate-800">{Math.min(current + 1, total)}</span> of <span className="font-bold text-slate-800">{total}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-sm font-bold text-slate-800">
          Score: <span className="text-emerald-600">{score}</span>
        </div>
      </div>
    </div>
  );
}
