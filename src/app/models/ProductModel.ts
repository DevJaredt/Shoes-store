import { model, Schema, Document, Types } from "mongoose";
import { ICategory } from "./CategoryModel";

export interface IProductVariant {
  size: number;
  color: string;
  stock: number;
}

export interface IProduct extends Document {
  name: string;
  brand: string;
  category: Types.ObjectId | ICategory;
  description: string;
  purchasePrice: number;
  price: number;
  active: boolean;
  images: string[];
  variants: IProductVariant[];
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    description: { type: String, required: true },
    purchasePrice: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    active: { type: Boolean, default: true, index: true },
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

productSchema.index({ category: 1, active: 1 });

export const ProductModel = model<IProduct>("Product", productSchema);
