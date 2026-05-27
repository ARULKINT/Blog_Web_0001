import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" }); // fallback
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌  MONGODB_URI is not set in .env.local");
  process.exit(1);
}

// ─── Schemas (inline to avoid Next.js module issues) ──────────
const UserSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true }, passwordHash: String,
  role: { type: String, default: "author" }, avatar: String, bio: String,
  social: { twitter: String, github: String, website: String },
}, { timestamps: true });

const CategorySchema = new mongoose.Schema({
  name: String, slug: { type: String, unique: true }, description: String,
  color: String, icon: String, postCount: { type: Number, default: 0 },
}, { timestamps: true });

const TagSchema = new mongoose.Schema({
  name: String, slug: { type: String, unique: true },
  postCount: { type: Number, default: 0 },
}, { timestamps: true });

const PostSchema = new mongoose.Schema({
  title: String, slug: { type: String, unique: true }, excerpt: String,
  content: String, coverImage: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, default: "published" },
  publishedAt: Date, readingTime: Number,
  views: { type: Number, default: 0 }, likes: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  seo: { title: String, description: String, ogImage: String },
}, { timestamps: true });
PostSchema.index({ title: "text", excerpt: "text", content: "text" });

const User = mongoose.model("User", UserSchema);
const Category = mongoose.model("Category", CategorySchema);
const Tag = mongoose.model("Tag", TagSchema);
const Post = mongoose.model("Post", PostSchema);

// ─── Data ─────────────────────────────────────────────────────
const AUTHORS = [
  {
    name: "Alex Rivera",
    email: "alex@lumen.blog",
    role: "author",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    bio: "Design engineer writing about systems, craft, and the future of the web.",
    social: { twitter: "https://twitter.com", github: "https://github.com", website: "" },
  },
  {
    name: "Jordan Lee",
    email: "jordan@lumen.blog",
    role: "author",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face",
    bio: "Engineer and essayist. Writes about productivity, open source, and mental models.",
    social: { twitter: "https://twitter.com", github: "https://github.com", website: "" },
  },
  {
    name: "Maya Patel",
    email: "maya@lumen.blog",
    role: "author",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
    bio: "UX researcher covering design ethics, accessibility, and human-centered technology.",
    social: { twitter: "https://twitter.com", github: "https://github.com", website: "" },
  },
];

const CATEGORIES = [
  { name: "Technology", slug: "technology", description: "The latest in software, AI, and the web.", color: "#6366F1" },
  { name: "Design", slug: "design", description: "Visual thinking, UX, and craft.", color: "#F59E0B" },
  { name: "Productivity", slug: "productivity", description: "Systems, focus, and doing less better.", color: "#10B981" },
  { name: "Lifestyle", slug: "lifestyle", description: "Slow living, wellness, and intentional choices.", color: "#F43F5E" },
  { name: "Culture", slug: "culture", description: "Ideas, books, and the world around us.", color: "#8B5CF6" },
];

const TAGS = [
  "react", "nextjs", "typescript", "css", "design-systems",
  "ai", "productivity", "mental-models", "accessibility", "ux",
  "writing", "career",
];

const generateContent = (topic: string) => `
<p>In the ever-evolving landscape of ${topic}, the most enduring principles tend to be the simplest ones. After years of working at the intersection of design and engineering, I've come to believe that <strong>clarity is the rarest and most valuable skill</strong> you can cultivate.</p>

<h2 id="the-foundation">The Foundation</h2>
<p>Before we dive into specifics, it's worth asking: what does it actually mean to think clearly about ${topic}? Most practitioners would say it means understanding your tools. But I'd argue it means something deeper — understanding <em>why</em> your tools exist at all.</p>

<blockquote>
  <p>The best designs are invisible. The best code reads like prose. The best systems anticipate failure gracefully.</p>
</blockquote>

<p>This sounds obvious when stated plainly. But in practice, we constantly reach for complexity when simplicity would do. We add abstractions before understanding the primitives. We optimize before profiling. We design for hypothetical users instead of real ones.</p>

<h2 id="first-principles">Thinking in First Principles</h2>
<p>The antidote is first-principles thinking. Rather than reasoning by analogy (doing things because others do them), you decompose problems to their fundamental components and reason up from there.</p>

<p>In practical terms for ${topic}, this looks like:</p>
<ul>
  <li>Asking "what problem does this pattern solve?" before adopting it</li>
  <li>Treating best practices as defaults, not laws</li>
  <li>Measuring outcomes instead of tracking activity</li>
  <li>Preferring reversible decisions over irreversible ones</li>
</ul>

<pre><code class="language-typescript">// Instead of reaching for a library immediately:
// 1. Understand the problem
// 2. See if the platform solves it
// 3. Write the simplest solution that works
// 4. Only then consider abstraction

function debounce&lt;T extends (...args: unknown[]) => void&gt;(
  fn: T,
  delay: number
): T {
  let timer: ReturnType&lt;typeof setTimeout&gt;;
  return ((...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as T;
}</code></pre>

<h2 id="iteration-over-perfection">Iteration Over Perfection</h2>
<p>One of the most damaging myths in our industry is the idea that great work arrives fully formed. In reality, every excellent piece of work you've admired went through many iterations — most of them terrible.</p>

<p>The writers you love didn't write their best sentences first. The designers you follow didn't ship their best interfaces first. They iterated. They shipped something, learned from it, and made it better. The willingness to do this — to share imperfect work and refine it — is what separates practitioners from perfectionists.</p>

<h2 id="building-taste">Building Taste</h2>
<p>Taste is often treated as innate — something you either have or you don't. This is wrong. Taste is developed through sustained, deliberate exposure to excellent work and honest critique of your own output.</p>

<p>The gap between good taste and good execution is famously painful to inhabit. Ira Glass described it perfectly: your taste is already excellent, but your work hasn't caught up yet. The only solution is to close the gap through volume — make more, reflect more, improve more.</p>

<h2 id="the-long-game">The Long Game</h2>
<p>Finally, and perhaps most importantly: the skills that matter most compound over time. Technical skills become commodities. Taste, judgment, and the ability to communicate ideas clearly — these are durable advantages.</p>

<p>Invest in them accordingly.</p>
`.trim();

