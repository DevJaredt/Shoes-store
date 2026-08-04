import bcrypt from "bcryptjs";
import { IUser, UserRole } from "../models/UserModel";
import { userRepository } from "../repositories/UserRepository";

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  document: string;
  phone: string;
  role?: UserRole;
}

class UserService {
  async createUser(data: CreateUserInput): Promise<IUser> {
    const existingEmail = await userRepository.findByEmail(data.email);
    if (existingEmail) {
      throw new Error("El email ya está registrado");
    }

    const existingDocument = await userRepository.findByDocument(data.document);
    if (existingDocument) {
      throw new Error("El documento ya está registrado");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    return await userRepository.create({
      ...data,
      password: hashedPassword,
      role: data.role || "customer",
    });
  }

  async getUsers(): Promise<IUser[]> {
    return await userRepository.findAll();
  }

  async getUserById(id: string): Promise<IUser | null> {
    return await userRepository.findById(id);
  }

  async updateUser(id: string, data: Partial<IUser>): Promise<IUser | null> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return await userRepository.update(id, data);
  }

  async deleteUser(id: string): Promise<IUser | null> {
    return await userRepository.softDelete(id);
  }
}

export const userService = new UserService();
