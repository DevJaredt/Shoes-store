import { UserModel, IUser, UserRole } from "../models/UserModel";

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  document: string;
  phone: string;
  role: UserRole;
}

class UserRepository {
  async create(data: CreateUserData): Promise<IUser> {
    const user = new UserModel(data);
    return await user.save();
  }

  async findAll(): Promise<IUser[]> {
    return await UserModel.find({ active: true }).select("-password");
  }

  async findById(id: string): Promise<IUser | null> {
    return await UserModel.findById(id).select("-password");
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email: email.toLowerCase() });
  }

  async findByDocument(document: string): Promise<IUser | null> {
    return await UserModel.findOne({ document });
  }

  async update(id: string, data: Partial<IUser>): Promise<IUser | null> {
    return await UserModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).select("-password");
  }

  async softDelete(id: string): Promise<IUser | null> {
    return await UserModel.findByIdAndUpdate(
      id,
      { active: false },
      { new: true },
    ).select("-password");
  }
}

export const userRepository = new UserRepository();
