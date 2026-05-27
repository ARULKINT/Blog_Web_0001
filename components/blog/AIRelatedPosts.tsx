"use client";

import { useEffect, useState } from "react";
import { PostCard } from "./PostCard";
import { PostCardSkeleton } from "@/components/ui/Skeleton";
import { Sparkles } from "lucide-react";
import type { Post } from "@/types";

interface AIRelatedPostsProps {
  slug: string;
  /** Fallback posts (from server) shown until AI response arrives */
  fallback: Post[];
}

export function AIRelatedPosts({ slug, fallback }: AIRelatedPostsProps) {
  const [posts, setPosts] = useState<Post[]>(fallback);
  const [loading, setLoading] = useState(true);
  const [isAI, setIsAI] = useState(false);

  useEffect(() => {
    fetch(`/api/posts/${slug}/similar`)
      .then((r) => r.json())
      .then((data) => {
        if (data.posts?.length) {
          setPosts(data.posts);
          setIsAI(data.source === "ai");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (!loading && posts.length === 0) return null;

  return (
    <section className="mt-16">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="font-serif text-xl font-semibold text-text">You may also like</h2>
        {isAI && !loading && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-accent/10 text-accent">
            <Sparkles className="h-3 w-3" />
            AI
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <PostCardSkeleton key={i} />)
          : posts.map((post) => <PostCard key={post._id} post={post} />)}
      </div>
    </section>
  );
}
