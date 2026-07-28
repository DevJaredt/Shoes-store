import { model, Schema, Document, Types } from "mongoose";
import { ICategory } from "./CategoryModel";

export interface IProduct extends Document {
  name: string;
  brand: string;
  category: Types.ObjectId | ICategory;
  description: string;
  price: number;
  active: boolean;
  images: string[];
  variants: {
    size: number;
    color: string;
    stock: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    active: { type: Boolean, default: true },
    images: [{ type: String }],
    variants: [
      {
        size: { type: Number, required: true },
        color: { type: String, required: true },
        stock: { type: Number, required: true, min: 0 },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const ProductModel = model<IProduct>("Product", productSchema);
