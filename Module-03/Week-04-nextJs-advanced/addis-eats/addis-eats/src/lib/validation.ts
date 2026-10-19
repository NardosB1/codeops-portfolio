import { z } from "zod";
export function normalizePhone(input: string): string {
  const cleaned = input.trim().replace(/[\s().-]/g, "");
  if (cleaned.startsWith("+251")) return cleaned;
  if (cleaned.startsWith("251")) return `+${cleaned}`;
  if (/^0[79]\d{8}$/.test(cleaned)) return `+251${cleaned.slice(1)}`;
  return cleaned;
}
export function safeNext(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\") || /[\r\n]/.test(value)) return "/";
  try { const parsed = new URL(value, "https://addis-eats.invalid"); if (parsed.origin !== "https://addis-eats.invalid") return "/"; return `${parsed.pathname}${parsed.search}${parsed.hash}`; }
  catch { return "/"; }
}
export const signUpSchema = z.object({ name: z.string().trim().min(2).max(80), email: z.email().transform(v => v.toLowerCase()), phone: z.string().transform(normalizePhone).refine(v => /^\+251[79]\d{8}$/.test(v), "Use an Ethiopian mobile number."), password: z.string().min(10).max(72) });
export const signInSchema = z.object({ email: z.email().transform(v => v.toLowerCase()), password: z.string().min(1).max(72) });
export const placeOrderSchema = z.object({ items: z.array(z.object({ dishId: z.uuid(), quantity: z.number().int().min(1).max(20) })).min(1).max(30) });
export const orderIdSchema = z.uuid();
export const statusSchema = z.enum(["placed", "preparing", "ready", "completed", "cancelled"]);
