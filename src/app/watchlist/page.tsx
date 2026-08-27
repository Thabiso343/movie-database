import Link from "next/link";
import { Bookmark } from "lucide-react";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { getMovieDetails } from "@/lib/tmdb/endpoints";
import MovieCard from "@/components/movies/MovieCard";
import type { Movie } from "@/types/movie";

export const metadata = {
  title: "My Watchlist — Movie Database",
};

export default async function WatchlistPage() {
  // proxy.ts already redirects signed-out visitors away from this route --
  // this check is a second, independent safety net, not a duplicate. If
  // proxy.ts's matcher were ever edited to stop covering this path, this
  // is what keeps the page from leaking another user's data instead of
  // silently relying on the one outer layer.
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const entries = await prisma.watchlist.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: { movieId: true },
  });

  if (entries.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <Bookmark size={40} className="mx-auto text-neutral-700" />
        <h1 className="mt-4 text-2xl font-bold text-white">
          Your watchlist is empty
        </h1>
        <p className="mt-2 text-neutral-400">
          Find a movie you like and click &ldquo;Add to watchlist&rdquo; to
          save it here.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-md bg-white px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-neutral-200"
        >
          Browse movies
        </Link>
      </div>
    );
  }

  // Our database only stores TMDB movie ids (see prisma/schema.prisma's
  // comments on why there's no local Movie table) -- so turning that back
  // into titles/posters means one TMDB fetch per saved movie. We use
  // allSettled rather than Promise.all so that if TMDB has since pulled a
  // movie (or a single fetch flakes), the rest of the watchlist still
  // renders instead of one bad id taking down the whole page.
  const results = await Promise.allSettled(
    entries.map((entry) => getMovieDetails(entry.movieId)),
  );

  const movies: Movie[] = results
    .filter((result) => result.status === "fulfilled")
    .map((result) => (result as PromiseFulfilledResult<Movie>).value);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white">My Watchlist</h1>
      <p className="mt-1 text-neutral-400">
        {movies.length} {movies.length === 1 ? "movie" : "movies"} saved
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
