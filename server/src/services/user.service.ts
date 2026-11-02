import { User, UserModel } from "../models/user.model";

const userServices = {
  create: async (user: User) => {
    return await UserModel.create(user);
  },
  getByEmail: async (email: string) => {
    return await UserModel.findOne({ email });
  },
  // Única consulta que trae la password: la necesitamos para comparar en el login
  getByEmailWithPassword: async (email: string) => {
    return await UserModel.findOne({ email }).select("+password");
  },
  getById: async (id: string) => {
    return await UserModel.findById(id);
  },
};

export { userServices };
