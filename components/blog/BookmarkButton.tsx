"use client";

import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  slug: string;
  postId: string;
}

export function BookmarkButton({ slug, postId: _postId }: BookmarkButtonProps) {
  const { data: session } = useSession();
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch initial bookmark status
  useEffect(() => {
    if (!session) return;
    fetch(`/api/posts/${slug}/bookmark`)
      .then((r) => r.json())
      .then((data) => setBookmarked(data.bookmarked ?? false))
      .catch(() => {});
  }, [slug, session]);

  const handleToggle = async () => {
    if (!session || loading) return;
    setLoading(true);
    const prev = bookmarked;
    setBookmarked(!prev); // optimistic
    try {
      const res = await fetch(`/api/posts/${slug}/bookmark`, { method: "POST" });
      const data = await res.json();
      setBookmarked(data.bookmarked ?? prev);
    } catch {
      setBookmarked(prev); // revert on error
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={!session || loading}
      title={
        session
          ? bookmarked
            ? "Remove bookmark"
            : "Bookmark this post"
          : "Sign in to bookmark"
      }
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200 text-sm font-medium",
        bookmarked
          ? "bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-900/20 dark:border-amber-800"
          : "border-border text-muted hover:border-amber-300 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/10",
        !session && "opacity-60 cursor-default"
      )}
    >
      <Bookmark className={cn("h-4 w-4 transition-all", bookmarked && "fill-current")} />
      {bookmarked ? "Saved" : "Save"}
    </button>
  );
}
