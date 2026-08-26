import type { StoredUser } from "./types";

/**
 * Storage seam for user records. The UI/AuthService never touch localStorage
 * directly — swapping in a real backend later means writing one new
 * implementation of this interface.
 */
export interface UserRepository {
  findByEmail(email: string): StoredUser | null;
  findById(id: string): StoredUser | null;
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

function readUsers(): StoredUser[] {
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]): void {
  try {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    // ignore write failures (e.g. storage disabled)
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
