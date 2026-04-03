import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';

function DetailCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
      <div className="mb-4 inline-flex rounded-xl bg-surface-container-high p-3 text-primary">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <p className="text-xs font-bold tracking-[0.16em] text-on-surface-variant uppercase">
        {label}
      </p>
      <p className="mt-2 break-words text-lg font-semibold text-on-surface [overflow-wrap:anywhere]">
        {value}
      </p>
    </div>
  );
}

export function ProfileView() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoutError, setLogoutError] = useState('');

  const initials = user?.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase())
    .join('');

  const handleLogout = async () => {
    setIsSubmitting(true);
    setLogoutError('');

    try {
      await logout();
      navigate('/login', { replace: true });
    } catch {
      setLogoutError(
        'No se pudo cerrar la sesion. Verifica la ruta de logout del backend.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Header
        activeTab="profile"
        onBackToSpaces={() => navigate('/dashboard')}
        onNavigateToReservations={() => navigate('/reservations')}
      />
      <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col px-4 pt-20 pb-14 sm:px-6 md:px-8 md:pt-24 md:pb-16">
        <section className="relative overflow-hidden rounded-[2rem] bg-primary px-5 py-8 text-white shadow-[0_32px_64px_-24px_rgba(0,30,64,0.35)] sm:px-8 md:px-12 md:py-10">
          <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-12 left-20 h-36 w-36 rounded-full bg-primary-fixed-dim/20 blur-3xl" />
          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-6">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[1.5rem] border border-white/20 bg-white/10 text-2xl font-bold sm:h-24 sm:w-24 sm:rounded-[1.75rem] sm:text-3xl">
                {user?.avatarUrl ? (
                  <img
                    alt="Avatar del usuario"
                    src={user.avatarUrl}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{initials || 'US'}</span>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold tracking-[0.16em] text-white/70 uppercase">
                  Perfil institucional
                </p>
                <h1 className="mt-2 text-3xl font-extrabold tracking-tight font-headline sm:text-4xl md:text-5xl">
                  {user?.name ?? 'Usuario institucional'}
                </h1>
                <p className="mt-3 break-words text-sm text-white/80 sm:text-base [overflow-wrap:anywhere]">
                  {user?.email ?? 'Correo no disponible'}
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur-sm">
                <p className="text-xs font-bold tracking-[0.16em] text-white/60 uppercase">
                  Estado
                </p>
                <p className="mt-2 text-lg font-semibold">Sesion activa</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur-sm">
                <p className="text-xs font-bold tracking-[0.16em] text-white/60 uppercase">
                  Metodo
                </p>
                <p className="mt-2 text-lg font-semibold">Microsoft 365</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
          <DetailCard
            icon="badge"
            label="Identificador"
            value={user?.id ?? 'No disponible'}
          />
          <DetailCard
            icon="work"
            label="Rol"
            value={user?.role ?? 'Sin rol registrado'}
          />
          <DetailCard
            icon="apartment"
            label="Area"
            value={user?.department ?? 'Sin area registrada'}
          />
          <DetailCard
            icon="domain"
            label="Organizacion"
            value={user?.organization ?? 'KEY Institute'}
          />
        </section>

        <section className="mt-8 grid grid-cols-1 gap-6 lg:mt-10 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="rounded-[2rem] bg-surface-container-low p-5 shadow-sm sm:p-6 md:p-8">
            <div className="mb-6 flex items-start gap-3 md:mb-8 md:items-center">
              <div className="rounded-xl bg-primary-container p-3 text-primary">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-primary font-headline">
                  Informacion de la cuenta
                </h2>
                <p className="text-sm text-on-surface-variant">
                  Resumen de los datos devueltos por tu backend para la sesion
                  activa.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
              <div className="min-w-0 rounded-2xl border border-surface-container-high bg-white px-5 py-4">
                <p className="text-xs font-bold tracking-[0.16em] text-on-surface-variant uppercase">
                  Nombre completo
                </p>
                <p className="mt-2 break-words text-lg font-semibold text-on-surface [overflow-wrap:anywhere]">
                  {user?.name ?? 'No disponible'}
                </p>
              </div>
              <div className="min-w-0 rounded-2xl border border-surface-container-high bg-white px-5 py-4">
                <p className="text-xs font-bold tracking-[0.16em] text-on-surface-variant uppercase">
                  Correo
                </p>
                <p className="mt-2 break-words text-lg font-semibold text-on-surface [overflow-wrap:anywhere]">
                  {user?.email ?? 'No disponible'}
                </p>
              </div>
              <div className="min-w-0 rounded-2xl border border-surface-container-high bg-white px-5 py-4">
                <p className="text-xs font-bold tracking-[0.16em] text-on-surface-variant uppercase">
                  Cargo
                </p>
                <p className="mt-2 break-words text-lg font-semibold text-on-surface [overflow-wrap:anywhere]">
                  {user?.role ?? 'No disponible'}
                </p>
              </div>
              <div className="min-w-0 rounded-2xl border border-surface-container-high bg-white px-5 py-4">
                <p className="text-xs font-bold tracking-[0.16em] text-on-surface-variant uppercase">
                  Unidad
                </p>
                <p className="mt-2 break-words text-lg font-semibold text-on-surface [overflow-wrap:anywhere]">
                  {user?.department ?? user?.organization ?? 'No disponible'}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-surface-container-lowest p-5 shadow-[0_24px_48px_-24px_rgba(25,28,30,0.2)] sm:p-6 md:p-8">
            <div className="mb-6 flex items-start gap-3 md:mb-8 md:items-center">
              <div className="rounded-xl bg-error-container p-3 text-on-error-container">
                <span className="material-symbols-outlined">logout</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-primary font-headline">
                  Cerrar sesion
                </h2>
                <p className="text-sm text-on-surface-variant">
                  Finaliza tu acceso en este dispositivo y vuelve a la pantalla
                  de login.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-surface-container-low px-5 py-4 text-sm leading-relaxed text-on-surface-variant">
              Tu cookie de autenticacion es administrada por el backend. El
              boton de abajo llama a la ruta de logout para invalidar la sesion.
            </div>

            {logoutError ? (
              <div className="mt-5 rounded-2xl bg-error-container px-5 py-4 text-sm text-on-error-container">
                {logoutError}
              </div>
            ) : null}

            <div className="mt-8 flex flex-col gap-4">
              <button
                type="button"
                onClick={handleLogout}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-3 rounded-2xl bg-[#ab1f2d] px-6 py-4 text-base font-bold text-white shadow-[0_20px_40px_-24px_rgba(171,31,45,0.8)] transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span className="material-symbols-outlined">logout</span>
                {isSubmitting ? 'Cerrando sesion...' : 'Cerrar sesion'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="rounded-2xl bg-surface-container-high px-6 py-4 text-base font-bold text-on-primary-fixed-variant transition-colors hover:bg-surface-container"
              >
                Volver al panel
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
