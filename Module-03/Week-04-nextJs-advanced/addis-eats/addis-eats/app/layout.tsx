import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Providers from "@/components/Providers";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

// next/font self-hosts the font files at build time: no render-blocking request to Google, no layout shift.
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const viewport: Viewport = { themeColor: "#FFF8E7" };
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL), // makes every relative canonical / og:image absolute
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: SITE_NAME, description: SITE_DESCRIPTION },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {/* Providers is a client component, but it only receives server output as children. */}
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-10 focus:rounded focus:bg-white focus:px-3 focus:py-2"
          >
            Skip to content
          </a>
          <Header />
          {children}
          <footer className="mt-auto border-t border-honey-300 bg-honey-100 py-6 text-center text-sm text-gray-600">
            Addis Eats: a Next.js capstone project. Demo data only.
          </footer>
        </Providers>
      </body>
    </html>
  );
}
