import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { Comment } from "@/lib/models/Comment";
import { revalidatePath } from "next/cache";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { status } = await req.json() as { status: string };

  if (!["approved", "spam", "pending"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 422 });
  }

  await connectDB();
  await Comment.findByIdAndUpdate(id, { status });
  revalidatePath("/admin/comments");

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await connectDB();
  await Comment.findByIdAndDelete(id);
  revalidatePath("/admin/comments");

  return NextResponse.json({ success: true });
}
