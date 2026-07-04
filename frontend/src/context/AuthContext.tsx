import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { authService, type User } from "@/services/auth";

interface AuthCtx {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

const TOKEN_KEY = "token";
const USER_KEY = "user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const t = window.localStorage.getItem(TOKEN_KEY);
    const u = window.localStorage.getItem(USER_KEY);
    if (t) setToken(t);
    if (u) {
      try {
        setUser(JSON.parse(u));
      } catch {
        /* ignore */
      }
    }
    setLoading(false);
  }, []);

  const persist = (t: string, u: User) => {
    window.localStorage.setItem(TOKEN_KEY, t);
    window.localStorage.setItem(USER_KEY, JSON.stringify(u));
    setToken(t);
    setUser(u);
  };

  const login = useCallback(async (email: string, password: string) => {
    const res = await authService.login(email, password);
    persist(res.token, res.user);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const res = await authService.register(name, email, password);
    persist(res.token, res.user);
  }, []);

  const logout = useCallback(() => {
    void authService.logout();
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const u = await authService.me();
      window.localStorage.setItem(USER_KEY, JSON.stringify(u));
      setUser(u);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <Ctx.Provider value={{ user, token, loading, login, register, logout, refresh }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
}
