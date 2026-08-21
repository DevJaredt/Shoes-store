import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { saleController } from "../controllers/SaleController";

const router = Router();

router.use(authenticate);

router.post("/", saleController.create);
router.get("/", saleController.getAll);
router.get("/:id", saleController.getById);

export default router;
