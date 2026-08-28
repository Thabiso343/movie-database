"use client";

import { useState, useTransition, type FormEvent } from "react";
import { deleteReview, upsertReview } from "@/lib/actions/reviews";

interface ReviewFormProps {
  movieId: number;
  initialBody: string | null;
}

const MAX_LENGTH = 2000;

export default function ReviewForm({ movieId, initialBody }: ReviewFormProps) {
  const [body, setBody] = useState(initialBody ?? "");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const hasExistingReview = initialBody !== null;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        await upsertReview(movieId, body);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      try {
        await deleteReview(movieId);
        setBody("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        maxLength={MAX_LENGTH}
        rows={4}
        placeholder="What did you think of this movie?"
        className="w-full resize-y rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-neutral-500 focus:outline-none"
      />

      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-neutral-500">
          {body.length}/{MAX_LENGTH}
        </span>
        <div className="flex items-center gap-3">
          {hasExistingReview && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="text-sm text-neutral-400 hover:text-red-400 disabled:cursor-not-allowed"
            >
              Delete review
            </button>
          )}
          <button
            type="submit"
            disabled={isPending || body.trim().length === 0}
            className="rounded-md bg-white px-4 py-1.5 text-sm font-medium text-neutral-950 transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {hasExistingReview ? "Update review" : "Post review"}
          </button>
        </div>
      </div>

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </form>
  );
}
