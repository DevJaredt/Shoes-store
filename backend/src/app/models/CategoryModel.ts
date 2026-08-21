import { Document, model, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description: string;
  active: boolean;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

export const CategoryModel = model<ICategory>("Category", categorySchema);
