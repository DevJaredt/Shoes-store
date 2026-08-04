import { model, Schema, Document, Types } from "mongoose";
import { IUser } from "./UserModel";
import { IProduct } from "./ProductModel";

export type PaymentMethod = "cash" | "card" | "transfer";

export interface ISaleItem {
  product: Types.ObjectId;
  nameSnapshot: string;
  size: number;
  color: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface ISale extends Document {
  customer: Types.ObjectId | IUser;
  createdBy: Types.ObjectId | IUser;
  date: Date;
  items: ISaleItem[];
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  updatedAt: Date;
}

const saleItemSchema = new Schema<ISaleItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    nameSnapshot: { type: String, required: true },
    size: { type: Number, required: true },
    color: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const saleSchema = new Schema<ISale>(
  {
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: { type: Date, default: Date.now, index: true },
    items: [saleItemSchema],
    discount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, enum: ["cash", "card", "transfer"], required: true },
  },
  {
    timestamps: true,
  },
);

saleSchema.index({ date: -1, createdBy: 1 });
saleSchema.index({ customer: 1, date: -1 });

export const SaleModel = model<ISale>("Sale", saleSchema);
