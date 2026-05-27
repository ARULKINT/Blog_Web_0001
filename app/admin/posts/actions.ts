"use server";

import { connectDB } from "@/lib/db";
import { Post } from "@/lib/models/Post";
import { revalidatePath } from "next/cache";

export async function deletePost(id: string) {
  await connectDB();
  await Post.findByIdAndDelete(id);
  revalidatePath("/admin/posts");
  revalidatePath("/blog");
}
