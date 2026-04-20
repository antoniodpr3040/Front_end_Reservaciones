import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { listReservations, type ReservationRecordResponse } from '../api/reservations';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';
import { dashboardSpaces } from '../data/mockData';
import type { ReservationConfirmation } from '../types/reservations';

interface SuccessViewProps {
  onBackToReservations: () => void;
  onNewBooking: () => void;
}

interface SuccessLocationState {
  reservationConfirmation?: ReservationConfirmation;
}

const DATE_LABEL = new Intl.DateTimeFormat('es-SV', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const TIME_LABEL = new Intl.DateTimeFormat('es-SV', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

function formatReservationTime(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  return `${TIME_LABEL.format(startDate)} - ${TIME_LABEL.format(endDate)}`;
}

function findSpaceDetails(spaceName: string) {
  return dashboardSpaces.find((space) => space.title === spaceName)?.description;
}

function toReservationConfirmation(
  reservation: ReservationRecordResponse,
): ReservationConfirmation {
  const spaceName = reservation.location?.trim() || reservation.title;

  return {
    end: reservation.end,
    reservationId: reservation.reservation_id,
    spaceDetails: findSpaceDetails(spaceName),
    spaceName,
    start: reservation.start,
    webLink: reservation.web_link ?? undefined,
  };
}

export function SuccessView({
  onBackToReservations,
  onNewBooking,
}: SuccessViewProps) {
  const location = useLocation();
  const locationState = location.state as SuccessLocationState | null;
  const [reservationConfirmation, setReservationConfirmation] =
    useState<ReservationConfirmation | null>(
      locationState?.reservationConfirmation ?? null,
    );
  const [isLoadingReservation, setIsLoadingReservation] = useState(
    !locationState?.reservationConfirmation,
  );

  useEffect(() => {
    if (locationState?.reservationConfirmation) {
      setReservationConfirmation(locationState.reservationConfirmation);
      setIsLoadingReservation(false);
      return;
    }

    const loadLatestReservation = async () => {
      setIsLoadingReservation(true);

      try {
        const reservations = await listReservations();
        setReservationConfirmation(
          reservations.length > 0 ? toReservationConfirmation(reservations[0]) : null,
        );
      } catch {
        setReservationConfirmation(null);
      } finally {
        setIsLoadingReservation(false);
      }
    };

    void loadLatestReservation();
  }, [locationState]);

  const reservationDate = reservationConfirmation
    ? DATE_LABEL.format(new Date(reservationConfirmation.start))
    : 'Fecha no disponible';
  const reservationTime = reservationConfirmation
    ? formatReservationTime(
        reservationConfirmation.start,
        reservationConfirmation.end,
      )
    : 'Horario no disponible';
  const reservationSpace = reservationConfirmation?.spaceName ?? 'Espacio no disponible';
  const reservationSpaceDetails =
    reservationConfirmation?.spaceDetails ?? 'El backend no devolvio un detalle adicional para este espacio.';
  const reservationId = reservationConfirmation?.reservationId ?? 'Sin ID disponible';

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Header
        activeTab="spaces"
        onBackToSpaces={onNewBooking}
        onNavigateToReservations={onBackToReservations}
      />
      <main className="flex min-h-screen flex-col items-center px-4 pt-32 pb-20">
        <div className="mb-12 text-center">
          <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
            <span
              className="material-symbols-outlined text-6xl text-green-600"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
          </div>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-on-surface font-headline md:text-5xl">
            Reserva confirmada
          </h1>
          <p className="mx-auto max-w-md text-lg text-on-surface-variant">
            {isLoadingReservation
              ? 'Estamos cargando el detalle real de tu reserva.'
              : 'Tu espacio academico fue asegurado con exito. Enviamos los detalles a tu correo institucional.'}
          </p>
        </div>
        <div className="mb-12 grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
          <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-8 shadow-sm md:col-span-2">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-bl-full bg-primary-fixed-dim/20"></div>
            <h2 className="mb-6 text-xs font-bold tracking-widest text-on-surface-variant uppercase">
              Detalles del espacio
            </h2>
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-surface-container-high p-3">
                  <span className="material-symbols-outlined text-primary">
                    domain
                  </span>
                </div>
                <div>
                  <p className="text-sm text-on-surface-variant">Ubicacion</p>
                  <p className="text-xl font-bold text-on-surface">
                    {reservationSpace}
                  </p>
                  <p className="text-sm text-on-surface-variant">
                    {reservationSpaceDetails}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-surface-container-high p-3">
                    <span className="material-symbols-outlined text-primary">
                      calendar_today
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-on-surface-variant">Fecha</p>
                    <p className="text-lg font-semibold text-on-surface">
                      {reservationDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-surface-container-high p-3">
                    <span className="material-symbols-outlined text-primary">
                      schedule
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-on-surface-variant">Horario</p>
                    <p className="text-lg font-semibold text-on-surface">
                      {reservationTime}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl bg-surface-container-low p-8 text-center">
            <div className="mb-4 flex h-44 w-full items-center justify-center rounded-xl bg-white p-4 shadow-sm">
              <span className="material-symbols-outlined text-7xl text-primary">
                event_available
              </span>
            </div>
            <p className="mb-1 text-xs font-bold tracking-tighter text-on-surface-variant uppercase">
              ID de reserva
            </p>
            <p className="font-mono text-lg font-bold text-primary">
              {reservationId}
            </p>
            {reservationConfirmation?.webLink ? (
              <a
                href={reservationConfirmation.webLink}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline underline-offset-4"
              >
                <span className="material-symbols-outlined text-sm">open_in_new</span>
                Ver evento en Outlook
              </a>
            ) : null}
          </div>
          <div className="flex flex-col items-center justify-between gap-6 rounded-xl bg-primary-container p-6 text-on-primary-container md:col-span-3 md:flex-row">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-primary-fixed-dim">
                info
              </span>
              <p className="text-sm font-medium">
                Presentate 5 minutos antes de tu horario con tu credencial
                fisica o digital.
              </p>
            </div>
            {reservationConfirmation?.webLink ? (
              <a
                href={reservationConfirmation.webLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm font-bold hover:underline underline-offset-4 decoration-primary-fixed-dim"
              >
                <span className="material-symbols-outlined text-sm">
                  calendar_month
                </span>
                Abrir comprobante en Outlook
              </a>
            ) : (
              <span className="text-sm font-bold text-primary-fixed-dim">
                El comprobante se refleja en tu historial de reservas.
              </span>
            )}
          </div>
        </div>
        <div className="flex w-full max-w-md flex-col gap-4 md:flex-row">
          <button
            type="button"
            onClick={onBackToReservations}
            className="bg-primary-gradient flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-4 font-bold text-on-primary shadow-lg transition-all hover:opacity-90"
          >
            <span className="material-symbols-outlined">event_available</span>
            Mis reservas
          </button>
          <button
            type="button"
            onClick={onNewBooking}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-surface-container-highest px-6 py-4 font-bold text-on-primary-fixed-variant transition-all hover:bg-surface-container-high"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Nueva reserva
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
