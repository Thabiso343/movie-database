const TMDB_BASE_URL = "https://api.themoviedb.org/3";

/**
 * A typed error for anything that goes wrong talking to TMDB, so calling
 * code (and eventually error.tsx boundaries) can distinguish "TMDB is
 * down" / "we're rate-limited" / "our key is wrong" from a generic crash.
 */
export class TmdbError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "TmdbError";
    this.status = status;
  }
}

/**
 * Low-level fetch wrapper. Nothing outside lib/tmdb/ should ever call
 * fetch() against api.themoviedb.org directly — this is the one place
 * that knows the base URL, the auth header, and how to react to TMDB's
 * error codes.
 */
export async function tmdbFetch<T>(
  path: string,
  searchParams?: Record<string, string>
): Promise<T> {
  const token = process.env.TMDB_ACCESS_TOKEN;
  if (!token) {
    throw new Error(
      "TMDB_ACCESS_TOKEN is not set. Copy .env.example to .env.local and add your TMDB access token."
    );
  }

  const url = new URL(`${TMDB_BASE_URL}${path}`);
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      url.searchParams.set(key, value);
    }
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
    },
    // Popular/top-rated/upcoming lists don't change minute to minute, so
    // we let Next.js cache the response for an hour instead of hitting
    // TMDB on every single page load.
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    switch (res.status) {
      case 401:
        throw new TmdbError(
          "TMDB rejected our credentials (401). Check TMDB_ACCESS_TOKEN in .env.local.",
          401
        );
      case 404:
        throw new TmdbError("The requested TMDB resource was not found (404).", 404);
      case 429:
        throw new TmdbError(
          "TMDB rate limit exceeded (429). Try again shortly.",
          429
        );
      default:
        throw new TmdbError(
          `TMDB request failed with status ${res.status}.`,
          res.status
        );
    }
  }

  return res.json() as Promise<T>;
}
