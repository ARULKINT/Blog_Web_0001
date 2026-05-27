import { connectDB, isDBConfigured } from "@/lib/db";
import { Post } from "@/lib/models/Post";
import { User } from "@/lib/models/User";
import { Comment } from "@/lib/models/Comment";
import { Category } from "@/lib/models/Category";
import { FileText, Users, MessageSquare, FolderOpen, Plus, Eye } from "lucide-react";
import Link from "next/link";

async function getStats() {
  if (!isDBConfigured()) return { posts: 0, users: 0, pendingComments: 0, categories: 0, views: 0 };
  await connectDB();
  const [posts, users, pendingComments, categories, viewsAgg] = await Promise.all([
    Post.countDocuments({ status: "published" }),
    User.countDocuments(),
    Comment.countDocuments({ status: "pending" }),
    Category.countDocuments(),
    Post.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]),
  ]);
  return { posts, users, pendingComments, categories, views: (viewsAgg[0]?.total as number) ?? 0 };
}

async function getRecentPosts() {
  if (!isDBConfigured()) return [];
  await connectDB();
  return await Post.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select("title status views publishedAt slug")
    .lean() as unknown as { _id: unknown; title: string; status: string; views: number; publishedAt?: Date; slug: string }[];
}

export default async function AdminDashboard() {
  const [stats, recentPosts] = await Promise.all([getStats(), getRecentPosts()]);

  const STAT_CARDS = [
    { label: "Published Posts", value: stats.posts, icon: FileText, color: "text-accent", bg: "bg-accent/10" },
    { label: "Total Views", value: stats.views.toLocaleString(), icon: Eye, color: "text-highlight", bg: "bg-highlight/10" },
    { label: "Pending Comments", value: stats.pendingComments, icon: MessageSquare, color: "text-green-500", bg: "bg-green-500/10", href: "/admin/comments" },
    { label: "Total Users", value: stats.users, icon: Users, color: "text-purple-500", bg: "bg-purple-500/10", href: "/admin/users" },
  ];

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-bold text-text">Dashboard</h1>
          <p className="text-muted text-sm mt-1">Overview of your blog&apos;s performance</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New post
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          const cardClass = "bg-surface border border-border rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all";
          const inner = (
            <>
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${card.bg} ${card.color} mb-3`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold text-text">{card.value}</p>
              <p className="text-xs text-muted mt-1">{card.label}</p>
            </>
          );
          return card.href ? (
            <Link key={card.label} href={card.href} className={cardClass}>{inner}</Link>
          ) : (
            <div key={card.label} className={cardClass}>{inner}</div>
          );
        })}
      </div>

      {/* Recent posts */}
      <div className="bg-surface border border-border rounded-2xl shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-text text-sm">Recent Posts</h2>
          <Link href="/admin/posts" className="text-xs text-accent hover:underline">View all</Link>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Views</th>
              <th className="px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentPosts.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-muted">No posts yet. <Link href="/admin/posts/new" className="text-accent hover:underline">Create your first post</Link>.</td></tr>
            ) : recentPosts.map((post) => (
              <tr key={String(post._id)} className="border-b border-border last:border-0 hover:bg-surface-2 transition-colors">
                <td className="px-6 py-4 font-medium text-text max-w-xs truncate">{post.title}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${post.status === "published" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-surface-2 text-muted"}`}>
                    {post.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted">{post.views.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/posts/${String(post._id)}/edit`} className="text-accent hover:underline text-xs">Edit</Link>
                    <Link href={`/blog/${post.slug}`} target="_blank" className="text-muted hover:text-text text-xs">View</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
