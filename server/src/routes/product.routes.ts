import { Router } from "express";
import { productControllers } from "../controllers/product.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { productRules, productUpdateRules } from "../middlewares/validate.middleware";

const productRouter = Router();

// Los middlewares corren en orden: primero autenticación (401), después rol (403), después validación (400)

// Lectura: cualquier usuario logueado
productRouter.get("/", authenticate, productControllers.list);
productRouter.get("/:id", authenticate, productControllers.getById);

// Escritura: solo admin
productRouter.post("/", authenticate, authorize("admin"), productRules, productControllers.create);
productRouter.put("/:id", authenticate, authorize("admin"), productUpdateRules, productControllers.update);
productRouter.delete("/:id", authenticate, authorize("admin"), productControllers.delete);

export { productRouter };
