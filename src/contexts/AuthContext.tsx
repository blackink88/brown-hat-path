/**
 * AuthContext — Frappe proxy JWT authentication (no Supabase dependency)
 *
 * Stores a proxy-issued JWT in localStorage under "bh_token".
 * The JWT payload contains: email, full_name, tier_level, exp.
 *
 * Exposes a synthetic `user` and `session` object that are interface-compatible
 * with the Supabase shapes used throughout the app, so downstream components
 * need minimal changes.
 */

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const PROXY_URL   = import.meta.env.VITE_PROXY_URL as string;
const TOKEN_KEY   = "bh_token";
const SSO_KEY     = "bh_sso_cred"; // temp sessionStorage — cleared after SSO or signout

// ── JWT payload shape ────────────────────────────────────────────────────────

interface JWTPayload {
  sub:        string;
  email:      string;
  full_name:  string;
  tier_level: number;
  is_admin?:  boolean;
  iat:        number;
  exp:        number;
}

function decodeJWT(token: string): JWTPayload | null {
  try {
    const [, body] = token.split(".");
    const json = atob(body.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(decodeURIComponent(escape(json))) as JWTPayload;
    if (payload.exp && Date.now() / 1000 > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

// ── Synthetic user / session types (compatible with existing component usage) ─

export interface BHUser {
  id:             string;
  email:          string;
  user_metadata:  { full_name: string };
}

export interface BHSession {
  access_token: string;
  user:         BHUser;
}

// ── Context type ──────────────────────────────────────────────────────────────

interface AuthContextType {
  user:           BHUser | null;
  session:        BHSession | null;
  loading:        boolean;
  tierLevel:      number;
  isAdmin:        boolean;
  signUp:         (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn:         (email: string, password: string) => Promise<{ error: Error | null; tierLevel?: number }>;
  signOut:        () => Promise<void>;
  applyNewToken:  (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Helper: build synthetic user / session from JWT ──────────────────────────

function buildFromToken(token: string): { user: BHUser; session: BHSession; tierLevel: number; isAdmin: boolean } | null {
  const payload = decodeJWT(token);
  if (!payload) return null;

  const user: BHUser = {
    id:            payload.email,
    email:         payload.email,
    user_metadata: { full_name: payload.full_name },
  };
  const session: BHSession = { access_token: token, user };
  return { user, session, tierLevel: payload.tier_level ?? 0, isAdmin: payload.is_admin ?? false };
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,      setUser]      = useState<BHUser | null>(null);
  const [session,   setSession]   = useState<BHSession | null>(null);
  const [tierLevel, setTierLevel] = useState<number>(0);
  const [isAdmin,   setIsAdmin]   = useState<boolean>(false);
  const [loading,   setLoading]   = useState(true);

  function applyToken(token: string | null) {
    if (!token) {
      setUser(null); setSession(null); setTierLevel(0); setIsAdmin(false);
      return;
    }
    const parsed = buildFromToken(token);
    if (!parsed) {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null); setSession(null); setTierLevel(0); setIsAdmin(false);
      return;
    }
    localStorage.setItem(TOKEN_KEY, token);
    setUser(parsed.user);
    setSession(parsed.session);
    setTierLevel(parsed.tierLevel);
    setIsAdmin(parsed.isAdmin);
  }

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    applyToken(stored);

    // Refresh JWT from Frappe on every app load so tier_level stays accurate
    // after webhook-processed subscription renewals or cancellations.
    if (stored && PROXY_URL) {
      fetch(`${PROXY_URL}?action=refresh-token`, {
        headers: { Authorization: `Bearer ${stored}` },
      })
        .then((r) => r.json())
        .then((data: Record<string, unknown>) => {
          if (data.token) applyToken(data.token as string);
        })
        .catch(() => { /* silent — stored token used as fallback */ })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const res = await fetch(`${PROXY_URL}?action=register`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password, full_name: fullName }),
      });
      const data = await res.json() as Record<string, unknown>;
      if (data.error) return { error: new Error(data.error as string) };
      applyToken(data.token as string);
      sessionStorage.setItem(SSO_KEY, JSON.stringify({ email, password }));
      return { error: null };
    } catch (e) {
      return { error: e instanceof Error ? e : new Error("Registration failed") };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const res = await fetch(`${PROXY_URL}?action=login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password }),
      });
      const data = await res.json() as Record<string, unknown>;
      if (data.error) return { error: new Error(data.error as string) };
      applyToken(data.token as string);
      sessionStorage.setItem(SSO_KEY, JSON.stringify({ email, password }));
      return { error: null, tierLevel: (data.tier_level as number) ?? 0 };
    } catch (e) {
      return { error: e instanceof Error ? e : new Error("Login failed") };
    }
  };

  const signOut = async () => {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(SSO_KEY);
    applyToken(null);
  };

  // Called after subscription activation to apply the new tier-level JWT
  const applyNewToken = (token: string) => applyToken(token);

  return (
    <AuthContext.Provider value={{
      user, session, loading, tierLevel, isAdmin,
      signUp, signIn, signOut, applyNewToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
