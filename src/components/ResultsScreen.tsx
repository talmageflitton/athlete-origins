import type { Athlete, GameConfig, AnswerRecord } from '../types';
import { getAnswerForMode } from '../utils/game';
import { MODE_LABELS, SPORT_LABELS } from '../types';
import { Link } from 'react-router-dom';

interface ResultsScreenProps {
  score: number;
  total: number;
  answers: AnswerRecord[];
  athletes: Athlete[];
  config: GameConfig;
  onPlayAgain: () => void;
}

export function ResultsScreen({ score, total, answers, athletes, config, onPlayAgain }: ResultsScreenProps) {
  const percentage = Math.round((score / total) * 100);

  let grade = '';
  let gradeColor = '';
  if (percentage >= 90) { grade = 'S'; gradeColor = 'text-amber-500'; }
  else if (percentage >= 80) { grade = 'A'; gradeColor = 'text-emerald-500'; }
  else if (percentage >= 70) { grade = 'B'; gradeColor = 'text-blue-500'; }
  else if (percentage >= 60) { grade = 'C'; gradeColor = 'text-slate-500'; }
  else if (percentage >= 50) { grade = 'D'; gradeColor = 'text-orange-500'; }
  else { grade = 'F'; gradeColor = 'text-red-500'; }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 text-center py-10 px-6">
        <div className={`text-7xl font-black mb-2 ${gradeColor}`}>{grade}</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-1">Game Complete!</h2>
        <p className="text-slate-500 mb-6">
          {MODE_LABELS[config.mode]} &middot; {config.sport === 'all' ? 'All Sports' : SPORT_LABELS[config.sport as keyof typeof SPORT_LABELS]}
        </p>
        <div className="text-5xl font-black text-slate-800 mb-1">
          {score}<span className="text-slate-400 text-3xl">/{total}</span>
        </div>
        <p className="text-slate-400 text-sm">{percentage}% correct</p>

        <div className="flex justify-center gap-3 mt-8">
          <button
            onClick={onPlayAgain}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-md"
          >
            Play Again
          </button>
          <Link
            to="/"
            className="px-6 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
          >
            New Game
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Answer Breakdown</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {answers.map((answer, i) => {
            const athlete = athletes.find(a => a.id === answer.athleteId);
            if (!athlete) return null;
            const correctValue = getAnswerForMode(athlete, config.mode);
            return (
              <div key={i} className="px-6 py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-800">{athlete.name}</div>
                  <div className="text-xs text-slate-400">
                    {answer.correct ? (
                      <span className="text-emerald-600">Correct: {correctValue}</span>
                    ) : (
                      <>
                        <span className="text-red-500">Your answer: {answer.guess}</span>
                        <span className="text-slate-300 mx-1">|</span>
                        <span className="text-emerald-600">Correct: {correctValue}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  answer.correct ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                }`}>
                  {answer.correct ? '\u2713' : '\u2717'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
