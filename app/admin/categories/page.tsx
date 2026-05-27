import { connectDB, isDBConfigured } from "@/lib/db";
import { Category } from "@/lib/models/Category";
import { CategoryManager } from "./CategoryManager";

async function getCategories() {
  if (!isDBConfigured()) return [];
  await connectDB();
  const cats = await Category.find().sort({ name: 1 }).lean();
  return cats.map((c) => ({
    _id: String(c._id),
    name: c.name,
    slug: c.slug,
    description: c.description ?? "",
    color: c.color ?? "#6366F1",
    icon: c.icon ?? "",
    postCount: c.postCount ?? 0,
  }));
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-text">Categories</h1>
        <p className="text-muted text-sm mt-1">
          Manage blog categories and their appearance.
        </p>
      </div>
      <CategoryManager initial={categories} />
    </div>
  );
}
