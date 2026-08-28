"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

/** The signed-in user's own rating for this movie, or null if unrated / signed out. */
export async function getUserRating(movieId: number): Promise<number | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const rating = await prisma.rating.findUnique({
    where: { userId_movieId: { userId: session.user.id, movieId } },
    select: { value: true },
  });
  return rating?.value ?? null;
}

/**
 * Sets (or replaces) the signed-in user's rating for a movie. This is an
 * upsert, not a create -- @@unique([userId, movieId]) on the Rating model
 * means a second rating from the same user for the same movie can't exist
 * as a separate row; re-rating always updates the one row that's already
 * there.
 */
export async function setRating(
  movieId: number,
  value: number,
): Promise<{ value: number }> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be signed in to rate movies.");
  }
  if (!Number.isInteger(value) || value < 1 || value > 10) {
    throw new Error("Rating must be a whole number from 1 to 10.");
  }
  const userId = session.user.id;

  await prisma.rating.upsert({
    where: { userId_movieId: { userId, movieId } },
    update: { value },
    create: { userId, movieId, value },
  });

  revalidatePath(`/movies/${movieId}`);

  return { value };
}

/** Removes the signed-in user's rating for a movie entirely. */
export async function clearRating(movieId: number): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be signed in to rate movies.");
  }
  const userId = session.user.id;

  // deleteMany (not delete) because there's nothing to do -- and nothing
  // to error about -- if the user had no rating for this movie to begin
  // with; delete() would throw on a missing row, deleteMany() just does
  // zero deletions silently.
  await prisma.rating.deleteMany({ where: { userId, movieId } });

  revalidatePath(`/movies/${movieId}`);
}
