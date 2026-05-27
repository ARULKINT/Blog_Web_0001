import { connectDB, isDBConfigured } from "@/lib/db";
import { Tag } from "@/lib/models/Tag";
import { TagManager } from "./TagManager";

async function getTags() {
  if (!isDBConfigured()) return [];
  await connectDB();
  const tags = await Tag.find().sort({ name: 1 }).lean();
  return tags.map((t) => ({
    _id: String(t._id),
    name: t.name,
    slug: t.slug,
    postCount: t.postCount ?? 0,
  }));
}

export default async function AdminTagsPage() {
  const tags = await getTags();

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-text">Tags</h1>
        <p className="text-muted text-sm mt-1">
          Manage post tags for better content discovery.
        </p>
      </div>
      <TagManager initial={tags} />
    </div>
  );
}
