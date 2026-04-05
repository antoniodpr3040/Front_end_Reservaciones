interface ReservationRowProps {
  actionDisabled?: boolean;
  actionHref?: string;
  actionLabel?: string;
  completed?: boolean;
  date: string;
  highlight?: boolean;
  icon: string;
  location: string;
  onActionClick?: () => void;
  secondaryActionHref?: string;
  secondaryActionLabel?: string;
  status: string;
  time: string;
  title: string;
}

export function ReservationRow({
  actionDisabled,
  actionHref,
  actionLabel,
  completed,
  date,
  highlight,
  icon,
  location,
  onActionClick,
  secondaryActionHref,
  secondaryActionLabel,
  status,
  time,
  title,
}: ReservationRowProps) {
  const actionText = actionLabel ?? (completed ? 'Repetir reserva' : 'Cancelar reserva');

  return (
    <tr
      className={`group transition-colors hover:bg-surface-container-low ${
        highlight ? 'border-l-4 border-primary bg-surface-container-low/30' : ''
      }`}
    >
      <td className="px-6 py-6">
        <div
          className={`flex items-center gap-4 ${completed ? 'opacity-60' : ''}`}
        >
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-lg ${
              completed
                ? 'bg-surface-container-high text-on-surface-variant'
                : 'bg-primary-fixed text-primary'
            }`}
          >
            <span className="material-symbols-outlined">{icon}</span>
          </div>
          <div>
            <div className="text-base font-bold text-on-surface font-headline">
              {title}
            </div>
            <div className="text-xs text-on-surface-variant">{location}</div>
          </div>
        </div>
      </td>
      <td
        className={`px-6 py-6 font-medium ${
          completed ? 'text-on-surface-variant' : 'text-on-surface'
        }`}
      >
        {date}
      </td>
      <td
        className={`px-6 py-6 font-medium ${
          completed ? 'text-on-surface-variant' : 'text-on-surface'
        }`}
      >
        {time}
      </td>
      <td className="px-6 py-6">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
            status === 'Cancelada'
              ? 'bg-error-container text-error'
              : completed
              ? 'bg-surface-container-high text-on-surface-variant'
              : 'bg-secondary-container text-on-secondary-container'
          }`}
        >
          {!completed && status !== 'Cancelada' && (
            <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary"></span>
          )}
          {status}
        </span>
      </td>
      <td className="px-6 py-6 text-right">
        <div className="flex flex-col items-end gap-2">
          {onActionClick ? (
            <button
              type="button"
              onClick={onActionClick}
              disabled={actionDisabled}
              className={`rounded-lg px-4 py-2 text-sm font-bold transition-all ${
                actionDisabled
                  ? 'cursor-not-allowed text-on-surface-variant opacity-60'
                  : 'text-error hover:bg-surface-container-high active:scale-95'
              }`}
            >
              {actionText}
            </button>
          ) : actionHref && !actionDisabled ? (
            <a
              href={actionHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-lg px-4 py-2 text-sm font-bold text-primary transition-all hover:bg-surface-container-high"
            >
              {actionText}
            </a>
          ) : (
            <button
              type="button"
              disabled={actionDisabled}
              className={`rounded-lg px-4 py-2 text-sm font-bold transition-all ${
                actionDisabled
                  ? 'cursor-not-allowed text-on-surface-variant opacity-60'
                  : completed
                    ? 'text-primary hover:bg-surface-container-high active:scale-95'
                    : 'text-error hover:bg-surface-container-high active:scale-95'
              }`}
            >
              {actionText}
            </button>
          )}

          {secondaryActionHref ? (
            <a
              href={secondaryActionHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-lg px-3 py-1.5 text-xs font-bold text-primary transition-all hover:bg-surface-container-high"
            >
              {secondaryActionLabel ?? 'Ver en Outlook'}
            </a>
          ) : null}
        </div>
      </td>
    </tr>
  );
}
