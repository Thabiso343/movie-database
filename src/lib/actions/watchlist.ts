"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

/**
 * Whether the signed-in user (if any) already has this movie on their
 * watchlist. Used to render the button in the right starting state --
 * without this, every movie page would render "Add to watchlist" even for
 * movies already saved, until the user clicked and got confused.
 */
export async function getWatchlistStatus(movieId: number): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) return false;

  const entry = await prisma.watchlist.findUnique({
    where: { userId_movieId: { userId: session.user.id, movieId } },
    select: { id: true },
  });
  return entry !== null;
}

/**
 * Adds the movie if it's not already on the watchlist, removes it if it
 * is. This is a Server Action (the "use server" directive at the top of
 * the file makes every export here callable directly from a Client
 * Component, without us hand-writing an API route or a fetch call).
 *
 * The proxy.ts guard only protects the *page* at /watchlist -- per Next's
 * own guidance, a Server Action is reachable independently of the page
 * that renders its button, so this action re-checks auth itself rather
 * than trusting that only signed-in users could have gotten here.
 */
export async function toggleWatchlist(
  movieId: number,
): Promise<{ isInWatchlist: boolean }> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be signed in to use your watchlist.");
  }
  const userId = session.user.id;

  const existing = await prisma.watchlist.findUnique({
    where: { userId_movieId: { userId, movieId } },
    select: { id: true },
  });

  if (existing) {
    await prisma.watchlist.delete({ where: { id: existing.id } });
  } else {
    await prisma.watchlist.create({ data: { userId, movieId } });
  }

  // Tell Next.js that cached data for these two pages is now stale, so the
  // next time either is visited it re-fetches from the database instead of
  // serving a stale "not in watchlist" (or "in watchlist") snapshot.
  revalidatePath(`/movies/${movieId}`);
  revalidatePath("/watchlist");

  return { isInWatchlist: !existing };
}
