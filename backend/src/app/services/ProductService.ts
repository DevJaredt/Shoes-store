import { productRepository } from "../repositories/ProductRepository";
import { IProduct } from "../models/ProductModel";

class ProductService {
  async getProducts(): Promise<IProduct[]> {
    return await productRepository.getProducts();
  }

  async getProductById(productId: string): Promise<IProduct | null> {
    return await productRepository.findById(productId);
  }

  async createProduct(productData: Partial<IProduct>): Promise<IProduct> {
    return await productRepository.createProduct(productData);
  }

  async updateProduct(
    productId: string,
    productData: Partial<IProduct>,
  ): Promise<IProduct | null> {
    return await productRepository.updateProduct(productId, productData);
  }

  async deleteProduct(productId: string): Promise<IProduct | null> {
    return await productRepository.deleteProduct(productId);
  }
}

export const productService = new ProductService();