const POSTS = [
  {
    title: "The Principles Behind Great Design Systems",
    slug: "principles-great-design-systems",
    excerpt: "Design systems succeed or fail based on a few non-obvious principles. After auditing dozens of them, here is what actually matters.",
    coverImage: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&h=630&fit=crop",
    categorySlug: "design",
    authorEmail: "alex@lumen.blog",
    tags: ["design-systems", "css"],
    featured: true,
    views: 4820,
    likes: 312,
    daysAgo: 2,
  },
  {
    title: "How I Learned to Stop Worrying and Love TypeScript",
    slug: "stop-worrying-love-typescript",
    excerpt: "TypeScript's reputation for complexity is largely undeserved. Here's a pragmatic path from JavaScript skeptic to TypeScript advocate.",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop",
    categorySlug: "technology",
    authorEmail: "jordan@lumen.blog",
    tags: ["typescript", "react"],
    featured: false,
    views: 3100,
    likes: 204,
    daysAgo: 5,
  },
  {
    title: "Accessibility is Not a Feature — It's a Foundation",
    slug: "accessibility-not-a-feature",
    excerpt: "Every argument for treating accessibility as an afterthought has a stronger counter-argument. Let's settle this once and for all.",
    coverImage: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=1200&h=630&fit=crop",
    categorySlug: "design",
    authorEmail: "maya@lumen.blog",
    tags: ["accessibility", "ux"],
    featured: false,
    views: 2750,
    likes: 187,
    daysAgo: 8,
  },
  {
    title: "Building with Next.js 15: What's Changed and What Matters",
    slug: "nextjs-15-whats-changed",
    excerpt: "Next.js 15 ships significant changes to caching, the App Router, and server components. Here's what you need to know before upgrading.",
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=630&fit=crop",
    categorySlug: "technology",
    authorEmail: "alex@lumen.blog",
    tags: ["nextjs", "react"],
    featured: false,
    views: 5600,
    likes: 401,
    daysAgo: 12,
  },
  {
    title: "The Minimum Viable Productivity System",
    slug: "minimum-viable-productivity",
    excerpt: "Most productivity systems collapse under their own weight. Here's the simplest system I've found that actually sticks.",
    coverImage: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&h=630&fit=crop",
    categorySlug: "productivity",
    authorEmail: "jordan@lumen.blog",
    tags: ["productivity", "mental-models"],
    featured: false,
    views: 2200,
    likes: 155,
    daysAgo: 15,
  },
  {
    title: "Why AI Won't Replace Designers (But Will Change Everything)",
    slug: "ai-wont-replace-designers",
    excerpt: "The conversation about AI and creative work is muddled by bad analogies. Here's a clearer way to think about what's actually happening.",
    coverImage: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&h=630&fit=crop",
    categorySlug: "technology",
    authorEmail: "maya@lumen.blog",
    tags: ["ai", "design-systems"],
    featured: false,
    views: 6100,
    likes: 442,
    daysAgo: 18,
  },
  {
    title: "Color in UI Design: A Practical Guide",
    slug: "color-ui-design-practical-guide",
    excerpt: "Color is where most design systems break down. This is a ground-up framework for choosing, naming, and using colors that scale.",
    coverImage: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1200&h=630&fit=crop",
    categorySlug: "design",
    authorEmail: "alex@lumen.blog",
    tags: ["design-systems", "css", "ux"],
    featured: false,
    views: 3400,
    likes: 228,
    daysAgo: 22,
  },
  {
    title: "Writing Technical Posts People Actually Want to Read",
    slug: "writing-technical-posts",
    excerpt: "Technical writing is a craft as much as code is. These principles transformed how readers respond to my posts.",
    coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=630&fit=crop",
    categorySlug: "culture",
    authorEmail: "jordan@lumen.blog",
    tags: ["writing", "career"],
    featured: false,
    views: 1890,
    likes: 133,
    daysAgo: 26,
  },
  {
    title: "The 2-Hour Deep Work Block: Rebuilding Focus in a Distracted World",
    slug: "two-hour-deep-work-block",
    excerpt: "Distraction is structural, not personal. Here's a system for protecting your best cognitive hours from the tyranny of notifications.",
    coverImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=630&fit=crop",
    categorySlug: "productivity",
    authorEmail: "maya@lumen.blog",
    tags: ["productivity"],
    featured: false,
    views: 2900,
    likes: 201,
    daysAgo: 30,
  },
  {
    title: "Digital Minimalism: A Year Without Social Media",
    slug: "digital-minimalism-year-without-social-media",
    excerpt: "Twelve months ago I deleted every social media app. Here's what I gained, what I lost, and why I'm not going back.",
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop",
    categorySlug: "lifestyle",
    authorEmail: "alex@lumen.blog",
    tags: ["mental-models"],
    featured: false,
    views: 4200,
    likes: 318,
    daysAgo: 35,
  },
  {
    title: "React Server Components: A Mental Model",
    slug: "react-server-components-mental-model",
    excerpt: "RSC is the biggest paradigm shift in React since hooks. This mental model makes it click — even if you've read the docs three times.",
    coverImage: "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=1200&h=630&fit=crop",
    categorySlug: "technology",
    authorEmail: "jordan@lumen.blog",
    tags: ["react", "nextjs"],
    featured: false,
    views: 7200,
    likes: 520,
    daysAgo: 40,
  },
  {
    title: "The Books That Shaped How I Think About Work",
    slug: "books-shaped-how-i-think-about-work",
    excerpt: "Not a listicle. A curated set of books that genuinely changed how I approach problems, with honest notes on what to take from each.",
    coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=630&fit=crop",
    categorySlug: "culture",
    authorEmail: "maya@lumen.blog",
    tags: ["career", "mental-models", "writing"],
    featured: false,
    views: 3100,
    likes: 247,
    daysAgo: 45,
  },
];

