import MovieGridSkeleton from "@/components/movies/MovieGridSkeleton";

export default function WatchlistLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 h-9 w-48 animate-pulse rounded bg-neutral-800" />
      <MovieGridSkeleton />
    </div>
  );
}
