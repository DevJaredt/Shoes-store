import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { categoryController } from "../controllers/CategoryController";

const router = Router();

router.get("/", categoryController.getAll);
router.get("/:id", categoryController.getById);

router.post("/", authenticate, authorize("admin"), categoryController.create);
router.put("/:id", authenticate, authorize("admin"), categoryController.update);
router.delete("/:id", authenticate, authorize("admin"), categoryController.delete);

export default router;
