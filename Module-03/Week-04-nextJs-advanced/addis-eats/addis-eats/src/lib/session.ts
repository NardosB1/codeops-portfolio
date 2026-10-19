import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";

export const SESSION_COOKIE = "addis_eats_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
type SessionPayload = { userId: string; issuedAt: number; expiresAt: number; nonce: string };
function secret(): string {
  const value = process.env.SESSION_SECRET;
  if (!value || Buffer.byteLength(value) < 32) throw new Error("SESSION_SECRET must be set to at least 32 bytes.");
  return value;
}
function sign(value: string): string { return createHmac("sha256", secret()).update(value).digest("base64url"); }
function safeEqual(a: string, b: string): boolean {
  const aa = Buffer.from(a); const bb = Buffer.from(b);
  return aa.length === bb.length && timingSafeEqual(aa, bb);
}
export function createSessionToken(userId: string, now = Date.now()): string {
  const payload: SessionPayload = { userId, issuedAt: now, expiresAt: now + SESSION_TTL_SECONDS * 1000, nonce: randomBytes(16).toString("base64url") };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}
export function verifySessionToken(token: string, now = Date.now()): SessionPayload | null {
  const parts = token.split(".");
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  if (!safeEqual(sign(parts[0]), parts[1])) return null;
  try {
    const value = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8")) as Partial<SessionPayload>;
    if (typeof value.userId !== "string" || !/^[0-9a-f-]{36}$/i.test(value.userId)) return null;
    if (typeof value.issuedAt !== "number" || typeof value.expiresAt !== "number" || typeof value.nonce !== "string") return null;
    if (value.issuedAt > now + 60_000 || value.expiresAt <= now || value.expiresAt - value.issuedAt > SESSION_TTL_SECONDS * 1000) return null;
    return value as SessionPayload;
  } catch { return null; }
}
export async function setSession(userId: string): Promise<void> {
  const token = createSessionToken(userId);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production" || process.env.COOKIE_SECURE === "true", sameSite: "lax", path: "/", maxAge: SESSION_TTL_SECONDS });
}
export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production" || process.env.COOKIE_SECURE === "true", sameSite: "lax", path: "/", maxAge: 0 });
}
export type CurrentUser = { id: string; name: string; email: string; phone: string; role: "customer" | "staff" };
export async function getSession(): Promise<{ userId: string; user: CurrentUser } | null> {
  const jar = await cookies(); const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = verifySessionToken(token); if (!payload) return null;
  const rows = await sql`SELECT id, name, email, phone, role FROM users WHERE id = ${payload.userId} LIMIT 1`;
  const user = rows[0] as CurrentUser | undefined;
  if (!user) return null;
  return { userId: user.id, user };
}
