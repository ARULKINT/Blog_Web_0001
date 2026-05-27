import { TrendingUp } from "lucide-react";
import { PostCard } from "@/components/blog/PostCard";
import type { Post } from "@/types";

export function TrendingGrid({ posts }: { posts: Post[] }) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-5 w-5 text-highlight" />
        <h2 className="section-title font-serif font-semibold text-text">
          Trending
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </section>
  );
}
