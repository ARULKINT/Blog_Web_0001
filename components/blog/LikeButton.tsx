"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { cn, formatCount } from "@/lib/utils";

interface LikeButtonProps {
  slug: string;
  initialLikes: number;
}

export function LikeButton({ slug, initialLikes }: LikeButtonProps) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (!session || liked || loading) return;
    setLoading(true);
    setLiked(true);
    setLikes((n) => n + 1);
    await fetch(`/api/posts/${slug}/like`, { method: "POST" });
    setLoading(false);
  };

  return (
    <button
      onClick={handleLike}
      disabled={liked || !session}
      title={session ? (liked ? "Liked!" : "Like this post") : "Sign in to like"}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200 text-sm font-medium",
        liked
          ? "bg-red-50 border-red-200 text-red-500 dark:bg-red-900/20 dark:border-red-800"
          : "border-border text-muted hover:border-red-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10",
        !session && "opacity-60 cursor-default"
      )}
    >
      <Heart className={cn("h-4 w-4 transition-all", liked && "fill-current")} />
      {formatCount(likes)}
    </button>
  );
}
