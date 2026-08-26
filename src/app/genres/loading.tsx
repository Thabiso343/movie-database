export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="h-8 w-32 animate-pulse rounded bg-neutral-800" />
      <div className="mt-8 flex flex-wrap gap-3" aria-busy="true" aria-label="Loading genres">
        {Array.from({ length: 19 }).map((_, index) => (
          <div
            key={index}
            className="h-10 w-24 animate-pulse rounded-full bg-neutral-800"
          />
        ))}
      </div>
    </div>
  );
}
