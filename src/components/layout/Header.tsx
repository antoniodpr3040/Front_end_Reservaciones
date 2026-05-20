import { useEffect, useState } from 'react';
import type { ActiveTab } from '../../types/navigation';
import { useAuth } from '../../auth/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppLogo } from '../branding/AppLogo';

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
  const location = useLocation();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const initials = user?.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase())
    .join('');

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navigationItems = [
    {
      label: 'Espacios',
      onClick: onBackToSpaces,
      isActive: activeTab === 'spaces',
    },
    {
      label: 'Mis reservas',
      onClick: onNavigateToReservations,
      isActive: activeTab === 'reservations',
    },
  ].filter((item) => Boolean(item.onClick));

  return (
    <header className="fixed top-0 z-50 w-full bg-white/85 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 w-full max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3 sm:gap-8">
          <button
            type="button"
            onClick={onBackToSpaces}
            className="flex min-w-0 items-center gap-3 text-left"
          >
            <AppLogo className="h-11 w-auto shrink-0" />
            <span className="block truncate bg-gradient-to-br from-[#001e40] to-[#003366] bg-clip-text text-base font-bold tracking-tight text-transparent font-headline sm:text-xl">
              DoDate Reservaciones
            </span>
          </button>
          <nav className="hidden items-center gap-6 text-sm font-semibold tracking-tight font-headline md:flex">
            {navigationItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.onClick}
                className={
                  item.isActive
                    ? 'border-b-2 border-blue-900 pb-1 font-bold text-blue-900'
                    : 'text-slate-500 transition-colors hover:text-blue-900'
                }
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className={`flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border transition-all active:scale-95 sm:h-10 sm:w-10 ${
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
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((currentValue) => !currentValue)}
            className="inline-flex rounded-lg p-2 text-slate-500 transition-all hover:bg-slate-100 active:scale-95 md:hidden"
            aria-expanded={isMobileMenuOpen}
            aria-label="Abrir menu de navegacion"
          >
            <span className="material-symbols-outlined">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {isMobileMenuOpen ? (
        <div className="border-t border-slate-200/80 bg-white px-4 py-4 shadow-sm md:hidden">
          <div className="space-y-3">
            {navigationItems.length > 0 ? (
              <nav className="grid gap-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={item.onClick}
                    className={`rounded-2xl px-4 py-3 text-left text-sm font-semibold transition-colors ${
                      item.isActive
                        ? 'bg-primary text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            ) : null}

            <div className="relative">
              <span className="material-symbols-outlined absolute top-1/2 left-3 -translate-y-1/2 text-slate-400">
                search
              </span>
              <input
                type="text"
                placeholder="Buscar espacios..."
                className="w-full rounded-2xl border-none bg-slate-100 py-3 pr-4 pl-10 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700"
              >
                <span className="material-symbols-outlined text-base">
                  notifications
                </span>
                Notificaciones
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700"
              >
                <span className="material-symbols-outlined text-base">help</span>
                Ayuda
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
