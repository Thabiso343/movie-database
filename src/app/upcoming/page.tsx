import type { Metadata } from "next";
import MovieListPage from "@/components/movies/MovieListPage";
import { getUpcomingMovies } from "@/lib/tmdb/endpoints";

export const metadata: Metadata = { title: "Upcoming Movies — Movie Database" };

type PageProps = { searchParams: Promise<{ page?: string }> };

export default async function UpcomingPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  return (
    <MovieListPage
      title="Upcoming Movies"
      page={currentPage}
      basePath="/upcoming"
      fetchList={getUpcomingMovies}
    />
  );
}
