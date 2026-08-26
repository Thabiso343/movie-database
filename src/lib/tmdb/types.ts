import { z } from "zod";

/**
 * TMDB's real movie object has dozens of fields (backdrop_path, genre_ids,
 * popularity, vote_count, adult, original_language, video, ...). We only
 * declare the ones we actually use. Zod ignores extra fields it isn't told
 * about, so this schema still validates a real TMDB response — it just
 * doesn't require every field to exist.
 */
export const tmdbMovieSchema = z.object({
  id: z.number(),
  title: z.string(),
  poster_path: z.string().nullable(),
  release_date: z.string(), // "2024-05-01", or "" if TMDB doesn't know it
  vote_average: z.number(),
});

export type TmdbMovie = z.infer<typeof tmdbMovieSchema>;

/**
 * Shape of TMDB's paginated list endpoints (/movie/popular,
 * /movie/top_rated, /movie/upcoming, /search/movie, ...).
 */
export const tmdbPaginatedMoviesSchema = z.object({
  page: z.number(),
  results: z.array(tmdbMovieSchema),
  total_pages: z.number(),
  total_results: z.number(),
});

export type TmdbPaginatedMovies = z.infer<typeof tmdbPaginatedMoviesSchema>;

/**
 * Shape of TMDB's single-movie endpoint (/movie/{id}). This is NOT the
 * same shape as an item inside a list response above — TMDB's detail
 * endpoint returns extra fields (tagline, runtime, genres, backdrop_path,
 * vote_count...) that the list endpoints omit for efficiency.
 */
export const tmdbMovieDetailsSchema = z.object({
  id: z.number(),
  title: z.string(),
  tagline: z.string().nullable(),
  overview: z.string(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  release_date: z.string(),
  runtime: z.number().nullable(),
  vote_average: z.number(),
  vote_count: z.number(),
  genres: z.array(z.object({ id: z.number(), name: z.string() })),
});

export type TmdbMovieDetails = z.infer<typeof tmdbMovieDetailsSchema>;

/**
 * Shape of TMDB's /movie/{id}/credits endpoint. Cast and crew are
 * genuinely different shapes in TMDB's response (crew has "job" and
 * "department"; cast has "character" and billing "order") — declaring
 * them as two separate schemas mirrors that instead of forcing one loose
 * shape onto both.
 */
export const tmdbCastMemberSchema = z.object({
  id: z.number(),
  name: z.string(),
  character: z.string(),
  profile_path: z.string().nullable(),
  order: z.number(),
});

export type TmdbCastMember = z.infer<typeof tmdbCastMemberSchema>;

export const tmdbCrewMemberSchema = z.object({
  id: z.number(),
  name: z.string(),
  job: z.string(),
  profile_path: z.string().nullable(),
});

export const tmdbCreditsSchema = z.object({
  cast: z.array(tmdbCastMemberSchema),
  crew: z.array(tmdbCrewMemberSchema),
});

export type TmdbCredits = z.infer<typeof tmdbCreditsSchema>;

/**
 * Shape of TMDB's /movie/{id}/videos endpoint. TMDB returns videos from
 * multiple sites (YouTube, Vimeo) and multiple types (Trailer, Teaser,
 * Clip, Behind the Scenes...) — filtering down to what we actually want
 * happens in endpoints.ts, not here. This schema just describes the raw
 * shape.
 */
export const tmdbVideoSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  site: z.string(),
  type: z.string(),
  official: z.boolean(),
});

export const tmdbVideosResponseSchema = z.object({
  results: z.array(tmdbVideoSchema),
});

export type TmdbVideo = z.infer<typeof tmdbVideoSchema>;

/** Shape of TMDB's /genre/movie/list endpoint. */
export const tmdbGenreSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const tmdbGenresResponseSchema = z.object({
  genres: z.array(tmdbGenreSchema),
});

export type TmdbGenre = z.infer<typeof tmdbGenreSchema>;
