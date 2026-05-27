import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { Post } from "@/lib/models/Post";
import { Category } from "@/lib/models/Category";
import { Tag } from "@/lib/models/Tag";
import { User } from "@/lib/models/User";
import { calcReadingTime } from "@/lib/reading-time";
import { revalidatePath } from "next/cache";

const schema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().min(3).max(220).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  excerpt: z.string().min(10).max(500),
  content: z.string().min(20),
  coverImage: z.string().url().optional().or(z.literal("")),
  categoryId: z.string().min(1),
  tagIds: z.array(z.string()).optional(),
  status: z.enum(["draft", "published"]),
  featured: z.boolean().optional(),
  seo: z.object({
    title: z.string().max(80).optional(),
    description: z.string().max(200).optional(),
    ogImage: z.string().optional(),
  }).optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 422 });
  }

  await connectDB();

  const [category, author] = await Promise.all([
    Category.findById(parsed.data.categoryId),
    User.findOne({ email: session.user.email }),
  ]);

  if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });
  if (!author) return NextResponse.json({ error: "Author not found" }, { status: 404 });

  const existing = await Post.findOne({ slug: parsed.data.slug });
  if (existing) return NextResponse.json({ error: "Slug already in use" }, { status: 409 });

  const readingTime = calcReadingTime(parsed.data.content);

  const post = await Post.create({
    title: parsed.data.title,
    slug: parsed.data.slug,
    excerpt: parsed.data.excerpt,
    content: parsed.data.content,
    coverImage: parsed.data.coverImage ?? "",
    category: category._id,
    tags: parsed.data.tagIds ?? [],
    author: author._id,
    status: parsed.data.status,
    publishedAt: parsed.data.status === "published" ? new Date() : undefined,
    readingTime,
    featured: parsed.data.featured ?? false,
    seo: parsed.data.seo ?? {},
  });

  // Update category post count
  await Category.findByIdAndUpdate(category._id, { $inc: { postCount: 1 } });
  if (parsed.data.tagIds?.length) {
    await Tag.updateMany({ _id: { $in: parsed.data.tagIds } }, { $inc: { postCount: 1 } });
  }

  revalidatePath("/blog");
  revalidatePath("/admin/posts");
  revalidatePath("/");

  return NextResponse.json({ success: true, slug: post.slug }, { status: 201 });
}
