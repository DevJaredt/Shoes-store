import { Request, Response } from "express";
import { productService } from "../services/ProductService";

export const getProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const products = await productService.getProducts();

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving products",
    });
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const product = await productService.getProductById(req.params.id as string);

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving product",
    });
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const productData = req.body;
    const newProduct = await productService.createProduct(productData);
    res.status(201).json({
      success: true,
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating product",
    });
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const productId = req.params.id as string;
    const productData = req.body;

    const updatedProduct = await productService.updateProduct(
      productId,
      productData,
    );

    res.status(200).json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating product",
    });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const productId = req.params.id as string;

    await productService.deleteProduct(productId);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting product",
    });
  }
};
