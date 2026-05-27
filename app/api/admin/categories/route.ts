import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { Category } from "@/lib/models/Category";
import { slugify } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(1).max(60),
  slug: z.string().min(1).max(80).optional(),
  description: z.string().max(300).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  icon: z.string().max(10).optional(),
});

async function requireAdmin() {
  const session = await auth();
  return session?.user?.role === "admin" ? session : null;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await connectDB();
  const categories = await Category.find().sort({ name: 1 }).lean();
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const { name, description, color, icon } = parsed.data;
  const slug = parsed.data.slug ?? slugify(name);

  await connectDB();

  const existing = await Category.findOne({ slug });
  if (existing) return NextResponse.json({ error: "Slug already taken" }, { status: 409 });

  const category = await Category.create({ name, slug, description: description ?? "", color: color ?? "#6366F1", icon: icon ?? "" });
  return NextResponse.json(category, { status: 201 });
}
