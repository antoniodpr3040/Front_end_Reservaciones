import { Footer } from '../components/layout/Footer';

interface FailureViewProps {
  onBackToSpaces: () => void;
  onTryAgain: () => void;
}

export function FailureView({
  onBackToSpaces,
  onTryAgain,
}: FailureViewProps) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between bg-slate-50/80 px-8 shadow-sm backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span className="bg-gradient-to-br from-[#001e40] to-[#003366] bg-clip-text text-xl font-bold tracking-tight text-transparent font-headline">
            DoDate Reservaciones
          </span>
        </div>
        <button
          type="button"
          className="rounded-lg p-2 text-slate-500 transition-all hover:bg-slate-100 active:scale-95"
        >
          <span className="material-symbols-outlined">help</span>
        </button>
      </header>
      <main className="flex flex-grow items-center justify-center px-6 pt-24 pb-12">
        <div className="w-full max-w-2xl">
          <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-8 shadow-[0_32px_64px_-12px_rgba(25,28,31,0.06)] md:p-12">
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-error-container/20 blur-3xl"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-error-container">
                <span
                  className="material-symbols-outlined text-4xl text-on-error-container"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  error
                </span>
              </div>
              <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-on-surface font-headline md:text-4xl">
                No se pudo procesar la reserva
              </h1>
              <p className="mb-8 max-w-md text-lg leading-relaxed text-on-surface-variant font-body">
                El espacio fue reservado durante tu sesion. Otra persona
                completo la solicitud unos segundos antes.
              </p>
              <div className="mb-10 flex w-full flex-col gap-6 rounded-xl bg-surface-container-low p-6 text-left md:flex-row">
                <div className="flex-1">
                  <span className="mb-2 block text-xs font-bold tracking-wider text-on-surface-variant uppercase font-label">
                    Espacio solicitado
                  </span>
                  <p className="font-bold text-primary font-headline">
                    Auditorium Magna - Wing B
                  </p>
                </div>
                <div className="flex-1 pl-0 md:border-l md:border-outline-variant/30 md:pl-6">
                  <span className="mb-2 block text-xs font-bold tracking-wider text-on-surface-variant uppercase font-label">
                    Codigo de error
                  </span>
                  <p className="font-mono text-sm text-on-surface-variant">
                    AA-RSV-409-CONFLICT
                  </p>
                </div>
              </div>
              <div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={onTryAgain}
                  className="w-full rounded-xl bg-primary-gradient px-10 py-4 font-bold text-on-primary shadow-lg shadow-primary/10 transition-all active:scale-95 sm:w-auto"
                >
                  Intentar de nuevo
                </button>
                <button
                  type="button"
                  onClick={onBackToSpaces}
                  className="w-full rounded-xl bg-surface-container-high px-10 py-4 font-semibold text-on-primary-fixed-variant transition-colors hover:bg-surface-dim active:scale-95 sm:w-auto"
                >
                  Volver a espacios
                </button>
              </div>
              <div className="mt-12 w-full border-t border-outline-variant/20 pt-8">
                <p className="text-sm text-on-surface-variant">
                  Ayuda inmediata:
                  <a
                    className="ml-1 font-semibold text-primary underline decoration-primary-fixed underline-offset-4"
                    href="#"
                  >
                    Contactar soporte
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-center gap-4 rounded-xl border border-white/40 bg-surface-container-low/50 p-6 backdrop-blur-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-fixed">
                <span className="material-symbols-outlined text-primary">
                  search
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-on-surface font-headline">
                  Explorar espacios similares
                </h4>
                <p className="text-xs text-on-surface-variant">
                  Encuentra salas disponibles cerca
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-xl border border-white/40 bg-surface-container-low/50 p-6 backdrop-blur-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-container">
                <span className="material-symbols-outlined text-on-secondary-container">
                  calendar_month
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-on-surface font-headline">
                  Revisar disponibilidad
                </h4>
                <p className="text-xs text-on-surface-variant">
                  Consulta el calendario completo
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
