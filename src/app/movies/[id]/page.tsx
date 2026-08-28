import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import CastList from "@/components/movies/CastList";
import MovieRow from "@/components/movies/MovieRow";
import TrailerButton from "@/components/movies/TrailerButton";
import WatchlistButton from "@/components/movies/WatchlistButton";
import RatingWidget from "@/components/movies/RatingWidget";
import ReviewsSection from "@/components/movies/ReviewsSection";
import { auth } from "@/lib/auth/auth";
import { getWatchlistStatus } from "@/lib/actions/watchlist";
import { getUserRating } from "@/lib/actions/ratings";
import { TmdbError } from "@/lib/tmdb/client";
import {
  getMovieCredits,
  getMovieDetails,
  getMovieTrailer,
  getSimilarMovies,
} from "@/lib/tmdb/endpoints";

type MovieDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: MovieDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const movieId = Number(id);
  if (!Number.isInteger(movieId)) return { title: "Movie not found" };

  try {
    const movie = await getMovieDetails(movieId);
    return {
      title: `${movie.title} — Movie Database`,
      description: movie.overview.slice(0, 155) || undefined,
    };
  } catch {
    // If the fetch fails here, the page component below will fail (and
    // handle it) the same way — metadata just falls back to something
    // generic rather than throwing twice.
    return { title: "Movie Database" };
  }
}

export default async function MovieDetailsPage({
  params,
}: MovieDetailsPageProps) {
  const { id } = await params;
  const movieId = Number(id);

  // A non-numeric id (e.g. someone editing the URL by hand) is never going
  // to match a real movie — fail fast instead of sending it to TMDB.
  if (!Number.isInteger(movieId)) {
    notFound();
  }

  let movie;
  let credits;
  let trailer;
  let similarMovies;
  let session;
  let isInWatchlist;
  let userRating;
  try {
    // All these depend on the same movieId (or nothing at all) and none
    // depends on another's result, so we fetch them concurrently instead
    // of one after another. Session, watchlist status, and rating ride
    // along here too, rather than each being its own separate await
    // later down the page -- that would serialize things for no reason.
    [movie, credits, trailer, similarMovies, session, isInWatchlist, userRating] =
      await Promise.all([
        getMovieDetails(movieId),
        getMovieCredits(movieId),
        getMovieTrailer(movieId),
        getSimilarMovies(movieId),
        auth(),
        getWatchlistStatus(movieId),
        getUserRating(movieId),
      ]);
  } catch (error) {
    // TMDB returning 404 means "this id doesn't exist" — that's Next.js's
    // built-in not-found case, not a broken app. Anything else (network
    // failure, TMDB down, bad key) is a real error and should be treated
    // as one, so we let it propagate to the nearest error boundary.
    if (error instanceof TmdbError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  return (
    <div>
      <div className="relative h-[35vh] w-full overflow-hidden bg-neutral-900 sm:h-[45vh]">
        {movie.backdropUrl && (
          <Image
            src={movie.backdropUrl}
            alt=""
            fill
            priority
            quality={90}
            className="object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/70 to-transparent" />
      </div>

      <div className="mx-auto -mt-24 max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="relative aspect-2/3 w-40 shrink-0 overflow-hidden rounded-lg bg-neutral-800 shadow-xl ring-1 ring-neutral-800 sm:w-56">
            {movie.posterUrl ? (
              <Image
                src={movie.posterUrl}
                alt={`${movie.title} poster`}
                fill
                quality={90}
                sizes="(min-width: 640px) 224px, 160px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center px-3 text-center text-xs text-neutral-500">
                No poster available
              </div>
            )}
          </div>

          <div className="flex-1 pt-4">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="mt-1 italic text-neutral-400">{movie.tagline}</p>
            )}
            {credits.director && (
              <p className="mt-1 text-sm text-neutral-400">
                Directed by{" "}
                <span className="text-neutral-200">{credits.director}</span>
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-neutral-300">
              <span className="flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1">
                <Star
                  size={14}
                  className="fill-yellow-400 text-yellow-400"
                  aria-hidden="true"
                />
                {movie.rating.toFixed(1)}
                <span className="text-neutral-400">
                  ({movie.voteCount.toLocaleString()} votes)
                </span>
              </span>
              {movie.releaseYear && <span>{movie.releaseYear}</span>}
              {movie.runtimeMinutes && <span>{movie.runtimeMinutes} min</span>}
            </div>

            {movie.genres.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full border border-neutral-700 px-3 py-1 text-xs text-neutral-300"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {trailer && (
                <TrailerButton videoKey={trailer.key} title={movie.title} />
              )}
              <WatchlistButton
                movieId={movie.id}
                initialIsInWatchlist={isInWatchlist}
                isSignedIn={!!session}
              />
            </div>

            <div className="mt-4">
              <RatingWidget
                movieId={movie.id}
                initialRating={userRating}
                isSignedIn={!!session}
              />
            </div>

            <p className="mt-6 max-w-2xl leading-relaxed text-neutral-300">
              {movie.overview || "No overview available."}
            </p>
          </div>
        </div>

        <CastList cast={credits.cast} />
        <MovieRow title="Similar Movies" movies={similarMovies} />
        <ReviewsSection movieId={movie.id} />
      </div>
    </div>
  );
}
