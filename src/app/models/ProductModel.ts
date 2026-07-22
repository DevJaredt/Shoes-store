import { model, Schema } from "mongoose";

interface IProduct {
  name: string;
  brand: string;
  category: string;
  description: string;

  price: number;
  active: boolean;

  images: string[];

  variants: {
    size: number;
    color: string;
    stock: number;
  }[];
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
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
