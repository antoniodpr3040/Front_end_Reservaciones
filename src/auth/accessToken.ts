const NGROK_SKIP_WARNING_HEADER = {
  'ngrok-skip-browser-warning': 'true',
};

const ACCESS_TOKEN_STORAGE_KEY = 'dodate_access_token';

export function readStoredAccessToken() {
  return sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)?.trim() ?? '';
}

export function writeStoredAccessToken(token: string) {
  sessionStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
}

export function clearStoredAccessToken() {
  sessionStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function consumeAccessTokenFromHash() {
  const hash = window.location.hash.replace(/^#/, '');

  if (!hash) {
    return '';
  }

  const params = new URLSearchParams(hash);
  const token = params.get('access_token')?.trim() ?? '';

  if (!token) {
    return '';
  }

  writeStoredAccessToken(token);
  window.history.replaceState(
    null,
    document.title,
    `${window.location.pathname}${window.location.search}`,
  );

  return token;
}

export function buildAuthHeaders(headers: Record<string, string> = {}) {
  const token = readStoredAccessToken();

  return {
    ...NGROK_SKIP_WARNING_HEADER,
    ...headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
