import { AnimatePresence, motion } from 'motion/react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AuthLoadingScreen, ProtectedRoute } from './auth/ProtectedRoute';
import { useAuth } from './auth/AuthContext';
import { DashboardView } from './views/DashboardView';
import { FailureView } from './views/FailureView';
import { LoginView } from './views/LoginView';
import { ReservationsView } from './views/ReservationsView';
import { SuccessView } from './views/SuccessView';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  const navigateTo = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex min-h-screen flex-col"
        >
          <Routes location={location}>
            <Route
              path="/"
              element={
                isLoading ? (
                  <AuthLoadingScreen />
                ) : (
                  <Navigate
                    to={isAuthenticated ? '/dashboard' : '/login'}
                    replace
                  />
                )
              }
            />
            <Route
              path="/login"
              element={
                isLoading ? (
                  <AuthLoadingScreen />
                ) : isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <LoginView
                    onLogin={() => {
                      window.location.href =
                        'http://localhost:8000/login/microsoft';
                    }}
                  />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardView
                    onNavigateToReservations={() => navigateTo('/reservations')}
                    onConfirmBooking={(success) =>
                      navigateTo(success ? '/success' : '/failure')
                    }
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/success"
              element={
                <ProtectedRoute>
                  <SuccessView
                    onBackToReservations={() => navigateTo('/reservations')}
                    onNewBooking={() => navigateTo('/dashboard')}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/failure"
              element={
                <ProtectedRoute>
                  <FailureView
                    onTryAgain={() => navigateTo('/dashboard')}
                    onBackToSpaces={() => navigateTo('/dashboard')}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reservations"
              element={
                <ProtectedRoute>
                  <ReservationsView
                    onBackToSpaces={() => navigateTo('/dashboard')}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="*"
              element={
                isLoading ? (
                  <AuthLoadingScreen />
                ) : (
                  <Navigate
                    to={isAuthenticated ? '/dashboard' : '/login'}
                    replace
                  />
                )
              }
            />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
