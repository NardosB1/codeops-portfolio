// Edge-safe token verification for proxy.ts. Keep this file free of DB and Node-only imports.
import { createHmac, timingSafeEqual } from "node:crypto";
export const SESSION_COOKIE = "addis_eats_session";
function secret() { const value = process.env.SESSION_SECRET; if (!value || Buffer.byteLength(value) < 32) return null; return value; }
function equal(a: string,b: string) { const x=Buffer.from(a), y=Buffer.from(b); return x.length===y.length && timingSafeEqual(x,y); }
export function verifySessionToken(token: string, now=Date.now()): boolean {
 const parts=token.split("."); const key=secret(); if(parts.length!==2||!key) return false;
 const expected=createHmac("sha256",key).update(parts[0]).digest("base64url"); if(!equal(expected,parts[1])) return false;
 try { const p=JSON.parse(Buffer.from(parts[0],"base64url").toString("utf8")) as {userId?:unknown;issuedAt?:unknown;expiresAt?:unknown;nonce?:unknown}; return typeof p.userId==="string" && /^[0-9a-f-]{36}$/i.test(p.userId) && typeof p.issuedAt==="number" && typeof p.expiresAt==="number" && typeof p.nonce==="string" && p.issuedAt<=now+60000 && p.expiresAt>now && p.expiresAt-p.issuedAt<=604800000; } catch { return false; }
}
