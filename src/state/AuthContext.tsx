"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

const SESSION_KEY = "lumadesk-authenticated";
const PERSISTENT_KEY = "lumadesk-authenticated-persistent";

type AuthContextValue = {
  isAuthenticated: boolean;
  signIn: (remember: boolean) => void;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

function readAuthState() {
  return window.sessionStorage.getItem(SESSION_KEY) === "true"
    || window.localStorage.getItem(PERSISTENT_KEY) === "true";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setAuthenticated] = useState(readAuthState);

  const value = useMemo<AuthContextValue>(() => ({
    isAuthenticated,
    signIn(remember) {
      window.sessionStorage.setItem(SESSION_KEY, "true");
      if (remember) window.localStorage.setItem(PERSISTENT_KEY, "true");
      else window.localStorage.removeItem(PERSISTENT_KEY);
      setAuthenticated(true);
    },
    signOut() {
      window.sessionStorage.removeItem(SESSION_KEY);
      window.localStorage.removeItem(PERSISTENT_KEY);
      setAuthenticated(false);
    },
  }), [isAuthenticated]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
