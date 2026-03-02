import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import type { GameConfig, Sport, GameMode, Era } from '../types';
import { useGame, getModeQuestion } from '../hooks/useGame';
import { AthleteCard } from '../components/AthleteCard';
import { OptionButton } from '../components/OptionButton';
import { ScoreBar } from '../components/ScoreBar';
import { ResultsScreen } from '../components/ResultsScreen';

export function GamePage() {
  const [searchParams] = useSearchParams();

  const config: GameConfig = useMemo(() => ({
    sport: (searchParams.get('sport') || 'all') as Sport | 'all',
    mode: (searchParams.get('mode') || 'college') as GameMode,
    era: (searchParams.get('era') || 'all') as Era,
    questionCount: parseInt(searchParams.get('count') || '10', 10),
    isDaily: searchParams.get('daily') === 'true',
  }), [searchParams]);

  const game = useGame(config);

  if (game.athletes.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="text-6xl mb-4">&#128533;</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">No Athletes Found</h2>
        <p className="text-slate-500 mb-6">
          No athletes match your current filters. Try a different sport or era.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  if (game.state.isComplete) {
    return (
      <ResultsScreen
        score={game.state.score}
        total={game.state.totalQuestions}
        answers={game.state.answers}
        athletes={game.athletes}
        config={config}
        onPlayAgain={game.resetGame}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <ScoreBar
        score={game.state.score}
        current={game.state.currentAthleteIndex}
        total={game.state.totalQuestions}
      />

      {game.currentAthlete && (
        <>
          <AthleteCard athlete={game.currentAthlete} hideField={config.mode} />

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-800">
              {getModeQuestion(config.mode)}
            </h3>

            <div className="space-y-2.5">
              {game.options.map(option => (
                <OptionButton
                  key={option}
                  option={option}
                  isSelected={game.selectedAnswer === option}
                  isCorrect={option === game.correctAnswer}
                  isRevealed={game.isRevealed}
                  onClick={() => game.handleAnswer(option)}
                />
              ))}
            </div>

            {game.isRevealed && (
              <div className="pt-2">
                <button
                  onClick={game.nextQuestion}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-md cursor-pointer"
                >
                  {game.state.currentAthleteIndex + 1 >= game.state.totalQuestions
                    ? 'See Results'
                    : 'Next Question'
                  }
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
