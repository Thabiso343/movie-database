import type { Metadata } from "next";
import MovieListPage from "@/components/movies/MovieListPage";
import { getPopularMovies } from "@/lib/tmdb/endpoints";

export const metadata: Metadata = { title: "Popular Movies — Movie Database" };

type PageProps = { searchParams: Promise<{ page?: string }> };

export default async function PopularPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  return (
    <MovieListPage
      title="Popular Movies"
      page={currentPage}
      basePath="/popular"
      fetchList={getPopularMovies}
    />
  );
}
