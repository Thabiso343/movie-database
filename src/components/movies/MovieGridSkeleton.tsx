/** Shared loading placeholder for any page rendering a movie grid. */
export default function MovieGridSkeleton({
  count = 10,
}: {
  count?: number;
}) {
  return (
    <div
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
      aria-busy="true"
      aria-label="Loading movies"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="aspect-2/3 animate-pulse rounded-lg bg-neutral-800"
        />
      ))}
    </div>
  );
}
