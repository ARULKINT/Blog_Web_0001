import { connectDB, isDBConfigured } from "@/lib/db";
import { Comment } from "@/lib/models/Comment";
import { formatDate } from "@/lib/utils";
import { CommentModerationRow } from "./CommentModerationRow";

async function getComments() {
  if (!isDBConfigured()) return [];
  await connectDB();
  return await Comment.find()
    .sort({ createdAt: -1 })
    .populate("user", "name email")
    .populate("post", "title slug")
    .lean() as unknown as {
      _id: unknown;
      content: string;
      status: string;
      createdAt: Date;
      user?: { name: string; email: string };
      post?: { title: string; slug: string };
    }[];
}

export default async function AdminCommentsPage() {
  const comments = await getComments();
  const pending = comments.filter((c) => c.status === "pending");
  const approved = comments.filter((c) => c.status === "approved");
  const spam = comments.filter((c) => c.status === "spam");

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-text">Comments</h1>
        <p className="text-muted text-sm mt-1">
          {pending.length} pending · {approved.length} approved · {spam.length} spam
        </p>
      </div>

      {comments.length === 0 ? (
        <div className="text-center py-20 text-muted">No comments yet.</div>
      ) : (
        <div className="bg-surface border border-border rounded-2xl shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Comment</th>
                <th className="px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Post</th>
                <th className="px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((comment) => (
                <CommentModerationRow
                  key={String(comment._id)}
                  id={String(comment._id)}
                  content={comment.content}
                  status={comment.status}
                  date={formatDate(comment.createdAt)}
                  userName={comment.user?.name ?? "Unknown"}
                  postTitle={comment.post?.title ?? "Unknown post"}
                  postSlug={comment.post?.slug ?? ""}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
