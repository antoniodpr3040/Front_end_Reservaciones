import type {
  HistoryEntry,
  ReservationEntry,
  SpaceCardData,
} from '../types/reservations';

export const dashboardSpaces: SpaceCardData[] = [
  {
    value: 'biblioteca',
    title: 'Biblioteca',
    description: 'Zona de silencio absoluto',
    capacity: 50,
    status: 'Disponible',
    icon: 'auto_stories',
  },
  {
    value: 'laboratorio',
    title: 'Laboratorio',
    description: 'Investigacion avanzada',
    capacity: 20,
    status: 'Ocupado',
    icon: 'biotech',
  },
  {
    value: 'mentoria',
    title: 'Sala de mentoria',
    description: 'Colaboracion dirigida',
    capacity: 6,
    status: 'Disponible',
    icon: 'co_present',
  },
];

export const reservationHistory: HistoryEntry[] = [
  {
    user: 'Ana Martinez',
    space: 'Biblioteca',
    date: '24 May 2026',
    time: '10:00 - 12:00',
    status: 'Completada',
  },
  {
    user: 'Carlos Ruiz',
    space: 'Laboratorio',
    date: '25 May 202+',
    time: '14:00 - 16:30',
    status: 'En proceso',
  },
  {
    user: 'Lucia Gomez',
    space: 'Sala de mentoria',
    date: '26 May 2026',
    time: '09:00 - 10:00',
    status: 'Completada',
  },
];

export const currentReservations: ReservationEntry[] = [
  {
    title: 'Laboratorio de fisica cuantica 402',
    location: 'Campus Norte - Bloque de Ciencias B',
    date: '24 Oct 202',
    time: '09:00 AM - 11:30 AM',
    status: 'Activa',
    icon: 'domain',
  },
  {
    title: 'Cabina de estudio G',
    location: 'Biblioteca Central - Nivel 2',
    date: '25 Oct 2026',
    time: '02:00 PM - 05:00 PM',
    status: 'Activa',
    icon: 'menu_book',
    highlight: true,
  },
  {
    title: 'Auditorio C',
    location: 'Plaza Central - Ala Oeste',
    date: '20 Oct 2026',
    time: '10:00 AM - 12:00 PM',
    status: 'Completada',
    icon: 'event_available',
    completed: true,
  },
  {
    title: 'Sala de colaboracion 12',
    location: 'Centro Estudiantil - Nivel 1',
    date: '18 Oct 2026',
    time: '08:00 AM - 09:30 AM',
    status: 'Completada',
    icon: 'groups',
    completed: true,
  },
];

export const calendarDays = Array.from({ length: 31 }, (_, index) => index + 1);
