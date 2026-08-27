"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import type { Session } from "next-auth";
import NavSearchForm from "@/components/navigation/NavSearchForm";
import AuthButton from "@/components/auth/AuthButton";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/popular", label: "Popular" },
  { href: "/top-rated", label: "Top Rated" },
  { href: "/upcoming", label: "Upcoming" },
  { href: "/genres", label: "Genres" },
];

interface NavbarProps {
  session: Session | null;
}

export default function Navbar({ session }: NavbarProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Signed-out visitors never see a link to a page proxy.ts would just
  // bounce them out of anyway -- building the list conditionally here is
  // simpler than a bunch of scattered {session && ...} checks below.
  const navLinks = session
    ? [...NAV_LINKS, { href: "/watchlist", label: "Watchlist" }]
    : NAV_LINKS;

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold tracking-tight text-white">
          Movie<span className="text-red-500">DB</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-neutral-800 text-white"
                      : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-4 md:flex">
          <NavSearchForm />
          <AuthButton session={session} />
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="rounded-md p-2 text-neutral-300 hover:bg-neutral-900 hover:text-white md:hidden"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu panel */}
      {isMenuOpen && (
        <div className="space-y-3 border-t border-neutral-800 px-4 py-3 md:hidden">
          <NavSearchForm fullWidth onSubmitQuery={() => setIsMenuOpen(false)} />
          <div className="border-b border-neutral-800 pb-3">
            <AuthButton session={session} />
          </div>
          <ul className="space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block rounded-md px-3 py-2 text-base font-medium ${
                    isActive
                      ? "bg-neutral-800 text-white"
                      : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
          </ul>
        </div>
      )}
    </header>
  );
}
