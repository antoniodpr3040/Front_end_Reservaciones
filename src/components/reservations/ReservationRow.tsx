interface ReservationRowProps {
  completed?: boolean;
  date: string;
  highlight?: boolean;
  icon: string;
  location: string;
  status: string;
  time: string;
  title: string;
}

export function ReservationRow({
  completed,
  date,
  highlight,
  icon,
  location,
  status,
  time,
  title,
}: ReservationRowProps) {
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
            completed
              ? 'bg-surface-container-high text-on-surface-variant'
              : 'bg-secondary-container text-on-secondary-container'
          }`}
        >
          {!completed && (
            <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary"></span>
          )}
          {status}
        </span>
      </td>
      <td className="px-6 py-6 text-right">
        <button
          type="button"
          className={`rounded-lg px-4 py-2 text-sm font-bold transition-all active:scale-95 hover:bg-surface-container-high ${
            completed ? 'text-primary' : 'text-error'
          }`}
        >
          {completed ? 'Repetir reserva' : 'Cancelar reserva'}
        </button>
      </td>
    </tr>
  );
}
