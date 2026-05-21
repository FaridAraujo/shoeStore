"use client";

import { createContext, useContext, useState, useCallback, useMemo } from "react";

interface AuthUser {
  name:  string;
  email: string;
}

interface AuthContextValue {
  user:    AuthUser | null;
  login:   (user: AuthUser) => void;
  logout:  () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user:   null,
  login:  () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login  = useCallback((u: AuthUser) => setUser(u), []);
  const logout = useCallback(() => setUser(null), []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
