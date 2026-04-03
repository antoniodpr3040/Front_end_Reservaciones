import { AnimatePresence, motion } from 'motion/react';
import { startTransition, useState } from 'react';
import type { Screen } from './types/navigation';
import { DashboardView } from './views/DashboardView';
import { FailureView } from './views/FailureView';
import { LoginView } from './views/LoginView';
import { ReservationsView } from './views/ReservationsView';
import { SuccessView } from './views/SuccessView';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');

  const navigateTo = (screen: Screen) => {
    startTransition(() => {
      setCurrentScreen(screen);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex min-h-screen flex-col"
        >
          {currentScreen === 'login' && (
            <LoginView onLogin={() => {window.location.href = "http://localhost:8000/login/microsoft"}} />
          )}
          {currentScreen === 'dashboard' && (
            <DashboardView
              onNavigateToReservations={() => navigateTo('reservations')}
              onConfirmBooking={(success) =>
                navigateTo(success ? 'success' : 'failure')
              }
            />
          )}
          {currentScreen === 'success' && (
            <SuccessView
              onBackToReservations={() => navigateTo('reservations')}
              onNewBooking={() => navigateTo('dashboard')}
            />
          )}
          {currentScreen === 'failure' && (
            <FailureView
              onTryAgain={() => navigateTo('dashboard')}
              onBackToSpaces={() => navigateTo('dashboard')}
            />
          )}
          {currentScreen === 'reservations' && (
            <ReservationsView
              onBackToSpaces={() => navigateTo('dashboard')}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
