import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { authUseCases } from "../useCases/auth.useCases";

const authControllers = {
  register: async (req: Request, res: Response) => {
    try {
      // matchedData: solo los campos validados. Si mandan { role: "admin" } en el body, se descarta
      const { name, email, password } = matchedData(req);
      const session = await authUseCases.register({ name, email, password });
      res.status(201).json(session);
    } catch (error) {
      if (error instanceof Error && error.message === "USER-ALREADY-EXISTS") {
        res.status(409).json({ message: "Ya existe un usuario con ese email" });
      } else {
        res.status(500).json({ message: "Error interno del servidor" });
      }
    }
  },
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = matchedData(req);
      const session = await authUseCases.login({ email, password });
      res.status(200).json(session);
    } catch (error) {
      if (error instanceof Error && error.message === "INVALID-CREDENTIALS") {
        res.status(401).json({ message: "Email o contraseña incorrectos" });
      } else {
        res.status(500).json({ message: "Error interno del servidor" });
      }
    }
  },
  me: async (req: Request, res: Response) => {
    try {
      // req.user lo cargó el middleware authenticate
      const user = await authUseCases.me(req.user!.id);
      res.status(200).json(user);
    } catch (error) {
      if (error instanceof Error && error.message === "USER-NOT-FOUND") {
        res.status(404).json({ message: "Usuario no encontrado" });
      } else {
        res.status(500).json({ message: "Error interno del servidor" });
      }
    }
  },
};

export { authControllers };
