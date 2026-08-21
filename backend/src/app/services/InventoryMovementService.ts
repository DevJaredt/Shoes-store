import { ClientSession, startSession } from "mongoose";
import { IInventoryMovement, MovementType } from "../models/InventoryMovementModel";
import { inventoryMovementRepository } from "../repositories/InventoryMovementRepository";
import { ProductModel } from "../models/ProductModel";

export interface MovementInput {
  product: string;
  type: MovementType;
  size: number;
  color: string;
  quantity: number;
  reason?: string;
  user: string;
  sale?: string;
}

class InventoryMovementService {
  async createMovement(input: MovementInput): Promise<IInventoryMovement> {
    const session = await startSession();
    session.startTransaction();

    try {
      const movement = await this.processMovement(input, session);
      await session.commitTransaction();
      return movement;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async processMovement(
    input: MovementInput,
    session: ClientSession,
  ): Promise<IInventoryMovement> {
    const { product: productId, type, size, color, quantity } = input;

    if (quantity <= 0) {
      throw new Error("La cantidad debe ser mayor a cero");
    }

    const product = await ProductModel.findById(productId).session(session);

    if (!product) {
      throw new Error("Producto no encontrado");
    }

    const variantIndex = product.variants.findIndex(
      (v) => v.size === size && v.color.toLowerCase() === color.toLowerCase(),
    );

    if (variantIndex === -1) {
      throw new Error("Variante de talla/color no encontrada");
    }

    const variant = product.variants[variantIndex];

    if (type === "entry") {
      variant.stock += quantity;
    } else if (type === "exit") {
      if (variant.stock < quantity) {
        throw new Error(`Stock insuficiente para la variante talla ${size} color ${color}`);
      }
      variant.stock -= quantity;
    } else if (type === "adjustment") {
      variant.stock = quantity;
    }

    product.variants[variantIndex] = variant;
    await product.save({ session });

    const movement = await inventoryMovementRepository.create(input, session);
    return movement;
  }

  async getMovements(): Promise<IInventoryMovement[]> {
    return await inventoryMovementRepository.findAll();
  }

  async getMovementsByProduct(productId: string): Promise<IInventoryMovement[]> {
    return await inventoryMovementRepository.findByProduct(productId);
  }
}

export const inventoryMovementService = new InventoryMovementService();
