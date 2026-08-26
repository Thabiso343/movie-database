import Link from "next/link";
import MovieCard from "@/components/movies/MovieCard";
import type { Movie } from "@/types/movie";

/**
 * A horizontal-scrolling row of movie cards with a heading and an
 * optional "See all" link to the full paginated page. Used on the home
 * page (Popular / Top Rated / Upcoming rows) and the movie detail page
 * (Similar Movies) — one component instead of two near-identical ones.
 */
export default function MovieRow({
  title,
  movies,
  seeAllHref,
}: {
  title: string;
  movies: Movie[];
  seeAllHref?: string;
}) {
  if (movies.length === 0) return null;

  return (
    <section className="mt-10 first:mt-0">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {seeAllHref && (
          <Link
            href={seeAllHref}
            className="text-sm text-neutral-400 hover:text-white"
          >
            See all
          </Link>
        )}
      </div>
      <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
        {movies.map((movie) => (
          <div key={movie.id} className="w-36 shrink-0 sm:w-40">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
}
