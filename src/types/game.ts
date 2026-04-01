export interface Athlete {
  id: string;
  name: string;
  position: string;           // 'PG' | 'SG' | 'SF' | 'PF' | 'C'
  birthYear: number;
  birthCity: string;          // e.g. "Akron, OH" or "Lagos, Nigeria"
  birthCountry: string;       // 'USA' | 'France' | 'Serbia' | etc.
  college: string;            // "Duke" | "Kentucky" | "International (France)" | "Lower Merion HS"
  collegeType: 'college' | 'high_school' | 'international' | 'g_league';
  draftYear: number;
  teams: string[];            // key franchises in career
  era: 'classic' | 'modern' | 'current';
  emoji: string;              // always 🏀
  aliases: string[];
  clues: readonly [string, string, string, string, string, string];
}

export type GameStatus = 'playing' | 'won' | 'lost';

export interface GameState {
  date: string;           // YYYY-MM-DD
  athleteId: string;
  revealedClues: number;  // 0–6
  guesses: string[];      // wrong guesses only
  status: GameStatus;
  score: number;
  completedAt?: number;
}

export interface PlayerStats {
  totalGames: number;
  wins: number;
  currentStreak: number;
  maxStreak: number;
  totalScore: number;
  level: number;
  coins: number;
  achievements: Achievement[];
  guessDist: [number, number, number, number, number, number, number];
  lastPlayedDate: string;
}

export interface OriginsStats {
  bestStreak: number;
  totalCorrect: number;
  totalPlayed: number;
}

export type AchievementId =
  | 'first_win'
  | 'quick_draw'
  | 'streak_3'
  | 'streak_7'
  | 'streak_30'
  | 'games_10'
  | 'games_50'
  | 'games_100'
  | 'perfect_score'
  | 'comeback'
  | 'goat';

export interface Achievement {
  id: AchievementId;
  unlockedAt: number;
}

export interface ClueType {
  icon: string;
  label: string;
  color: string;
}

export const CLUE_TYPES: ClueType[] = [
  { icon: '🏅', label: 'Player Type',  color: 'apple-blue' },
  { icon: '⚡', label: 'Draft Era',    color: 'apple-purple' },
  { icon: '🌍', label: 'Origin',       color: 'apple-green' },
  { icon: '🎓', label: 'School',       color: 'apple-orange' },
  { icon: '🏆', label: 'Career',       color: 'apple-pink' },
  { icon: '💡', label: 'Final Hint',   color: 'apple-red' },
];

export const SCORE_BY_CLUE: Record<number, number> = {
  1: 1000,
  2: 800,
  3: 600,
  4: 400,
  5: 200,
  6: 100,
};

export const WRONG_GUESS_PENALTY = 50;

export const LEVELS = [
  { level: 1, title: 'Rookie',    minScore: 0 },
  { level: 2, title: 'Bench',     minScore: 500 },
  { level: 3, title: 'Starter',   minScore: 1500 },
  { level: 4, title: 'All-Star',  minScore: 3500 },
  { level: 5, title: 'MVP',       minScore: 7000 },
  { level: 6, title: 'Champion',  minScore: 12500 },
  { level: 7, title: 'G.O.A.T.',  minScore: 25000 },
] as const;

export const ACHIEVEMENT_META: Record<AchievementId, { title: string; desc: string; icon: string }> = {
  first_win:     { title: 'First W',        desc: 'Win your first game',           icon: '🏆' },
  quick_draw:    { title: 'Quick Draw',      desc: 'Guess correctly on clue 1',     icon: '⚡' },
  streak_3:      { title: 'Hat Trick',       desc: '3-day win streak',              icon: '🔥' },
  streak_7:      { title: 'Week Warrior',    desc: '7-day win streak',              icon: '🔥🔥' },
  streak_30:     { title: 'Unstoppable',     desc: '30-day win streak',             icon: '💥' },
  games_10:      { title: 'In the Game',     desc: 'Play 10 games',                 icon: '🎮' },
  games_50:      { title: 'Veteran',         desc: 'Play 50 games',                 icon: '🎖️' },
  games_100:     { title: 'Centurion',       desc: 'Play 100 games',                icon: '💯' },
  perfect_score: { title: 'Perfect',         desc: 'Score 1000 points in a game',   icon: '💎' },
  comeback:      { title: 'Comeback Kid',    desc: 'Win after 3 wrong guesses',     icon: '🦾' },
  goat:          { title: 'G.O.A.T.',        desc: 'Reach Champion level',          icon: '🐐' },
};
