"use client";

import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef } from "react";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

type AuthState = {
  user?: AuthUser;
  ready: boolean;
};

type Action =
  | { type: "hydrate"; user?: AuthUser }
  | { type: "login"; user: AuthUser }
  | { type: "logout" };

const STORAGE_KEY = "job_assistant_auth_v1";

function reducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case "hydrate":
      return { user: action.user, ready: true };
    case "login":
      return { user: action.user, ready: true };
    case "logout":
      return { user: undefined, ready: true };
    default:
      return state;
  }
}

function nowIso() {
  return new Date().toISOString();
}

function newId(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

type AuthActions = {
  signup: (input: { name: string; email: string }) => void;
  login: (input: { email: string }) => void;
  logout: () => void;
};

const AuthContext = createContext<{ state: AuthState; actions: AuthActions } | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { user: undefined, ready: false });
  const hydratedRef = useRef(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        dispatch({ type: "hydrate", user: undefined });
        hydratedRef.current = true;
        return;
      }
      const user = JSON.parse(raw) as AuthUser;
      dispatch({ type: "hydrate", user });
    } catch {
      dispatch({ type: "hydrate", user: undefined });
    } finally {
      hydratedRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    try {
      if (state.user) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.user));
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, [state.user]);

  const actions: AuthActions = useMemo(
    () => ({
      signup: ({ name, email }) => {
        const user: AuthUser = {
          id: newId("user"),
          name: name.trim() || "User",
          email: email.trim(),
          createdAt: nowIso()
        };
        dispatch({ type: "login", user });
      },
      login: ({ email }) => {
        const user: AuthUser = {
          id: newId("user"),
          name: "User",
          email: email.trim(),
          createdAt: nowIso()
        };
        dispatch({ type: "login", user });
      },
      logout: () => dispatch({ type: "logout" })
    }),
    []
  );

  const value = useMemo(() => ({ state, actions }), [state, actions]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

