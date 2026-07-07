import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as authApi from "../api/auth";
import { registerUnauthorizedHandler } from "../api/client";

const AuthContext = createContext(null);
const STORAGE_KEY = "acs.user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [ready, setReady] = useState(true);

  const persist = useCallback((nextUser) => {
    setUser(nextUser);
    if (nextUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = useCallback(
    async (username, password) => {
      const data = await authApi.login(username, password);
      persist(data.user);
      return data;
    },
    [persist]
  );

  const registerAccount = useCallback(
    async (username, password) => {
      const data = await authApi.register(username, password);
      persist(data.user);
      return data;
    },
    [persist]
  );

  const logout = useCallback(() => {
    // The backend has no logout route (session cookie only), so we clear
    // local client state; the httpOnly cookie expires with the browser
    // session on the server side.
    persist(null);
  }, [persist]);

  useEffect(() => {
    // If any request comes back 401, the session cookie is gone/invalid —
    // drop local state so the UI reflects reality instead of a stale login.
    registerUnauthorizedHandler(() => persist(null));
  }, [persist]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      ready,
      login,
      registerAccount,
      logout,
    }),
    [user, ready, login, registerAccount, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
