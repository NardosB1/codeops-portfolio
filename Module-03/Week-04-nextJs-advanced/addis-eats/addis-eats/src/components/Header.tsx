"use client"; // asks /api/session who is signed in; cart count; sign-out button

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";
import { signOut } from "@/app/actions";
import { useCart } from "@/components/Providers";

type SessionResponse = { user: { name: string; role: "customer" | "staff" } | null };

const fetcher = async (url: string): Promise<SessionResponse> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Could not load session");
  return res.json();
};

export default function AuthNav() {
  const pathname = usePathname();
  const { count, ready } = useCart();
  const { data, isLoading, mutate } = useSWR("/api/session", fetcher);

  // Re-check after every navigation (e.g. right after signing in or out).
  useEffect(() => { mutate(); }, [pathname, mutate]);

  const showCount = ready && count > 0;
  const cartLink = (
    <Link href="/cart" className="underline" aria-label={showCount ? `Cart, ${count} items` : "Cart"}>
      Cart{showCount ? ` (${count})` : ""}
    </Link>
  );

  if (isLoading || !data) {
    return <div className="flex items-center gap-4">{cartLink}<span className="inline-block h-6 w-32" aria-hidden /></div>;
  }

  if (!data.user) {
    return (
      <div className="flex items-center gap-4">
        {cartLink}
        <Link href="/signin" className="font-medium underline">Sign in</Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {cartLink}
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