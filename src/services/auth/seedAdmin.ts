import type { StoredUser } from "./types";

/**
 * One demo admin account so /admin is reachable without a real backend or a
 * hand-rolled second auth system. This is a portfolio demo, not a real
 * secret: the password below is never stored anywhere — only its SHA-256
 * hash is (via the same `hashPassword("frostmarket-demo:" + password)`
 * scheme every other account uses, see ./password.ts). The plaintext exists
 * only in this comment and in the discoverable hint shown on the login page.
 *
 * Demo admin login:
 *   email:    admin@frostmarket.demo
 *   password: Admin123!
 *
 * (Hash below = sha256("frostmarket-demo:Admin123!"), precomputed offline —
 * regenerate it the same way if this password ever changes.)
 */
export const SEED_ADMIN_EMAIL = "admin@frostmarket.demo";
/** Display-only, for the "demo admin" hint on the login page — never used to authenticate (see hash below). */
export const SEED_ADMIN_DEMO_PASSWORD = "Admin123!";

export const SEED_ADMIN_USER: StoredUser = {
  id: "user_seed_admin",
  firstName: "Frost",
  lastName: "Admin",
  email: SEED_ADMIN_EMAIL,
  phone: "",
  createdAt: "2026-01-01T00:00:00.000Z",
  role: "admin",
  passwordHash: "fa39ede511054cb9f939eb869274e046307f26679c718a4df86a06ecd100752e",
};
