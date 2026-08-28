"use client";

import { useOptimistic, useState, useTransition } from "react";
import { Star, X } from "lucide-react";
import { clearRating, setRating } from "@/lib/actions/ratings";

interface RatingWidgetProps {
  movieId: number;
  initialRating: number | null;
  isSignedIn: boolean;
}

const STARS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function RatingWidget({
  movieId,
  initialRating,
  isSignedIn,
}: RatingWidgetProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticRating, setOptimisticRating] = useOptimistic(initialRating);
  // Separate from optimisticRating: this is purely a hover preview, never
  // sent anywhere -- it lets someone see "clicking here would rate it 7"
  // before they commit, without touching the real/optimistic value at all.
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  if (!isSignedIn) {
    return (
      <a
        href="/api/auth/signin/github"
        className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white"
      >
        <Star size={16} />
        Sign in to rate this movie
      </a>
    );
  }

  function handleRate(value: number) {
    startTransition(async () => {
      setOptimisticRating(value);
      await setRating(movieId, value);
    });
  }

  function handleClear() {
    startTransition(async () => {
      setOptimisticRating(null);
      await clearRating(movieId);
    });
  }

  // While hovering, preview that value; otherwise fall back to whatever's
  // actually (optimistically) set.
  const displayValue = hoveredValue ?? optimisticRating ?? 0;

  return (
    <div className="flex items-center gap-3">
      <div
        className="flex items-center gap-0.5"
        onMouseLeave={() => setHoveredValue(null)}
        role="radiogroup"
        aria-label="Your rating"
      >
        {STARS.map((value) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={optimisticRating === value}
            aria-label={`Rate ${value} out of 10`}
            disabled={isPending}
            onMouseEnter={() => setHoveredValue(value)}
            onClick={() => handleRate(value)}
            className="p-0.5 disabled:cursor-not-allowed"
          >
            <Star
              size={18}
              className={
                value <= displayValue
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-neutral-700"
              }
            />
          </button>
        ))}
      </div>

      {optimisticRating !== null && (
        <>
          <span className="text-sm text-neutral-400">
            You rated {optimisticRating}/10
          </span>
          <button
            type="button"
            onClick={handleClear}
            disabled={isPending}
            aria-label="Clear your rating"
            className="text-neutral-500 hover:text-white disabled:cursor-not-allowed"
          >
            <X size={14} />
          </button>
        </>
      )}
    </div>
  );
}
