import MovieCard from "@/components/movies/MovieCard";
import MoviePagination from "@/components/movies/MoviePagination";
import { searchMovies } from "@/lib/tmdb/endpoints";

type SearchPageProps = {
  searchParams: Promise<{ q?: string; page?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, page } = await searchParams;
  const query = q?.trim() ?? "";
  const currentPage = Math.max(1, Number(page) || 1);

  if (!query) {
    return (
      <p className="text-neutral-400">Start typing to search for a movie.</p>
    );
  }

  let results;
  try {
    results = await searchMovies(query, currentPage);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong.";
    return (
      <div className="rounded-lg border border-red-900 bg-red-950/40 p-4 text-sm text-red-200">
        <p className="font-medium">Search failed.</p>
        <p className="mt-1 text-red-300">{message}</p>
      </div>
    );
  }

  if (results.movies.length === 0) {
    return <p className="text-neutral-400">No results for &quot;{query}&quot;.</p>;
  }

  return (
    <>
      <p className="mb-4 text-sm text-neutral-400">
        {results.totalResults.toLocaleString()} result
        {results.totalResults === 1 ? "" : "s"} for &quot;{query}&quot;
      </p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {results.movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      <MoviePagination
        currentPage={results.page}
        totalPages={results.totalPages}
        buildHref={(targetPage) =>
          `/search?q=${encodeURIComponent(query)}&page=${targetPage}`
        }
      />
    </>
  );
}
