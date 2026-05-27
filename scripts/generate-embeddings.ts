/**
 * Generate OpenAI embeddings for all published posts and store in PostEmbedding collection.
 * Run with: npm run ai:embeddings
 *
 * Requires MONGODB_URI and OPENAI_API_KEY in .env.local
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" }); // fallback
import mongoose from "mongoose";
import { embedText } from "../lib/ai";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI not set");

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  // Dynamic imports to avoid model registration order issues
  const { Post } = await import("../lib/models/Post");
  const { PostEmbedding } = await import("../lib/models/PostEmbedding");

  const posts = await Post.find({ status: "published" }).select("title excerpt content").lean();
  console.log(`Generating embeddings for ${posts.length} posts…`);

  let done = 0;
  for (const post of posts) {
    const text = `${post.title}\n\n${post.excerpt}\n\n${post.content.replace(/<[^>]+>/g, " ")}`;
    try {
      const embedding = await embedText(text);
      await PostEmbedding.findOneAndUpdate(
        { postId: post._id },
        { postId: post._id, embedding, model: "text-embedding-3-small" },
        { upsert: true }
      );
      done++;
      console.log(`  ✓ ${post.title} (${done}/${posts.length})`);
    } catch (err) {
      console.error(`  ✗ ${post.title}:`, err);
    }
    // Small delay to avoid rate limits
    await new Promise((r) => setTimeout(r, 200));
  }

  await mongoose.disconnect();
  console.log(`Done — ${done} embeddings generated.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
