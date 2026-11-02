// Plain constants (no server-only import) so proxy.ts and lib/session.ts share one name.
export const SESSION_COOKIE = "session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, in seconds
