import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { AUTH_LOGOUT_URL, AUTH_SESSION_URL } from './config';

export interface AuthUser {
  name: string;
  email: string;
  role?: string;
  department?: string;
  avatarUrl?: string;
  id?: string;
  organization?: string;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const NGROK_SKIP_WARNING_HEADER = {
  'ngrok-skip-browser-warning': 'true',
};
const ACCESS_TOKEN_STORAGE_KEY = 'dodate_access_token';

function readStoredAccessToken() {
  return sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)?.trim() ?? '';
}

function writeStoredAccessToken(token: string) {
  sessionStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
}

function clearStoredAccessToken() {
  sessionStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
}

function consumeAccessTokenFromHash() {
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

function buildAuthHeaders() {
  const token = readStoredAccessToken();

  return {
    ...NGROK_SKIP_WARNING_HEADER,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function pickString(
  source: Record<string, unknown>,
  keys: string[],
) {
  for (const key of keys) {
    const value = source[key];

    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}

function normalizeUser(payload: unknown) {
  if (!isRecord(payload)) {
    return null;
  }

  const nestedUser = isRecord(payload.user) ? payload.user : payload;

  return {
    name:
      pickString(nestedUser, ['name', 'fullName', 'displayName', 'username']) ??
      pickString(payload, ['name', 'fullName', 'displayName']) ??
      pickString(nestedUser, ['email', 'mail', 'userPrincipalName']) ??
      'Usuario institucional',
    email:
      pickString(nestedUser, ['email', 'mail', 'userPrincipalName']) ??
      pickString(payload, ['email', 'mail']) ??
      'Correo no disponible',
    role:
      pickString(nestedUser, ['role', 'jobTitle', 'position']) ??
      pickString(payload, ['role', 'jobTitle']),
    department:
      pickString(nestedUser, ['department', 'area', 'faculty']) ??
      pickString(payload, ['department', 'area']),
    avatarUrl:
      pickString(nestedUser, ['avatarUrl', 'avatar', 'picture', 'photo']) ??
      pickString(payload, ['avatarUrl', 'avatar', 'picture']),
    id:
      pickString(nestedUser, ['id', 'sub', 'employeeId']) ??
      pickString(payload, ['id', 'sub']),
    organization:
      pickString(nestedUser, ['organization', 'tenant', 'company']) ??
      pickString(payload, ['organization', 'tenant']),
  } satisfies AuthUser;
}

async function loadSession() {
  consumeAccessTokenFromHash();

  const response = await fetch(AUTH_SESSION_URL, {
    credentials: 'include',
    headers: buildAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      clearStoredAccessToken();
    }

    return {
      authenticated: false,
      user: null,
    };
  }

  const contentType = response.headers.get('content-type') ?? '';

  if (!contentType.includes('application/json')) {
    return {
      authenticated: true,
      user: null,
    };
  }

  const data = await response.json();

  if (isRecord(data) && typeof data.authenticated === 'boolean') {
    return {
      authenticated: data.authenticated,
      user: data.authenticated ? normalizeUser(data) : null,
    };
  }

  return {
    authenticated: true,
    user: normalizeUser(data),
  };
}

async function requestLogout() {
  const postResponse = await fetch(AUTH_LOGOUT_URL, {
    method: 'POST',
    credentials: 'include',
    headers: buildAuthHeaders(),
  });

  if (postResponse.ok) {
    return;
  }

  if (postResponse.status !== 404 && postResponse.status !== 405) {
    throw new Error('No se pudo cerrar la sesion actual.');
  }

  const getResponse = await fetch(AUTH_LOGOUT_URL, {
    method: 'GET',
    credentials: 'include',
    headers: buildAuthHeaders(),
  });

  if (!getResponse.ok) {
    throw new Error('No se pudo cerrar la sesion actual.');
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);

  const refreshSession = async () => {
    setIsLoading(true);

    try {
      const session = await loadSession();

      setIsAuthenticated(session.authenticated);
      setUser(session.user);
    } catch {
      setIsAuthenticated(false);
      setUser(null);
    }
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);

    try {
      await requestLogout();
      clearStoredAccessToken();
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refreshSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        refreshSession,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
