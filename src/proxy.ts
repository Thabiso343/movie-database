import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";

/**
 * This file replaces what used to be called `middleware.ts` (Next.js 16
 * renamed the convention to `proxy.ts` -- same mechanism, new name). It
 * runs on the Node.js runtime by default here, which matters: it's what
 * lets us safely use our *full* `auth()` config below, Prisma adapter and
 * all, since Prisma needs Node.js APIs that wouldn't exist in the older
 * Edge runtime older Auth.js guides warn you to route around.
 *
 * Wrapping our own function with `auth(...)` (rather than just exporting
 * `auth` directly) augments the incoming request with `req.auth` --
 * the current session, or null -- so we can redirect signed-out visitors
 * before the /watchlist page itself ever starts rendering.
 */
export default auth((req) => {
  const isSignedIn = !!req.auth;

  if (!isSignedIn) {
    const signInUrl = new URL("/api/auth/signin/github", req.url);
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }
});

export const config = {
  // Only /watchlist (and any future sub-paths under it) goes through this
  // check -- everything else on the site stays public.
  matcher: ["/watchlist/:path*"],
};
