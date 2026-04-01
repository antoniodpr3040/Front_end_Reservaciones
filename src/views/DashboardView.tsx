import { useState } from 'react';
import { HistoryRow } from '../components/dashboard/HistoryRow';
import { SpaceCard } from '../components/dashboard/SpaceCard';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';
import {
  calendarDays,
  dashboardSpaces,
  reservationHistory,
} from '../data/mockData';
import type { SpaceCardData } from '../types/reservations';

interface DashboardViewProps {
  onConfirmBooking: (success: boolean) => void;
  onNavigateToReservations: () => void;
}

export function DashboardView({
  onConfirmBooking,
  onNavigateToReservations,
}: DashboardViewProps) {
  const [selectedSpace, setSelectedSpace] = useState('');

  const handleReserve = (space: SpaceCardData) => {
    if (space.status === 'Ocupado') {
      onConfirmBooking(false);
      return;
    }

    setSelectedSpace(space.value);
    document
      .getElementById('booking-section')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        activeTab="spaces"
        onBackToSpaces={() => undefined}
        onNavigateToReservations={onNavigateToReservations}
      />
      <main className="mx-auto flex w-full max-w-[1440px] flex-grow flex-col space-y-16 px-6 pt-24 pb-12 md:px-12">
        <section className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-primary font-headline md:text-5xl">
            Gestion de espacios
          </h1>
          <p className="max-w-2xl text-lg text-on-surface-variant font-body">
            Reserva el espacio de trabajo que necesitas para tu jornada.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {dashboardSpaces.map((space) => (
            <SpaceCard
              key={space.value}
              title={space.title}
              description={space.description}
              capacity={space.capacity}
              status={space.status}
              icon={space.icon}
              onReserve={() => handleReserve(space)}
            />
          ))}
        </section>

        <section
          id="booking-section"
          className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2"
        >
          <div className="rounded-[2rem] bg-surface-container-low p-8 md:p-12">
            <h2 className="mb-8 text-3xl font-bold text-primary font-headline">
              Nueva reservacion
            </h2>
            <form
              className="space-y-6"
              onSubmit={(event) => {
                event.preventDefault();
                onConfirmBooking(true);
              }}
            >
              <div className="space-y-2">
                <label className="text-sm font-semibold tracking-wider text-on-surface-variant uppercase">
                  Nombre del usuario
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Dr. Alberto Casas"
                  className="w-full rounded-xl border-none bg-surface-container-lowest px-4 py-3 outline-none transition-all focus:ring-2 focus:ring-surface-tint/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold tracking-wider text-on-surface-variant uppercase">
                  Espacio academico
                </label>
                <select
                  required
                  value={selectedSpace}
                  onChange={(event) => setSelectedSpace(event.target.value)}
                  className="w-full rounded-xl border-none bg-surface-container-lowest px-4 py-3 outline-none focus:ring-2 focus:ring-surface-tint/20"
                >
                  <option value="">Seleccione un espacio...</option>
                  <option value="biblioteca">Biblioteca central</option>
                  <option value="laboratorio">Laboratorio de ciencias</option>
                  <option value="mentoria">Sala de mentoria A</option>
                </select>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold tracking-wider text-on-surface-variant uppercase">
                    Fecha
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full rounded-xl border-none bg-surface-container-lowest px-4 py-3 outline-none focus:ring-2 focus:ring-surface-tint/20"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 space-y-2">
                    <label className="text-sm font-semibold tracking-wider text-on-surface-variant uppercase">
                      Inicio
                    </label>
                    <input
                      type="time"
                      required
                      className="w-full rounded-xl border-none bg-surface-container-lowest px-4 py-3 outline-none focus:ring-2 focus:ring-surface-tint/20"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="text-sm font-semibold tracking-wider text-on-surface-variant uppercase">
                      Fin
                    </label>
                    <input
                      type="time"
                      required
                      className="w-full rounded-xl border-none bg-surface-container-lowest px-4 py-3 outline-none focus:ring-2 focus:ring-surface-tint/20"
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-primary-gradient py-4 text-lg font-bold text-white shadow-lg shadow-primary/20 transition-all hover:opacity-90 active:scale-95"
              >
                Confirmar reserva
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-primary font-headline">
              Calendario de ocupacion
            </h2>
            <div className="flex items-start gap-4 rounded-2xl bg-surface-container-high p-6 text-primary">
              <span className="material-symbols-outlined">info</span>
              <div>
                <p className="font-bold">Listo para reservar</p>
                <p className="text-sm opacity-90">
                  Completa el formulario para validar la disponibilidad en
                  tiempo real.
                </p>
              </div>
            </div>
            <div className="space-y-4 rounded-3xl border border-surface-container bg-white p-6 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    calendar_month
                  </span>
                  <h3 className="font-bold text-primary font-headline">
                    Mayo 2024
                  </h3>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    className="rounded-full p-1 text-outline transition-colors hover:bg-surface-container-high"
                  >
                    <span className="material-symbols-outlined">
                      chevron_left
                    </span>
                  </button>
                  <button
                    type="button"
                    className="rounded-full p-1 text-outline transition-colors hover:bg-surface-container-high"
                  >
                    <span className="material-symbols-outlined">
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>
              <div className="calendar-grid mb-2 text-center text-[10px] font-bold tracking-widest text-outline-variant uppercase">
                <div>Dom</div>
                <div>Lun</div>
                <div>Mar</div>
                <div>Mie</div>
                <div>Jue</div>
                <div>Vie</div>
                <div>Sab</div>
              </div>
              <div className="calendar-grid gap-1">
                {calendarDays.map((day) => {
                  const isOccupied = day === 24 || day === 26;
                  const isPending = day === 25;

                  return (
                    <div
                      key={day}
                      className={`relative flex aspect-square items-center justify-center rounded-lg text-xs font-medium ${
                        isOccupied
                          ? 'bg-primary font-bold text-white'
                          : isPending
                            ? 'bg-secondary-container text-on-secondary-container'
                            : 'cursor-pointer text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      {day}
                      {(isOccupied || isPending) && (
                        <span
                          className={`absolute bottom-1 h-1 w-1 rounded-full ${
                            isPending ? 'bg-on-secondary-container' : 'bg-white'
                          }`}
                        ></span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-4 border-t border-surface-container pt-4 text-[11px] font-semibold tracking-wider text-outline uppercase">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded bg-surface-container"></span>
                  <span>Disponible</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded bg-primary"></span>
                  <span>Ocupado</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded bg-secondary-container"></span>
                  <span>En proceso</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="history-section" className="space-y-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <h2 className="text-3xl font-bold text-primary font-headline">
              Historial de reservas
            </h2>
            <div className="flex items-center gap-2 rounded-full bg-surface-container-low px-4 py-2 text-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-base">history</span>
              <span>Actualizado hace 2 minutos</span>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl bg-surface-container-low">
            <table className="w-full border-collapse text-left">
              <thead className="bg-surface-container-high">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold tracking-widest text-on-surface-variant uppercase">
                    Usuario
                  </th>
                  <th className="px-6 py-4 text-xs font-bold tracking-widest text-on-surface-variant uppercase">
                    Espacio
                  </th>
                  <th className="px-6 py-4 text-xs font-bold tracking-widest text-on-surface-variant uppercase">
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-xs font-bold tracking-widest text-on-surface-variant uppercase">
                    Horario
                  </th>
                  <th className="px-6 py-4 text-xs font-bold tracking-widest text-on-surface-variant uppercase">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {reservationHistory.map((entry) => (
                  <HistoryRow
                    key={`${entry.user}-${entry.date}-${entry.time}`}
                    user={entry.user}
                    space={entry.space}
                    date={entry.date}
                    time={entry.time}
                    status={entry.status}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
