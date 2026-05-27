import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const CommentSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, trim: true },
    status: { type: String, enum: ["pending", "approved", "spam"], default: "pending" },
    parent: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
  },
  { timestamps: true }
);

export type CommentDoc = InferSchemaType<typeof CommentSchema> & { _id: string };

export const Comment: Model<CommentDoc> =
  (models.Comment as Model<CommentDoc>) ??
  model<CommentDoc>("Comment", CommentSchema);
