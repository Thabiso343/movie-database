import type { Metadata } from "next";
import MovieListPage from "@/components/movies/MovieListPage";
import { getTopRatedMovies } from "@/lib/tmdb/endpoints";

export const metadata: Metadata = {
  title: "Top Rated Movies — Movie Database",
};

type PageProps = { searchParams: Promise<{ page?: string }> };

export default async function TopRatedPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  return (
    <MovieListPage
      title="Top Rated Movies"
      page={currentPage}
      basePath="/top-rated"
      fetchList={getTopRatedMovies}
    />
  );
}
