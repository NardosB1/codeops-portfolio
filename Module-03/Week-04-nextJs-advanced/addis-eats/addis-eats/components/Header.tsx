import Link from "next/link";
import AuthNav from "@/components/AuthNav";

// Server component. Links only, no cookies (see AuthNav).
export default function Header() {
  return (
    <header className="border-b border-honey-300 bg-honey-100">
      <nav aria-label="Main" className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-lake-800">
            <span aria-hidden className="inline-block size-3 rounded-full bg-honey-400 ring-2 ring-lake-800" />
            Addis Eats
          </Link>
          <Link href="/menu" className="font-medium underline underline-offset-4">
            Menu
          </Link>
        </div>
        <AuthNav />
      </nav>
    </header>
  );
}