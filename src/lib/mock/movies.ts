import type { Movie } from "@/types/movie";

/**
 * Temporary placeholder data for building and testing UI components before
 * the real TMDB integration exists (Phase 2). This file gets deleted once
 * lib/tmdb/client.ts can fetch real movies — nothing here should be treated
 * as permanent.
 */
export const mockMovies: Movie[] = [
  {
    id: 1,
    title: "The Silent Horizon",
    posterUrl: "https://picsum.photos/seed/movie1/780/1170",
    releaseYear: "2023",
    rating: 8.1,
  },
  {
    id: 2,
    title: "Neon Drift",
    posterUrl: "https://picsum.photos/seed/movie2/780/1170",
    releaseYear: "2021",
    rating: 7.4,
  },
  {
    id: 3,
    title: "Glass Kingdom",
    posterUrl: "https://picsum.photos/seed/movie3/780/1170",
    releaseYear: "2019",
    rating: 6.8,
  },
  {
    id: 4,
    title: "Paper Moons",
    posterUrl: null,
    releaseYear: "2024",
    rating: 5.9,
  },
  {
    id: 5,
    title: "The Last Cartographer",
    posterUrl: "https://picsum.photos/seed/movie5/780/1170",
    releaseYear: "2022",
    rating: 9.0,
  },
  {
    id: 6,
    title: "Static Bloom",
    posterUrl: "https://picsum.photos/seed/movie6/780/1170",
    releaseYear: "2020",
    rating: 7.0,
  },
];
