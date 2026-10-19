"use client";
import useSWR from "swr";
import { signOut } from "@/actions/auth";
type Me = { user: { name: string; role: string } | null };
const fetcher = async (url: string): Promise<Me> => { const response = await fetch(url, { credentials: "same-origin" }); if (!response.ok) throw new Error("Unable to load account"); return response.json() as Promise<Me>; };
export function UserNav() {
 const { data } = useSWR<Me>("/api/me", fetcher, { revalidateOnFocus: false, shouldRetryOnError: false });
 return <nav aria-label="Main navigation" className="flex items-center gap-4 text-sm"><a href="/menu">Menu</a>{data?.user ? <><a href="/orders">Orders</a><a href="/account">{data.user.name}</a>{data.user.role === "staff" && <a href="/kitchen">Kitchen</a>}<form action={signOut}><button className="rounded bg-slate-900 px-3 py-2 text-white" type="submit">Sign out</button></form></> : <><a href="/signin">Sign in</a><a className="rounded bg-amber-500 px-3 py-2 font-semibold" href="/signup">Create account</a></>}</nav>;
}
