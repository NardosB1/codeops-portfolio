import "server-only";
import { notFound, redirect } from "next/navigation";
import { getSession, type SessionUser } from "./session";

// LAYER 2 helpers: call at the top of every private page.

export async function requireUser(returnTo: string): Promise<SessionUser> {
  const user = await getSession();
  if (!user) redirect(`/signin?next=${encodeURIComponent(returnTo)}`);
  return user;
}

// Staff pages answer "not found" to everyone else, so the route's existence is not advertised.
export async function requireStaff(returnTo: string): Promise<SessionUser> {
  const user = await requireUser(returnTo);
  if (user.role !== "staff") notFound();
  return user;
}
