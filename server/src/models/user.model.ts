import { Schema, model } from "mongoose";

const ROLES = ["user", "admin"] as const;
type Role = (typeof ROLES)[number]; // "user" | "admin"

interface User {
  name: string;
  email: string;
  password: string;
  role: Role;
}

const userSchema = new Schema<User>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // select: false -> la password (hasheada) nunca viene en las consultas salvo que la pidamos
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ROLES, default: "user" },
  },
  { timestamps: true },
);

const UserModel = model<User>("User", userSchema);

export type { User, Role };
export { UserModel, ROLES };
