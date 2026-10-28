import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { SESSION_COOKIE, SESSION_MAX_AGE } from "./session-config";
import { findUserById, type Role } from "./users";

export type SessionUser = { id: string; name: string; role: Role };

function secretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET is missing or shorter than 32 characters");
  }
  return new TextEncoder().encode(secret);
}

// Steps 3-4 of the six: create the session and set it as a flagged cookie.
export async function createSession(userId: string) {
  const token = await new SignJWT({}) // no role in the token: identity only
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + SESSION_MAX_AGE)
    .sign(secretKey());

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true, // scripts cannot read it
    secure: process.env.NODE_ENV === "production", // HTTPS only (production)
    sameSite: "lax", // not sent on cross-site POSTs
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

// Step 5: who is asking? One helper, used by pages, actions and handlers.
// cache() = verified once per request even if called many times.
export const getSession = cache(async (): Promise<SessionUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  // Outside the try: a missing secret should crash loudly,
  // not silently look like "everyone is signed out".
  const key = secretKey();

  try {
    // Pinning the algorithm blocks "alg: none" / algorithm-swap tricks.
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    if (!payload.sub) return null;

    // Signature OK and not expired. Does the user still exist?
    const user = findUserById(payload.sub);
    return user ? { id: user.id, name: user.name, role: user.role } : null;
  } catch {
    return null; // bad signature, expired, malformed
  }
});

// Step 6: sign out.
export async function deleteSession() {
  (await cookies()).delete(SESSION_COOKIE);
}