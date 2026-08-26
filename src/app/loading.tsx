export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="h-9 w-64 animate-pulse rounded bg-neutral-800" />
      <div className="mt-2 h-5 w-80 animate-pulse rounded bg-neutral-800" />
      {Array.from({ length: 3 }).map((_, rowIndex) => (
        <div key={rowIndex} className="mt-10">
          <div className="h-6 w-32 animate-pulse rounded bg-neutral-800" />
          <div className="mt-4 flex gap-4">
            {Array.from({ length: 6 }).map((_, cardIndex) => (
              <div
                key={cardIndex}
                className="aspect-2/3 w-36 shrink-0 animate-pulse rounded-lg bg-neutral-800 sm:w-40"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
