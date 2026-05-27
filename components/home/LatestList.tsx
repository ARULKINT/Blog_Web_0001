import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { PostCard } from "@/components/blog/PostCard";
import type { Post } from "@/types";

interface LatestListProps {
  posts: Post[];
  trendingPosts: Post[];
}

export function LatestList({ posts, trendingPosts }: LatestListProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <h2 className="section-title font-serif font-semibold text-text">
            Latest Posts
          </h2>
        </div>
        <Link
          href="/blog"
          className="hidden sm:flex items-center gap-1 text-sm text-muted hover:text-accent transition-colors"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main list */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-surface border border-border rounded-2xl p-5 sticky top-24">
            <p className="text-xs uppercase tracking-widest font-semibold text-muted mb-4">
              Popular right now
            </p>
            {trendingPosts.map((post) => (
              <PostCard key={post._id} post={post} variant="compact" />
            ))}
          </div>
        </aside>
      </div>

      <Link
        href="/blog"
        className="sm:hidden mt-6 flex items-center justify-center gap-1 text-sm text-muted hover:text-accent transition-colors"
      >
        View all posts
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </section>
  );
}
