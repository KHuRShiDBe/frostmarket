/** "admin" unlocks /admin; every self-registered account is "user" — there is no signup path to admin. */
export type UserRole = "user" | "admin";

/** Public-facing user profile — never includes the password hash. */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
  role: UserRole;
}

/** What actually gets persisted. Only the repository layer ever sees `passwordHash`. */
export interface StoredUser extends User {
  passwordHash: string;
}

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ProfileUpdateInput {
  firstName: string;
  lastName: string;
  phone: string;
}

/**
 * Error codes only — never a display string. Keeping the service layer
 * language-agnostic means the UI (which already owns KO/RU/EN copy) decides
 * how each code reads, and a future real backend can reuse the same codes.
 */
export type AuthErrorCode = "email_taken" | "invalid_credentials" | "unknown_error";

export type AuthResult = { success: true; user: User } | { success: false; error: AuthErrorCode };
