import { connectDB } from "@/lib/db";
import { Category } from "@/lib/models/Category";
import "@/lib/models/Post";
import "@/lib/models/Tag";
import "@/lib/models/User";
import type { Category as CategoryType } from "@/types";

function toJSON<T>(doc: unknown): T {
  return JSON.parse(JSON.stringify(doc)) as T;
}

export async function getAllCategories(): Promise<CategoryType[]> {
  await connectDB();
  const docs = await Category.find().sort({ postCount: -1 }).lean();
  return toJSON<CategoryType[]>(docs);
}

export async function getCategoryBySlug(
  slug: string
): Promise<CategoryType | null> {
  await connectDB();
  const doc = await Category.findOne({ slug }).lean();
  if (!doc) return null;
  return toJSON<CategoryType>(doc);
}

export async function getAllCategorySlugs(): Promise<string[]> {
  await connectDB();
  const docs = await Category.find({}, { slug: 1 }).lean();
  return (docs as { slug: string }[]).map((d) => d.slug);
}
