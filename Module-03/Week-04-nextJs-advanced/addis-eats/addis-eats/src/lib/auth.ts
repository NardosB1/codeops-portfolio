import "server-only";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
export async function requireUser() {
  const session = await getSession();
  if (!session) redirect("/signin");
  return session;
}
export async function requireStaff() {
  const session = await requireUser();
  if (session.user.role !== "staff") redirect("/");
  return session;
}
