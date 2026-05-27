import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Post } from "@/lib/models/Post";
import { PostEmbedding } from "@/lib/models/PostEmbedding";
import { isAIConfigured, cosineSimilarity } from "@/lib/ai";

const LIMIT = 3;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  await connectDB();

  const post = await Post.findOne({ slug }).select("_id category").lean() as { _id: unknown; category: unknown } | null;
  if (!post) return NextResponse.json({ posts: [], source: "none" });

  // --- AI path ---
  if (isAIConfigured()) {
    const targetEmb = await PostEmbedding.findOne({ postId: post._id }).lean() as { embedding: number[] } | null;

    if (targetEmb) {
      const others = await PostEmbedding.find({ postId: { $ne: post._id } }).lean() as { postId: unknown; embedding: number[] }[];

      const scored = others
        .map((e) => ({ postId: e.postId, score: cosineSimilarity(targetEmb.embedding, e.embedding) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, LIMIT);

      const ids = scored.map((s) => s.postId);
      const posts = await Post.find({ _id: { $in: ids }, status: "published" })
        .populate("category", "name slug color")
        .populate("author", "name avatar")
        .lean();

      // Preserve similarity order
      const ordered = ids.map((id) => posts.find((p) => String(p._id) === String(id))).filter(Boolean);
      return NextResponse.json({ posts: JSON.parse(JSON.stringify(ordered)), source: "ai" });
    }
  }

  // --- Fallback: same-category posts ---
  const fallback = await Post.find({
    _id: { $ne: post._id },
    category: post.category,
    status: "published",
  })
    .limit(LIMIT)
    .populate("category", "name slug color")
    .populate("author", "name avatar")
    .lean();

  return NextResponse.json({ posts: JSON.parse(JSON.stringify(fallback)), source: "category" });
}
