export interface StreakScore {
  streak: number;
  date: string; // YYYY-MM-DD
  timestamp: number;
}

const PERSONAL_BEST_KEY = 'ao_streak_best';
const LEADERBOARD_KEY = 'ao_streak_scores';
const MAX_LEADERBOARD_SIZE = 10;

export function loadPersonalBest(): number {
  try {
    const raw = localStorage.getItem(PERSONAL_BEST_KEY);
    return raw ? parseInt(raw, 10) : 0;
  } catch {
    return 0;
  }
}

export function savePersonalBest(streak: number): void {
  try {
    const current = loadPersonalBest();
    if (streak > current) {
      localStorage.setItem(PERSONAL_BEST_KEY, String(streak));
    }
  } catch {
    // ignore
  }
}

export function loadLeaderboard(): StreakScore[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLeaderboardEntry(streak: number): void {
  if (streak === 0) return;
  try {
    const scores = loadLeaderboard();
    const now = new Date();
    const date = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;
    scores.push({ streak, date, timestamp: Date.now() });
    scores.sort((a, b) => b.streak - a.streak);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(scores.slice(0, MAX_LEADERBOARD_SIZE)));
  } catch {
    // ignore
  }
}
