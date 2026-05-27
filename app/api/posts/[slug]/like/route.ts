import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { Post } from "@/lib/models/Post";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Sign in to like" }, { status: 401 });

  const { slug } = await params;
  await connectDB();

  const post = await Post.findOneAndUpdate(
    { slug },
    { $inc: { likes: 1 } },
    { new: true }
  );

  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ likes: post.likes });
}
