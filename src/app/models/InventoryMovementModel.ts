import { model, Schema, Document, Types } from "mongoose";
import { IProduct } from "./ProductModel";
import { ISale } from "./SaleModel";
import { IUser } from "./UserModel";

export type MovementType = "entry" | "exit" | "adjustment";

export interface IInventoryMovement extends Document {
  product: Types.ObjectId | IProduct;
  type: MovementType;
  size: number;
  color: string;
  quantity: number;
  reason?: string;
  user: Types.ObjectId | IUser;
  sale?: Types.ObjectId | ISale;
  createdAt: Date;
  updatedAt: Date;
}

const inventoryMovementSchema = new Schema<IInventoryMovement>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    type: { type: String, enum: ["entry", "exit", "adjustment"], required: true },
    size: { type: Number, required: true },
    color: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    reason: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sale: { type: Schema.Types.ObjectId, ref: "Sale" },
  },
  {
    timestamps: true,
  },
);

inventoryMovementSchema.index({ product: 1, size: 1, color: 1, createdAt: -1 });
inventoryMovementSchema.index({ type: 1, createdAt: -1 });
inventoryMovementSchema.index({ user: 1, createdAt: -1 });

export const InventoryMovementModel = model<IInventoryMovement>(
  "InventoryMovement",
  inventoryMovementSchema,
);
