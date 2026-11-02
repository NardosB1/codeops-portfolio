import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { safeNext } from "@/lib/safe-next";
import { getSession } from "@/lib/session";
import SignInForm from "./SignInForm";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const sp = await searchParams;
  const rawNext = Array.isArray(sp.next) ? sp.next[0] : sp.next;
  const next = safeNext(rawNext); // sanitised here AND again in the signIn action

  if (await getSession()) redirect(next); // already signed in

  return (
    <main id="main" className="mx-auto w-full max-w-sm px-4 py-12">
      <h1 className="mb-4 text-2xl font-semibold">Sign in</h1>
      <SignInForm next={next} />
      <details className="mt-6 text-sm">
        <summary className="cursor-pointer underline">Demo accounts</summary>
        <ul className="mt-2 space-y-1">
          <li>0911000001: Almaz (customer)</li>
          <li>0911000002: Dawit (customer)</li>
          <li>0911000003: Selam (kitchen staff)</li>
          <li>
            Password for all: <code>addis2026</code>
          </li>
        </ul>
      </details>
    </main>
  );
}
