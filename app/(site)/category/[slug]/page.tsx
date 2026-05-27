import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PostCard } from "@/components/blog/PostCard";
import { Pagination } from "@/components/blog/Pagination";
import { getCategoryBySlug, getAllCategorySlugs } from "@/lib/queries/categories";
import { getPaginatedPosts } from "@/lib/queries/posts";
import { isDBConfigured } from "@/lib/db";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isDBConfigured()) return {};
  const cat = await getCategoryBySlug(slug);
  if (!cat) return {};
  return {
    title: cat.name,
    description: cat.description || `Articles in ${cat.name}`,
  };
}

export async function generateStaticParams() {
  if (!isDBConfigured()) return [];
  try {
    const slugs = await getAllCategorySlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export const dynamicParams = true;

export const revalidate = 3600;

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? 1));

  if (!isDBConfigured()) {
    return (
      <Container className="py-20 text-center">
        <p className="text-muted">Database not configured.</p>
      </Container>
    );
  }

  const [cat, { posts, total, totalPages }] = await Promise.all([
    getCategoryBySlug(slug),
    getPaginatedPosts(page, 9, slug),
  ]);

  if (!cat) notFound();

  return (
    <Container className="py-12">
      {/* Category hero */}
      <div
        className="rounded-3xl p-10 mb-10 text-center"
        style={{ backgroundColor: `${cat.color}15` }}
      >
        <div
          className="inline-flex h-14 w-14 items-center justify-center rounded-2xl text-2xl mb-4"
          style={{ backgroundColor: `${cat.color}20` }}
        >
          📂
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-text mb-3">
          {cat.name}
        </h1>
        {cat.description && (
          <p className="text-muted text-base max-w-lg mx-auto">{cat.description}</p>
        )}
        <p className="text-sm text-muted mt-3">{total} articles</p>
      </div>

      {/* Posts */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted py-20">No posts yet in this category.</p>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        basePath={`/category/${slug}`}
      />
    </Container>
  );
}
