import { useState, useCallback, useMemo } from 'react';
import type { Athlete, GameConfig, GameState, GameMode } from '../types';
import { getFilteredAthletes, getAllAnswersForMode } from '../data';
import { getAnswerForMode, generateOptions, generateNumberOptions, shuffleArray } from '../utils/game';
import { getDailySeed, seededShuffle, saveDailyProgress } from '../utils/daily';

export function useGame(config: GameConfig) {
  const athletes = useMemo(() => {
    const filtered = getFilteredAthletes(config.sport, config.era);
    if (config.isDaily) {
      const seed = getDailySeed();
      return seededShuffle(filtered, seed).slice(0, config.questionCount);
    }
    return shuffleArray(filtered).slice(0, config.questionCount);
  }, [config.sport, config.era, config.questionCount, config.isDaily]);

  const [state, setState] = useState<GameState>({
    currentAthleteIndex: 0,
    score: 0,
    totalQuestions: athletes.length,
    answers: [],
    isComplete: false,
  });

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const currentAthlete: Athlete | undefined = athletes[state.currentAthleteIndex];
  const correctAnswer = currentAthlete ? getAnswerForMode(currentAthlete, config.mode) : '';

  const options = useMemo(() => {
    if (!currentAthlete) return [];
    if (config.mode === 'jersey') {
      return generateNumberOptions(currentAthlete.jerseyNumber);
    }
    const allAnswers = getAllAnswersForMode(athletes, config.mode);
    return generateOptions(correctAnswer, allAnswers);
  }, [currentAthlete, config.mode, athletes, correctAnswer]);

  const handleAnswer = useCallback((answer: string) => {
    if (isRevealed) return;
    setSelectedAnswer(answer);
    setIsRevealed(true);

    const isCorrect = answer === correctAnswer;

    setState(prev => {
      const newAnswers = [...prev.answers, {
        athleteId: currentAthlete?.id ?? '',
        guess: answer,
        correct: isCorrect,
      }];
      const newScore = isCorrect ? prev.score + 1 : prev.score;
      return {
        ...prev,
        score: newScore,
        answers: newAnswers,
      };
    });
  }, [isRevealed, correctAnswer, currentAthlete]);

  const nextQuestion = useCallback(() => {
    setState(prev => {
      const nextIndex = prev.currentAthleteIndex + 1;
      const isComplete = nextIndex >= athletes.length;

      if (isComplete && config.isDaily) {
        saveDailyProgress(prev.score, prev.totalQuestions, true);
      }

      return {
        ...prev,
        currentAthleteIndex: nextIndex,
        isComplete,
      };
    });
    setSelectedAnswer(null);
    setIsRevealed(false);
  }, [athletes.length, config.isDaily]);

  const resetGame = useCallback(() => {
    setState({
      currentAthleteIndex: 0,
      score: 0,
      totalQuestions: athletes.length,
      answers: [],
      isComplete: false,
    });
    setSelectedAnswer(null);
    setIsRevealed(false);
  }, [athletes.length]);

  return {
    state,
    currentAthlete,
    correctAnswer,
    options,
    selectedAnswer,
    isRevealed,
    handleAnswer,
    nextQuestion,
    resetGame,
    athletes,
    config,
  };
}

export function getModeQuestion(mode: GameMode): string {
  switch (mode) {
    case 'college': return 'Where did this athlete go to college / develop?';
    case 'draft': return 'What was this athlete\'s draft position?';
    case 'hometown': return 'Where is this athlete from?';
    case 'jersey': return 'What jersey number does/did this athlete wear?';
  }
}
