import { ProductModel } from "../models/ProductModel";

class ProductRepository {
  async getProducts() {
    return await ProductModel.find({}).sort({ createdAt: -1 });
  }

  async createProduct(productData: any) {
    const product = new ProductModel(productData);
    return await product.save();
  }

  async updateProduct(productId: string, productData: any) {
    return await ProductModel.findByIdAndUpdate(productId, productData, {
      returnDocument: "after",
    });
  }

  async deleteProduct(productId: string) {
    return await ProductModel.findByIdAndDelete(productId);
  }
}

export const productRepository = new ProductRepository();
