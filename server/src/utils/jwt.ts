import jwt, { SignOptions } from "jsonwebtoken";
import { Role } from "../models/user.model";

interface TokenPayload {
  id: string;
  role: Role;
}

// Firma el token con el secreto del servidor. Solo quien tiene JWT_SECRET puede generar tokens válidos.
function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: (process.env.JWT_EXPIRES_IN || "1h") as SignOptions["expiresIn"],
  });
}

// Verifica firma y vencimiento. Si el token fue adulterado o expiró, jwt.verify tira un error.
function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
}

export type { TokenPayload };
export { signToken, verifyToken };
