import { notFound } from "next/navigation";
import { connectDB, isDBConfigured } from "@/lib/db";
import { Post } from "@/lib/models/Post";
import { Category } from "@/lib/models/Category";
import { Tag } from "@/lib/models/Tag";
import { PostForm } from "@/components/admin/PostForm";

function toJSON<T>(doc: unknown): T {
  return JSON.parse(JSON.stringify(doc)) as T;
}

async function getData(id: string) {
  if (!isDBConfigured()) return null;
  await connectDB();
  const [post, categories, tags] = await Promise.all([
    Post.findById(id).lean(),
    Category.find().sort({ name: 1 }).lean(),
    Tag.find().sort({ name: 1 }).lean(),
  ]);
  if (!post) return null;
  return {
    post: toJSON<{
      _id: string; title: string; slug: string; excerpt: string; content: string;
      coverImage: string; category: string; tags: string[]; status: string;
      featured: boolean; seo: { title?: string; description?: string };
    }>(post),
    categories: toJSON<{ _id: string; name: string; slug: string; description: string; color: string; icon: string; postCount: number }[]>(categories),
    tags: toJSON<{ _id: string; name: string }[]>(tags),
  };
}

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const data = await getData(id);
  if (!data) notFound();

  const { post, categories, tags } = data;

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-text">Edit Post</h1>
        <p className="text-muted text-sm mt-1 truncate">{post.title}</p>
      </div>
      <PostForm
        categories={categories}
        tags={tags}
        postId={post._id}
        defaultValues={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage,
          categoryId: post.category,
          tagIds: post.tags,
          status: post.status as "draft" | "published",
          featured: post.featured,
          seo: post.seo,
        }}
      />
    </div>
  );
}
