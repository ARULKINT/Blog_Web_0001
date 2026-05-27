import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { Post } from "@/lib/models/Post";
import { Category } from "@/lib/models/Category";
import { Tag } from "@/lib/models/Tag";
import { calcReadingTime } from "@/lib/reading-time";
import { revalidatePath } from "next/cache";

const schema = z.object({
  title: z.string().min(3).max(200).optional(),
  slug: z.string().min(3).max(220).regex(/^[a-z0-9-]+$/).optional(),
  excerpt: z.string().min(10).max(500).optional(),
  content: z.string().min(20).optional(),
  coverImage: z.string().optional(),
  categoryId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
  status: z.enum(["draft", "published"]).optional(),
  featured: z.boolean().optional(),
  seo: z.object({
    title: z.string().max(80).optional(),
    description: z.string().max(200).optional(),
    ogImage: z.string().optional(),
  }).optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 422 });
  }

  await connectDB();

  const post = await Post.findById(id);
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  const update: Record<string, unknown> = { ...parsed.data };

  if (parsed.data.categoryId) update.category = parsed.data.categoryId;
  if (parsed.data.tagIds) update.tags = parsed.data.tagIds;
  if (parsed.data.content) update.readingTime = calcReadingTime(parsed.data.content);
  if (parsed.data.status === "published" && post.status !== "published") {
    update.publishedAt = new Date();
    // Increment category postCount if newly published
    await Category.findByIdAndUpdate(post.category, { $inc: { postCount: 1 } });
    if (parsed.data.tagIds?.length) {
      await Tag.updateMany({ _id: { $in: parsed.data.tagIds } }, { $inc: { postCount: 1 } });
    }
  }

  delete update.categoryId;
  delete update.tagIds;

  const updated = await Post.findByIdAndUpdate(id, { $set: update }, { new: true });

  revalidatePath(`/blog/${updated?.slug ?? ""}`);
  revalidatePath("/blog");
  revalidatePath("/admin/posts");
  revalidatePath("/");

  return NextResponse.json({ success: true, slug: updated?.slug });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await connectDB();

  const post = await Post.findByIdAndDelete(id);
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  await Category.findByIdAndUpdate(post.category, { $inc: { postCount: -1 } });

  revalidatePath("/blog");
  revalidatePath("/admin/posts");

  return NextResponse.json({ success: true });
}
