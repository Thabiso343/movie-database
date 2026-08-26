/**
 * Our app's internal Movie shape — deliberately NOT the same as TMDB's raw
 * API response (which uses snake_case fields like poster_path, vote_average).
 * The TMDB service layer (lib/tmdb/) translates TMDB's response into this
 * shape, so the rest of the app never has to know TMDB's field names or
 * response format exist.
 */
export interface Movie {
  id: number;
  title: string;
  posterUrl: string | null;
  releaseYear: string | null;
  rating: number; // 0–10
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profileUrl: string | null;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Trailer {
  key: string; // YouTube video id, used to build the embed URL
  name: string;
}

/**
 * Everything a list card needs (Movie), plus what only the detail page
 * needs. Kept separate from Movie because list endpoints (popular,
 * top-rated...) don't return these fields — fetching them for every card
 * in a grid would be wasted data we never display.
 */
export interface MovieDetails extends Movie {
  backdropUrl: string | null;
  tagline: string | null;
  overview: string;
  runtimeMinutes: number | null;
  genres: string[];
  voteCount: number;
}
