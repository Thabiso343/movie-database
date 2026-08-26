"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useState, type FormEvent } from "react";

/**
 * Deliberately NOT debounced or live — this lives in the navbar and is
 * visible on every page. A search box that yanks you to /search after a
 * few keystrokes while you're just typing casually would be a bad
 * surprise. Submitting (Enter, or the icon) is the only way it navigates.
 * The debounced live-search behavior belongs to SearchBar, which only
 * exists once you're already on the results page and searching is the
 * whole point of being there.
 *
 * Used in two places in Navbar (desktop row, mobile menu panel) with
 * different sizing needs, hence the fullWidth prop rather than a fixed
 * width baked in.
 */
export default function NavSearchForm({
  fullWidth = false,
  onSubmitQuery,
}: {
  fullWidth?: boolean;
  /** Called right after a successful navigate — e.g. to close a mobile menu. */
  onSubmitQuery?: () => void;
}) {
  const router = useRouter();
  const [value, setValue] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    onSubmitQuery?.();
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search
        size={16}
        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-neutral-500"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search movies…"
        aria-label="Search movies"
        className={`rounded-md border border-neutral-800 bg-neutral-900 py-1.5 pr-3 pl-9 text-sm text-white placeholder-neutral-500 focus:border-neutral-600 focus:outline-none ${
          fullWidth ? "w-full" : "w-40 transition-all focus:w-56"
        }`}
      />
    </form>
  );
}
