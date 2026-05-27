import { Container } from "@/components/ui/Container";
import { HeroFeatured, HeroFeaturedFallback } from "@/components/home/HeroFeatured";
import { TrendingGrid } from "@/components/home/TrendingGrid";
import { LatestList } from "@/components/home/LatestList";
import { CategoryPills } from "@/components/home/CategoryPills";
import { NewsletterCTA } from "@/components/home/NewsletterCTA";
import { Testimonials } from "@/components/home/Testimonials";
import { getFeaturedPost, getTrendingPosts, getLatestPosts } from "@/lib/queries/posts";
import { getAllCategories } from "@/lib/queries/categories";
import { isDBConfigured } from "@/lib/db";
import { AdSlot } from "@/components/ads/AdSlot";

export const revalidate = 60;

export default async function HomePage() {
  const dbReady = isDBConfigured();

  const [featured, trending, latest, categories] = dbReady
    ? await Promise.all([
        getFeaturedPost(),
        getTrendingPosts(3),
        getLatestPosts(6),
        getAllCategories(),
      ])
    : [null, [], [], []];

  return (
    <>
      {/* Hero */}
      <Container className="py-8">
        {featured ? (
          <HeroFeatured post={featured} />
        ) : (
          <HeroFeaturedFallback />
        )}
      </Container>

      {/* Trending */}
      {trending.length > 0 && (
        <Container className="py-12">
          <TrendingGrid posts={trending} />
        </Container>
      )}

      {/* Ad — between Trending and Latest */}
      <Container className="py-4 flex justify-center">
        <AdSlot format="leaderboard" />
      </Container>

      {/* Latest + sidebar */}
      {latest.length > 0 && (
        <Container className="py-12">
          <LatestList posts={latest} trendingPosts={trending} />
        </Container>
      )}

      {/* No content fallback */}
      {!dbReady || (!featured && !trending.length && !latest.length) ? (
        <Container className="py-20 text-center">
          <h1 className="font-serif text-display font-bold gradient-text mb-4">
            Welcome to Ink & Ideas
          </h1>
          <p className="text-muted text-lg max-w-xl mx-auto mb-6">
            Your premium blog platform is ready. Configure your{" "}
            <code className="text-accent">.env.local</code> with a MongoDB URI and run{" "}
            <code className="text-accent">npm run db:seed</code> to get started.
          </p>
        </Container>
      ) : null}

      {/* Categories */}
      {categories.length > 0 && (
        <Container className="py-12">
          <CategoryPills categories={categories} />
        </Container>
      )}

      {/* Newsletter */}
      <Container className="py-12">
        <NewsletterCTA />
      </Container>

      {/* Testimonials */}
      <Container className="py-12">
        <Testimonials />
      </Container>
    </>
  );
}
