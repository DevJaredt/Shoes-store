import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/UserRepository";

export interface AuthResult {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

class AuthService {
  async login(email: string, password: string): Promise<AuthResult | null> {
    const user = await userRepository.findByEmail(email);

    if (!user || !user.active) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return null;
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET no está configurado");
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      secret,
      { expiresIn: "1d" },
    );

    return {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}

export const authService = new AuthService();
