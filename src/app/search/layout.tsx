import type { ReactNode } from "react";
import { Suspense } from "react";
import SearchBar from "@/components/search/SearchBar";

export default function SearchLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-white">Search</h1>
      <div className="mt-4 max-w-xl">
        {/* useSearchParams() requires a Suspense boundary — without this,
            Next.js would force the whole route to opt out of static
            rendering. */}
        <Suspense>
          <SearchBar />
        </Suspense>
      </div>
      {/* Only this part re-renders (and shows loading.tsx) when the URL's
          search params change — SearchBar above stays mounted. */}
      <div className="mt-8">{children}</div>
    </div>
  );
}
