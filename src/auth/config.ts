export const AUTH_API_BASE =
  'https://nonenviable-dorothea-congenial.ngrok-free.dev'.replace(/\/+$/, '');
export const AUTH_LOGIN_URL = `${AUTH_API_BASE}/login/microsoft`;
export const AUTH_SESSION_URL = `${AUTH_API_BASE}/me`;
export const AUTH_LOGOUT_URL = `${AUTH_API_BASE}/logout`;
