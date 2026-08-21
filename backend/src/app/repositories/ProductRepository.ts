import { ClientSession } from "mongoose";
import { IProduct, ProductModel } from "../models/ProductModel";

class ProductRepository {
  async getProducts(): Promise<IProduct[]> {
    return await ProductModel.find({}).sort({ createdAt: -1 }).populate("category");
  }

  async findById(productId: string): Promise<IProduct | null> {
    return await ProductModel.findById(productId).populate("category");
  }

  async createProduct(productData: Partial<IProduct>): Promise<IProduct> {
    const product = new ProductModel(productData);
    return await product.save();
  }

  async updateProduct(
    productId: string,
    productData: Partial<IProduct>,
    session?: ClientSession,
  ): Promise<IProduct | null> {
    return await ProductModel.findByIdAndUpdate(productId, productData, {
      returnDocument: "after",
      session,
    });
  }

  async deleteProduct(productId: string): Promise<IProduct | null> {
    return await ProductModel.findByIdAndDelete(productId);
  }
}

export const productRepository = new ProductRepository();
