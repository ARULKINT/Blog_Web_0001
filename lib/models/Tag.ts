import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const TagSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    postCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type TagDoc = InferSchemaType<typeof TagSchema> & { _id: string };

export const Tag: Model<TagDoc> =
  (models.Tag as Model<TagDoc>) ?? model<TagDoc>("Tag", TagSchema);
