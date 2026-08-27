"use client";

import { useOptimistic, useTransition } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toggleWatchlist } from "@/lib/actions/watchlist";

interface WatchlistButtonProps {
  movieId: number;
  initialIsInWatchlist: boolean;
  isSignedIn: boolean;
}

export default function WatchlistButton({
  movieId,
  initialIsInWatchlist,
  isSignedIn,
}: WatchlistButtonProps) {
  const [isPending, startTransition] = useTransition();

  // useOptimistic lets the button flip state the instant you click it,
  // instead of sitting there for the roundtrip to the database and back.
  // If the server action ever throws, React automatically rolls this
  // back to the last real value on the next render.
  const [optimisticIsInWatchlist, setOptimisticIsInWatchlist] = useOptimistic(
    initialIsInWatchlist,
  );

  if (!isSignedIn) {
    return (
      <a
        href="/api/auth/signin/github"
        className="inline-flex items-center gap-2 rounded-md border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-900 hover:text-white"
      >
        <Bookmark size={18} />
        Sign in to save
      </a>
    );
  }

  function handleClick() {
    startTransition(async () => {
      setOptimisticIsInWatchlist((current) => !current);
      await toggleWatchlist(movieId);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={optimisticIsInWatchlist}
      className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${
        optimisticIsInWatchlist
          ? "bg-white text-neutral-950 hover:bg-neutral-200"
          : "border border-neutral-700 text-neutral-300 hover:bg-neutral-900 hover:text-white"
      }`}
    >
      {optimisticIsInWatchlist ? (
        <BookmarkCheck size={18} />
      ) : (
        <Bookmark size={18} />
      )}
      {optimisticIsInWatchlist ? "In your watchlist" : "Add to watchlist"}
    </button>
  );
}
