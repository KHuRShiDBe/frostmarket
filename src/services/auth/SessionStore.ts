/**
 * Storage seam for "who is currently signed in". Kept separate from
 * UserRepository so the concepts of "user record" and "active session" don't
 * get tangled — a real backend would replace this with an HTTP-only cookie
 * or bearer token, not localStorage.
 */
export interface SessionStore {
  getUserId(): string | null;
  /** `persist: true` survives browser restarts (Remember Me); `false` lasts for the tab only. */
  setUserId(id: string, persist: boolean): void;
  clear(): void;
}

const SESSION_KEY = "frostmarket:session";

export class BrowserSessionStore implements SessionStore {
  getUserId(): string | null {
    try {
      return window.localStorage.getItem(SESSION_KEY) ?? window.sessionStorage.getItem(SESSION_KEY);
    } catch {
      return null;
    }
  }

  setUserId(id: string, persist: boolean): void {
    try {
      if (persist) {
        window.localStorage.setItem(SESSION_KEY, id);
        window.sessionStorage.removeItem(SESSION_KEY);
      } else {
        window.sessionStorage.setItem(SESSION_KEY, id);
        window.localStorage.removeItem(SESSION_KEY);
      }
    } catch {
      // ignore write failures (e.g. storage disabled)
    }
  }

  clear(): void {
    try {
      window.localStorage.removeItem(SESSION_KEY);
      window.sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore write failures
    }
  }
}
