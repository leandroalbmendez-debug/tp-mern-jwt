import "dotenv/config"; // primero de todo: carga el .env en process.env
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import { seedAdmin } from "./config/seedAdmin";
import { authRouter } from "./routes/auth.routes";
import { productRouter } from "./routes/product.routes";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL })); // solo el front de React puede llamar a la API desde el navegador
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API TP MERN funcionando" });
});

app.use("/auth", authRouter);
app.use("/products", productRouter);

// Ninguna ruta coincidió
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// Manejador de errores: Express 5 manda acá los errores no capturados (incluidos los async)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError) {
    res.status(400).json({ message: "El body no es un JSON válido" });
    return;
  }
  console.error(err);
  res.status(500).json({ message: "Error interno del servidor" });
});

const PORT = process.env.PORT || 3000;

async function start() {
  await connectDB();
  await seedAdmin();
  app.listen(PORT, () => {
    console.log(`Server corriendo en http://localhost:${PORT}`);
  });
}

start();
