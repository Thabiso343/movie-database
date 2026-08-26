import Image from "next/image";
import Link from "next/link";
import { Film, Star } from "lucide-react";
import type { Movie } from "@/types/movie";

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link
      href={`/movies/${movie.id}`}
      className="group block overflow-hidden rounded-lg bg-neutral-900 ring-1 ring-neutral-800 transition-transform duration-200 hover:-translate-y-1 hover:ring-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500"
    >
      <div className="relative aspect-2/3 w-full bg-neutral-800">
        {movie.posterUrl ? (
          <Image
            src={movie.posterUrl}
            alt={`${movie.title} poster`}
            fill
            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
            quality={90}
            className="object-cover transition-opacity duration-200 group-hover:opacity-90"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-3 text-center text-neutral-500">
            <Film size={32} aria-hidden="true" />
            <span className="text-xs">No poster available</span>
          </div>
        )}

        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-white backdrop-blur-xs">
          <Star
            size={12}
            className="fill-yellow-400 text-yellow-400"
            aria-hidden="true"
          />
          {movie.rating.toFixed(1)}
        </div>
      </div>

      <div className="p-3">
        <h3 className="truncate text-sm font-medium text-white">
          {movie.title}
        </h3>
        <p className="text-xs text-neutral-400">
          {movie.releaseYear ?? "Unknown year"}
        </p>
      </div>
    </Link>
  );
}
