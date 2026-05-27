import { Schema, model, models, type Model } from "mongoose";

const PostEmbeddingSchema = new Schema(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true, unique: true },
    embedding: { type: [Number], required: true },
    model: { type: String, default: "text-embedding-3-small" },
  },
  { timestamps: true }
);

export interface PostEmbeddingDoc {
  _id: string;
  postId: string;
  embedding: number[];
  model: string;
}

export const PostEmbedding: Model<PostEmbeddingDoc> =
  (models.PostEmbedding as Model<PostEmbeddingDoc>) ??
  model<PostEmbeddingDoc>("PostEmbedding", PostEmbeddingSchema);
