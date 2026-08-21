import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { userService } from "../services/UserService";

class UserController {
  create = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al crear el usuario";
      res.status(400).json({ message });
    }
  };

  getAll = async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
      const users = await userService.getUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los usuarios" });
    }
  };

  getById = async (req: AuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const user = await userService.getUserById(req.params.id as string);
      if (!user) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el usuario" });
    }
  };

  update = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const targetId = req.params.id as string;

      if (req.user?.role !== "admin" && req.user?.id !== targetId) {
        res.status(403).json({ message: "No puedes modificar otro usuario" });
        return;
      }

      if (req.user?.role !== "admin" && req.body.role) {
        res.status(403).json({ message: "No puedes cambiar tu rol" });
        return;
      }

      const user = await userService.updateUser(targetId, req.body);
      if (!user) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }
      res.status(200).json(user);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al actualizar el usuario";
      res.status(400).json({ message });
    }
  };

  delete = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = await userService.deleteUser(req.params.id as string);
      if (!user) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }
      res.status(200).json({ message: "Usuario eliminado con éxito", user });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar el usuario" });
    }
  };
}

export const userController = new UserController();
