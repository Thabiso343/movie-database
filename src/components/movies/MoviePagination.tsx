import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * A plain Server Component: Previous/Next are just <Link>s to a
 * different page number, computed by whatever URL shape the caller
 * needs (buildHref). No client state, no JavaScript required for
 * pagination to work — the URL is the only source of truth, which is
 * also what makes every one of these pages shareable/bookmarkable.
 *
 * Shared by every paginated movie list in the app (search, popular,
 * top-rated, upcoming, genre detail) instead of each page hand-rolling
 * its own Previous/Next markup.
 */
export default function MoviePagination({
  currentPage,
  totalPages,
  buildHref,
}: {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const linkClasses =
    "flex items-center gap-1 rounded-md px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-900";
  const disabledClasses =
    "flex items-center gap-1 rounded-md px-3 py-2 text-sm text-neutral-600";

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex items-center justify-center gap-4"
    >
      {hasPrevious ? (
        <Link href={buildHref(currentPage - 1)} className={linkClasses}>
          <ChevronLeft size={16} aria-hidden="true" />
          Previous
        </Link>
      ) : (
        <span className={disabledClasses} aria-disabled="true">
          <ChevronLeft size={16} aria-hidden="true" />
          Previous
        </span>
      )}

      <span className="text-sm text-neutral-400">
        Page {currentPage} of {totalPages.toLocaleString()}
      </span>

      {hasNext ? (
        <Link href={buildHref(currentPage + 1)} className={linkClasses}>
          Next
          <ChevronRight size={16} aria-hidden="true" />
        </Link>
      ) : (
        <span className={disabledClasses} aria-disabled="true">
          Next
          <ChevronRight size={16} aria-hidden="true" />
        </span>
      )}
    </nav>
  );
}
