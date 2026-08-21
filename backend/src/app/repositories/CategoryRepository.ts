import { CategoryModel, ICategory } from "../models/CategoryModel";

class CategoryRepository {
  async create(data: Partial<ICategory>): Promise<ICategory> {
    const category = new CategoryModel(data);
    return await category.save();
  }

  async findAll(): Promise<ICategory[]> {
    return await CategoryModel.find({ active: true });
  }

  async findById(id: string): Promise<ICategory | null> {
    return await CategoryModel.findById(id);
  }

  async update(
    id: string,
    data: Partial<ICategory>,
  ): Promise<ICategory | null> {
    return await CategoryModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async softDelete(id: string): Promise<ICategory | null> {
    return await CategoryModel.findByIdAndUpdate(
      id,
      { active: false },
      { new: true },
    );
  }
}

export const categoryRepository = new CategoryRepository();
