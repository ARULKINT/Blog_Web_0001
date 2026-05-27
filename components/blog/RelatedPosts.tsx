import { PostCard } from "./PostCard";
import type { Post } from "@/types";

export function RelatedPosts({ posts }: { posts: Post[] }) {
  if (!posts.length) return null;

  return (
    <section className="mt-16 pt-12 border-t border-border">
      <h2 className="font-serif text-2xl font-semibold text-text mb-8">
        You might also like
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </section>
  );
}
