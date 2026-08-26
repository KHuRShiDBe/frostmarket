import { DemoAuthService, type AuthService } from "./AuthService";
import { LocalStorageUserRepository } from "./UserRepository";
import { BrowserSessionStore } from "./SessionStore";

let activeService: AuthService | null = null;

/**
 * Single point of truth for authentication. Today this resolves to a
 * localStorage-backed demo service; swapping in a real backend/auth
 * provider later means writing one new `AuthService` implementation here —
 * no changes needed in Header, Checkout, or the Account pages, which only
 * depend on the interface via `useAuth()`.
 */
export function getAuthService(): AuthService {
  if (!activeService) {
    activeService = new DemoAuthService(new LocalStorageUserRepository(), new BrowserSessionStore());
  }
  return activeService;
}

export type { AuthService } from "./AuthService";
export type {
  AuthErrorCode,
  AuthResult,
  LoginInput,
  ProfileUpdateInput,
  RegisterInput,
  StoredUser,
  User,
} from "./types";
