import type { ActiveTab } from '../../types/navigation';

interface HeaderProps {
  activeTab?: ActiveTab;
  onBackToSpaces?: () => void;
  onNavigateToReservations?: () => void;
}

export function Header({
  activeTab,
  onBackToSpaces,
  onNavigateToReservations,
}: HeaderProps) {
  return (
    <header className="fixed top-0 z-50 h-16 w-full bg-white/80 shadow-sm backdrop-blur-xl">
      <div className="flex h-full max-w-full items-center justify-between px-8">
        <div className="flex items-center gap-8">
          <span
            className="cursor-pointer bg-gradient-to-br from-[#001e40] to-[#003366] bg-clip-text text-xl font-bold tracking-tight text-transparent font-headline"
            onClick={onBackToSpaces}
          >
            DoDate Reservaciones
          </span>
          <nav className="hidden items-center gap-6 text-sm font-semibold tracking-tight font-headline md:flex">
            <button
              type="button"
              onClick={onBackToSpaces}
              className={
                activeTab === 'spaces'
                  ? 'border-b-2 border-blue-900 pb-1 font-bold text-blue-900'
                  : 'text-slate-500 transition-colors hover:text-blue-900'
              }
            >
              Espacios
            </button>
            <button
              type="button"
              onClick={onNavigateToReservations}
              className={
                activeTab === 'reservations'
                  ? 'border-b-2 border-blue-900 pb-1 font-bold text-blue-900'
                  : 'text-slate-500 transition-colors hover:text-blue-900'
              }
            >
              Mis reservas
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <span className="material-symbols-outlined absolute top-1/2 left-3 -translate-y-1/2 text-slate-400">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar espacios..."
              className="w-64 rounded-lg border-none bg-slate-100 py-1.5 pr-4 pl-10 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-slate-500 duration-200 hover:bg-slate-100 active:scale-95"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button
            type="button"
            className="rounded-lg p-2 text-slate-500 duration-200 hover:bg-slate-100 active:scale-95"
          >
            <span className="material-symbols-outlined">help</span>
          </button>
          <div className="ml-2 h-8 w-8 overflow-hidden rounded-full border border-slate-200">
            <img
              alt="Avatar del usuario"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuVyeAPqNQDLEeAgFfRE6rEior0b2sfv-DFqAPCn1qNmChr35d_x76mUwQ5RByOskpfp5xD9hB9zUr8h_5AmR1fy2b3QY_nvgCehgQwnfJ5th6T4HFIqYOngogmTPwXT1ueeqnr2X0FmmLeY3_rZyxSazwh-_8p3XGro7BvVPxRa0Dg3XG8QD6CATOa55l-mo8uL2XObeRdmuO1xRsMZ08hxYr_Nft6ttqln3Sgja0Nq8bW6tpL8xedisMXPHt77B2qkbc-PcdH7aE"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
