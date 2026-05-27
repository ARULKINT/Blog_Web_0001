import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  basePath: string;
}

export function Pagination({ page, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1 mt-12"
    >
      <PaginationLink
        href={page > 1 ? `${basePath}?page=${page - 1}` : null}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </PaginationLink>

      {pages.map((p) => (
        <PaginationLink
          key={p}
          href={`${basePath}?page=${p}`}
          active={p === page}
          aria-label={`Page ${p}`}
        >
          {p}
        </PaginationLink>
      ))}

      <PaginationLink
        href={page < totalPages ? `${basePath}?page=${page + 1}` : null}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </PaginationLink>
    </nav>
  );
}

function PaginationLink({
  href,
  children,
  active,
  "aria-label": ariaLabel,
}: {
  href: string | null;
  children: React.ReactNode;
  active?: boolean;
  "aria-label"?: string;
}) {
  const cls = cn(
    "h-9 w-9 rounded-xl flex items-center justify-center text-sm font-medium transition-all",
    active
      ? "bg-accent text-accent-foreground"
      : "text-muted hover:text-text hover:bg-surface-2",
    !href && "opacity-40 pointer-events-none"
  );

  if (!href) return <span className={cls} aria-label={ariaLabel}>{children}</span>;
  return (
    <Link href={href} className={cls} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}
