import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { Post } from "@/lib/models/Post";
import mongoose from "mongoose";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ bookmarked: false });

  const { slug } = await params;
  await connectDB();

  const post = await Post.findOne({ slug }).select("_id");
  if (!post) return NextResponse.json({ bookmarked: false });

  const user = await User.findById(session.user.id).select("bookmarks");
  const bookmarked = user?.bookmarks?.some(
    (id) => id.toString() === post._id.toString()
  ) ?? false;

  return NextResponse.json({ bookmarked });
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Sign in to bookmark" }, { status: 401 });

  const { slug } = await params;
  await connectDB();

  const post = await Post.findOne({ slug }).select("_id");
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const postId = post._id as unknown as mongoose.Types.ObjectId;
  const user = await User.findById(session.user.id).select("bookmarks");
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const alreadyBookmarked = user.bookmarks?.some(
    (id) => id.toString() === postId.toString()
  );

  if (alreadyBookmarked) {
    await User.findByIdAndUpdate(session.user.id, { $pull: { bookmarks: postId } });
    return NextResponse.json({ bookmarked: false });
  } else {
    await User.findByIdAndUpdate(session.user.id, { $addToSet: { bookmarks: postId } });
    return NextResponse.json({ bookmarked: true });
  }
}
