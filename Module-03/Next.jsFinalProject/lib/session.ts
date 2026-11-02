import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { SESSION_COOKIE, SESSION_MAX_AGE } from "./session-config";
import { findUserById, type Role } from "./users";

export type SessionUser = { id: string; name: string; role: Role };

function secretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    // Fail loudly: a missing secret must never look like "everyone is signed out".
    throw new Error("SESSION_SECRET is missing or shorter than 32 characters.");
  }
  return new TextEncoder().encode(secret);
}

// The token carries only the user id (`sub`). Name and role are looked up on
// every request, so changing a role takes effect immediately.
export async function createSession(userId: string): Promise<void> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(secretKey());

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true, // JavaScript on the page cannot read it (limits XSS damage)
    secure: process.env.NODE_ENV === "production", // HTTPS only when deployed
    sameSite: "lax", // not sent on cross-site POSTs (limits CSRF)
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

// Verifies signature + expiry + that the user still exists. Memoised per request
// with React cache(), so a layout and a page asking twice cost one verification.
export const getSession = cache(async (): Promise<SessionUser | null> => {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const key = secretKey(); // outside the try on purpose (see above)
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] }); // algorithm pinned
    if (typeof payload.sub !== "string") return null;
    const user = findUserById(payload.sub);
    return user ? { id: user.id, name: user.name, role: user.role } : null;
  } catch {
    return null; // bad signature, expired, malformed
  }
});

export async function deleteSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}
