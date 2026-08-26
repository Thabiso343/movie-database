import type { Metadata } from "next";
import Link from "next/link";
import { getGenres } from "@/lib/tmdb/endpoints";

export const metadata: Metadata = { title: "Genres — Movie Database" };

export default async function GenresPage() {
  const genres = await getGenres();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-white sm:text-3xl">Genres</h1>
      <p className="mt-2 text-neutral-400">
        Browse movies by genre.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        {genres.map((genre) => (
          <Link
            key={genre.id}
            href={`/genres/${genre.id}`}
            className="rounded-full border border-neutral-700 px-4 py-2 text-sm text-neutral-200 transition-colors hover:border-neutral-500 hover:bg-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
          >
            {genre.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
