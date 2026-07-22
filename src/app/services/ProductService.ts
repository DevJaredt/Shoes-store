import { productRepository } from "../repositories/ProductRepository";

class ProductService {
  async getProducts() {
    return await productRepository.getProducts();
  }

  async createProduct(productData: any) {
    return await productRepository.createProduct(productData);
  }
}

export const productService = new ProductService();
