import { ClientSession } from "mongoose";
import { ISale, SaleModel } from "../models/SaleModel";

export interface CreateSaleData {
  customer: string;
  createdBy: string;
  date?: Date;
  items: {
    product: string;
    nameSnapshot: string;
    size: number;
    color: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
  discount: number;
  total: number;
  paymentMethod: string;
}

class SaleRepository {
  async create(data: CreateSaleData, session?: ClientSession): Promise<ISale> {
    const sale = new SaleModel(data);
    return await sale.save({ session });
  }

  async findAll(): Promise<ISale[]> {
    return await SaleModel.find()
      .sort({ createdAt: -1 })
      .populate("customer createdBy", "-password");
  }

  async findById(id: string): Promise<ISale | null> {
    return await SaleModel.findById(id)
      .populate("customer createdBy", "-password")
      .populate("items.product");
  }

  async findByCustomer(customerId: string): Promise<ISale[]> {
    return await SaleModel.find({ customer: customerId })
      .sort({ createdAt: -1 })
      .populate("createdBy", "-password");
  }

  async findByDateRange(start: Date, end: Date): Promise<ISale[]> {
    return await SaleModel.find({
      date: { $gte: start, $lte: end },
    }).populate("customer createdBy", "-password");
  }
}

export const saleRepository = new SaleRepository();
