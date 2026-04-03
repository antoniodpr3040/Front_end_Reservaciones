import type { ActiveTab } from '../../types/navigation';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const { user } = useAuth();

  const initials = user?.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase())
    .join('');

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
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className={`ml-2 flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border transition-all active:scale-95 ${
              activeTab === 'profile'
                ? 'border-primary shadow-[0_0_0_4px_rgba(0,30,64,0.08)]'
                : 'border-slate-200 hover:border-slate-300'
            }`}
            aria-label="Abrir perfil del usuario"
            title="Perfil"
          >
            {user?.avatarUrl ? (
              <img
                alt="Avatar del usuario"
                src={user.avatarUrl}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="bg-primary-gradient flex h-full w-full items-center justify-center text-[11px] font-bold text-white">
                {initials || 'US'}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
