import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_API_BASE = 'http://localhost:8000';
const AUTH_SESSION_URL = `${AUTH_API_BASE}/me`;

async function hasActiveSession() {
  try {
    const response = await fetch(AUTH_SESSION_URL, {
      credentials: 'include',
    });

    if (!response.ok) {
      return false;
    }

    const contentType = response.headers.get('content-type') ?? '';

    if (!contentType.includes('application/json')) {
      return true;
    }

    const data = (await response.json()) as { authenticated?: boolean };

    if (typeof data.authenticated === 'boolean') {
      return data.authenticated;
    }

    return true;
  } catch {
    return false;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = async () => {
    setIsLoading(true);

    const authenticated = await hasActiveSession();

    setIsAuthenticated(authenticated);
    setIsLoading(false);
  };

  useEffect(() => {
    void refreshSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        refreshSession,
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
