import Link from "next/link";
import Image from "next/image";
import { Clock, Eye } from "lucide-react";
import { cn, formatDate, formatCount } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import type { Post } from "@/types";

interface PostCardProps {
  post: Post;
  variant?: "default" | "featured" | "compact";
  className?: string;
}

export function PostCard({ post, variant = "default", className }: PostCardProps) {
  if (variant === "compact") {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className={cn(
          "flex gap-4 group py-4 border-b border-border last:border-0",
          className
        )}
      >
        {post.coverImage && (
          <div className="relative h-16 w-16 flex-shrink-0 rounded-xl overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="64px"
            />
          </div>
        )}
        <div className="flex flex-col justify-center gap-1">
          <p className="text-xs text-muted">{formatDate(post.publishedAt)}</p>
          <p className="text-sm font-semibold text-text line-clamp-2 group-hover:text-accent transition-colors">
            {post.title}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${post.slug}`} className={cn("block group", className)}>
      <article
        className={cn(
          "h-full bg-surface rounded-2xl border border-border shadow-card overflow-hidden",
          "transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5"
        )}
      >
        {/* Cover */}
        {post.coverImage && (
          <div className="relative h-48 overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Category overlay */}
            <div className="absolute top-3 left-3">
              <Badge
                variant="solid"
                color={post.category?.color ?? "#6366F1"}
                className="shadow-sm"
              >
                {post.category?.name}
              </Badge>
            </div>
          </div>
        )}

        <div className="p-5 flex flex-col gap-2">
          {!post.coverImage && (
            <Badge variant="solid" color={post.category?.color ?? "#6366F1"} className="self-start">
              {post.category?.name}
            </Badge>
          )}

          <h3 className="font-serif font-semibold text-text text-base leading-snug line-clamp-2 group-hover:text-accent transition-colors">
            {post.title}
          </h3>

          <p className="text-sm text-muted line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Meta row */}
          <div className="flex items-center justify-between pt-2 mt-auto">
            <div className="flex items-center gap-2">
              {post.author && (
                <>
                  {post.author.avatar ? (
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={28}
                      height={28}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
                      {post.author.name[0]}
                    </div>
                  )}
                  <span className="text-xs text-muted">{post.author.name}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.readingTime} min
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {formatCount(post.views)}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
