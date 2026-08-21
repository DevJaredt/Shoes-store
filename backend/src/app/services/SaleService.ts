import { startSession } from "mongoose";
import { ISale } from "../models/SaleModel";
import { inventoryMovementService } from "./InventoryMovementService";
import { saleRepository } from "../repositories/SaleRepository";
import { productRepository } from "../repositories/ProductRepository";

export interface SaleItemInput {
  product: string;
  size: number;
  color: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateSaleInput {
  customer: string;
  createdBy: string;
  date?: Date;
  items: SaleItemInput[];
  discount?: number;
  paymentMethod: string;
}

class SaleService {
  async createSale(input: CreateSaleInput): Promise<ISale> {
    const session = await startSession();
    session.startTransaction();

    try {
      const saleItems = [];

      for (const item of input.items) {
        const product = await productRepository.findById(item.product);
        if (!product) {
          throw new Error(`Producto no encontrado: ${item.product}`);
        }

        saleItems.push({
          product: item.product,
          nameSnapshot: product.name,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.quantity * item.unitPrice,
        });
      }

      const discount = input.discount || 0;
      const subtotal = saleItems.reduce((sum, item) => sum + item.subtotal, 0);
      const total = Math.max(0, subtotal - discount);

      const sale = await saleRepository.create(
        {
          customer: input.customer,
          createdBy: input.createdBy,
          date: input.date || new Date(),
          items: saleItems,
          discount,
          total,
          paymentMethod: input.paymentMethod,
        },
        session,
      );

      for (const item of saleItems) {
        await inventoryMovementService.processMovement(
          {
            product: item.product,
            type: "exit",
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            reason: "Venta",
            user: input.createdBy,
            sale: sale._id.toString(),
          },
          session,
        );
      }

      await session.commitTransaction();
      return sale;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getSales(): Promise<ISale[]> {
    return await saleRepository.findAll();
  }

  async getSalesByCustomer(customerId: string): Promise<ISale[]> {
    return await saleRepository.findByCustomer(customerId);
  }

  async getSaleById(id: string): Promise<ISale | null> {
    return await saleRepository.findById(id);
  }
}

export const saleService = new SaleService();
