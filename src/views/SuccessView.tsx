import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';

interface SuccessViewProps {
  onBackToReservations: () => void;
  onNewBooking: () => void;
}

export function SuccessView({
  onBackToReservations,
  onNewBooking,
}: SuccessViewProps) {
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
            Tu espacio academico fue asegurado con exito. Enviamos los detalles
            a tu correo institucional.
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
                    Auditorio Central "Hamilton"
                  </p>
                  <p className="text-sm text-on-surface-variant">
                    Edificio de Ciencias, nivel 3
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
                      24 de octubre de 2026
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
                      14:00 - 16:30
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl bg-surface-container-low p-8 text-center">
            <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
              <img
                alt="Codigo QR de la reserva"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqBW1rHjwKcWdP_4PN4dk4rgoJhQ1C7v_lH8tcIaW-sxd1BWR68LWyMF-3CfE09TxJqLICZ9JQJABMdhofGywar1JWXAYXwveSYAlD34GMAebctM73tefTnY0PJ5ZRkWvHyPn6Rj2J-Fkp2tOR-Kws_Ocwj6kodxxRtZ-ojTBNJpelLeIQzFhuawE9SLQ_4g1ThsdCHwZNJqoZYihAuoB1c19a0rYlIuWFkSstH-AMMVG_7V-kSDqMKprT2jdOBw8o8ExpNS27J3Fh"
              />
            </div>
            <p className="mb-1 text-xs font-bold tracking-tighter text-on-surface-variant uppercase">
              ID de reserva
            </p>
            <p className="font-mono text-lg font-bold text-primary">
              #AA-459-882
            </p>
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
            <button
              type="button"
              className="flex items-center gap-2 text-sm font-bold hover:underline underline-offset-4 decoration-primary-fixed-dim"
            >
              <span className="material-symbols-outlined text-sm">
                file_download
              </span>
              Descargar comprobante PDF
            </button>
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
