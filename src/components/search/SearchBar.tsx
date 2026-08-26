"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Lives in app/search/layout.tsx (not page.tsx) so it stays mounted while
 * the results below it re-fetch and swap out. If this input were part of
 * the page that re-renders on every search, it would lose focus mid-type
 * every time the debounce timer fires — that's the whole reason for the
 * layout/page split here.
 */
export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const trimmed = value.trim();
      const params = new URLSearchParams();
      if (trimmed) params.set("q", trimmed);
      // Every new query starts back at page 1 — "page 4 of your previous
      // search" isn't meaningful once the query itself has changed.
      // replace(), not push(): each keystroke shouldn't add a new browser
      // history entry, or the back button would step through every
      // half-typed query instead of leaving the search page.
      router.replace(`/search?${params.toString()}`);
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, router]);

  return (
    <div className="relative">
      <Search
        size={18}
        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-neutral-500"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search for a movie…"
        aria-label="Search movies"
        className="w-full rounded-md border border-neutral-800 bg-neutral-900 py-2.5 pr-4 pl-10 text-white placeholder-neutral-500 focus:border-neutral-600 focus:outline-none"
      />
    </div>
  );
}
