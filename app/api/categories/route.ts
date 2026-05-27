import { NextResponse } from "next/server";
import { getAllCategories } from "@/lib/queries/categories";
import { isDBConfigured } from "@/lib/db";

export async function GET() {
  if (!isDBConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  const categories = await getAllCategories();
  return NextResponse.json(categories);
}
