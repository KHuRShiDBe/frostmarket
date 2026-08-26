import type { StoredUser } from "./types";
import { SEED_ADMIN_USER } from "./seedAdmin";

/**
 * Storage seam for user records. The UI/AuthService never touch localStorage
 * directly — swapping in a real backend later means writing one new
 * implementation of this interface.
 */
export interface UserRepository {
  findByEmail(email: string): StoredUser | null;
  findById(id: string): StoredUser | null;
  getAll(): StoredUser[];
  create(user: StoredUser): void;
  update(
    id: string,
    updates: Partial<Pick<StoredUser, "firstName" | "lastName" | "phone">>,
  ): StoredUser | null;
}

const USERS_KEY = "frostmarket:users";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Legacy records saved before `role` existed default to "user", never "admin". */
function normalizeUser(user: StoredUser): StoredUser {
  return user.role ? user : { ...user, role: "user" };
}

function writeUsers(users: StoredUser[]): void {
  try {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    // ignore write failures (e.g. storage disabled)
  }
}

function readUsers(): StoredUser[] {
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    // Key has never been written: first run, so seed the one demo admin
    // account (see seedAdmin.ts). An empty array is left alone.
    if (raw === null) {
      writeUsers([SEED_ADMIN_USER]);
      return [SEED_ADMIN_USER];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(normalizeUser) : [];
  } catch {
    return [];
  }
}

/** Demo-only implementation backed by localStorage. Replace with a real API-backed repository later. */
export class LocalStorageUserRepository implements UserRepository {
  findByEmail(email: string): StoredUser | null {
    const target = normalizeEmail(email);
    return readUsers().find((user) => normalizeEmail(user.email) === target) ?? null;
  }

  findById(id: string): StoredUser | null {
    return readUsers().find((user) => user.id === id) ?? null;
  }

  getAll(): StoredUser[] {
    return readUsers();
  }

  create(user: StoredUser): void {
    const users = readUsers();
    users.push(user);
    writeUsers(users);
  }

  update(
    id: string,
    updates: Partial<Pick<StoredUser, "firstName" | "lastName" | "phone">>,
  ): StoredUser | null {
    const users = readUsers();
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) return null;

    const updated = { ...users[index], ...updates };
    users[index] = updated;
    writeUsers(users);
    return updated;
  }
}
