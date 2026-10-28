"use client"; // needs the browser: it asks /api/session who is signed in

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";
import { signOut } from "@/app/actions";

type SessionResponse = { user: { name: string; role: "customer" | "staff" } | null };

const fetcher = async (url: string): Promise<SessionResponse> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Could not load session");
  return res.json();
};

export default function AuthNav() {
  const pathname = usePathname();
  const { data, isLoading, mutate } = useSWR("/api/session", fetcher);

  // Re-check after every navigation (e.g. right after signing in or out).
  useEffect(() => {
    mutate();
  }, [pathname, mutate]);

  // Reserve the space so the header doesn't jump (layout shift).
  if (isLoading || !data) return <div className="h-6 w-40" aria-hidden />;

  if (!data.user) {
    return <Link href="/signin" className="font-medium underline">Sign in</Link>;
  }

  return (
    <div className="flex items-center gap-4">
      <Link href="/orders" className="underline">Orders</Link>
      {/* UI only. The real check is on the server (requireStaff). */}
      {data.user.role === "staff" && <Link href="/kitchen" className="underline">Kitchen</Link>}
      <span className="text-sm text-gray-600">{data.user.name}</span>
      <form action={signOut} onSubmit={() => mutate({ user: null }, { revalidate: false })}>
        <button type="submit" className="underline">Sign out</button>
      </form>
    </div>
  );
}