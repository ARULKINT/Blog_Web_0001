import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: "" },
    color: { type: String, default: "#6366F1" },
    icon: { type: String, default: "" },
    postCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type CategoryDoc = InferSchemaType<typeof CategorySchema> & { _id: string };

export const Category: Model<CategoryDoc> =
  (models.Category as Model<CategoryDoc>) ??
  model<CategoryDoc>("Category", CategorySchema);
