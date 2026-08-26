const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

// TMDB only serves images at these fixed widths — you can't request an
// arbitrary size like you could with a URL-based image CDN.
export type PosterSize =
  | "w92"
  | "w154"
  | "w185"
  | "w342"
  | "w500"
  | "w780"
  | "original";

export type BackdropSize = "w300" | "w780" | "w1280" | "original";

export type ProfileSize = "w45" | "w185" | "h632" | "original";

/**
 * Builds a full poster URL from TMDB's raw poster_path (which is just a
 * filename fragment like "/abc123.jpg", not a usable URL on its own).
 * Returns null when there's no poster, so callers can render the same
 * "no poster" fallback UI already built for the mock data.
 */
export function getPosterUrl(
  path: string | null,
  size: PosterSize = "w780"
): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

/**
 * Same idea as getPosterUrl, but for the wide backdrop images used on the
 * movie detail page's hero banner. Kept as a separate function (rather
 * than one function with a union of both size lists) because posters and
 * backdrops are used in visually distinct places — separate call sites
 * read more clearly than one function serving two purposes.
 */
export function getBackdropUrl(
  path: string | null,
  size: BackdropSize = "w1280"
): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

/** Same pattern again, for cast/crew headshots. */
export function getProfileUrl(
  path: string | null,
  size: ProfileSize = "w185"
): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}
