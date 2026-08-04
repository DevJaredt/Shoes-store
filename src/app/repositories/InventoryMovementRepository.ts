import { ClientSession } from "mongoose";
import { IInventoryMovement, InventoryMovementModel, MovementType } from "../models/InventoryMovementModel";

export interface CreateMovementData {
  product: string;
  type: MovementType;
  size: number;
  color: string;
  quantity: number;
  reason?: string;
  user: string;
  sale?: string;
}

class InventoryMovementRepository {
  async create(
    data: CreateMovementData,
    session?: ClientSession,
  ): Promise<IInventoryMovement> {
    const movement = new InventoryMovementModel(data);
    return await movement.save({ session });
  }

  async findAll(): Promise<IInventoryMovement[]> {
    return await InventoryMovementModel.find()
      .sort({ createdAt: -1 })
      .populate("product user sale");
  }

  async findByProduct(productId: string): Promise<IInventoryMovement[]> {
    return await InventoryMovementModel.find({ product: productId })
      .sort({ createdAt: -1 })
      .populate("user sale");
  }
}

export const inventoryMovementRepository = new InventoryMovementRepository();
