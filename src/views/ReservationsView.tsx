import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';
import { ReservationRow } from '../components/reservations/ReservationRow';
import { currentReservations } from '../data/mockData';

interface ReservationsViewProps {
  onBackToSpaces: () => void;
}

export function ReservationsView({
  onBackToSpaces,
}: ReservationsViewProps) {
  const getStatusClasses = (completed?: boolean) =>
    completed
      ? 'bg-surface-container-high text-on-surface-variant'
      : 'bg-secondary-container text-on-secondary-container';

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
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="grid grid-cols-3 gap-2 rounded-2xl bg-surface-container-low p-1.5">
              <button
                type="button"
                className="rounded-xl bg-surface-container-lowest px-3 py-2 text-sm font-bold text-primary shadow-sm sm:px-6"
              >
                Todas
              </button>
              <button
                type="button"
                className="rounded-xl px-3 py-2 text-sm text-on-surface-variant transition-colors hover:bg-surface-container-high sm:px-6"
              >
                Proximas
              </button>
              <button
                type="button"
                className="rounded-xl px-3 py-2 text-sm text-on-surface-variant transition-colors hover:bg-surface-container-high sm:px-6"
              >
                Historial
              </button>
            </div>
            <div className="w-full rounded-2xl bg-surface-container-low px-4 py-4 text-left md:w-auto md:bg-transparent md:px-0 md:py-0 md:text-right">
              <span className="mb-1 block text-xs font-bold tracking-widest text-on-surface-variant/50 uppercase">
                Uso actual
              </span>
              <div className="flex items-center gap-2 md:justify-end">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-container-high md:w-32 md:flex-none">
                  <div className="h-full w-3/4 bg-primary"></div>
                </div>
                <span className="text-sm font-bold text-primary">
                  12/15 horas
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4 md:hidden">
            {currentReservations.map((reservation) => (
              <article
                key={`${reservation.title}-${reservation.date}-${reservation.time}`}
                className={`rounded-[1.5rem] border border-surface-container bg-surface-container-lowest p-5 shadow-sm ${
                  reservation.highlight
                    ? 'ring-2 ring-primary/10'
                    : ''
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
                    <button
                      type="button"
                      className={`mt-4 w-full rounded-2xl px-4 py-3 text-sm font-bold transition-all active:scale-95 ${
                        reservation.completed
                          ? 'bg-surface-container-high text-primary'
                          : 'bg-error-container text-error'
                      }`}
                    >
                      {reservation.completed
                        ? 'Repetir reserva'
                        : 'Cancelar reserva'}
                    </button>
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
                {currentReservations.map((reservation) => (
                  <ReservationRow
                    key={`${reservation.title}-${reservation.date}-${reservation.time}`}
                    title={reservation.title}
                    location={reservation.location}
                    date={reservation.date}
                    time={reservation.time}
                    status={reservation.status}
                    icon={reservation.icon}
                    highlight={reservation.highlight}
                    completed={reservation.completed}
                  />
                ))}
              </tbody>
            </table>
          </div>
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
                  Las cancelaciones deben hacerse al menos 2 horas antes del
                  horario reservado para evitar penalizaciones.
                </p>
              </div>
              <a
                className="mt-4 text-sm font-bold underline decoration-2 underline-offset-4 decoration-tertiary/30"
                href="#"
              >
                Ver politica
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
