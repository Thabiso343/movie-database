"use client";

import Image from "next/image";
import { signIn, signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { LogIn, LogOut } from "lucide-react";

interface AuthButtonProps {
  session: Session | null;
}

/**
 * This is a Client Component because signing in/out are onClick handlers --
 * but notice it never fetches the session itself (no useSession() hook, no
 * <SessionProvider> wrapping the app). The session is handed to it as a
 * plain prop, computed once on the server in layout.tsx via `await auth()`.
 * That's a deliberate choice: it avoids an extra client-side round trip
 * just to find out who's signed in, since the server already knows by the
 * time it renders the page.
 */
export default function AuthButton({ session }: AuthButtonProps) {
  if (!session?.user) {
    return (
      <button
        type="button"
        onClick={() => signIn("github")}
        className="flex items-center gap-2 rounded-md bg-neutral-800 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
      >
        <LogIn size={16} />
        Sign in with GitHub
      </button>
    );
  }

  const { name, image } = session.user;

  return (
    <div className="flex items-center gap-3">
      {image ? (
        <Image
          src={image}
          alt={name ?? "Your avatar"}
          width={28}
          height={28}
          className="rounded-full"
        />
      ) : null}
      <button
        type="button"
        onClick={() => signOut()}
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-neutral-400 transition-colors hover:bg-neutral-900 hover:text-white"
        aria-label="Sign out"
      >
        <LogOut size={16} />
        <span className="hidden sm:inline">Sign out</span>
      </button>
    </div>
  );
}
