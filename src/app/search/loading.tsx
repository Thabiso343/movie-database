export default function Loading() {
  return (
    <div
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
      aria-busy="true"
      aria-label="Loading search results"
    >
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className="aspect-2/3 animate-pulse rounded-lg bg-neutral-800"
        />
      ))}
    </div>
  );
}
