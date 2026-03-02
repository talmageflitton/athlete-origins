export type Sport = 'nfl' | 'nba' | 'mlb' | 'nhl' | 'soccer';

export type GameMode = 'college' | 'draft' | 'hometown' | 'jersey';

export type Era = 'all' | '1970s' | '1980s' | '1990s' | '2000s' | '2010s' | '2020s';

export interface Athlete {
  id: string;
  name: string;
  sport: Sport;
  team: string;
  position: string;
  college: string;
  draftPick: string; // e.g. "Round 1, Pick 1" or "Undrafted"
  hometown: string;  // e.g. "Akron, Ohio"
  jerseyNumber: number;
  era: Era;
  imageUrl?: string;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameState {
  currentAthleteIndex: number;
  score: number;
  totalQuestions: number;
  answers: AnswerRecord[];
  isComplete: boolean;
}

export interface AnswerRecord {
  athleteId: string;
  guess: string;
  correct: boolean;
}

export interface GameConfig {
  sport: Sport | 'all';
  mode: GameMode;
  era: Era;
  questionCount: number;
  isDaily: boolean;
}

export const SPORT_LABELS: Record<Sport, string> = {
  nfl: 'NFL',
  nba: 'NBA',
  mlb: 'MLB',
  nhl: 'NHL',
  soccer: 'Soccer',
};

export const SPORT_COLORS: Record<Sport, string> = {
  nfl: '#013369',
  nba: '#C9082A',
  mlb: '#002D72',
  nhl: '#000000',
  soccer: '#1B5E20',
};

export const MODE_LABELS: Record<GameMode, string> = {
  college: 'Guess the College',
  draft: 'Guess the Draft Pick',
  hometown: 'Guess the Hometown',
  jersey: 'Guess the Jersey Number',
};

export const ERA_LABELS: Record<Era, string> = {
  all: 'All Eras',
  '1970s': '1970s',
  '1980s': '1980s',
  '1990s': '1990s',
  '2000s': '2000s',
  '2010s': '2010s',
  '2020s': '2020s',
};
