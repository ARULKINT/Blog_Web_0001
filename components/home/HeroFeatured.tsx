import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import type { Post } from "@/types";

export function HeroFeatured({ post }: { post: Post }) {
  return (
    <section className="relative min-h-[75vh] flex items-end overflow-hidden rounded-3xl">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={post.coverImage || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1600"}
          alt={post.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 md:p-12 max-w-3xl">
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="solid" color={post.category?.color ?? "#6366F1"}>
            {post.category?.name}
          </Badge>
          <span className="text-white/70 text-sm flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {post.readingTime} min read
          </span>
        </div>

        <h1 className="font-serif text-white text-hero mb-4 leading-tight drop-shadow-sm">
          {post.title}
        </h1>

        <p className="text-white/80 text-base md:text-lg leading-relaxed mb-6 line-clamp-2">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            {post.author.avatar ? (
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={36}
                height={36}
                className="rounded-full object-cover border-2 border-white/30"
              />
            ) : (
              <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold text-white">
                {post.author.name[0]}
              </div>
            )}
            <div>
              <p className="text-white text-sm font-medium">{post.author.name}</p>
              <p className="text-white/60 text-xs">{formatDate(post.publishedAt)}</p>
            </div>
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors"
          >
            Read article
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function HeroFeaturedFallback() {
  return (
    <section className="relative min-h-[75vh] flex items-end overflow-hidden rounded-3xl bg-gradient-to-br from-accent/20 via-surface to-surface-2">
      <div className="relative z-10 p-8 md:p-12 max-w-3xl">
        <div className="space-y-4">
          <div className="h-6 w-32 skeleton rounded-full" />
          <div className="h-12 w-full skeleton" />
          <div className="h-12 w-4/5 skeleton" />
          <div className="h-4 w-full skeleton" />
          <div className="h-4 w-3/4 skeleton" />
        </div>
      </div>
    </section>
  );
}
