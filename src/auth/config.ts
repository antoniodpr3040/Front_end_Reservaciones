const configuredApiBase =
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  'https://back-end-reservaciones.vercel.app';

export const AUTH_API_BASE = configuredApiBase.replace(/\/+$/, '');
export const AUTH_LOGIN_URL = `${AUTH_API_BASE}/login/microsoft`;
export const AUTH_SESSION_URL = `${AUTH_API_BASE}/me`;
export const AUTH_LOGOUT_URL = `${AUTH_API_BASE}/logout`;
export const OUTLOOK_RESERVATIONS_URL = `${AUTH_API_BASE}/outlook/reservations`;
