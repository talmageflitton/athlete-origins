import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { GameMode } from '../types';
import { MODE_LABELS } from '../types';
import { getDailyDateString, getDailyProgress } from '../utils/daily';

const modeIcons: Record<GameMode, string> = {
  college: '\u{1F393}',
  draft: '\u{1F4CB}',
  hometown: '\u{1F3E0}',
  jersey: '#\uFE0F\u20E3',
};

export function DailyPage() {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<GameMode>('college');
  const dailyProgress = getDailyProgress();

  const startDaily = () => {
    const params = new URLSearchParams({
      sport: 'all',
      mode: selectedMode,
      era: 'all',
      count: '10',
      daily: 'true',
    });
    navigate(`/play?${params.toString()}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center py-6">
        <span className="text-5xl mb-4 block">&#127942;</span>
        <h2 className="text-3xl font-black text-slate-800 mb-2">Daily Challenge</h2>
        <p className="text-slate-500">{getDailyDateString()}</p>
      </div>

      {dailyProgress?.completed ? (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
          <div className="text-5xl font-black text-emerald-600 mb-2">
            {dailyProgress.score}/{dailyProgress.total}
          </div>
          <p className="text-slate-500 mb-1">You've completed today's challenge!</p>
          <p className="text-slate-400 text-sm">Come back tomorrow for a new one.</p>

          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
            >
              Play Custom Game
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 bg-gradient-to-r from-amber-500 to-orange-500">
            <h3 className="text-lg font-bold text-white">Choose Your Mode</h3>
            <p className="text-white/80 text-sm">10 questions, all sports, all eras</p>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(MODE_LABELS) as GameMode[]).map(m => (
                <button
                  key={m}
                  onClick={() => setSelectedMode(m)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                    selectedMode === m
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span className="text-xl">{modeIcons[m]}</span>
                  {MODE_LABELS[m]}
                </button>
              ))}
            </div>

            <button
              onClick={startDaily}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg rounded-xl hover:opacity-90 transition-opacity shadow-lg cursor-pointer"
            >
              Start Daily Challenge
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
