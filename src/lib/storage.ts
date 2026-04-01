import type { GameState, PlayerStats, Achievement, AchievementId, PowerUpId } from '@/types/game';
import { LEVELS, WRONG_GUESS_PENALTY, SCORE_BY_CLUE, POWER_UP_META } from '@/types/game';
import { getDailyAthlete, getTodayString, isCorrectGuess } from '@/data/athletes';

const GAME_STATE_KEY = 'ao_game_state';
const STATS_KEY = 'ao_stats';

// ─── Default factories ────────────────────────────────────────────────────────

export function defaultStats(): PlayerStats {
  return {
    totalGames: 0,
    wins: 0,
    currentStreak: 0,
    maxStreak: 0,
    totalScore: 0,
    level: 1,
    coins: 100, // starter coins
    achievements: [],
    guessDist: [0, 0, 0, 0, 0, 0, 0],
    lastPlayedDate: '',
  };
}

export function defaultGameState(): GameState {
  const athlete = getDailyAthlete();
  return {
    date: getTodayString(),
    athleteId: athlete.id,
    revealedClues: 0,
    guesses: [],
    status: 'playing',
    score: 0,
    usedPowerUps: [],
  };
}

// ─── Persistence ──────────────────────────────────────────────────────────────

export function loadStats(): PlayerStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return defaultStats();
    return { ...defaultStats(), ...JSON.parse(raw) } as PlayerStats;
  } catch {
    return defaultStats();
  }
}

export function saveStats(stats: PlayerStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // localStorage unavailable (private browsing, storage full)
  }
}

export function loadGameState(): GameState {
  try {
    const raw = localStorage.getItem(GAME_STATE_KEY);
    if (!raw) return defaultGameState();
    const saved = JSON.parse(raw) as GameState;
    const today = getTodayString();
    // If saved game is from a different day, start fresh
    if (saved.date !== today) return defaultGameState();
    // Ensure usedPowerUps exists for games saved before this field was added
    if (!saved.usedPowerUps) saved.usedPowerUps = [];
    return saved;
  } catch {
    return defaultGameState();
  }
}

