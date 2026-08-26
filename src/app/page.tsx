import MovieRow from "@/components/movies/MovieRow";
import {
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  type MovieList,
} from "@/lib/tmdb/endpoints";

const EMPTY_LIST: MovieList = {
  movies: [],
  page: 1,
  totalPages: 0,
  totalResults: 0,
};

export default async function Home() {
  let popular = EMPTY_LIST;
  let topRated = EMPTY_LIST;
  let upcoming = EMPTY_LIST;
  let errorMessage: string | null = null;

  try {
    // Three independent TMDB calls — fetch them together rather than
    // waiting for each one before starting the next.
    [popular, topRated, upcoming] = await Promise.all([
      getPopularMovies(),
      getTopRatedMovies(),
      getUpcomingMovies(),
    ]);
  } catch (error) {
    console.error("Failed to load home page movies:", error);
    errorMessage =
      error instanceof Error
        ? error.message
        : "Something went wrong loading movies.";
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-white">
        Discover Movies
      </h1>
      <p className="mt-2 text-neutral-400">
        Browse what&apos;s popular, top-rated, and coming soon.
      </p>

      {errorMessage ? (
        <div className="mt-8 rounded-lg border border-red-900 bg-red-950/40 p-4 text-sm text-red-200">
          <p className="font-medium">Couldn&apos;t load movies from TMDB.</p>
          <p className="mt-1 text-red-300">{errorMessage}</p>
        </div>
      ) : (
        <>
          <MovieRow
            title="Popular"
            movies={popular.movies}
            seeAllHref="/popular"
          />
          <MovieRow
            title="Top Rated"
            movies={topRated.movies}
            seeAllHref="/top-rated"
          />
          <MovieRow
            title="Upcoming"
            movies={upcoming.movies}
            seeAllHref="/upcoming"
          />
        </>
      )}
    </div>
  );
}
