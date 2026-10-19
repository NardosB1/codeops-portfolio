import { SignInForm } from "@/components/signin-form";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) { if (await getSession()) redirect("/account"); const params = await searchParams; return <section className="mx-auto max-w-md rounded-2xl border bg-white p-7"><h1 className="text-2xl font-bold">Welcome back</h1><p className="mt-2 text-sm text-slate-600">Sign in to manage your orders.</p><SignInForm next={params.next} /><p className="mt-5 text-sm">New here? <a className="font-semibold underline" href="/signup">Create an account</a></p></section>; }
