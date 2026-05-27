import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PostCard } from "@/components/blog/PostCard";
import { Pagination } from "@/components/blog/Pagination";
import { getAllCategories } from "@/lib/queries/categories";
import { getPaginatedPosts } from "@/lib/queries/posts";
import { isDBConfigured } from "@/lib/db";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description: "All articles — design, technology, productivity, and more.",
};

export const revalidate = 60;

interface BlogPageProps {
  searchParams: Promise<{ page?: string; category?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1));
  const category = params.category;
  const dbReady = isDBConfigured();

  const [{ posts, total, totalPages }, categories] = dbReady
    ? await Promise.all([
        getPaginatedPosts(page, 9, category),
        getAllCategories(),
      ])
    : [{ posts: [], total: 0, totalPages: 0 }, []];

  return (
    <Container className="py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-serif text-display font-bold text-text mb-3">
          All Articles
        </h1>
        <p className="text-muted text-lg">
          {total > 0 ? `${total} articles across all topics` : "No articles yet"}
        </p>
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          <Link
            href="/blog"
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
              !category
                ? "bg-accent text-accent-foreground"
                : "bg-surface-2 text-muted hover:text-text"
            )}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/blog?category=${cat.slug}`}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                category === cat.slug
                  ? "bg-accent text-accent-foreground"
                  : "bg-surface-2 text-muted hover:text-text"
              )}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}

      {/* Grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <p className="text-muted text-lg">No posts found.</p>
          <Link href="/blog" className="text-accent text-sm mt-2 inline-block">
            View all posts
          </Link>
        </div>
      )}

      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={totalPages}
        basePath="/blog"
      />
    </Container>
  );
}
