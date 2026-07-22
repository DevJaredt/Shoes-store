import { ProductModel } from "../models/ProductModel";

class ProductRepository {
  async getProducts() {
    return await ProductModel.find({}).sort({ createdAt: -1 });
  }

  async createProduct(productData: any) {
    const product = new ProductModel(productData);
    return await product.save();
  }
}

export const productRepository = new ProductRepository();
