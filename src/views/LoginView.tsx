interface LoginViewProps {
  onLogin: () => void;
}

export function LoginView({ onLogin }: LoginViewProps) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="w-full bg-[#f7f9fb] px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-2xl text-primary">
            account_balance
          </span>
          <span className="text-xl font-bold tracking-tight text-[#191c1e] font-headline">
            DoDate Reservaciones
          </span>
        </div>
      </header>
      <main className="flex flex-grow items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-xl bg-surface-container-lowest p-8 shadow-[0_32px_64px_-15px_rgba(25,28,30,0.06)] md:p-12">
            <div className="mb-10 text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-surface-container-low">
                <span className="material-symbols-outlined text-4xl text-primary">
                  architecture
                </span>
              </div>
              <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-on-surface font-headline">
                Iniciar sesion
              </h1>
              <p className="text-sm text-on-surface-variant">
                Accede a la app de reservas de espacios DoDate
              </p>
            </div>
            <form
              className="space-y-6"
              onSubmit={(event) => {
                event.preventDefault();
                onLogin();
              }}
            >
              <div className="space-y-2">
                <label className="ml-1 block text-xs font-semibold tracking-wider text-on-surface-variant uppercase">
                  Correo electronico
                </label>
                <input
                  type="email"
                  required
                  placeholder="usuario@institucion.edu"
                  className="ghost-border w-full rounded-lg border-none bg-surface-container-low px-4 py-3 text-on-surface outline-none transition-all focus:bg-surface-container-lowest focus:ring-0"
                />
              </div>
              <div className="space-y-2">
                <label className="ml-1 block text-xs font-semibold tracking-wider text-on-surface-variant uppercase">
                  Contrasena
                </label>
                <input
                  type="password"
                  required
                  placeholder="********"
                  className="ghost-border w-full rounded-lg border-none bg-surface-container-low px-4 py-3 text-on-surface outline-none transition-all focus:bg-surface-container-lowest focus:ring-0"
                />
              </div>
              <div className="flex items-center justify-end">
                <a
                  className="text-sm font-medium text-primary transition-all hover:underline underline-offset-4"
                  href="#"
                >
                  Recuperar contrasena
                </a>
              </div>
              <button
                type="submit"
                className="bg-primary-gradient w-full rounded-xl py-4 font-bold text-on-primary shadow-lg transition-all duration-200 hover:shadow-xl active:scale-95"
              >
                Entrar
              </button>
            </form>
            <div className="mt-10 border-t border-surface-container-high pt-8 text-center">
              <p className="text-xs leading-relaxed text-on-surface-variant">
                Este es un sistema de gestion institucional. El acceso no
                autorizado esta estrictamente prohibido y monitoreado.
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
          (c) 2024 DoDate Reservaciones. Gestion de espacios institucionales.
        </p>
      </footer>
    </div>
  );
}
