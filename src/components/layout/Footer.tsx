export function Footer() {
  return (
    <footer className="mt-auto w-full bg-slate-100 py-8">
      <div className="mx-auto mb-8 h-px max-w-7xl bg-slate-200"></div>
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-8 text-xs text-slate-500 font-body md:flex-row">
        <p>(c) 2024 DoDate Reservaciones. Uso institucional.</p>
        <div className="flex gap-6">
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
