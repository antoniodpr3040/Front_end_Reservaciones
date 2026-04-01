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
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Header
        activeTab="reservations"
        onBackToSpaces={onBackToSpaces}
        onNavigateToReservations={() => undefined}
      />
      <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col px-4 pt-24 pb-16 md:px-8">
        <div className="mb-12">
          <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-primary font-headline">
            Mis reservas
          </h1>
          <p className="max-w-2xl text-on-surface-variant">
            Administra tus proximas sesiones y revisa el historial de uso de los
            espacios reservados.
          </p>
        </div>
        <div className="space-y-8">
          <div className="mb-6 flex flex-col items-end justify-between gap-4 md:flex-row">
            <div className="flex gap-2 rounded-xl bg-surface-container-low p-1">
              <button
                type="button"
                className="rounded-lg bg-surface-container-lowest px-6 py-2 text-sm font-bold text-primary shadow-sm"
              >
                Todas
              </button>
              <button
                type="button"
                className="rounded-lg px-6 py-2 text-sm text-on-surface-variant transition-colors hover:bg-surface-container-high"
              >
                Proximas
              </button>
              <button
                type="button"
                className="rounded-lg px-6 py-2 text-sm text-on-surface-variant transition-colors hover:bg-surface-container-high"
              >
                Historial
              </button>
            </div>
            <div className="text-right">
              <span className="mb-1 block text-xs font-bold tracking-widest text-on-surface-variant/50 uppercase">
                Uso actual
              </span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 overflow-hidden rounded-full bg-surface-container-high">
                  <div className="h-full w-3/4 bg-primary"></div>
                </div>
                <span className="text-sm font-bold text-primary">
                  12/15 horas
                </span>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
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
            <div className="relative col-span-1 flex items-center justify-between overflow-hidden rounded-xl bg-primary p-8 text-on-primary shadow-lg md:col-span-2">
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
                  className="rounded-lg bg-white px-6 py-3 text-sm font-bold text-primary transition-all hover:shadow-xl active:scale-95"
                >
                  Ver catalogo
                </button>
              </div>
              <span className="material-symbols-outlined pointer-events-none absolute -right-8 -bottom-8 text-[160px] opacity-10">
                add_circle
              </span>
            </div>
            <div className="flex flex-col justify-between rounded-xl bg-tertiary-fixed p-8 text-on-tertiary-fixed shadow-sm">
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
