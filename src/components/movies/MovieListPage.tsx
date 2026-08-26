import MovieCard from "@/components/movies/MovieCard";
import MoviePagination from "@/components/movies/MoviePagination";
import type { MovieList } from "@/lib/tmdb/endpoints";

/**
 * Shared shell for every full, paginated movie-browsing page (Popular,
 * Top Rated, Upcoming, a genre's movies). Each route's page.tsx just
 * resolves its own searchParams/params and calls this with the right
 * title, TMDB fetcher, and base URL for pagination links — the fetch /
 * error / empty / grid / pagination logic itself lives in exactly one
 * place instead of being copy-pasted per route.
 */
export default async function MovieListPage({
  title,
  page,
  basePath,
  fetchList,
}: {
  title: string;
  page: number;
  basePath: string;
  fetchList: (page: number) => Promise<MovieList>;
}) {
  let list: MovieList = { movies: [], page, totalPages: 0, totalResults: 0 };
  let errorMessage: string | null = null;

  try {
    list = await fetchList(page);
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Something went wrong.";
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-white sm:text-3xl">{title}</h1>

      {errorMessage ? (
        <div className="mt-8 rounded-lg border border-red-900 bg-red-950/40 p-4 text-sm text-red-200">
          <p className="font-medium">Couldn&apos;t load movies from TMDB.</p>
          <p className="mt-1 text-red-300">{errorMessage}</p>
        </div>
      ) : list.movies.length === 0 ? (
        <p className="mt-8 text-neutral-400">No movies found.</p>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {list.movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          <MoviePagination
            currentPage={list.page}
            totalPages={list.totalPages}
            buildHref={(targetPage) => `${basePath}?page=${targetPage}`}
          />
        </>
      )}
    </div>
  );
}
