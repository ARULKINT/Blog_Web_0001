import { connectDB } from "@/lib/db";
import { Post } from "@/lib/models/Post";
// These imports ensure Mongoose registers all referenced schemas before any query runs
import "@/lib/models/User";
import "@/lib/models/Category";
import "@/lib/models/Tag";
import type { Post as PostType, PaginatedPosts } from "@/types";

const POPULATE_AUTHOR = "name avatar bio social";
const POPULATE_CATEGORY = "name slug color icon";
const POPULATE_TAGS = "name slug";

function toJSON<T>(doc: unknown): T {
  return JSON.parse(JSON.stringify(doc)) as T;
}

export async function getFeaturedPost(): Promise<PostType | null> {
  await connectDB();
  const doc = await Post.findOne({ status: "published", featured: true })
    .sort({ publishedAt: -1 })
    .populate("author", POPULATE_AUTHOR)
    .populate("category", POPULATE_CATEGORY)
    .populate("tags", POPULATE_TAGS)
    .lean();
  if (!doc) return null;
  return toJSON<PostType>(doc);
}

export async function getTrendingPosts(limit = 3): Promise<PostType[]> {
  await connectDB();
  const docs = await Post.find({ status: "published" })
    .sort({ views: -1, likes: -1, publishedAt: -1 })
    .limit(limit)
    .populate("author", POPULATE_AUTHOR)
    .populate("category", POPULATE_CATEGORY)
    .lean();
  return toJSON<PostType[]>(docs);
}

export async function getLatestPosts(limit = 6): Promise<PostType[]> {
  await connectDB();
  const docs = await Post.find({ status: "published" })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .populate("author", POPULATE_AUTHOR)
    .populate("category", POPULATE_CATEGORY)
    .lean();
  return toJSON<PostType[]>(docs);
}

export async function getPaginatedPosts(
  page = 1,
  limit = 9,
  categorySlug?: string
): Promise<PaginatedPosts> {
  await connectDB();

  const filter: Record<string, unknown> = { status: "published" };

  if (categorySlug) {
    const { Category } = await import("@/lib/models/Category");
    const cat = await Category.findOne({ slug: categorySlug }).lean();
    if (cat) filter.category = (cat as { _id: unknown })._id;
  }

  const skip = (page - 1) * limit;
  const [docs, total] = await Promise.all([
    Post.find(filter)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", POPULATE_AUTHOR)
      .populate("category", POPULATE_CATEGORY)
      .lean(),
    Post.countDocuments(filter),
  ]);

  return {
    posts: toJSON<PostType[]>(docs),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getPostBySlug(slug: string): Promise<PostType | null> {
  await connectDB();
  const doc = await Post.findOne({ slug, status: "published" })
    .populate("author", POPULATE_AUTHOR)
    .populate("category", POPULATE_CATEGORY)
    .populate("tags", POPULATE_TAGS)
    .lean();
  if (!doc) return null;
  return toJSON<PostType>(doc);
}

export async function getRelatedPosts(
  postId: string,
  categoryId: string,
  limit = 3
): Promise<PostType[]> {
  await connectDB();
  const docs = await Post.find({
    status: "published",
    _id: { $ne: postId },
    category: categoryId,
  })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .populate("author", POPULATE_AUTHOR)
    .populate("category", POPULATE_CATEGORY)
    .lean();
  return toJSON<PostType[]>(docs);
}

export async function searchPosts(query: string, limit = 10): Promise<PostType[]> {
  await connectDB();
  const docs = await Post.find(
    { $text: { $search: query }, status: "published" },
    { score: { $meta: "textScore" } }
  )
    .sort({ score: { $meta: "textScore" } })
    .limit(limit)
    .populate("author", POPULATE_AUTHOR)
    .populate("category", POPULATE_CATEGORY)
    .lean();
  return toJSON<PostType[]>(docs);
}

export async function getAllPostSlugs(): Promise<string[]> {
  await connectDB();
  const docs = await Post.find({ status: "published" }, { slug: 1 }).lean();
  return (docs as { slug: string }[]).map((d) => d.slug);
}
