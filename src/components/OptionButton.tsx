interface OptionButtonProps {
  option: string;
  isSelected: boolean;
  isCorrect: boolean;
  isRevealed: boolean;
  onClick: () => void;
}

export function OptionButton({ option, isSelected, isCorrect, isRevealed, onClick }: OptionButtonProps) {
  let className = 'w-full text-left px-5 py-3.5 rounded-xl border-2 font-medium transition-all duration-200 ';

  if (!isRevealed) {
    className += 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50 hover:shadow-md cursor-pointer active:scale-[0.98]';
  } else if (isCorrect) {
    className += 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm';
  } else if (isSelected && !isCorrect) {
    className += 'border-red-500 bg-red-50 text-red-800 shadow-sm';
  } else {
    className += 'border-slate-100 bg-slate-50 text-slate-400';
  }

  return (
    <button
      onClick={onClick}
      disabled={isRevealed}
      className={className}
    >
      <div className="flex items-center justify-between">
        <span>{option}</span>
        {isRevealed && isCorrect && (
          <span className="text-emerald-600 font-bold text-lg">&#10003;</span>
        )}
        {isRevealed && isSelected && !isCorrect && (
          <span className="text-red-600 font-bold text-lg">&#10007;</span>
        )}
      </div>
    </button>
  );
}
