import { AppLogo } from '../components/branding/AppLogo';

interface LoginViewProps {
  onLogin: () => void;
}

export function LoginView({ onLogin }: LoginViewProps) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="w-full bg-[#f7f9fb] px-6 py-4">
        <div className="flex items-center gap-3">
          <AppLogo className="h-12 w-auto" />
          <span className="text-xl font-bold tracking-tight text-[#191c1e] font-headline">
            DoDate Reservaciones
          </span>
        </div>
      </header>
      <main className="flex flex-grow items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-xl bg-surface-container-lowest p-8 shadow-[0_32px_64px_-15px_rgba(25,28,30,0.06)] md:p-12">
            <div className="mb-10 text-center">
              <div className="mb-6 inline-flex items-center justify-center">
                <AppLogo className="h-24 w-auto drop-shadow-[0_18px_28px_rgba(0,51,102,0.18)]" />
              </div>
              <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-on-surface font-headline">
                Iniciar sesion
              </h1>
              <p className="text-sm text-on-surface-variant">
                Accede a la app de reservas de espacios DoDate
              </p>
            </div>
            <div className="space-y-6">
              <p className="text-center text-sm leading-relaxed text-on-surface-variant">
                Ingresa con tu correo, solo funcionan los correos personales.
              </p>
              <button
                type="button"
                onClick={onLogin}
                className="flex w-full items-center justify-center gap-4 rounded-md border border-[#8a8886] bg-white px-6 py-3.5 font-semibold text-[#5e5e5e] shadow-[0_8px_24px_-18px_rgba(0,0,0,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#f7f7f7] hover:shadow-[0_14px_32px_-20px_rgba(0,0,0,0.55)] active:translate-y-0"
              >
                <span
                  aria-hidden="true"
                  className="grid h-5 w-5 grid-cols-2 grid-rows-2 gap-[2px]"
                >
                  <span className="rounded-[1px] bg-[#f25022]" />
                  <span className="rounded-[1px] bg-[#7fba00]" />
                  <span className="rounded-[1px] bg-[#00a4ef]" />
                  <span className="rounded-[1px] bg-[#ffb900]" />
                </span>
                <span className="text-base tracking-[0.01em] font-body">
                  Inice con Microsoft
                </span>
              </button>
            </div>
            <div className="mt-10 border-t border-surface-container-high pt-8 text-center">
              <p className="text-xs leading-relaxed text-on-surface-variant">
                Este es un sistema de gestion para la reservacion de espacios.
              </p>
            </div>
          </div>
        </div>
      </main>
      <footer className="mt-auto flex w-full flex-col items-center gap-4 bg-[#f7f9fb] py-8">
        <div className="flex gap-6">
          <a
            className="text-xs text-[#43474f] opacity-80 transition-opacity hover:text-[#001e40] hover:opacity-100 font-body"
            href="#"
          >
            Privacidad
          </a>
          <a
            className="text-xs text-[#43474f] opacity-80 transition-opacity hover:text-[#001e40] hover:opacity-100 font-body"
            href="#"
          >
            Terminos
          </a>
          <a
            className="text-xs text-[#43474f] opacity-80 transition-opacity hover:text-[#001e40] hover:opacity-100 font-body"
            href="#"
          >
            Seguridad
          </a>
        </div>
        <p className="text-xs text-[#43474f] opacity-80 font-body">
          (c) 2026 DoDate Reservaciones. Gestion de espacios institucionales.
        </p>
      </footer>
    </div>
  );
}
