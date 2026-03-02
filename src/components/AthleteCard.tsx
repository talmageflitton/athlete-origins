import type { Athlete } from '../types';
import { SPORT_LABELS } from '../types';
import { SportIcon } from './SportIcon';

interface AthleteCardProps {
  athlete: Athlete;
  hideField?: string;
}

export function AthleteCard({ athlete, hideField }: AthleteCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4 flex items-center gap-3">
        <SportIcon sport={athlete.sport} size="text-3xl" />
        <div>
          <h2 className="text-white text-2xl font-bold">{athlete.name}</h2>
          <div className="flex items-center gap-2 text-slate-300 text-sm mt-0.5">
            <span>{athlete.team}</span>
            <span className="text-slate-500">|</span>
            <span>{athlete.position}</span>
            <span className="text-slate-500">|</span>
            <span>{SPORT_LABELS[athlete.sport]}</span>
          </div>
        </div>
      </div>
      <div className="px-6 py-4 grid grid-cols-2 gap-3 text-sm">
        {hideField !== 'college' && (
          <InfoRow label="College" value={athlete.college} />
        )}
        {hideField !== 'draft' && (
          <InfoRow label="Draft" value={athlete.draftPick} />
        )}
        {hideField !== 'hometown' && (
          <InfoRow label="Hometown" value={athlete.hometown} />
        )}
        {hideField !== 'jersey' && (
          <InfoRow label="Jersey #" value={String(athlete.jerseyNumber)} />
        )}
        <InfoRow label="Era" value={athlete.era} />
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-slate-400 text-xs font-medium uppercase tracking-wide">{label}</span>
      <span className="text-slate-800 font-medium">{value}</span>
    </div>
  );
}
