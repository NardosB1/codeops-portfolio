import { SignUpForm } from "@/components/signup-form";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
export default async function SignUpPage() { if (await getSession()) redirect("/account"); return <section className="mx-auto max-w-md rounded-2xl border bg-white p-7"><h1 className="text-2xl font-bold">Create your account</h1><p className="mt-2 text-sm text-slate-600">One account for your Addis Eats orders.</p><SignUpForm /></section>; }
