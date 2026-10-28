import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { safeNext } from "@/lib/safe-next";
import SignInForm from "./SignInForm";

export const metadata = { title: "Sign in" };

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const { next } = await searchParams;
  // Sanitised here (what we render) AND again in the action (what we trust).
  const safe = safeNext(Array.isArray(next) ? next[0] : next);

  if (await getSession()) redirect(safe); // already signed in

  return (
    <main className="mx-auto w-full max-w-sm px-4 py-12">
      <h1 className="mb-6 text-2xl font-semibold">Sign in</h1>
      <SignInForm next={safe} />
    </main>
  );
}