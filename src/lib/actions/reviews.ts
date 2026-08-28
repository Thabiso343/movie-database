"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

export interface MovieReview {
  id: string;
  userId: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    name: string | null;
    image: string | null;
  };
}

/**
 * Every review left on a movie, most recently edited first. Deliberately
 * has no auth check -- reviews are public content, like a comment
 * section, not private data scoped to one user (contrast with
 * getUserRating/getWatchlistStatus, which only ever answer for the
 * signed-in user).
 */
export async function getMovieReviews(movieId: number): Promise<MovieReview[]> {
  return prisma.review.findMany({
    where: { movieId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      userId: true,
      body: true,
      createdAt: true,
      updatedAt: true,
      user: { select: { name: true, image: true } },
    },
  });
}

/** The signed-in user's own review for this movie, or null. */
export async function getUserReview(
  movieId: number,
): Promise<{ body: string } | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  return prisma.review.findUnique({
    where: { userId_movieId: { userId: session.user.id, movieId } },
    select: { body: true },
  });
}

const MAX_REVIEW_LENGTH = 2000;

/**
 * Creates or replaces the signed-in user's review for this movie -- an
 * upsert, same reasoning as setRating: @@unique([userId, movieId]) means
 * there's exactly one row per user per movie, so "writing a review" and
 * "editing your existing review" are the same operation as far as the
 * database is concerned.
 */
export async function upsertReview(movieId: number, body: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be signed in to write a review.");
  }

  const trimmed = body.trim();
  if (trimmed.length === 0) {
    throw new Error("Review can't be empty.");
  }
  if (trimmed.length > MAX_REVIEW_LENGTH) {
    throw new Error(`Review must be ${MAX_REVIEW_LENGTH} characters or fewer.`);
  }

  const userId = session.user.id;

  await prisma.review.upsert({
    where: { userId_movieId: { userId, movieId } },
    update: { body: trimmed },
    create: { userId, movieId, body: trimmed },
  });

  // Revalidating here is what makes the reviews list on the page (a
  // Server Component) show the new/edited review right after this action
  // resolves, with no client-side fetch of our own to write.
  revalidatePath(`/movies/${movieId}`);
}

/** Deletes the signed-in user's own review for this movie. */
export async function deleteReview(movieId: number): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("You must be signed in to delete a review.");
  }

  await prisma.review.deleteMany({
    where: { userId: session.user.id, movieId },
  });

  revalidatePath(`/movies/${movieId}`);
}
