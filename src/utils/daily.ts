// Deterministic seeded random for daily challenge
// Everyone gets the same sequence on the same day
export function getDailySeed(): number {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

export function seededShuffle<T>(array: T[], seed: number): T[] {
  const result = [...array];
  let currentSeed = seed;

  function nextRandom(): number {
    currentSeed = (currentSeed * 1664525 + 1013904223) & 0xffffffff;
    return (currentSeed >>> 0) / 0xffffffff;
  }

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(nextRandom() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export function getDailyDateString(): string {
  const today = new Date();
  return today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const DAILY_STORAGE_KEY = 'athlete-origins-daily';

export interface DailyProgress {
  date: string;
  score: number;
  total: number;
  completed: boolean;
}

export function getDailyProgress(): DailyProgress | null {
  const stored = localStorage.getItem(DAILY_STORAGE_KEY);
  if (!stored) return null;
  const progress: DailyProgress = JSON.parse(stored);
  const todayKey = new Date().toISOString().split('T')[0];
  if (progress.date !== todayKey) return null;
  return progress;
}

export function saveDailyProgress(score: number, total: number, completed: boolean): void {
  const todayKey = new Date().toISOString().split('T')[0];
  const progress: DailyProgress = { date: todayKey, score, total, completed };
  localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify(progress));
}
