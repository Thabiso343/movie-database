import Image from "next/image";
import { UserRound } from "lucide-react";
import { auth } from "@/lib/auth/auth";
import { getMovieReviews, getUserReview } from "@/lib/actions/reviews";
import ReviewForm from "./ReviewForm";

interface ReviewsSectionProps {
  movieId: number;
}

/**
 * A Server Component, not a Client one -- it does its own data fetching
 * (auth + both review queries) rather than receiving props from the
 * movie page. That keeps movies/[id]/page.tsx from growing yet another
 * few fields in its already-large Promise.all, and means this section
 * could be dropped onto any other page unchanged.
 */
export default async function ReviewsSection({ movieId }: ReviewsSectionProps) {
  const session = await auth();

  const [reviews, userReview] = await Promise.all([
    getMovieReviews(movieId),
    getUserReview(movieId),
  ]);

  return (
    <section className="mt-12 border-t border-neutral-800 pt-8">
      <h2 className="text-xl font-bold text-white">Reviews</h2>

      {session ? (
        <ReviewForm movieId={movieId} initialBody={userReview?.body ?? null} />
      ) : (
        <p className="mt-3 text-sm text-neutral-400">
          <a
            href="/api/auth/signin/github"
            className="text-white underline hover:no-underline"
          >
            Sign in
          </a>{" "}
          to write a review.
        </p>
      )}

      <div className="mt-8 space-y-6">
        {reviews.length === 0 && (
          <p className="text-sm text-neutral-500">
            No reviews yet — be the first to write one.
          </p>
        )}

        {reviews.map((review) => (
          <article
            key={review.id}
            className="border-b border-neutral-800 pb-6 last:border-0"
          >
            <div className="flex items-center gap-3">
              {review.user.image ? (
                <Image
                  src={review.user.image}
                  alt=""
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800">
                  <UserRound size={16} className="text-neutral-500" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-white">
                  {review.user.name ?? "Anonymous"}
                </p>
                <p className="text-xs text-neutral-500">
                  {review.updatedAt.toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                  {review.updatedAt.getTime() !== review.createdAt.getTime() &&
                    " (edited)"}
                </p>
              </div>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-neutral-300">
              {review.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
