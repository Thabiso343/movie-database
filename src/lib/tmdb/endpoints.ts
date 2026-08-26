import type {
  CastMember,
  Genre,
  Movie,
  MovieDetails,
  Trailer,
} from "@/types/movie";
import { tmdbFetch } from "./client";
import { getBackdropUrl, getPosterUrl, getProfileUrl } from "./images";
import {
  tmdbCreditsSchema,
  tmdbGenresResponseSchema,
  tmdbMovieDetailsSchema,
  tmdbPaginatedMoviesSchema,
  tmdbVideosResponseSchema,
  type TmdbCastMember,
  type TmdbMovie,
  type TmdbMovieDetails,
} from "./types";

/**
 * Translates TMDB's raw movie object into our app's internal Movie type.
 * This is the ONE place that ever reads poster_path / release_date /
 * vote_average — every component downstream just sees a clean Movie.
 */
function toMovie(raw: TmdbMovie): Movie {
  return {
    id: raw.id,
    title: raw.title,
    posterUrl: getPosterUrl(raw.poster_path),
    releaseYear: raw.release_date ? raw.release_date.slice(0, 4) : null,
    rating: raw.vote_average,
  };
}

function toMovieDetails(raw: TmdbMovieDetails): MovieDetails {
  return {
    ...toMovie(raw),
    backdropUrl: getBackdropUrl(raw.backdrop_path),
    tagline: raw.tagline || null, // TMDB sends "" rather than null sometimes
    overview: raw.overview,
    runtimeMinutes: raw.runtime,
    genres: raw.genres.map((genre) => genre.name),
    voteCount: raw.vote_count,
  };
}

function toCastMember(raw: TmdbCastMember): CastMember {
  return {
    id: raw.id,
    name: raw.name,
    character: raw.character,
    profileUrl: getProfileUrl(raw.profile_path),
  };
}

export interface MovieList {
  movies: Movie[];
  page: number;
  totalPages: number;
  totalResults: number;
}

/**
 * Popular, top-rated, upcoming, search, and discover-by-genre are all
 * TMDB endpoints returning the exact same paginated movie shape. Rather
 * than repeat "fetch, validate, map, wrap in pagination metadata" for
 * each one (as getPopularMovies and searchMovies did before this
 * refactor), every list endpoint below is one line delegating to this
 * shared helper. This is the "rule of three" in practice: the first
 * repeat is fine to leave alone, the second is a coincidence worth
 * watching, and the third is a real pattern worth naming and extracting.
 */
async function fetchMovieList(
  path: string,
  page: number,
  extraParams: Record<string, string> = {}
): Promise<MovieList> {
  const raw = await tmdbFetch<unknown>(path, {
    page: String(page),
    ...extraParams,
  });
  const parsed = tmdbPaginatedMoviesSchema.parse(raw);

  return {
    movies: parsed.results.map(toMovie),
    page: parsed.page,
    totalPages: parsed.total_pages,
    totalResults: parsed.total_results,
  };
}

export function getPopularMovies(page: number = 1): Promise<MovieList> {
  return fetchMovieList("/movie/popular", page);
}

export function getTopRatedMovies(page: number = 1): Promise<MovieList> {
  return fetchMovieList("/movie/top_rated", page);
}

export function getUpcomingMovies(page: number = 1): Promise<MovieList> {
  return fetchMovieList("/movie/upcoming", page);
}

export function searchMovies(
  query: string,
  page: number = 1
): Promise<MovieList> {
  return fetchMovieList("/search/movie", page, { query });
}

/**
 * TMDB's /discover/movie endpoint is a general-purpose filter — genre is
 * just one of many possible filters it supports (year, rating, language,
 * runtime...). Section 17 of the brief ("Advanced Search") will add more
 * of those filters to this same call later; for now we only pass
 * with_genres.
 */
export function getMoviesByGenre(
  genreId: number,
  page: number = 1
): Promise<MovieList> {
  return fetchMovieList("/discover/movie", page, {
    with_genres: String(genreId),
  });
}

export async function getMovieDetails(id: number): Promise<MovieDetails> {
  const raw = await tmdbFetch<unknown>(`/movie/${id}`);
  const parsed = tmdbMovieDetailsSchema.parse(raw);
  return toMovieDetails(parsed);
}

/**
 * Kept separate from getMovieDetails() rather than merged into one big
 * fetch: they hit two different TMDB endpoints, and not every caller of
 * movie details needs the cast list (generateMetadata, for one, only
 * needs the title and overview). Callers that need both — the detail
 * page — fetch them in parallel with Promise.all.
 */
export async function getMovieCredits(
  id: number
): Promise<{ cast: CastMember[]; director: string | null }> {
  const raw = await tmdbFetch<unknown>(`/movie/${id}/credits`);
  const parsed = tmdbCreditsSchema.parse(raw);

  const director =
    parsed.crew.find((member) => member.job === "Director")?.name ?? null;

  // TMDB can return 50+ cast members for a big-ensemble film — cap it to
  // a sensible number for the UI rather than rendering all of them.
  const cast = parsed.cast.slice(0, 12).map(toCastMember);

  return { cast, director };
}

/**
 * TMDB's /videos endpoint returns every video it has for a movie —
 * trailers, teasers, clips, behind-the-scenes footage, on multiple sites
 * (YouTube, Vimeo). We only want a YouTube trailer, and we prefer an
 * "official" one when TMDB has multiple. Returns null rather than
 * throwing when there's no suitable trailer — that's a normal, expected
 * case (plenty of movies have none on TMDB), not an error.
 */
export async function getMovieTrailer(id: number): Promise<Trailer | null> {
  const raw = await tmdbFetch<unknown>(`/movie/${id}/videos`);
  const parsed = tmdbVideosResponseSchema.parse(raw);

  const youtubeTrailers = parsed.results.filter(
    (video) => video.site === "YouTube" && video.type === "Trailer"
  );

  const trailer =
    youtubeTrailers.find((video) => video.official) ?? youtubeTrailers[0];

  return trailer ? { key: trailer.key, name: trailer.name } : null;
}

export async function getSimilarMovies(id: number): Promise<Movie[]> {
  const { movies } = await fetchMovieList(`/movie/${id}/similar`, 1);
  return movies.slice(0, 10);
}

export async function getGenres(): Promise<Genre[]> {
  const raw = await tmdbFetch<unknown>("/genre/movie/list");
  const parsed = tmdbGenresResponseSchema.parse(raw);
  return parsed.genres;
}
