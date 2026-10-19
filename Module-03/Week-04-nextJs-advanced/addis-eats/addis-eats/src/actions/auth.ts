"use server";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { clearSession, setSession } from "@/lib/session";
import { safeNext, signInSchema, signUpSchema } from "@/lib/validation";
export type AuthState = { error?: string };
export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = signUpSchema.safeParse({ name: formData.get("name"), email: formData.get("email"), phone: formData.get("phone"), password: formData.get("password") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check your details." };
  const { name, email, phone, password } = parsed.data;
  try {
    const passwordHash = await hashPassword(password);
    const rows = await sql`INSERT INTO users (name,email,phone,password_hash) VALUES (${name},${email},${phone},${passwordHash}) RETURNING id`;
    const id = rows[0]?.id as string | undefined;
    if (!id) return { error: "Could not create your account." };
    await setSession(id);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "";
    if (msg.includes("users_email_key") || msg.includes("users_phone_key") || msg.includes("duplicate key")) return { error: "An account already uses that email or phone." };
    console.error("signUp failed", error); return { error: "Account creation failed. Please try again." };
  }
  redirect("/account");
}
export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = signInSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { error: "Enter a valid email and password." };
  const rows = await sql`SELECT id, password_hash FROM users WHERE email = ${parsed.data.email} LIMIT 1`;
  const user = rows[0] as { id: string; password_hash: string } | undefined;
  if (!user || !(await verifyPassword(parsed.data.password, user.password_hash))) return { error: "Email or password is incorrect." };
  await setSession(user.id);
  redirect(safeNext(typeof formData.get("next") === "string" ? String(formData.get("next")) : null));
}
export async function signOut(): Promise<void> { await clearSession(); redirect("/"); }