export function saveGameState(state: GameState): void {
  try {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

// ─── Score calculation ────────────────────────────────────────────────────────

export function calculateScore(cluesRevealed: number, wrongGuesses: number): number {
  const base = SCORE_BY_CLUE[cluesRevealed] ?? 0;
  const penalty = wrongGuesses * WRONG_GUESS_PENALTY;
  return Math.max(0, base - penalty);
}

// ─── Level ────────────────────────────────────────────────────────────────────

export function getLevelForScore(totalScore: number): number {
  let level = 1;
  for (const l of LEVELS) {
    if (totalScore >= l.minScore) level = l.level;
  }
  return level;
}

export function getLevelTitle(level: number): string {
  return LEVELS.find((l) => l.level === level)?.title ?? 'Rookie';
}

export function getNextLevelInfo(totalScore: number): { nextLevel: number; nextTitle: string; pointsNeeded: number } | null {
  for (let i = 0; i < LEVELS.length - 1; i++) {
    if (totalScore < LEVELS[i + 1].minScore) {
      return {
        nextLevel: LEVELS[i + 1].level,
        nextTitle: LEVELS[i + 1].title,
        pointsNeeded: LEVELS[i + 1].minScore - totalScore,
      };
    }
  }
  return null; // at max level
}

// ─── Achievement unlocking ────────────────────────────────────────────────────

function hasAchievement(stats: PlayerStats, id: AchievementId): boolean {
  return stats.achievements.some((a) => a.id === id);
}

function unlockAchievement(stats: PlayerStats, id: AchievementId): Achievement | null {
  if (hasAchievement(stats, id)) return null;
  const achievement: Achievement = { id, unlockedAt: Date.now() };
  stats.achievements.push(achievement);
  return achievement;
}

export function processGameResult(
  prevStats: PlayerStats,
  gameState: GameState,
): { updatedStats: PlayerStats; newAchievements: Achievement[] } {
  const stats = { ...prevStats, guessDist: [...prevStats.guessDist] as PlayerStats['guessDist'] };
  const newAchievements: Achievement[] = [];

  const won = gameState.status === 'won';
  const today = getTodayString();

  // Update streak
  const yesterday = new Date();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const yStr = [
    yesterday.getUTCFullYear(),
    String(yesterday.getUTCMonth() + 1).padStart(2, '0'),
    String(yesterday.getUTCDate()).padStart(2, '0'),
  ].join('-');

  if (won) {
    if (stats.lastPlayedDate === yStr) {
      stats.currentStreak += 1;
    } else if (stats.lastPlayedDate !== today) {
      stats.currentStreak = 1;
    }
    stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
  } else {
    stats.currentStreak = 0;
  }

  stats.lastPlayedDate = today;
  stats.totalGames += 1;

  if (won) {
    stats.wins += 1;
    stats.totalScore += gameState.score;
    stats.coins += Math.floor(gameState.score / 10) + 10;

    // Distribution: index = clues revealed when won
    const clueIdx = Math.min(6, Math.max(1, gameState.revealedClues)) as 0 | 1 | 2 | 3 | 4 | 5 | 6;
    stats.guessDist[clueIdx] += 1;
  } else {
    stats.guessDist[0] += 1;
  }

  stats.level = getLevelForScore(stats.totalScore);

  // Check achievements
  const a = (id: AchievementId) => {
    const unlocked = unlockAchievement(stats, id);
    if (unlocked) newAchievements.push(unlocked);
  };

  if (won) {
    a('first_win');
    if (gameState.revealedClues === 1) a('quick_draw');
    if (gameState.score >= 1000) a('perfect_score');
    if (gameState.guesses.length >= 3 && won) a('comeback');
  }
  if (stats.currentStreak >= 3) a('streak_3');
  if (stats.currentStreak >= 7) a('streak_7');
  if (stats.currentStreak >= 30) a('streak_30');
  if (stats.totalGames >= 10) a('games_10');
  if (stats.totalGames >= 50) a('games_50');
  if (stats.totalGames >= 100) a('games_100');
  if (stats.level >= 6) a('goat');

  return { updatedStats: stats, newAchievements };
}

// ─── Share text ───────────────────────────────────────────────────────────────

export function buildShareText(gameState: GameState, dayNumber: number): string {
  const won = gameState.status === 'won';
  const clueEmojis = Array.from({ length: 6 }, (_, i) => {
    if (i < gameState.revealedClues - 1) return '🟨'; // used but didn't guess
    if (i === gameState.revealedClues - 1 && won) return '🟩'; // winning clue
    if (i < gameState.revealedClues) return '⬛';
    return '⬜'; // unused
  }).join('');

  const result = won
    ? `Guessed in ${gameState.revealedClues} clue${gameState.revealedClues !== 1 ? 's' : ''} — ${gameState.score} pts`
    : 'Didn\'t get it today';

  return [
    `⚡ Athlete Origins #${dayNumber}`,
    result,
    clueEmojis,
    '',
    'athleteoriginsgame.com',
  ].join('\n');
}

// ─── Game actions ─────────────────────────────────────────────────────────────

export function revealNextClue(state: GameState): GameState {
  if (state.status !== 'playing') return state;
  if (state.revealedClues >= 6) return state;
  return { ...state, revealedClues: state.revealedClues + 1 };
}

export function submitGuess(state: GameState, guess: string): GameState {
  if (state.status !== 'playing') return state;
  if (state.revealedClues === 0) return state; // must reveal at least 1 clue first

  const athlete = getDailyAthlete();
  const correct = isCorrectGuess(guess, athlete);

  if (correct) {
    const score = calculateScore(state.revealedClues, state.guesses.length);
    return {
      ...state,
      status: 'won',
      score,
      completedAt: Date.now(),
    };
  }

  const newGuesses = [...state.guesses, guess];
  // Auto-lose after 6 clues revealed + wrong guess, or 3 wrong guesses while all 6 clues shown
  const shouldLose = state.revealedClues >= 6 || newGuesses.length >= 6;
  return {
    ...state,
    guesses: newGuesses,
    status: shouldLose ? 'lost' : 'playing',
    completedAt: shouldLose ? Date.now() : undefined,
  };
}

export function giveUp(state: GameState): GameState {
  if (state.status !== 'playing') return state;
  return { ...state, status: 'lost', score: 0, completedAt: Date.now() };
}

// ─── Power-ups ────────────────────────────────────────────────────────────────

export function canUsePowerUp(
  powerUpId: PowerUpId,
  gameState: GameState,
  stats: PlayerStats,
): boolean {
  if (gameState.status !== 'playing') return false;
  if (gameState.usedPowerUps.includes(powerUpId)) return false;
  const cost = POWER_UP_META[powerUpId].cost;
  return stats.coins >= cost;
}

export function usePowerUp(
  powerUpId: PowerUpId,
  gameState: GameState,
  stats: PlayerStats,
): { gameState: GameState; stats: PlayerStats } | null {
  if (!canUsePowerUp(powerUpId, gameState, stats)) return null;
  const cost = POWER_UP_META[powerUpId].cost;
  return {
    gameState: {
      ...gameState,
      usedPowerUps: [...gameState.usedPowerUps, powerUpId],
    },
    stats: {
      ...stats,
      coins: stats.coins - cost,
    },
  };
}
