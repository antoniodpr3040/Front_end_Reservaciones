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
  const response = await fetch(AUTH_SESSION_URL, {
    credentials: 'include',
  });

  if (!response.ok) {
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
