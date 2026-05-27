import Image from "next/image";
import Link from "next/link";
import { Clock, Calendar, Eye, ThumbsUp } from "lucide-react";
import { formatDate, formatCount } from "@/lib/utils";
import type { Post } from "@/types";

export function PostMeta({ post }: { post: Post }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
      {/* Author */}
      <Link
        href={`/about`}
        className="flex items-center gap-2 hover:text-text transition-colors"
      >
        {post.author.avatar ? (
          <Image
            src={post.author.avatar}
            alt={post.author.name}
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-sm font-bold text-accent">
            {post.author.name[0]}
          </div>
        )}
        <span className="font-medium">{post.author.name}</span>
      </Link>

      <span className="flex items-center gap-1.5">
        <Calendar className="h-3.5 w-3.5" />
        {formatDate(post.publishedAt)}
      </span>

      <span className="flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5" />
        {post.readingTime} min read
      </span>

      <span className="flex items-center gap-1.5">
        <Eye className="h-3.5 w-3.5" />
        {formatCount(post.views)} views
      </span>

      <span className="flex items-center gap-1.5">
        <ThumbsUp className="h-3.5 w-3.5" />
        {formatCount(post.likes)}
      </span>
    </div>
  );
}
