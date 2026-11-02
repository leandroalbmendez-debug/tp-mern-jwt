import { NextFunction, Request, Response } from "express";
import { Role } from "../models/user.model";
import { userServices } from "../services/user.service";
import { TokenPayload, verifyToken } from "../utils/jwt";

// 1) ¿Quién sos? Verifica el token y carga req.user. Si algo falla -> 401 (no autenticado)
const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization; // "Bearer eyJhbGciOi..."
  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ message: "No autenticado: falta el token" });
    return;
  }

  let payload: TokenPayload;
  try {
    payload = verifyToken(header.split(" ")[1]);
  } catch (error) {
    res.status(401).json({ message: "Token inválido o vencido" });
    return;
  }

  // Confirmamos contra la base: si borraron al usuario o le cambiaron el rol, manda lo que diga la DB
  const user = await userServices.getById(payload.id);
  if (!user) {
    res.status(401).json({ message: "El usuario del token ya no existe" });
    return;
  }

  req.user = { id: user._id.toString(), role: user.role };
  next();
};

// 2) ¿Tenés permiso? Se usa DESPUÉS de authenticate. Rol no permitido -> 403 (prohibido)
const authorize = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ message: "No autenticado" });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: "No tenés permisos para realizar esta acción" });
      return;
    }
    next();
  };
};

export { authenticate, authorize };
