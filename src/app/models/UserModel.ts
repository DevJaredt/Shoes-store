import { Document, model, Schema } from "mongoose";

export type UserRole = "admin" | "customer";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  document: string;
  phone: string;
  role: UserRole;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    document: { type: String, required: true, unique: true, trim: true },
    phone: { type: String, required: true, trim: true },
    role: { type: String, enum: ["admin", "customer"], default: "customer" },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ role: 1, active: 1 });

export const UserModel = model<IUser>("User", userSchema);
