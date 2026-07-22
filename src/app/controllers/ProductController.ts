import { Request, Response } from "express";
import { ProductModel } from "../models/ProductModel";
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
