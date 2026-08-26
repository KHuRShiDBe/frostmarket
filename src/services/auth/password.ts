/**
 * Demo-only password hashing via the browser's built-in Web Crypto API — no
 * external dependency, but also NOT a substitute for a real backend auth
 * flow (proper salting/peppering, rate limiting, etc. belong on a server).
 * This exists purely so raw passwords are never the thing stored/compared.
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`frostmarket-demo:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
