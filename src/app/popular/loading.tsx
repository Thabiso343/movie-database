import MovieGridSkeleton from "@/components/movies/MovieGridSkeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="h-8 w-56 animate-pulse rounded bg-neutral-800" />
      <div className="mt-8">
        <MovieGridSkeleton />
      </div>
    </div>
  );
}
