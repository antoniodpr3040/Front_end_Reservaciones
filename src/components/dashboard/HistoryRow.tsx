import type { HistoryStatus } from '../../types/reservations';

interface HistoryRowProps {
  date: string;
  space: string;
  status: HistoryStatus;
  time: string;
  user: string;
}

export function HistoryRow({
  date,
  space,
  status,
  time,
  user,
}: HistoryRowProps) {
  return (
    <tr className="border-b border-surface-container bg-surface-container-lowest">
      <td className="px-6 py-4 text-sm font-medium">{user}</td>
      <td className="px-6 py-4 text-sm text-on-surface-variant">{space}</td>
      <td className="px-6 py-4 text-sm text-on-surface-variant">{date}</td>
      <td className="px-6 py-4 text-sm text-on-surface-variant">{time}</td>
      <td className="px-6 py-4">
        <span
          className={
            status === 'Completada'
              ? 'rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800'
              : 'rounded-full bg-secondary-container px-3 py-1 text-xs font-bold text-on-secondary-container'
          }
        >
          {status}
        </span>
      </td>
    </tr>
  );
}
