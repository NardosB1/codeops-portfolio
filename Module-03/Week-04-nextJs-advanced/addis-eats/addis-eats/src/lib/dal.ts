import "server-only";
import { notFound, redirect } from "next/navigation";
import { getSession } from "./session";

// Layer 2 helper: used at the top of every private page.
export async function requireUser(returnTo: string) {
  const user = await getSession();
  if (!user) redirect(`/signin?next=${encodeURIComponent(returnTo)}`);
  return user;
}

// Staff-only. A non-staff user gets a 404, not a 403, so the route's
// existence isn't revealed. The role is read from the server's user record.
export async function requireStaff(returnTo: string) {
  const user = await requireUser(returnTo);
  if (user.role !== "staff") notFound();
  return user;
}