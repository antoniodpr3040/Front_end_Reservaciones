export type SpaceStatus = 'Disponible' | 'Ocupado';
export type HistoryStatus = 'Completada' | 'En proceso';
export type ReservationStatus = 'Activa' | 'Completada';

export interface SpaceCardData {
  value: string;
  title: string;
  description: string;
  capacity: number;
  status: SpaceStatus;
  icon: string;
}

export interface HistoryEntry {
  user: string;
  space: string;
  date: string;
  time: string;
  status: HistoryStatus;
}

export interface ReservationEntry {
  title: string;
  location: string;
  date: string;
  time: string;
  status: ReservationStatus;
  icon: string;
  highlight?: boolean;
  completed?: boolean;
}
