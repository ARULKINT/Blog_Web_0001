import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { PostMeta } from "@/components/blog/PostMeta";
import { StickyShareBar } from "@/components/blog/StickyShareBar";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { AIRelatedPosts } from "@/components/blog/AIRelatedPosts";
import { Badge } from "@/components/ui/Badge";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPostBySlug, getRelatedPosts, getAllPostSlugs } from "@/lib/queries/posts";
import { buildPostMetadata, blogPostingJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { CommentSection } from "@/components/blog/CommentSection";
import { LikeButton } from "@/components/blog/LikeButton";
import { BookmarkButton } from "@/components/blog/BookmarkButton";
import { ViewTracker } from "@/components/blog/ViewTracker";
import { AdSlot } from "@/components/ads/AdSlot";
import { PaywallGate } from "@/components/paywall/PaywallGate";
import { absoluteUrl } from "@/lib/utils";
import { isDBConfigured } from "@/lib/db";
import DOMPurify from "isomorphic-dompurify";
import Link from "next/link";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isDBConfigured()) return {};
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return buildPostMetadata(post);
}

export async function generateStaticParams() {
  if (!isDBConfigured()) return [];
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export const revalidate = 3600;

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  if (!isDBConfigured()) {
    return (
      <Container narrow className="py-20 text-center">
        <p className="text-muted">Database not configured.</p>
      </Container>
    );
  }

  const [post, session] = await Promise.all([getPostBySlug(slug), import("@/auth").then(m => m.auth())]);
  if (!post) notFound();

  // Access control: subscriber-only posts
  const isSubscriberPost = (post as { access?: string }).access === "subscriber";
  let isSubscriber = false;
  if (isSubscriberPost && session?.user?.id) {
    const { connectDB } = await import("@/lib/db");
    const { User } = await import("@/lib/models/User");
    await connectDB();
    const user = await User.findById(session.user.id).select("isSubscriber").lean() as { isSubscriber?: boolean } | null;
    isSubscriber = user?.isSubscriber ?? false;
  }
  const showPaywall = isSubscriberPost && !isSubscriber;

  const related = await getRelatedPosts(
    post._id,
    post.category._id,
    3
  );

  const postUrl = absoluteUrl(`/blog/${post.slug}`);
  const sanitizedContent = DOMPurify.sanitize(post.content);
  // For paywalled posts show only first ~300 words as preview
  const previewContent = showPaywall
    ? DOMPurify.sanitize(post.content.split("</p>").slice(0, 3).join("</p>") + "</p>")
    : sanitizedContent;

  return (
    <>
      <JsonLd data={blogPostingJsonLd(post)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: absoluteUrl("/") },
          { name: "Blog", url: absoluteUrl("/blog") },
          { name: post.title, url: postUrl },
        ])}
      />

      <StickyShareBar title={post.title} url={postUrl} />

      {/* Hero */}
      <div className="relative h-64 md:h-96 mb-10 overflow-hidden">
        {post.coverImage ? (
          <>
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />
          </>
        ) : (
          <div className="h-full gradient-hero" />
        )}
      </div>

      <Container>
        <div className="flex flex-col xl:flex-row gap-12">
          {/* Article */}
          <article className="flex-1 min-w-0">
            {/* Category + tags */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Link href={`/category/${post.category.slug}`}>
                <Badge variant="solid" color={post.category.color}>
                  {post.category.name}
                </Badge>
              </Link>
              {post.tags?.map((tag) => (
                <Badge key={tag._id} variant="outline">
                  #{tag.name}
                </Badge>
              ))}
            </div>

            <h1 className="font-serif text-hero font-bold text-text mb-5 leading-tight">
              {post.title}
            </h1>

            <PostMeta post={post} />

            {/* Like + Bookmark */}
            <div className="mt-4 mb-2 flex items-center gap-3">
              <LikeButton slug={post.slug} initialLikes={post.likes ?? 0} />
              <BookmarkButton slug={post.slug} postId={post._id} />
            </div>

            {/* View tracker (fires once on mount) */}
            <ViewTracker slug={post.slug} />

            {/* Excerpt */}
            <p className="mt-6 mb-8 text-lg text-muted leading-relaxed border-l-4 border-accent pl-4">
              {post.excerpt}
            </p>

            {/* Body */}
            {showPaywall ? (
              <PaywallGate previewHtml={previewContent} />
            ) : (
              <div
                className="prose prose-base dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />
            )}

            {/* Related — AI-powered with server fallback */}
            <AIRelatedPosts slug={post.slug} fallback={related} />

            {/* Comments */}
            <CommentSection postId={post._id} />
          </article>

          {/* Right rail: TOC + Ad */}
          <aside className="hidden xl:block w-60 flex-shrink-0">
            <div className="sticky top-28 space-y-6">
              <TableOfContents />
              <AdSlot format="rectangle" />
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
