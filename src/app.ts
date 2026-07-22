import express, { Application, Request, Response } from "express";
import productRoutes from "./app/routes/ProductRoutes";

const app: Application = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from your TypeScript Express Server!" });
});

app.use("/api/v1/products", productRoutes);
app.use("/api/v1/create-product", productRoutes);

export default app;
