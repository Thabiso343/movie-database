import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MovieListPage from "@/components/movies/MovieListPage";
import { getGenres, getMoviesByGenre } from "@/lib/tmdb/endpoints";

type GenrePageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
};

/**
 * getGenres() is called again here (it was already called by /genres to
 * render the list of links) purely to look up this one id's display
 * name — TMDB's genre list rarely changes and our fetch layer caches it
 * for an hour (see client.ts), so this doesn't cost a fresh TMDB request
 * on every visit, just a cache read.
 */
async function findGenre(id: number) {
  const genres = await getGenres();
  return genres.find((genre) => genre.id === id) ?? null;
}

export async function generateMetadata({
  params,
}: GenrePageProps): Promise<Metadata> {
  const { id } = await params;
  const genre = await findGenre(Number(id));
  return {
    title: genre ? `${genre.name} Movies — Movie Database` : "Movie Database",
  };
}

export default async function GenreDetailPage({
  params,
  searchParams,
}: GenrePageProps) {
  const { id } = await params;
  const genreId = Number(id);
  if (!Number.isInteger(genreId)) notFound();

  const genre = await findGenre(genreId);
  if (!genre) notFound();

  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  return (
    <MovieListPage
      title={`${genre.name} Movies`}
      page={currentPage}
      basePath={`/genres/${genreId}`}
      fetchList={(p) => getMoviesByGenre(genreId, p)}
    />
  );
}
