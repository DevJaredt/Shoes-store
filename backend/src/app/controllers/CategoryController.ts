import { Request, Response } from "express";
import { categoryService } from "../services/CategoryService";

class CategoryController {
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const category = await categoryService.createCategory(req.body);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: "Error al crear la categoría", error });
    }
  };

  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const categories = await categoryService.getCategories();
      res.status(200).json(categories);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al obtener las categorías", error });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const category = await categoryService.getCategoryById(
        req.params.id as string,
      );
      if (!category) {
        res.status(404).json({ message: "Categoría no encontrada" });
        return;
      }
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener la categoría", error });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const category = await categoryService.updateCategory(
        req.params.id as string,
        req.body,
      );
      if (!category) {
        res.status(404).json({ message: "Categoría no encontrada" });
        return;
      }
      res.status(200).json(category);
    } catch (error) {
      res
        .status(400)
        .json({ message: "Error al actualizar la categoría", error });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const category = await categoryService.deleteCategory(
        req.params.id as string,
      );
      if (!category) {
        res.status(404).json({ message: "Categoría no encontrada" });
        return;
      }
      res
        .status(200)
        .json({ message: "Categoría eliminada con éxito", category });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al eliminar la categoría", error });
    }
  };
}

export const categoryController = new CategoryController();
