import type { Athlete, Sport, Era } from '../types';
import { nflAthletes } from './nfl';
import { nbaAthletes } from './nba';
import { mlbAthletes } from './mlb';
import { nhlAthletes } from './nhl';
import { soccerAthletes } from './soccer';

export const allAthletes: Athlete[] = [
  ...nflAthletes,
  ...nbaAthletes,
  ...mlbAthletes,
  ...nhlAthletes,
  ...soccerAthletes,
];

export const athletesBySport: Record<Sport, Athlete[]> = {
  nfl: nflAthletes,
  nba: nbaAthletes,
  mlb: mlbAthletes,
  nhl: nhlAthletes,
  soccer: soccerAthletes,
};

export function getFilteredAthletes(sport: Sport | 'all', era: Era): Athlete[] {
  let athletes = sport === 'all' ? allAthletes : athletesBySport[sport];
  if (era !== 'all') {
    athletes = athletes.filter(a => a.era === era);
  }
  return athletes;
}

export function getAllAnswersForMode(
  athletes: Athlete[],
  mode: 'college' | 'draft' | 'hometown' | 'jersey',
): string[] {
  switch (mode) {
    case 'college': return [...new Set(athletes.map(a => a.college))];
    case 'draft': return [...new Set(athletes.map(a => a.draftPick))];
    case 'hometown': return [...new Set(athletes.map(a => a.hometown))];
    case 'jersey': return [...new Set(athletes.map(a => String(a.jerseyNumber)))];
  }
}
