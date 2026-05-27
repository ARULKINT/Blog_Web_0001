import { connectDB, isDBConfigured } from "@/lib/db";
import { Category } from "@/lib/models/Category";
import { Tag } from "@/lib/models/Tag";
import { PostForm } from "@/components/admin/PostForm";

async function getData() {
  if (!isDBConfigured()) return { categories: [], tags: [] };
  await connectDB();
  const [categories, tags] = await Promise.all([
    Category.find().sort({ name: 1 }).lean(),
    Tag.find().sort({ name: 1 }).lean(),
  ]);
  return {
    categories: JSON.parse(JSON.stringify(categories)) as { _id: string; name: string; slug: string; description: string; color: string; icon: string; postCount: number }[],
    tags: JSON.parse(JSON.stringify(tags)) as { _id: string; name: string }[],
  };
}

export default async function NewPostPage() {
  const { categories, tags } = await getData();

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-text">New Post</h1>
        <p className="text-muted text-sm mt-1">Write and publish a new article</p>
      </div>
      <PostForm categories={categories} tags={tags} />
    </div>
  );
}
