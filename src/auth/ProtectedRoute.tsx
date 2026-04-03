import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function AuthLoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-6">
      <div className="rounded-2xl bg-surface-container-lowest px-8 py-6 text-center shadow-sm">
        <p className="text-sm font-semibold tracking-[0.08em] text-on-surface-variant uppercase">
          Validando sesion
        </p>
        <p className="mt-2 text-base text-on-surface">
          Espera un momento mientras confirmamos tu acceso.
        </p>
      </div>
    </div>
  );
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
