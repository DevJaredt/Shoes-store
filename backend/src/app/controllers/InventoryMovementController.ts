import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { inventoryMovementService } from "../services/InventoryMovementService";

class InventoryMovementController {
  create = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const movement = await inventoryMovementService.createMovement({
        ...req.body,
        user: req.user?.id,
      });
      res.status(201).json(movement);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al crear el movimiento";
      res.status(400).json({ message });
    }
  };

  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const movements = await inventoryMovementService.getMovements();
      res.status(200).json(movements);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los movimientos" });
    }
  };

  getByProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const movements = await inventoryMovementService.getMovementsByProduct(
        req.params.productId as string,
      );
      res.status(200).json(movements);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los movimientos" });
    }
  };
}

export const inventoryMovementController = new InventoryMovementController();
