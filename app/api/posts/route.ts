import { NextResponse } from "next/server";
import { getPaginatedPosts } from "@/lib/queries/posts";
import { isDBConfigured } from "@/lib/db";

export async function GET(req: Request) {
  if (!isDBConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(20, Math.max(1, Number(searchParams.get("limit") ?? 9)));
  const category = searchParams.get("category") ?? undefined;

  const data = await getPaginatedPosts(page, limit, category);
  return NextResponse.json(data);
}
