import type { Athlete, GameMode } from '../types';

export function getAnswerForMode(athlete: Athlete, mode: GameMode): string {
  switch (mode) {
    case 'college': return athlete.college;
    case 'draft': return athlete.draftPick;
    case 'hometown': return athlete.hometown;
    case 'jersey': return String(athlete.jerseyNumber);
  }
}

export function getQuestionForMode(mode: GameMode): string {
  switch (mode) {
    case 'college': return 'Where did this athlete go to college?';
    case 'draft': return 'What was this athlete\'s draft position?';
    case 'hometown': return 'Where is this athlete from?';
    case 'jersey': return 'What is this athlete\'s jersey number?';
  }
}

export function generateOptions(
  correctAnswer: string,
  allAnswers: string[],
  count: number = 4,
): string[] {
  const unique = [...new Set(allAnswers.filter(a => a !== correctAnswer))];
  const shuffled = unique.sort(() => Math.random() - 0.5);
  const wrong = shuffled.slice(0, count - 1);
  const options = [correctAnswer, ...wrong];
  return options.sort(() => Math.random() - 0.5);
}

export function generateNumberOptions(correct: number): string[] {
  const options = new Set<number>([correct]);
  while (options.size < 4) {
    const offset = Math.floor(Math.random() * 20) - 10;
    const candidate = Math.max(0, correct + offset);
    if (candidate !== correct) options.add(candidate);
  }
  return [...options].sort((a, b) => a - b).map(String);
}

export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
