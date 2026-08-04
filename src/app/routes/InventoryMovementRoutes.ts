import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { inventoryMovementController } from "../controllers/InventoryMovementController";

const router = Router();

router.use(authenticate, authorize("admin"));

router.post("/", inventoryMovementController.create);
router.get("/", inventoryMovementController.getAll);
router.get("/product/:productId", inventoryMovementController.getByProduct);

export default router;
