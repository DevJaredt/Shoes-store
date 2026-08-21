import cors from "cors";
import express, { Application, Request, Response } from "express";
import authRoutes from "./app/routes/AuthRoutes";
import categoryRoutes from "./app/routes/CategoryRoutes";
import inventoryMovementRoutes from "./app/routes/InventoryMovementRoutes";
import productRoutes from "./app/routes/ProductRoutes";
import saleRoutes from "./app/routes/SaleRoutes";
import userRoutes from "./app/routes/UserRoutes";

const app: Application = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Shoes Store API" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/sales", saleRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/inventory-movements", inventoryMovementRoutes);

export default app;
