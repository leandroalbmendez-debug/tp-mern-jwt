import bcrypt from "bcryptjs";
import { HydratedDocument } from "mongoose";
import { User } from "../models/user.model";
import { userServices } from "../services/user.service";
import { signToken } from "../utils/jwt";

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

// Lo que mandamos al cliente: nunca incluye la password
const toPublicUser = (user: HydratedDocument<User>) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
});

const buildSession = (user: HydratedDocument<User>) => {
  const publicUser = toPublicUser(user);
  return {
    token: signToken({ id: publicUser.id, role: publicUser.role }),
    user: publicUser,
  };
};

const authUseCases = {
  register: async ({ name, email, password }: RegisterData) => {
    const userFound = await userServices.getByEmail(email);
    if (userFound) {
      throw new Error("USER-ALREADY-EXISTS");
    }

    // bcrypt genera un "salt" aleatorio y aplica el hash 2^10 veces: lento a propósito contra fuerza bruta
    const hashedPassword = await bcrypt.hash(password, 10);

    // El rol se fuerza a "user": desde el registro público nadie puede volverse admin
    const newUser = await userServices.create({ name, email, password: hashedPassword, role: "user" });
    return buildSession(newUser);
  },
  login: async ({ email, password }: LoginData) => {
    const userFound = await userServices.getByEmailWithPassword(email);
    if (!userFound) {
      throw new Error("INVALID-CREDENTIALS");
    }

    const passwordOk = await bcrypt.compare(password, userFound.password);
    if (!passwordOk) {
      // Mismo error que "email no existe": no le damos pistas a un atacante
      throw new Error("INVALID-CREDENTIALS");
    }

    return buildSession(userFound);
  },
  me: async (id: string) => {
    const userFound = await userServices.getById(id);
    if (!userFound) {
      throw new Error("USER-NOT-FOUND");
    }
    return toPublicUser(userFound);
  },
};

export { authUseCases };
