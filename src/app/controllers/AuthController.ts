import { Request, Response } from "express";
import { authService } from "../services/AuthService";
import { userService } from "../services/UserService";

class AuthController {
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: "Email y contraseña son requeridos" });
        return;
      }

      const result = await authService.login(email, password);

      if (!result) {
        res.status(401).json({ message: "Credenciales inválidas" });
        return;
      }

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al iniciar sesión";
      res.status(500).json({ message });
    }
  };

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password, document, phone } = req.body;

      if (!name || !email || !password || !document || !phone) {
        res.status(400).json({ message: "Todos los campos son requeridos" });
        return;
      }

      const user = await userService.createUser({
        name,
        email,
        password,
        document,
        phone,
        role: "customer",
      });

      res.status(201).json({
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          document: user.document,
          phone: user.phone,
          role: user.role,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al registrar el usuario";
      res.status(400).json({ message });
    }
  };
}

export const authController = new AuthController();
