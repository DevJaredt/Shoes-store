import { categoryRepository } from "../repositories/CategoryRepository";
import { ICategory } from "../models/CategoryModel";

class CategoryService {
  async createCategory(data: Partial<ICategory>): Promise<ICategory> {
    return await categoryRepository.create(data);
  }

  async getCategories(): Promise<ICategory[]> {
    return await categoryRepository.findAll();
  }

  async getCategoryById(id: string): Promise<ICategory | null> {
    return await categoryRepository.findById(id);
  }

  async updateCategory(
    id: string,
    data: Partial<ICategory>,
  ): Promise<ICategory | null> {
    return await categoryRepository.update(id, data);
  }

  async deleteCategory(id: string): Promise<ICategory | null> {
    return await categoryRepository.softDelete(id);
  }
}

export const categoryService = new CategoryService();
