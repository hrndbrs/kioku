import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session } from '@/lib/schemas';

interface SessionContextProps {
  session: Session;
  setSession: (newSession: Session) => void;
  logout: () => void;
}

const SessionContext = createContext<SessionContextProps>({
  session: { isLoggedIn: false },
  setSession: () => {},
  logout: () => {},
});

export const useSession = (): SessionContextProps => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [session, setSession] = useState<Session>({
    isLoggedIn: false,
  });

  function logout() {
    setSession({ isLoggedIn: false });
    localStorage.removeItem('access_token');
  }

  const val = useMemo(() => ({ session, setSession, logout }), [session]);

  return (
    <SessionContext.Provider value={val}>{children}</SessionContext.Provider>
  );
}
