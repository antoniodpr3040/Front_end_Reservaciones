import { useEffect, useState } from 'react';
import {
  cancelReservation,
  listReservations,
  type ReservationRecordResponse,
} from '../api/reservations';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';
import { ReservationRow } from '../components/reservations/ReservationRow';

type ReservationFilter = 'all' | 'upcoming' | 'history';

interface ReservationCardViewModel {
  actionDisabled?: boolean;
  actionHref?: string;
  actionLabel: string;
  canCancel: boolean;
  completed?: boolean;
  date: string;
  highlight?: boolean;
  id: string;
  icon: string;
  location: string;
  outlookHref?: string;
  sortTime: number;
  status: string;
  time: string;
  title: string;
}

interface ReservationsViewProps {
  onBackToSpaces: () => void;
}

const DATE_LABEL = new Intl.DateTimeFormat('es-SV', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const TIME_LABEL = new Intl.DateTimeFormat('es-SV', {
  hour: 'numeric',
  minute: '2-digit',
});

function formatReservationTime(start: Date, end: Date) {
  return `${TIME_LABEL.format(start)} - ${TIME_LABEL.format(end)}`;
}

function toReservationViewModel(
  reservation: ReservationRecordResponse,
  now: Date,
): ReservationCardViewModel {
  const startDate = new Date(reservation.start);
  const endDate = new Date(reservation.end);
  const isCancelled = reservation.status.toLowerCase() === 'cancelled';
  const isCompleted = !isCancelled && endDate.getTime() < now.getTime();
  const isActive = !isCancelled && !isCompleted;

  return {
    actionDisabled: isCancelled,
    actionHref: isCompleted ? reservation.web_link ?? undefined : undefined,
    actionLabel: isCancelled
      ? 'Cancelada'
      : isActive
        ? 'Cancelar reserva'
        : 'Ver en Outlook',
    canCancel: isActive,
    completed: !isActive,
    date: DATE_LABEL.format(startDate),
    highlight: isActive,
    id: reservation.reservation_id,
    icon: isCancelled ? 'event_busy' : isCompleted ? 'task_alt' : 'event_available',
    location: reservation.location?.trim() || 'Ubicacion no especificada',
    outlookHref: isActive ? reservation.web_link ?? undefined : undefined,
    sortTime: startDate.getTime(),
    status: isCancelled ? 'Cancelada' : isCompleted ? 'Completada' : 'Activa',
    time: formatReservationTime(startDate, endDate),
    title: reservation.title,
  };
}

export function ReservationsView({
  onBackToSpaces,
}: ReservationsViewProps) {
  const [activeFilter, setActiveFilter] = useState<ReservationFilter>('all');
  const [cancelErrorMessage, setCancelErrorMessage] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [cancelSuccessMessage, setCancelSuccessMessage] = useState('');
  const [cancelTarget, setCancelTarget] = useState<ReservationCardViewModel | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reservations, setReservations] = useState<ReservationCardViewModel[]>([]);

  const loadReservations = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const data = await listReservations();
      const now = new Date();
      const nextReservations = data
        .map((reservation) => toReservationViewModel(reservation, now))
        .sort((left, right) => right.sortTime - left.sortTime);

      setReservations(nextReservations);
    } catch (error) {
      setReservations([]);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'No se pudo cargar tus reservaciones.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadReservations();
  }, []);

  const activeCount = reservations.filter(
    (reservation) => reservation.status === 'Activa',
  ).length;
  const totalCount = reservations.length;
  const summaryWidth =
    totalCount > 0 ? `${Math.max((activeCount / totalCount) * 100, 8)}%` : '0%';

  const filteredReservations =
    activeFilter === 'upcoming'
      ? reservations.filter((reservation) => reservation.status === 'Activa')
      : activeFilter === 'history'
        ? reservations.filter((reservation) => reservation.status !== 'Activa')
        : reservations;

  const getStatusClasses = (completed?: boolean, status?: string) => {
    if (status === 'Cancelada') {
      return 'bg-error-container text-error';
    }

    return completed
      ? 'bg-surface-container-high text-on-surface-variant'
      : 'bg-secondary-container text-on-secondary-container';
  };

  const closeCancelModal = () => {
    if (isCancelling) {
      return;
    }

    setCancelTarget(null);
    setCancelReason('');
    setCancelErrorMessage('');
  };

  const openCancelModal = (reservation: ReservationCardViewModel) => {
    setCancelTarget(reservation);
    setCancelReason('');
    setCancelErrorMessage('');
    setCancelSuccessMessage('');
  };

  const handleConfirmCancellation = async () => {
    if (!cancelTarget) {
      return;
    }

    const trimmedReason = cancelReason.trim();

    if (!trimmedReason) {
      setCancelErrorMessage('Debes indicar el motivo de cancelacion.');
      return;
    }

    setIsCancelling(true);
    setCancelErrorMessage('');

    try {
      await cancelReservation(cancelTarget.id, {
        reason: trimmedReason,
      });
      setCancelTarget(null);
      setCancelReason('');
      setCancelSuccessMessage('La reservacion fue cancelada correctamente.');
      await loadReservations();
    } catch (error) {
      setCancelErrorMessage(
        error instanceof Error
          ? error.message
          : 'No se pudo cancelar la reservacion.',
      );
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Header
        activeTab="reservations"
        onBackToSpaces={onBackToSpaces}
        onNavigateToReservations={() => undefined}
      />
      <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col px-4 pt-20 pb-14 sm:px-6 md:px-8 md:pt-24 md:pb-16">
        <div className="mb-10 md:mb-12">
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-primary font-headline sm:text-4xl">
            Mis reservas
          </h1>
          <p className="max-w-2xl text-sm text-on-surface-variant sm:text-base">
            Administra tus proximas sesiones y revisa el historial de uso de los
            espacios reservados.
          </p>
        </div>
        <div className="space-y-8">
          {cancelSuccessMessage ? (
            <div className="rounded-[1.5rem] border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-800">
              {cancelSuccessMessage}
            </div>
          ) : null}

          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="grid grid-cols-3 gap-2 rounded-2xl bg-surface-container-low p-1.5">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`rounded-xl px-3 py-2 text-sm sm:px-6 ${
                  activeFilter === 'all'
                    ? 'bg-surface-container-lowest font-bold text-primary shadow-sm'
                    : 'text-on-surface-variant transition-colors hover:bg-surface-container-high'
                }`}
              >
                Todas
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('upcoming')}
                className={`rounded-xl px-3 py-2 text-sm sm:px-6 ${
                  activeFilter === 'upcoming'
                    ? 'bg-surface-container-lowest font-bold text-primary shadow-sm'
                    : 'text-on-surface-variant transition-colors hover:bg-surface-container-high'
                }`}
              >
                Proximas
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('history')}
                className={`rounded-xl px-3 py-2 text-sm sm:px-6 ${
                  activeFilter === 'history'
                    ? 'bg-surface-container-lowest font-bold text-primary shadow-sm'
                    : 'text-on-surface-variant transition-colors hover:bg-surface-container-high'
                }`}
              >
                Historial
              </button>
            </div>
            <div className="w-full rounded-2xl bg-surface-container-low px-4 py-4 text-left md:w-auto md:bg-transparent md:px-0 md:py-0 md:text-right">
              <span className="mb-1 block text-xs font-bold tracking-widest text-on-surface-variant/50 uppercase">
                Reservas activas
              </span>
              <div className="flex items-center gap-2 md:justify-end">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-container-high md:w-32 md:flex-none">
                  <div
                    className="h-full bg-primary"
                    style={{ width: summaryWidth }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-primary">
                  {activeCount}/{totalCount} reservas
                </span>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-[1.75rem] bg-surface-container-low px-6 py-10 text-center text-sm text-on-surface-variant">
              Cargando tus reservaciones...
            </div>
          ) : errorMessage ? (
            <div className="rounded-[1.75rem] border border-error/15 bg-error-container/40 px-6 py-6 text-sm text-error">
              <p className="font-semibold">{errorMessage}</p>
              <button
                type="button"
                onClick={() => void loadReservations()}
                className="mt-4 rounded-2xl bg-white px-4 py-2 font-bold text-primary transition-all hover:shadow-sm active:scale-95"
              >
                Reintentar
              </button>
            </div>
          ) : filteredReservations.length === 0 ? (
            <div className="rounded-[1.75rem] bg-surface-container-low px-6 py-10 text-center">
              <p className="text-lg font-bold text-primary font-headline">
                No hay reservaciones para esta vista.
              </p>
              <p className="mt-2 text-sm text-on-surface-variant">
                Cuando registres una reserva desde el dashboard aparecera aqui.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4 md:hidden">
                {filteredReservations.map((reservation) => (
                  <article
                    key={reservation.id}
                    className={`rounded-[1.5rem] border border-surface-container bg-surface-container-lowest p-5 shadow-sm ${
                      reservation.highlight ? 'ring-2 ring-primary/10' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                          reservation.completed
                            ? 'bg-surface-container-high text-on-surface-variant'
                            : 'bg-primary-fixed text-primary'
                        }`}
                      >
                        <span className="material-symbols-outlined">
                          {reservation.icon}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h2 className="text-base font-bold text-on-surface font-headline">
                              {reservation.title}
                            </h2>
                            <p className="mt-1 text-sm text-on-surface-variant">
                              {reservation.location}
                            </p>
                          </div>
                          <span
                            className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-bold ${getStatusClasses(
                              reservation.completed,
                              reservation.status,
                            )}`}
                          >
                            {reservation.status}
                          </span>
                        </div>
                        <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-on-surface sm:grid-cols-2">
                          <div className="rounded-2xl bg-surface-container-low px-4 py-3">
                            <p className="text-[11px] font-bold tracking-[0.16em] text-on-surface-variant uppercase">
                              Fecha
                            </p>
                            <p className="mt-1 font-semibold">{reservation.date}</p>
                          </div>
                          <div className="rounded-2xl bg-surface-container-low px-4 py-3">
                            <p className="text-[11px] font-bold tracking-[0.16em] text-on-surface-variant uppercase">
                              Horario
                            </p>
                            <p className="mt-1 font-semibold">{reservation.time}</p>
                          </div>
                        </div>

                        {reservation.canCancel ? (
                          <div className="mt-4 space-y-2">
                            <button
                              type="button"
                              onClick={() => openCancelModal(reservation)}
                              className="inline-flex w-full items-center justify-center rounded-2xl bg-error-container px-4 py-3 text-sm font-bold text-error transition-all hover:shadow-sm active:scale-95"
                            >
                              {reservation.actionLabel}
                            </button>
                            {reservation.outlookHref ? (
                              <a
                                href={reservation.outlookHref}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex w-full items-center justify-center rounded-2xl bg-surface-container-high px-4 py-3 text-sm font-bold text-primary transition-all hover:shadow-sm active:scale-95"
                              >
                                Ver en Outlook
                              </a>
                            ) : null}
                          </div>
                        ) : reservation.actionHref && !reservation.actionDisabled ? (
                          <a
                            href={reservation.actionHref}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-surface-container-high px-4 py-3 text-sm font-bold text-primary transition-all hover:shadow-sm active:scale-95"
                          >
                            {reservation.actionLabel}
                          </a>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="mt-4 w-full cursor-not-allowed rounded-2xl bg-surface-container-high px-4 py-3 text-sm font-bold text-on-surface-variant opacity-70"
                          >
                            {reservation.actionLabel}
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="hidden overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm md:block">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-surface-container-high">
                      <th className="px-6 py-4 text-xs font-bold tracking-wider text-on-surface-variant uppercase">
                        Espacio y ubicacion
                      </th>
                      <th className="px-6 py-4 text-xs font-bold tracking-wider text-on-surface-variant uppercase">
                        Fecha
                      </th>
                      <th className="px-6 py-4 text-xs font-bold tracking-wider text-on-surface-variant uppercase">
                        Horario
                      </th>
                      <th className="px-6 py-4 text-xs font-bold tracking-wider text-on-surface-variant uppercase">
                        Estado
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold tracking-wider text-on-surface-variant uppercase">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container">
                    {filteredReservations.map((reservation) => (
                      <ReservationRow
                        key={reservation.id}
                        actionDisabled={reservation.actionDisabled}
                        actionHref={reservation.actionHref}
                        actionLabel={reservation.actionLabel}
                        completed={reservation.completed}
                        date={reservation.date}
                        highlight={reservation.highlight}
                        icon={reservation.icon}
                        location={reservation.location}
                        onActionClick={
                          reservation.canCancel
                            ? () => openCancelModal(reservation)
                            : undefined
                        }
                        secondaryActionHref={reservation.outlookHref}
                        secondaryActionLabel="Ver en Outlook"
                        status={reservation.status}
                        time={reservation.time}
                        title={reservation.title}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="relative col-span-1 overflow-hidden rounded-[1.75rem] bg-primary p-6 text-on-primary shadow-lg md:col-span-2 md:p-8">
              <div className="z-10">
                <h3 className="mb-2 text-xl font-bold font-headline">
                  Reservar un nuevo espacio
                </h3>
                <p className="mb-6 max-w-xs text-sm text-primary-fixed-dim/80">
                  Necesitas una sala o laboratorio para tu proximo proyecto.
                  Revisa el catalogo disponible.
                </p>
                <button
                  type="button"
                  onClick={onBackToSpaces}
                  className="rounded-2xl bg-white px-6 py-3 text-sm font-bold text-primary transition-all hover:shadow-xl active:scale-95"
                >
                  Ver catalogo
                </button>
              </div>
              <span className="material-symbols-outlined pointer-events-none absolute -right-5 -bottom-8 text-[128px] opacity-10 sm:-right-8 sm:text-[160px]">
                add_circle
              </span>
            </div>
            <div className="flex flex-col justify-between rounded-[1.75rem] bg-tertiary-fixed p-6 text-on-tertiary-fixed shadow-sm md:p-8">
              <div>
                <span className="material-symbols-outlined mb-4 text-tertiary">
                  info
                </span>
                <h3 className="mb-1 text-lg font-bold font-headline">
                  Politica de reservas
                </h3>
                <p className="text-xs leading-relaxed opacity-80">
                  El uso de las salas es exclusivo para su aplicación específica. Las reservas deben realizarse antes de la hora de inicio. Sin embargo, si la sala se encuentra disponible en una hora específica, podrá utilizarse al momento de llegar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      {cancelTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6">
          <div className="w-full max-w-lg rounded-[1.75rem] bg-white p-6 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold tracking-[0.14em] text-error uppercase">
                  Cancelar reserva
                </p>
                <h2 className="mt-2 text-2xl font-bold text-primary font-headline">
                  {cancelTarget.title}
                </h2>
                <p className="mt-2 text-sm text-on-surface-variant">
                  {cancelTarget.date} · {cancelTarget.time}
                </p>
              </div>
              <button
                type="button"
                onClick={closeCancelModal}
                disabled={isCancelling}
                className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high"
                aria-label="Cerrar modal de cancelacion"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="mt-6 space-y-3">
              <label
                htmlFor="cancel-reason"
                className="text-sm font-semibold tracking-wider text-on-surface-variant uppercase"
              >
                Motivo de cancelacion
              </label>
              <textarea
                id="cancel-reason"
                rows={4}
                value={cancelReason}
                onChange={(event) => setCancelReason(event.target.value)}
                placeholder="Escribe por que deseas cancelar esta reservacion."
                className="w-full rounded-2xl border border-surface-container bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
              {cancelErrorMessage ? (
                <p className="text-sm font-medium text-error">{cancelErrorMessage}</p>
              ) : (
                <p className="text-xs text-on-surface-variant">
                  Este motivo se enviara junto con la solicitud de cancelacion.
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeCancelModal}
                disabled={isCancelling}
                className="rounded-2xl bg-surface-container-high px-5 py-3 text-sm font-bold text-on-surface transition-all hover:bg-surface-container active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Seguir con la reserva
              </button>
              <button
                type="button"
                onClick={() => void handleConfirmCancellation()}
                disabled={isCancelling}
                className="rounded-2xl bg-error px-5 py-3 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isCancelling ? 'Cancelando...' : 'Confirmar cancelacion'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <Footer />
    </div>
  );
}
