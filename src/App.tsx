/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

type Screen = 'login' | 'dashboard' | 'success' | 'failure' | 'reservations';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatePresence mode="wait">
        {currentScreen === 'login' && (
          <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-grow flex flex-col">
            <LoginView onLogin={() => navigateTo('dashboard')} />
          </motion.div>
        )}
        {currentScreen === 'dashboard' && (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-grow flex flex-col">
            <DashboardView 
              onNavigateToReservations={() => navigateTo('reservations')}
              onConfirmBooking={(success) => navigateTo(success ? 'success' : 'failure')}
            />
          </motion.div>
        )}
        {currentScreen === 'success' && (
          <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-grow flex flex-col">
            <SuccessView 
              onBackToReservations={() => navigateTo('reservations')}
              onNewBooking={() => navigateTo('dashboard')}
            />
          </motion.div>
        )}
        {currentScreen === 'failure' && (
          <motion.div key="failure" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-grow flex flex-col">
            <FailureView 
              onTryAgain={() => navigateTo('dashboard')}
              onBackToSpaces={() => navigateTo('dashboard')}
            />
          </motion.div>
        )}
        {currentScreen === 'reservations' && (
          <motion.div key="reservations" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-grow flex flex-col">
            <ReservationsView 
              onBackToSpaces={() => navigateTo('dashboard')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Header({ onNavigateToReservations, onBackToSpaces, activeTab }: { onNavigateToReservations?: () => void, onBackToSpaces?: () => void, activeTab?: 'spaces' | 'reservations' }) {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm h-16">
      <div className="flex justify-between items-center px-8 h-full max-w-full">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold bg-gradient-to-br from-[#001e40] to-[#003366] bg-clip-text text-transparent font-headline tracking-tight cursor-pointer" onClick={onBackToSpaces}>
            DoDate Reservaciones
          </span>
          <nav className="hidden md:flex items-center gap-6 font-headline tracking-tight text-sm font-semibold">
            <button 
              onClick={onBackToSpaces} 
              className={`${activeTab === 'spaces' ? 'text-blue-900 font-bold border-b-2 border-blue-900 pb-1' : 'text-slate-500 hover:text-blue-900 transition-colors'}`}
            >
              Espacios
            </button>
            <button 
              onClick={onNavigateToReservations} 
              className={`${activeTab === 'reservations' ? 'text-blue-900 font-bold border-b-2 border-blue-900 pb-1' : 'text-slate-500 hover:text-blue-900 transition-colors'}`}
            >
              Mis Reservas
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input className="bg-slate-100 border-none rounded-lg pl-10 pr-4 py-1.5 text-sm w-64 focus:ring-2 focus:ring-primary/20 transition-all outline-none" placeholder="Search spaces..." type="text" />
          </div>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg active:scale-95 duration-200">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg active:scale-95 duration-200">
            <span className="material-symbols-outlined">help</span>
          </button>
          <div className="h-8 w-8 rounded-full overflow-hidden border border-slate-200 ml-2">
            <img alt="User profile avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuVyeAPqNQDLEeAgFfRE6rEior0b2sfv-DFqAPCn1qNmChr35d_x76mUwQ5RByOskpfp5xD9hB9zUr8h_5AmR1fy2b3QY_nvgCehgQwnfJ5th6T4HFIqYOngogmTPwXT1ueeqnr2X0FmmLeY3_rZyxSazwh-_8p3XGro7BvVPxRa0Dg3XG8QD6CATOa55l-mo8uL2XObeRdmuO1xRsMZ08hxYr_Nft6ttqln3Sgja0Nq8bW6tpL8xedisMXPHt77B2qkbc-PcdH7aE" />
          </div>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="w-full py-8 mt-auto bg-slate-100">
      <div className="bg-slate-200 h-[1px] mb-8 max-w-7xl mx-auto"></div>
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4 font-body text-xs text-slate-500">
        <p>© 2024 The DoDate Reservaciones. Institutional Property.</p>
        <div className="flex gap-6">
          <a className="hover:text-blue-900 transition-colors opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
          <a className="hover:text-blue-900 transition-colors opacity-80 hover:opacity-100" href="#">Terms of Service</a>
          <a className="hover:text-blue-900 transition-colors opacity-80 hover:opacity-100" href="#">Campus Map</a>
          <a className="hover:text-blue-900 transition-colors opacity-80 hover:opacity-100" href="#">Directory</a>
        </div>
      </div>
    </footer>
  );
}

function LoginView({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="bg-surface min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 w-full bg-[#f7f9fb]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">account_balance</span>
          <span className="font-headline font-bold tracking-tight text-xl text-[#191c1e]">DoDate Reservaciones</span>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-surface-container-lowest rounded-xl p-8 md:p-12 shadow-[0_32px_64px_-15px_rgba(25,28,30,0.06)] border-none">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-surface-container-low mb-6">
                <span className="material-symbols-outlined text-primary text-4xl">architecture</span>
              </div>
              <h1 className="font-headline text-2xl font-extrabold text-on-surface tracking-tight mb-2">Iniciar Sesión</h1>
              <p className="text-on-surface-variant text-sm">Accede a la app de reservas de espacios DoDate</p>
            </div>
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant ml-1">Correo Electrónico</label>
                <input className="w-full px-4 py-3 bg-surface-container-low border-none rounded-lg text-on-surface focus:ring-0 focus:bg-surface-container-lowest transition-all ghost-border outline-none" placeholder="usuario@institucion.edu" required type="email" />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant ml-1">Contraseña</label>
                <input className="w-full px-4 py-3 bg-surface-container-low border-none rounded-lg text-on-surface focus:ring-0 focus:bg-surface-container-lowest transition-all ghost-border outline-none" placeholder="••••••••" required type="password" />
              </div>
              <div className="flex items-center justify-end">
                <a className="text-sm font-medium text-primary hover:underline underline-offset-4 transition-all" href="#">¿Olvidaste tu contraseña?</a>
              </div>
              <button className="w-full py-4 bg-primary-gradient text-on-primary font-bold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 duration-200" type="submit">
                Entrar
              </button>
            </form>
            <div className="mt-10 pt-8 border-t border-surface-container-high text-center">
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Este es un sistema de gestión institucional. El acceso no autorizado está estrictamente prohibido y monitoreado.
              </p>
            </div>
          </div>
        </div>
      </main>
      <footer className="w-full py-8 flex flex-col items-center gap-4 mt-auto bg-[#f7f9fb]">
        <div className="flex gap-6">
          <a className="font-body text-xs text-[#43474f] hover:text-[#001e40] transition-opacity opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
          <a className="font-body text-xs text-[#43474f] hover:text-[#001e40] transition-opacity opacity-80 hover:opacity-100" href="#">Terms of Service</a>
          <a className="font-body text-xs text-[#43474f] hover:text-[#001e40] transition-opacity opacity-80 hover:opacity-100" href="#">Security Architecture</a>
        </div>
        <p className="font-body text-xs text-[#43474f] opacity-80">
          © 2024 DoDate Reservaciones. Institutional Space Management.
        </p>
      </footer>
    </div>
  );
}

function DashboardView({ onNavigateToReservations, onConfirmBooking }: { onNavigateToReservations: () => void, onConfirmBooking: (success: boolean) => void }) {
  const [selectedSpace, setSelectedSpace] = useState('');

  return (
    <div className="flex flex-col min-h-screen">
      <Header onNavigateToReservations={onNavigateToReservations} onBackToSpaces={() => {}} activeTab="spaces" />
      <main className="flex-grow pt-24 pb-12 px-6 md:px-12 max-w-[1440px] mx-auto w-full space-y-16">
        <section className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary font-headline">Gestión de Espacios</h1>
          <p className="text-on-surface-variant max-w-2xl text-lg font-body">Haga la reservacion para el espacio de trabajo que utilizara</p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <SpaceCard 
            title="Biblioteca" 
            desc="Zona de Silencio Absoluto" 
            cap={50} 
            status="Disponible" 
            icon="auto_stories" 
            onReserve={() => { setSelectedSpace('biblioteca'); document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' }); }}
          />
          <SpaceCard 
            title="Laboratorio" 
            desc="Investigación Avanzada" 
            cap={20} 
            status="Ocupado" 
            icon="biotech" 
            onReserve={() => onConfirmBooking(false)}
          />
          <SpaceCard 
            title="Sala de mentoría" 
            desc="Colaboración Dirigida" 
            cap={6} 
            status="Disponible" 
            icon="co_present" 
            onReserve={() => { setSelectedSpace('mentoria'); document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' }); }}
          />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start" id="booking-section">
          <div className="bg-surface-container-low p-8 md:p-12 rounded-[2rem]">
            <h2 className="text-3xl font-bold text-primary mb-8 font-headline">Nueva Reservación</h2>
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onConfirmBooking(true); }}>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Nombre del Usuario</label>
                <input className="w-full bg-surface-container-lowest border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-surface-tint focus:ring-opacity-20 transition-all outline-none" placeholder="Ej. Dr. Alberto Casas" type="text" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Espacio Académico</label>
                <select 
                  className="w-full bg-surface-container-lowest border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-surface-tint focus:ring-opacity-20 outline-none" 
                  value={selectedSpace}
                  onChange={(e) => setSelectedSpace(e.target.value)}
                  required
                >
                  <option value="">Seleccione un espacio...</option>
                  <option value="biblioteca">Biblioteca Central</option>
                  <option value="laboratorio">Laboratorio de Ciencias</option>
                  <option value="mentoria">Sala de Mentoría A</option>
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Fecha</label>
                  <input className="w-full bg-surface-container-lowest border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-surface-tint focus:ring-opacity-20 outline-none" type="date" required />
                </div>
                <div className="flex gap-2">
                  <div className="space-y-2 flex-1">
                    <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Inicio</label>
                    <input className="w-full bg-surface-container-lowest border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-surface-tint focus:ring-opacity-20 outline-none" type="time" required />
                  </div>
                  <div className="space-y-2 flex-1">
                    <label className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Fin</label>
                    <input className="w-full bg-surface-container-lowest border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-surface-tint focus:ring-opacity-20 outline-none" type="time" required />
                  </div>
                </div>
              </div>
              <button className="w-full bg-primary-gradient text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95" type="submit">Confirmar Reserva</button>
            </form>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-primary font-headline">Calendario de Ocupación</h2>
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-surface-container-high text-primary">
              <span className="material-symbols-outlined">info</span>
              <div>
                <p className="font-bold">Listo para reservar</p>
                <p className="text-sm opacity-90">Complete el formulario para verificar la disponibilidad en tiempo real.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-surface-container space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">calendar_month</span>
                  <h3 className="font-bold text-primary font-headline">Mayo 2024</h3>
                </div>
                <div className="flex gap-1">
                  <button className="p-1 hover:bg-surface-container-high rounded-full text-outline transition-colors"><span className="material-symbols-outlined">chevron_left</span></button>
                  <button className="p-1 hover:bg-surface-container-high rounded-full text-outline transition-colors"><span className="material-symbols-outlined">chevron_right</span></button>
                </div>
              </div>
              <div className="calendar-grid text-center text-[10px] font-bold text-outline-variant uppercase tracking-widest mb-2">
                <div>Dom</div><div>Lun</div><div>Mar</div><div>Mié</div><div>Jue</div><div>Vie</div><div>Sáb</div>
              </div>
              <div className="calendar-grid gap-1">
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                  <div key={day} className={`aspect-square flex items-center justify-center text-xs font-medium rounded-lg relative ${day === 24 || day === 26 ? 'bg-primary text-white font-bold' : day === 25 ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface hover:bg-surface-container cursor-pointer'}`}>
                    {day}
                    {(day === 24 || day === 25 || day === 26) && <span className={`absolute bottom-1 w-1 h-1 rounded-full ${day === 25 ? 'bg-on-secondary-container' : 'bg-white'}`}></span>}
                  </div>
                ))}
              </div>
              <div className="flex gap-4 pt-4 border-t border-surface-container text-[11px] font-semibold uppercase tracking-wider text-outline">
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-surface-container"></span><span>Disponible</span></div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-primary"></span><span>Ocupado</span></div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-secondary-container"></span><span>En Proceso</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8" id="history-section">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2 className="text-3xl font-bold text-primary font-headline">Historial de Reservas</h2>
            <div className="flex items-center gap-2 text-on-surface-variant text-sm bg-surface-container-low px-4 py-2 rounded-full">
              <span className="material-symbols-outlined text-base">history</span>
              <span>Actualizado hace 2 minutos</span>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl bg-surface-container-low">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-high">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Usuario</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Espacio</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Fecha</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Horario</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Estado</th>
                </tr>
              </thead>
              <tbody>
                <HistoryRow user="Ana Martínez" space="Biblioteca" date="24 May 2024" time="10:00 - 12:00" status="Completada" />
                <HistoryRow user="Carlos Ruiz" space="Laboratorio" date="25 May 2024" time="14:00 - 16:30" status="En Proceso" />
                <HistoryRow user="Lucía Gómez" space="Sala Mentoría" date="26 May 2024" time="09:00 - 10:00" status="Completada" />
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function SpaceCard({ title, desc, cap, status, icon, onReserve }: { title: string, desc: string, cap: number, status: string, icon: string, onReserve: () => void }) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm flex flex-col justify-between hover:translate-y-[-4px] transition-transform duration-300">
      <div className="space-y-4">
        <div className="w-12 h-12 bg-primary-fixed-dim/30 rounded-2xl flex items-center justify-center text-primary">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-on-surface font-headline">{title}</h3>
          <p className="text-sm text-on-surface-variant">{desc}</p>
        </div>
        <div className="flex items-center gap-4 py-2">
          <div className="flex items-center gap-1 text-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-base">group</span>
            <span>Cap. {cap}</span>
          </div>
          <span className={`px-3 py-1 text-xs font-bold rounded-full ${status === 'Disponible' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{status}</span>
        </div>
      </div>
      <button onClick={onReserve} className="mt-6 w-full py-3 rounded-xl bg-surface-container-high text-on-primary-fixed-variant font-bold hover:bg-secondary-container transition-colors">Reservar</button>
    </div>
  );
}

function HistoryRow({ user, space, date, time, status }: { user: string, space: string, date: string, time: string, status: string }) {
  return (
    <tr className="bg-surface-container-lowest border-b border-surface-container">
      <td className="px-6 py-4 text-sm font-medium">{user}</td>
      <td className="px-6 py-4 text-sm text-on-surface-variant">{space}</td>
      <td className="px-6 py-4 text-sm text-on-surface-variant">{date}</td>
      <td className="px-6 py-4 text-sm text-on-surface-variant">{time}</td>
      <td className="px-6 py-4">
        <span className={`px-3 py-1 text-xs font-bold rounded-full ${status === 'Completada' ? 'bg-green-100 text-green-800' : 'bg-secondary-container text-on-secondary-container'}`}>{status}</span>
      </td>
    </tr>
  );
}

function SuccessView({ onBackToReservations, onNewBooking }: { onBackToReservations: () => void, onNewBooking: () => void }) {
  return (
    <div className="bg-surface min-h-screen flex flex-col">
      <Header onNavigateToReservations={onBackToReservations} onBackToSpaces={onNewBooking} activeTab="spaces" />
      <main className="pt-32 pb-20 min-h-screen flex flex-col items-center px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6">
            <span className="material-symbols-outlined text-green-600 text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-4 font-headline">¡Reserva Confirmada!</h1>
          <p className="text-on-surface-variant text-lg max-w-md mx-auto">Tu espacio académico ha sido asegurado con éxito. Hemos enviado los detalles a tu correo institucional.</p>
        </div>
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="md:col-span-2 bg-surface-container-lowest p-8 rounded-xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-fixed-dim/20 rounded-bl-full -mr-8 -mt-8"></div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-6">Detalles del Espacio</h2>
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-surface-container-high rounded-xl">
                  <span className="material-symbols-outlined text-primary">domain</span>
                </div>
                <div>
                  <p className="text-sm text-on-surface-variant">Ubicación</p>
                  <p className="text-xl font-bold text-on-surface">Auditorio Central "Hamilton"</p>
                  <p className="text-sm text-on-surface-variant">Edificio de Ciencias, Nivel 3</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-surface-container-high rounded-xl">
                    <span className="material-symbols-outlined text-primary">calendar_today</span>
                  </div>
                  <div>
                    <p className="text-sm text-on-surface-variant">Fecha</p>
                    <p className="text-lg font-semibold text-on-surface">24 de Octubre, 2024</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-surface-container-high rounded-xl">
                    <span className="material-symbols-outlined text-primary">schedule</span>
                  </div>
                  <div>
                    <p className="text-sm text-on-surface-variant">Horario</p>
                    <p className="text-lg font-semibold text-on-surface">14:00 - 16:30</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-surface-container-low p-8 rounded-xl flex flex-col items-center justify-center text-center">
            <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
              <img alt="Reservation QR Code" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqBW1rHjwKcWdP_4PN4dk4rgoJhQ1C7v_lH8tcIaW-sxd1BWR68LWyMF-3CfE09TxJqLICZ9JQJABMdhofGywar1JWXAYXwveSYAlD34GMAebctM73tefTnY0PJ5ZRkWvHyPn6Rj2J-Fkp2tOR-Kws_Ocwj6kodxxRtZ-ojTBNJpelLeIQzFhuawE9SLQ_4g1ThsdCHwZNJqoZYihAuoB1c19a0rYlIuWFkSstH-AMMVG_7V-kSDqMKprT2jdOBw8o8ExpNS27J3Fh" />
            </div>
            <p className="text-xs text-on-surface-variant font-bold uppercase tracking-tighter mb-1">ID de Reserva</p>
            <p className="text-lg font-mono font-bold text-primary">#AA-459-882</p>
          </div>
          <div className="md:col-span-3 bg-primary-container text-on-primary-container p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-primary-fixed-dim">info</span>
              <p className="text-sm font-medium">Recuerda presentarte 5 minutos antes de tu hora reservada con tu credencial física o digital.</p>
            </div>
            <button className="text-sm font-bold flex items-center gap-2 hover:underline decoration-primary-fixed-dim underline-offset-4">
              <span className="material-symbols-outlined text-sm">file_download</span>
              Descargar Comprobante PDF
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full max-w-md">
          <button onClick={onBackToReservations} className="flex-1 py-4 px-6 rounded-xl bg-primary-gradient text-on-primary font-bold shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">event_available</span>
            Mis Reservas
          </button>
          <button onClick={onNewBooking} className="flex-1 py-4 px-6 rounded-xl bg-surface-container-highest text-on-primary-fixed-variant font-bold hover:bg-surface-container-high transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">add_circle</span>
            Nueva Reserva
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function FailureView({ onTryAgain, onBackToSpaces }: { onTryAgain: () => void, onBackToSpaces: () => void }) {
  return (
    <div className="bg-surface min-h-screen flex flex-col">
      <header className="fixed top-0 w-full z-50 bg-slate-50/80 backdrop-blur-xl shadow-sm h-16 flex justify-between items-center px-8 max-w-full">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold bg-gradient-to-br from-[#001e40] to-[#003366] bg-clip-text text-transparent font-headline tracking-tight">DoDate Reservaciones</span>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-slate-500 hover:bg-slate-100 p-2 rounded-lg transition-all active:scale-95">
            <span className="material-symbols-outlined">help</span>
          </button>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center px-6 pt-24 pb-12">
        <div className="max-w-2xl w-full">
          <div className="bg-surface-container-lowest rounded-xl p-8 md:p-12 shadow-[0px_32px_64px_-12px_rgba(25,28,31,0.06)] relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-error-container/20 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-error-container flex items-center justify-center rounded-full mb-8">
                <span className="material-symbols-outlined text-on-error-container text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
              </div>
              <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight mb-4">
                Lo sentimos, no se pudo procesar la reserva
              </h1>
              <p className="font-body text-on-surface-variant text-lg max-w-md mb-8 leading-relaxed">
                The space was booked during your session. Someone else completed their reservation just a moment before you.
              </p>
              <div className="w-full bg-surface-container-low rounded-xl p-6 mb-10 text-left flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <span className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2 block">Space Requested</span>
                  <p className="font-headline font-bold text-primary">Auditorium Magna - Wing B</p>
                </div>
                <div className="flex-1 border-l-0 md:border-l border-outline-variant/30 pl-0 md:pl-6">
                  <span className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2 block">Error Code</span>
                  <p className="font-mono text-sm text-on-surface-variant">AA-RSV-409-CONFLICT</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
                <button onClick={onTryAgain} className="w-full sm:w-auto px-10 py-4 bg-primary-gradient text-on-primary font-bold rounded-xl active:scale-95 transition-all shadow-lg shadow-primary/10">
                  Try Again
                </button>
                <button onClick={onBackToSpaces} className="w-full sm:w-auto px-10 py-4 bg-surface-container-high text-on-primary-fixed-variant font-semibold rounded-xl hover:bg-surface-dim transition-colors active:scale-95">
                  Back to Spaces
                </button>
              </div>
              <div className="mt-12 pt-8 border-t border-outline-variant/20 w-full">
                <p className="text-sm text-on-surface-variant">
                  Need immediate assistance? 
                  <a className="text-primary font-semibold underline decoration-primary-fixed underline-offset-4 ml-1" href="#">Contact Support</a>
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface-container-low/50 backdrop-blur-md p-6 rounded-xl border border-white/40 flex items-center gap-4">
              <div className="w-10 h-10 bg-primary-fixed flex items-center justify-center rounded-lg">
                <span className="material-symbols-outlined text-primary">search</span>
              </div>
              <div>
                <h4 className="font-headline font-bold text-sm text-on-surface">Explore Similar Spaces</h4>
                <p className="text-xs text-on-surface-variant">Find available rooms nearby</p>
              </div>
            </div>
            <div className="bg-surface-container-low/50 backdrop-blur-md p-6 rounded-xl border border-white/40 flex items-center gap-4">
              <div className="w-10 h-10 bg-secondary-container flex items-center justify-center rounded-lg">
                <span className="material-symbols-outlined text-on-secondary-container">calendar_month</span>
              </div>
              <div>
                <h4 className="font-headline font-bold text-sm text-on-surface">Check Availability</h4>
                <p className="text-xs text-on-surface-variant">View the full campus schedule</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ReservationsView({ onBackToSpaces }: { onBackToSpaces: () => void }) {
  return (
    <div className="bg-surface min-h-screen flex flex-col">
      <Header onNavigateToReservations={() => {}} onBackToSpaces={onBackToSpaces} activeTab="reservations" />
      <main className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-primary tracking-tight mb-2 font-headline">Mis Reservas</h1>
          <p className="text-on-surface-variant max-w-2xl">Manage your upcoming academic sessions and track your attendance history across campus facilities.</p>
        </div>
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-6">
            <div className="flex gap-2 p-1 bg-surface-container-low rounded-xl">
              <button className="px-6 py-2 bg-surface-container-lowest text-primary font-bold rounded-lg shadow-sm text-sm">All Bookings</button>
              <button className="px-6 py-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg text-sm transition-colors">Upcoming</button>
              <button className="px-6 py-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg text-sm transition-colors">Past</button>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-on-surface-variant/50 uppercase tracking-widest block mb-1">Current Usage</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-primary"></div>
                </div>
                <span className="text-sm font-bold text-primary">12/15 Hours</span>
              </div>
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border-none">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-surface-container-high">
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Space & Location</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Time Slot</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                <ReservationRow 
                  title="Quantum Physics Lab 402" 
                  location="North Campus • Science Block B" 
                  date="Oct 24, 2024" 
                  time="09:00 AM - 11:30 AM" 
                  status="Active" 
                  icon="domain" 
                />
                <ReservationRow 
                  title="Quiet Study Pod G" 
                  location="Main Library • Floor 2" 
                  date="Oct 25, 2024" 
                  time="02:00 PM - 05:00 PM" 
                  status="Active" 
                  icon="menu_book" 
                  highlight
                />
                <ReservationRow 
                  title="Auditorium C" 
                  location="Central Plaza • Wing West" 
                  date="Oct 20, 2024" 
                  time="10:00 AM - 12:00 PM" 
                  status="Completed" 
                  icon="event_available" 
                  completed
                />
                <ReservationRow 
                  title="Collaboration Room 12" 
                  location="Student Union • Floor 1" 
                  date="Oct 18, 2024" 
                  time="08:00 AM - 09:30 AM" 
                  status="Completed" 
                  icon="groups" 
                  completed
                />
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-primary p-8 rounded-xl text-on-primary shadow-lg col-span-1 md:col-span-2 flex justify-between items-center overflow-hidden relative">
              <div className="z-10">
                <h3 className="text-xl font-bold mb-2 font-headline">Reserve a New Space</h3>
                <p className="text-primary-fixed-dim/80 text-sm mb-6 max-w-xs">Need a quiet place or a lab for your next project? Browse available campus locations.</p>
                <button onClick={onBackToSpaces} className="bg-white text-primary px-6 py-3 rounded-lg font-bold text-sm hover:shadow-xl transition-all active:scale-95">
                  Browse Catalog
                </button>
              </div>
              <span className="material-symbols-outlined text-[160px] absolute -right-8 -bottom-8 opacity-10 pointer-events-none">add_circle</span>
            </div>
            <div className="bg-tertiary-fixed p-8 rounded-xl text-on-tertiary-fixed shadow-sm flex flex-col justify-between">
              <div>
                <span className="material-symbols-outlined mb-4 text-tertiary">info</span>
                <h3 className="text-lg font-bold mb-1 font-headline">Reservation Policy</h3>
                <p className="text-xs opacity-80 leading-relaxed">Cancellations must be made at least 2 hours before the time slot to avoid penalty points.</p>
              </div>
              <a className="text-sm font-bold underline decoration-2 underline-offset-4 decoration-tertiary/30 mt-4" href="#">View Policy</a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ReservationRow({ title, location, date, time, status, icon, highlight, completed }: { title: string, location: string, date: string, time: string, status: string, icon: string, highlight?: boolean, completed?: boolean }) {
  return (
    <tr className={`hover:bg-surface-container-low transition-colors group ${highlight ? 'bg-surface-container-low/30 border-l-4 border-primary' : ''}`}>
      <td className="px-6 py-6">
        <div className={`flex items-center gap-4 ${completed ? 'opacity-60' : ''}`}>
          <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${completed ? 'bg-surface-container-high text-on-surface-variant' : 'bg-primary-fixed text-primary'}`}>
            <span className="material-symbols-outlined">{icon}</span>
          </div>
          <div>
            <div className="font-bold text-on-surface text-base font-headline">{title}</div>
            <div className="text-xs text-on-surface-variant">{location}</div>
          </div>
        </div>
      </td>
      <td className={`px-6 py-6 font-medium ${completed ? 'text-on-surface-variant' : 'text-on-surface'}`}>{date}</td>
      <td className={`px-6 py-6 font-medium ${completed ? 'text-on-surface-variant' : 'text-on-surface'}`}>{time}</td>
      <td className="px-6 py-6">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${completed ? 'bg-surface-container-high text-on-surface-variant' : 'bg-secondary-container text-on-secondary-container'}`}>
          {!completed && <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></span>}
          {status}
        </span>
      </td>
      <td className="px-6 py-6 text-right">
        <button className={`${completed ? 'text-primary' : 'text-error'} font-bold text-sm px-4 py-2 hover:bg-surface-container-high rounded-lg transition-all active:scale-95`}>
          {completed ? 'Rebook Space' : 'Cancel Reservation'}
        </button>
      </td>
    </tr>
  );
}
