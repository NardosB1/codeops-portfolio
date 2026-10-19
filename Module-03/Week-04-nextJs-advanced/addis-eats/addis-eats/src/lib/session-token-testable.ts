// Pure token functions are isolated so smoke tests do not import cookies()/DB code.
import { createHmac, createHash, randomBytes, timingSafeEqual } from "node:crypto";
const TTL=604800000;
function key(){const v=process.env.SESSION_SECRET;if(!v||Buffer.byteLength(v)<32)throw new Error("SESSION_SECRET must be at least 32 bytes");return v;}
export function hashToken(token: string): string { return createHash("sha256").update(token).digest("hex"); }
function sig(s:string){return createHmac("sha256",key()).update(s).digest("base64url");}
export function createSessionToken(userId:string,now=Date.now()){const p={userId,issuedAt:now,expiresAt:now+TTL,nonce:randomBytes(16).toString("base64url")};const e=Buffer.from(JSON.stringify(p)).toString("base64url");return `${e}.${sig(e)}`;}
export function verifySessionToken(token:string,now=Date.now()):boolean{const a=token.split(".");if(a.length!==2)return false;const expected=sig(a[0]);const x=Buffer.from(expected),y=Buffer.from(a[1]);if(x.length!==y.length||!timingSafeEqual(x,y))return false;try{const p=JSON.parse(Buffer.from(a[0],"base64url").toString()) as {userId?:unknown;issuedAt?:unknown;expiresAt?:unknown;nonce?:unknown};return typeof p.userId==="string"&&/^[0-9a-f-]{36}$/i.test(p.userId)&&typeof p.issuedAt==="number"&&typeof p.expiresAt==="number"&&typeof p.nonce==="string"&&p.issuedAt<=now+60000&&p.expiresAt>now&&p.expiresAt-p.issuedAt<=TTL;}catch{return false;}}
