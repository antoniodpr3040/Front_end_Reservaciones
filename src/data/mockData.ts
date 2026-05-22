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
    value: 'laboratorios',
    title: 'Laboratorios',
    description: 'Investigacion avanzada',
    status: 'Disponible',
    icon: 'biotech',
    subSpaces: [
      {
        value: 'laboratorio-computacion',
        title: 'Laboratorio CLIC',
        description: 'Laboratorio de computacion',
        icon: 'desktop_windows',
      },
      {
        value: 'laboratorio-fisica',
        title: 'Laboratorio SPARK',
        description: 'Laboratorio con instrumentos de medicion y experimentacion',
        icon: 'science',
      },
      {
        value: 'laboratorio-quimica',
        title: 'Laboratorio KITE',
        description: 'Laboratorio con herramientas para la creacion de tus proyectos',
        icon: 'biotech',
      },
    ],
  },
  {
    value: 'mentorias',
    title: 'Salas de mentoria',
    description: 'Colaboracion dirigida',
    status: 'Disponible',
    icon: 'co_present',
    subSpaces: [
      {
        value: 'mentoria-1',
        title: 'Sala de Mentoria 1',
        description: 'Sesiones personalizadas',
        icon: 'co_present',
      },
      {
        value: 'mentoria-2',
        title: 'Sala de Mentoria 2',
        description: 'Sesiones personalizadas',
        icon: 'co_present',
      },
      {
        value: 'mentoria-3',
        title: 'Sala de Mentoria 3',
        description: 'Sesiones personalizadas',
        icon: 'co_present',
      },
    ],
  },
];

export const reservationHistory: HistoryEntry[] = [
  {
    id: 'history-1',
    user: 'Ana Martinez',
    space: 'Biblioteca',
    date: '24 May 2026',
    time: '10:00 - 12:00',
    status: 'Completada',
  },
  {
    id: 'history-2',
    user: 'Carlos Ruiz',
    space: 'Laboratorio',
    date: '25 May 202+',
    time: '14:00 - 16:30',
    status: 'Activa',
  },
  {
    id: 'history-3',
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
