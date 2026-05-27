import Link from "next/link";
import { connectDB, isDBConfigured } from "@/lib/db";
import { Post } from "@/lib/models/Post";
import { Plus, Pencil, Eye, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

async function getPosts() {
  if (!isDBConfigured()) return [];
  await connectDB();
  return await Post.find()
    .sort({ createdAt: -1 })
    .populate("category", "name")
    .populate("author", "name")
    .lean() as unknown as {
      _id: unknown;
      title: string;
      slug: string;
      status: string;
      views: number;
      featured: boolean;
      publishedAt?: Date;
      createdAt: Date;
      category?: { name: string };
      author?: { name: string };
    }[];
}

export default async function AdminPostsPage() {
  const posts = await getPosts();

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-bold text-text">Posts</h1>
          <p className="text-muted text-sm mt-1">{posts.length} total posts</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New post
        </Link>
      </div>

      <div className="bg-surface border border-border rounded-2xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Views</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-muted">
                  No posts yet.{" "}
                  <Link href="/admin/posts/new" className="text-accent hover:underline">
                    Create your first post
                  </Link>
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={String(post._id)} className="border-b border-border last:border-0 hover:bg-surface-2 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-text max-w-xs truncate block">{post.title}</span>
                      {post.featured && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-highlight/20 text-highlight font-semibold">Featured</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted">{post.category?.name ?? "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      post.status === "published"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-surface-2 text-muted"
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted">{post.views.toLocaleString()}</td>
                  <td className="px-6 py-4 text-muted text-xs">
                    {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/posts/${String(post._id)}/edit`}
                        className="text-muted hover:text-accent transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="text-muted hover:text-text transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <DeletePostButton id={String(post._id)} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DeletePostButton({ id }: { id: string }) {
  return (
    <form
      action={async () => {
        "use server";
        const { connectDB } = await import("@/lib/db");
        const { Post } = await import("@/lib/models/Post");
        await connectDB();
        await Post.findByIdAndDelete(id);
        const { revalidatePath } = await import("next/cache");
        revalidatePath("/admin/posts");
        revalidatePath("/blog");
      }}
    >
      <button
        type="submit"
        className="text-muted hover:text-red-500 transition-colors"
        title="Delete"
        onClick={(e) => {
          if (!confirm("Delete this post? This cannot be undone.")) e.preventDefault();
        }}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </form>
  );
}