// ─── Main ──────────────────────────────────────────────────────
async function seed() {
  console.log("🌱  Connecting to MongoDB…");
  await mongoose.connect(MONGODB_URI!);
  console.log("✅  Connected");

  // Clear existing
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Tag.deleteMany({}),
    Post.deleteMany({}),
  ]);
  console.log("🗑️   Cleared existing documents");

  // Insert users
  const users = await User.insertMany(AUTHORS);
  const userMap = new Map(users.map((u) => [u.email as string, u._id]));
  console.log(`👤  Inserted ${users.length} authors`);

  // Insert categories
  const cats = await Category.insertMany(CATEGORIES);
  const catMap = new Map(cats.map((c) => [c.slug as string, c._id]));
  console.log(`📂  Inserted ${cats.length} categories`);

  // Insert tags
  const tagDocs = await Tag.insertMany(
    TAGS.map((name) => ({ name, slug: name }))
  );
  const tagMap = new Map(tagDocs.map((t) => [t.slug as string, t._id]));
  console.log(`🏷️   Inserted ${tagDocs.length} tags`);

  // Insert posts
  const now = Date.now();
  const postDocs = POSTS.map((p) => ({
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    content: generateContent(p.title),
    coverImage: p.coverImage,
    category: catMap.get(p.categorySlug),
    tags: p.tags.map((t) => tagMap.get(t)).filter(Boolean),
    author: userMap.get(p.authorEmail),
    status: "published",
    publishedAt: new Date(now - p.daysAgo * 24 * 60 * 60 * 1000),
    readingTime: Math.ceil(Math.random() * 5) + 3,
    views: p.views,
    likes: p.likes,
    featured: p.featured,
    seo: { title: p.title, description: p.excerpt, ogImage: p.coverImage },
  }));

  await Post.insertMany(postDocs);
  console.log(`📝  Inserted ${postDocs.length} posts`);

  // Update category post counts
  for (const [slug, id] of catMap) {
    const count = await Post.countDocuments({ category: id });
    await Category.updateOne({ slug }, { postCount: count });
  }
  console.log("🔢  Updated post counts");

  await mongoose.disconnect();
  console.log("✅  Seed complete! Run npm run dev and visit http://localhost:3000");
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err);
  process.exit(1);
});
