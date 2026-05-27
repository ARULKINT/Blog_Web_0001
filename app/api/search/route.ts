import { NextResponse } from "next/server";
import { searchPosts } from "@/lib/queries/posts";
import { isDBConfigured } from "@/lib/db";

export async function GET(req: Request) {
  if (!isDBConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();

  if (!q) {
    return NextResponse.json({ results: [], query: "" });
  }

  const results = await searchPosts(q, 10);
  return NextResponse.json({ results, query: q });
}
