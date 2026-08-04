import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/ProductController";

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/", authenticate, authorize("admin"), createProduct);
router.put("/:id", authenticate, authorize("admin"), updateProduct);
router.delete("/:id", authenticate, authorize("admin"), deleteProduct);

export default router;
