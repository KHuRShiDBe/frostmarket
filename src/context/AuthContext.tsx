"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getAuthService } from "@/services/auth";
import type { AuthResult, LoginInput, ProfileUpdateInput, RegisterInput, User } from "@/services/auth";

interface AuthContextValue {
  user: User | null;
  /** True until the initial session lookup (localStorage/sessionStorage) has run. */
  isLoading: boolean;
  register: (input: RegisterInput) => Promise<AuthResult>;
  login: (input: LoginInput, rememberMe: boolean) => Promise<AuthResult>;
  logout: () => void;
  updateProfile: (updates: ProfileUpdateInput) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore the current session once, on the client only.
  useEffect(() => {
    // Syncing from localStorage/sessionStorage (client-only) on mount; SSR
    // renders signed-out to avoid a hydration mismatch, so this can't be a
    // lazy useState initializer.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(getAuthService().getCurrentUser());
    setIsLoading(false);
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const result = await getAuthService().register(input);
    if (result.success) setUser(result.user);
    return result;
  }, []);

  const login = useCallback(async (input: LoginInput, rememberMe: boolean) => {
    const result = await getAuthService().login(input, rememberMe);
    if (result.success) setUser(result.user);
    return result;
  }, []);

  const logout = useCallback(() => {
    getAuthService().logout();
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (updates: ProfileUpdateInput): Promise<AuthResult> => {
      if (!user) return { success: false, error: "unknown_error" };
      const result = await getAuthService().updateProfile(user.id, updates);
      if (result.success) setUser(result.user);
      return result;
    },
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({ user, isLoading, register, login, logout, updateProfile }),
    [user, isLoading, register, login, logout, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
