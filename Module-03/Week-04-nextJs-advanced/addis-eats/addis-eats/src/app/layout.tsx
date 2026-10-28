// app/layout.tsx  (REPLACE)
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Providers from "@/components/Providers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Addis Eats", template: "%s · Addis Eats" },
  description: "Order Ethiopian food from Addis Ababa.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {/* Providers is a client component, but it only receives server output as children. */}
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}