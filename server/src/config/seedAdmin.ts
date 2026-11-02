import bcrypt from "bcryptjs";
import { userServices } from "../services/user.service";

// Crea el admin inicial a partir del .env, solo si todavía no existe
async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.log("ADMIN_EMAIL / ADMIN_PASSWORD no definidos: no se crea el admin");
    return;
  }

  const adminFound = await userServices.getByEmail(email);
  if (adminFound) {
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await userServices.create({ name: "Administrador", email, password: hashedPassword, role: "admin" });
  console.log(`Usuario admin creado: ${email}`);
}

export { seedAdmin };
