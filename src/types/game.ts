export interface Athlete {
  id: string;
  name: string;
  sport: string;
  country: string;
  region: string;
  birthYear: number;
  currentTeam: string;
  emoji: string; // sport emoji for visual cue
  clues: readonly [string, string, string, string, string, string];
  aliases: string[]; // accepted answer variations
}

export type GameStatus = 'playing' | 'won' | 'lost';

export interface GameState {
  date: string; // YYYY-MM-DD
  athleteId: string;
  revealedClues: number; // 0–6
  guesses: string[]; // wrong guesses only
  status: GameStatus;
  score: number;
  completedAt?: number; // timestamp
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
  // index 0 = lost, index 1–6 = won on clue N
  lastPlayedDate: string;
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
  unlockedAt: number; // timestamp
}

export interface ClueType {
  icon: string;
  label: string;
  color: string; // tailwind color class
}

export const CLUE_TYPES: ClueType[] = [
  { icon: '🏅', label: 'Sport Type', color: 'apple-blue' },
  { icon: '⚡', label: 'Sport', color: 'apple-purple' },
  { icon: '🌍', label: 'Origin', color: 'apple-green' },
  { icon: '📅', label: 'Era', color: 'apple-orange' },
  { icon: '🏆', label: 'Career', color: 'apple-pink' },
  { icon: '💡', label: 'Final Hint', color: 'apple-red' },
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
  { level: 1, title: 'Rookie', minScore: 0 },
  { level: 2, title: 'Amateur', minScore: 500 },
  { level: 3, title: 'Pro', minScore: 1500 },
  { level: 4, title: 'All-Star', minScore: 3500 },
  { level: 5, title: 'MVP', minScore: 7000 },
  { level: 6, title: 'Legend', minScore: 12500 },
  { level: 7, title: 'G.O.A.T.', minScore: 25000 },
] as const;

export const ACHIEVEMENT_META: Record<AchievementId, { title: string; desc: string; icon: string }> = {
  first_win: { title: 'First W', desc: 'Win your first game', icon: '🏆' },
  quick_draw: { title: 'Quick Draw', desc: 'Guess correctly on the first clue', icon: '⚡' },
  streak_3: { title: 'Hat Trick', desc: '3-day win streak', icon: '🔥' },
  streak_7: { title: 'Week Warrior', desc: '7-day win streak', icon: '🔥🔥' },
  streak_30: { title: 'Unstoppable', desc: '30-day win streak', icon: '💥' },
  games_10: { title: 'In the Game', desc: 'Play 10 games', icon: '🎮' },
  games_50: { title: 'Veteran', desc: 'Play 50 games', icon: '🎖️' },
  games_100: { title: 'Centurion', desc: 'Play 100 games', icon: '💯' },
  perfect_score: { title: 'Perfect', desc: 'Score 1000 points in a game', icon: '💎' },
  comeback: { title: 'Comeback Kid', desc: 'Win after 3 wrong guesses', icon: '🦾' },
  goat: { title: 'G.O.A.T.', desc: 'Reach Legend level', icon: '🐐' },
};
