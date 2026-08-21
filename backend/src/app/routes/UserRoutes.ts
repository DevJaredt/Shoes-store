import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { userController } from "../controllers/UserController";

const router = Router();

router.use(authenticate);

router.post("/", authorize("admin"), userController.create);
router.get("/", authorize("admin"), userController.getAll);
router.get("/:id", userController.getById);
router.put("/:id", userController.update);
router.delete("/:id", authorize("admin"), userController.delete);

export default router;
