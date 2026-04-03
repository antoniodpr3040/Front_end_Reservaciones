export function Footer() {
  return (
    <footer className="mt-auto w-full bg-slate-100 py-8">
      <div className="mx-auto mb-6 h-px max-w-7xl bg-slate-200 px-4 sm:mb-8"></div>
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-center text-xs text-slate-500 font-body sm:px-6 md:flex-row md:px-8 md:text-left">
        <p>(c) 2024 DoDate Reservaciones. Uso institucional.</p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:justify-end">
          <a
            className="opacity-80 transition-colors hover:text-blue-900 hover:opacity-100"
            href="#"
          >
            Privacidad
          </a>
          <a
            className="opacity-80 transition-colors hover:text-blue-900 hover:opacity-100"
            href="#"
          >
            Terminos
          </a>
          <a
            className="opacity-80 transition-colors hover:text-blue-900 hover:opacity-100"
            href="#"
          >
            Mapa del campus
          </a>
          <a
            className="opacity-80 transition-colors hover:text-blue-900 hover:opacity-100"
            href="#"
          >
            Directorio
          </a>
        </div>
      </div>
    </footer>
  );
}
