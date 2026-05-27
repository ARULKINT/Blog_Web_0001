import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Post } from "@/lib/models/Post";

// Simple in-memory cooldown so a single visitor can't spam views.
// Resets on server restart — good enough for Phase 1/2.
const seen = new Map<string, number>();
const COOLDOWN_MS = 30 * 60 * 1000; // 30 minutes

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Use IP for cooldown key
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const key = `${ip}:${slug}`;
  const now = Date.now();

  if (seen.has(key) && now - seen.get(key)! < COOLDOWN_MS) {
    return NextResponse.json({ ok: true, skipped: true });
  }
  seen.set(key, now);

  await connectDB();
  await Post.findOneAndUpdate({ slug }, { $inc: { views: 1 } });
  return NextResponse.json({ ok: true });
}
