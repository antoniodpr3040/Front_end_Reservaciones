export type SpaceStatus = 'Disponible' | 'Ocupado';
export type HistoryStatus = 'Activa' | 'Cancelada' | 'Completada';
export type ReservationStatus = 'Activa' | 'Completada';

export interface SubSpaceItem {
  value: string;
  title: string;
  description: string;
  icon: string;
}

export interface SpaceCardData {
  value: string;
  title: string;
  description: string;
  capacity?: number;
  status: SpaceStatus;
  icon: string;
  subSpaces?: SubSpaceItem[];
}

export interface HistoryEntry {
  id: string;
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

export interface ReservationConfirmation {
  end: string;
  reservationId: string;
  spaceDetails?: string;
  spaceName: string;
  start: string;
  webLink?: string;
}
