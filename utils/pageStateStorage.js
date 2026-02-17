const STORAGE_PREFIX = "duel-nexus:filters:";

export function getStorageKey(userId) {
  return `${STORAGE_PREFIX}${userId ?? "guest"}`;
}

export function loadPageState(userId) {
  try {
    const key = getStorageKey(userId);
    const raw = typeof window !== "undefined" ? localStorage.getItem(key) : null;
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function savePageState(userId, state) {
  try {
    const key = getStorageKey(userId);
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(state));
    }
  } catch { }
}

/**
 * Clears stored page state for a user (e.g. on logout).
 * Call with the current user id before signOut().
 */
export function clearPageState(userId) {
  try {
    const key = getStorageKey(userId);
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  } catch { }
}
