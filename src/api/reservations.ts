import { buildAuthHeaders } from '../auth/accessToken';
import { OUTLOOK_RESERVATIONS_URL } from '../auth/config';

export interface CreateReservationInput {
  attendees?: string[];
  description?: string;
  end: string;
  location?: string;
  start: string;
  timezone?: string;
  title: string;
}

export interface CreateReservationResponse {
  event_id: string;
  message: string;
  reservation_id: string;
  web_link?: string | null;
}

export interface CancelReservationInput {
  reason: string;
}

export interface CancelReservationResponse {
  message?: string;
}

export interface ReservationRecordResponse {
  attendees: string[];
  cancelled_at?: string | null;
  created_at: string;
  description?: string | null;
  end: string;
  event_id: string;
  location?: string | null;
  reservation_id: string;
  start: string;
  status: string;
  timezone: string;
  title: string;
  updated_at: string;
  user_email?: string | null;
  user_id: number;
  web_link?: string | null;
}

function readErrorMessage(payload: unknown) {
  if (typeof payload === 'string' && payload.trim()) {
    return payload.trim();
  }

  if (!payload || typeof payload !== 'object') {
    return undefined;
  }

  const detail = 'detail' in payload ? payload.detail : undefined;

  if (typeof detail === 'string' && detail.trim()) {
    return detail.trim();
  }

  if (detail && typeof detail === 'object') {
    const message = 'message' in detail ? detail.message : undefined;

    if (typeof message === 'string' && message.trim()) {
      return message.trim();
    }
  }

  return undefined;
}

export async function createReservation(
  payload: CreateReservationInput,
) {
  const response = await fetch(OUTLOOK_RESERVATIONS_URL, {
    method: 'POST',
    credentials: 'include',
    headers: buildAuthHeaders({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify({
      attendees: payload.attendees ?? [],
      description: payload.description,
      end: payload.end,
      location: payload.location,
      start: payload.start,
      timezone: payload.timezone ?? 'Central America Standard Time',
      title: payload.title,
    }),
  });

  if (!response.ok) {
    let errorMessage = 'No se pudo registrar la reservacion.';

    try {
      const data = await response.json();
      errorMessage = readErrorMessage(data) ?? errorMessage;
    } catch {
      // Ignore non-JSON responses and preserve the fallback message.
    }

    throw new Error(errorMessage);
  }

  return response.json() as Promise<CreateReservationResponse>;
}

export async function listReservations() {
  const response = await fetch(OUTLOOK_RESERVATIONS_URL, {
    method: 'GET',
    credentials: 'include',
    headers: buildAuthHeaders(),
  });

  if (!response.ok) {
    let errorMessage = 'No se pudo cargar tus reservaciones.';

    try {
      const data = await response.json();
      errorMessage = readErrorMessage(data) ?? errorMessage;
    } catch {
      // Ignore non-JSON responses and preserve the fallback message.
    }

    throw new Error(errorMessage);
  }

  return response.json() as Promise<ReservationRecordResponse[]>;
}

export async function cancelReservation(
  reservationId: string,
  payload: CancelReservationInput,
) {
  const encodedReservationId = encodeURIComponent(reservationId);
  const response = await fetch(
    `${OUTLOOK_RESERVATIONS_URL}/${encodedReservationId}`,
    {
      method: 'DELETE',
      credentials: 'include',
      headers: buildAuthHeaders({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        reason: payload.reason,
      }),
    },
  );

  if (!response.ok) {
    let errorMessage = 'No se pudo cancelar la reservacion.';

    try {
      const data = await response.json();
      errorMessage = readErrorMessage(data) ?? errorMessage;
    } catch {
      // Ignore non-JSON responses and preserve the fallback message.
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return { message: 'Reservacion cancelada.' } satisfies CancelReservationResponse;
  }

  try {
    return await response.json() as CancelReservationResponse;
  } catch {
    return { message: 'Reservacion cancelada.' } satisfies CancelReservationResponse;
  }
}
