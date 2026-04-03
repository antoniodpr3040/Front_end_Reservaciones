import type { SpaceStatus } from '../../types/reservations';

interface SpaceCardProps {
  capacity: number;
  description: string;
  icon: string;
  onReserve: () => void;
  status: SpaceStatus;
  title: string;
}

export function SpaceCard({
  capacity,
  description,
  icon,
  onReserve,
  status,
  title,
}: SpaceCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-3xl bg-surface-container-lowest p-5 shadow-sm transition-transform duration-300 hover:-translate-y-1 sm:p-6">
      <div className="space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-fixed-dim/30 text-primary">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-on-surface font-headline">
            {title}
          </h3>
          <p className="text-sm text-on-surface-variant">{description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 py-2">
          <div className="flex items-center gap-1 text-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-base">group</span>
            <span>Cap. {capacity}</span>
          </div>
          <span
            className={
              status === 'Disponible'
                ? 'rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800'
                : 'rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-800'
            }
          >
            {status}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={onReserve}
        className="mt-6 w-full rounded-xl bg-surface-container-high py-3 font-bold text-on-primary-fixed-variant transition-colors hover:bg-secondary-container"
      >
        Reservar
      </button>
    </div>
  );
}
