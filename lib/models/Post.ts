import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const PostSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    coverImage: { type: String, default: "" },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    publishedAt: { type: Date },
    readingTime: { type: Number, default: 1 },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    access: { type: String, enum: ["public", "subscriber"], default: "public" },
    seo: {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
      ogImage: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

PostSchema.index({ title: "text", excerpt: "text", content: "text" });
// slug already indexed via unique:true in field definition — no duplicate needed
PostSchema.index({ status: 1, publishedAt: -1 });
PostSchema.index({ category: 1, status: 1 });
PostSchema.index({ featured: 1, status: 1 });

export type PostDoc = InferSchemaType<typeof PostSchema> & { _id: string };

export const Post: Model<PostDoc> =
  (models.Post as Model<PostDoc>) ?? model<PostDoc>("Post", PostSchema);
