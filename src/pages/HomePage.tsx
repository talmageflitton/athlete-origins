import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Sport, GameMode, Era } from '../types';
import { SPORT_LABELS, MODE_LABELS, ERA_LABELS } from '../types';
import { SportIcon } from '../components/SportIcon';
import { getDailyProgress } from '../utils/daily';

const sports: (Sport | 'all')[] = ['all', 'nfl', 'nba', 'mlb', 'nhl', 'soccer'];
const modes: GameMode[] = ['college', 'draft', 'hometown', 'jersey'];
const eras: Era[] = ['all', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];
const questionCounts = [5, 10, 15, 20];

const modeIcons: Record<GameMode, string> = {
  college: '\u{1F393}',
  draft: '\u{1F4CB}',
  hometown: '\u{1F3E0}',
  jersey: '#\uFE0F\u20E3',
};

export function HomePage() {
  const navigate = useNavigate();
  const [sport, setSport] = useState<Sport | 'all'>('all');
  const [mode, setMode] = useState<GameMode>('college');
  const [era, setEra] = useState<Era>('all');
  const [questionCount, setQuestionCount] = useState(10);

  const dailyProgress = getDailyProgress();

  const startGame = () => {
    const params = new URLSearchParams({
      sport,
      mode,
      era,
      count: String(questionCount),
    });
    navigate(`/play?${params.toString()}`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Hero */}
      <div className="text-center py-8">
        <h2 className="text-4xl font-black text-slate-800 mb-3">
          Test Your Sports Knowledge
        </h2>
        <p className="text-slate-500 text-lg max-w-lg mx-auto">
          Guess where athletes went to college, their draft picks, hometowns, jersey numbers, and more.
        </p>
      </div>

      {/* Daily Challenge Banner */}
      <button
        onClick={() => navigate('/daily')}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-5 text-left text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">Daily Challenge</div>
            <div className="text-xl font-bold">
              {dailyProgress?.completed
                ? `Completed! ${dailyProgress.score}/${dailyProgress.total}`
                : 'Play today\'s challenge'
              }
            </div>
            <div className="text-sm opacity-80 mt-1">Same questions for everyone, every day</div>
          </div>
          <span className="text-4xl">&#127942;</span>
        </div>
      </button>

      {/* Game Setup */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 bg-gradient-to-r from-slate-800 to-slate-700">
          <h3 className="text-lg font-bold text-white">Custom Game</h3>
          <p className="text-slate-400 text-sm">Configure your game settings</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Sport Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Sport</label>
            <div className="flex flex-wrap gap-2">
              {sports.map(s => (
                <button
                  key={s}
                  onClick={() => setSport(s)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    sport === s
                      ? 'bg-slate-800 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {s !== 'all' && <SportIcon sport={s} size="text-base" />}
                  {s === 'all' ? 'All Sports' : SPORT_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Mode Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Game Mode</label>
            <div className="grid grid-cols-2 gap-2">
              {modes.map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                    mode === m
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span className="text-xl">{modeIcons[m]}</span>
                  {MODE_LABELS[m]}
                </button>
              ))}
            </div>
          </div>

          {/* Era Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Era</label>
            <div className="flex flex-wrap gap-2">
              {eras.map(e => (
                <button
                  key={e}
                  onClick={() => setEra(e)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    era === e
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {ERA_LABELS[e]}
                </button>
              ))}
            </div>
          </div>

          {/* Question Count */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Number of Questions</label>
            <div className="flex gap-2">
              {questionCounts.map(n => (
                <button
                  key={n}
                  onClick={() => setQuestionCount(n)}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                    questionCount === n
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="px-6 pb-6">
          <button
            onClick={startGame}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-xl hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl cursor-pointer"
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
}
