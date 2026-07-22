import { productRepository } from "../repositories/ProductRepository";

class ProductService {
  async getProducts() {
    return await productRepository.getProducts();
  }

  async createProduct(productData: any) {
    return await productRepository.createProduct(productData);
  }

  async updateProduct(productId: string, productData: any) {
    return await productRepository.updateProduct(productId, productData);
  }

  async deleteProduct(productId: string) {
    return await productRepository.deleteProduct(productId);
  }
}

export const productService = new ProductService();
