import type { UserRepository } from "./UserRepository";
import type { SessionStore } from "./SessionStore";
import { hashPassword } from "./password";
import type { AuthResult, LoginInput, ProfileUpdateInput, RegisterInput, StoredUser, User } from "./types";

/**
 * Everything Checkout/Header/Account need from authentication, expressed as
 * an interface. UI code only ever depends on this — never on
 * LocalStorageUserRepository/BrowserSessionStore directly — so a real
 * backend/auth provider can replace `DemoAuthService` later without
 * touching a single component.
 */
export interface AuthService {
  getCurrentUser(): User | null;
  register(input: RegisterInput): Promise<AuthResult>;
  login(input: LoginInput, rememberMe: boolean): Promise<AuthResult>;
  logout(): void;
  updateProfile(userId: string, updates: ProfileUpdateInput): Promise<AuthResult>;
}

function toPublicUser(stored: StoredUser): User {
  const { id, firstName, lastName, email, phone, createdAt } = stored;
  return { id, firstName, lastName, email, phone, createdAt };
}

function generateUserId(): string {
  return `user_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Demo-only implementation. Not production-secure authentication — it exists
 * to make Register/Login/Account fully usable in this portfolio build.
 * Swap this for a real backend-backed implementation later (see AuthService
 * doc above); UserRepository/SessionStore already isolate the storage
 * concerns so that swap doesn't ripple into the UI.
 */
export class DemoAuthService implements AuthService {
  constructor(
    private readonly users: UserRepository,
    private readonly session: SessionStore,
  ) {}

  getCurrentUser(): User | null {
    const id = this.session.getUserId();
    if (!id) return null;
    const stored = this.users.findById(id);
    return stored ? toPublicUser(stored) : null;
  }

  async register(input: RegisterInput): Promise<AuthResult> {
    if (this.users.findByEmail(input.email)) {
      return { success: false, error: "email_taken" };
    }

    const stored: StoredUser = {
      id: generateUserId(),
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      email: input.email.trim(),
      phone: input.phone.trim(),
      createdAt: new Date().toISOString(),
      passwordHash: await hashPassword(input.password),
    };

    this.users.create(stored);
    // Registering signs the user in immediately, persisted like a "remember me" login.
    this.session.setUserId(stored.id, true);
    return { success: true, user: toPublicUser(stored) };
  }

  async login(input: LoginInput, rememberMe: boolean): Promise<AuthResult> {
    const stored = this.users.findByEmail(input.email);
    if (!stored) {
      return { success: false, error: "invalid_credentials" };
    }

    const candidateHash = await hashPassword(input.password);
    if (candidateHash !== stored.passwordHash) {
      return { success: false, error: "invalid_credentials" };
    }

    this.session.setUserId(stored.id, rememberMe);
    return { success: true, user: toPublicUser(stored) };
  }

  logout(): void {
    this.session.clear();
  }

  async updateProfile(userId: string, updates: ProfileUpdateInput): Promise<AuthResult> {
    const updated = this.users.update(userId, {
      firstName: updates.firstName.trim(),
      lastName: updates.lastName.trim(),
      phone: updates.phone.trim(),
    });
    if (!updated) {
      return { success: false, error: "unknown_error" };
    }
    return { success: true, user: toPublicUser(updated) };
  }
}
