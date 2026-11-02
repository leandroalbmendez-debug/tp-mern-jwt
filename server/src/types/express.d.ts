import type { Role } from "../models/user.model";

// Le agregamos a Request la propiedad "user" que carga el middleware authenticate
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: Role };
    }
  }
}

export {};
