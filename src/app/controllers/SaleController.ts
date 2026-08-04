import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { saleService } from "../services/SaleService";

class SaleController {
  create = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const sale = await saleService.createSale({
        ...req.body,
        customer: req.user!.id,
        createdBy: req.user!.id,
      });
      res.status(201).json({
        success: true,
        data: sale,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al crear la venta";
      res.status(400).json({
        success: false,
        message,
      });
    }
  };

  getAll = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const sales = req.user?.role === "admin"
        ? await saleService.getSales()
        : await saleService.getSalesByCustomer(req.user!.id);
      res.status(200).json({
        success: true,
        count: sales.length,
        data: sales,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener las ventas",
      });
    }
  };

  getById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const sale = await saleService.getSaleById(req.params.id as string);
      if (!sale) {
        res.status(404).json({
          success: false,
          message: "Venta no encontrada",
        });
        return;
      }

      if (req.user?.role !== "admin" && sale.customer.toString() !== req.user!.id) {
        res.status(403).json({
          success: false,
          message: "No puedes ver esta venta",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: sale,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener la venta",
      });
    }
  };
}

export const saleController = new SaleController();
