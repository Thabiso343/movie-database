import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import { auth } from "@/lib/auth/auth";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Movie Database",
  description: "Discover, search, and track movies.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Reading the session here, once, on the server -- rather than in Navbar
  // itself -- is what lets Navbar stay a plain Client Component that takes
  // session as a prop instead of needing a <SessionProvider> wrapping the
  // whole app and a useSession() hook (which would mean an extra client-side
  // fetch just to find out who's signed in, on every single page).
  const session = await auth();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-neutral-950 text-neutral-50">
        <Navbar session={session} />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
