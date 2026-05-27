import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { Comment } from "@/lib/models/Comment";
import { Post } from "@/lib/models/Post";

const schema = z.object({
  postId: z.string().min(1),
  content: z.string().min(2).max(2000),
  parentId: z.string().optional(),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");
  if (!postId) return NextResponse.json({ error: "postId required" }, { status: 400 });

  await connectDB();
  const comments = await Comment.find({ post: postId, status: "approved", parent: null })
    .populate("user", "name avatar")
    .sort({ createdAt: -1 })
    .lean();

  const withReplies = await Promise.all(
    (comments as { _id: unknown }[]).map(async (c) => {
      const replies = await Comment.find({ parent: c._id, status: "approved" })
        .populate("user", "name avatar")
        .sort({ createdAt: 1 })
        .lean();
      return { ...c, replies };
    })
  );

  return NextResponse.json(JSON.parse(JSON.stringify(withReplies)));
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Sign in to comment" }, { status: 401 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 422 });
  }

  await connectDB();

  const post = await Post.findById(parsed.data.postId);
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  const { User } = await import("@/lib/models/User");
  const user = await User.findOne({ email: session.user.email });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const comment = await Comment.create({
    post: parsed.data.postId,
    user: user._id,
    content: parsed.data.content,
    parent: parsed.data.parentId ?? null,
    status: "pending",
  });

  return NextResponse.json(
    { success: true, id: comment._id, message: "Comment submitted for moderation." },
    { status: 201 }
  );
}
