import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PostCard } from "@/components/blog/PostCard";
import { searchPosts } from "@/lib/queries/posts";
import { isDBConfigured } from "@/lib/db";
import { Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Search",
  description: "Search articles",
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const sp = await searchParams;
  const query = (sp.q ?? "").trim();
  const dbReady = isDBConfigured();

  const results = query && dbReady ? await searchPosts(query, 12) : [];

  return (
    <Container className="py-12 max-w-4xl">
      <h1 className="font-serif text-3xl font-bold text-text mb-8">Search</h1>

      {/* Search form */}
      <form method="GET" action="/search" className="mb-10">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search articles…"
            autoFocus
            className="w-full h-12 pl-11 pr-4 rounded-2xl border border-border bg-surface text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent text-base transition-colors"
          />
        </div>
      </form>

      {/* Results */}
      {query ? (
        results.length > 0 ? (
          <>
            <p className="text-sm text-muted mb-6">
              {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {results.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg font-semibold text-text mb-2">No results found</p>
            <p className="text-muted text-sm">
              Try different keywords or browse all{" "}
              <a href="/blog" className="text-accent hover:underline">
                articles
              </a>
              .
            </p>
          </div>
        )
      ) : (
        <p className="text-center text-muted py-20">Enter a search term above.</p>
      )}
    </Container>
  );
}
