import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  AUTH_STORAGE_KEY,
  HARDCODED_ADMIN,
  validateAdminCredentials,
} from './adminCredentials';

const AuthContext = createContext(null);

const readStoredSession = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.authenticated === true && parsed?.username === HARDCODED_ADMIN.username) {
      return {
        authenticated: true,
        username: HARDCODED_ADMIN.username,
        displayName: HARDCODED_ADMIN.displayName,
        email: HARDCODED_ADMIN.email,
      };
    }
  } catch {
    /* ignore corrupt storage */
  }
  return null;
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => readStoredSession());

  const login = useCallback((username, password) => {
    if (!validateAdminCredentials(username, password)) {
      return { ok: false, message: 'Usuario o contraseña incorrectos.' };
    }
    const next = {
      authenticated: true,
      username: HARDCODED_ADMIN.username,
      displayName: HARDCODED_ADMIN.displayName,
      email: HARDCODED_ADMIN.email,
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next));
    setSession(next);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(session?.authenticated),
      user: session,
      login,
      logout,
    }),
    [session, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return ctx;
};
