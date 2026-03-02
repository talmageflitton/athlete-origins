import type { Sport } from '../types';

const icons: Record<Sport, string> = {
  nfl: '\u{1F3C8}',
  nba: '\u{1F3C0}',
  mlb: '\u26BE',
  nhl: '\u{1F3D2}',
  soccer: '\u26BD',
};

export function SportIcon({ sport, size = 'text-2xl' }: { sport: Sport; size?: string }) {
  return <span className={size} role="img" aria-label={sport}>{icons[sport]}</span>;
}
