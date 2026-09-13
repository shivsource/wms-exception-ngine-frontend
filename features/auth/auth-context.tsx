"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { clearStoredAuth, getStoredAuth, setStoredAuth } from "./storage";

interface AuthContextValue {
  isAuthenticated: boolean;
  email: string | null;
  /** False until the localStorage-backed state has been read on the client — callers that
   *  gate rendering on auth (AuthGuard) must wait for this to avoid a false "logged out"
   *  flash during server render / first paint. */
  isHydrated: boolean;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const stored = getStoredAuth();
    setIsAuthenticated(stored.isAuthenticated);
    setEmail(stored.email);
    setIsHydrated(true);
  }, []);

  function login(nextEmail: string) {
    setStoredAuth(nextEmail);
    setIsAuthenticated(true);
    setEmail(nextEmail);
  }

  function logout() {
    clearStoredAuth();
    setIsAuthenticated(false);
    setEmail(null);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, email, isHydrated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
