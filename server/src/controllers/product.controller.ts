import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { Product } from "../models/product.model";
import { productUseCases } from "../useCases/product.useCases";

// Traduce los errores del useCase a códigos HTTP (mismo patrón que category)
const handleProductError = (error: unknown, res: Response) => {
  if (error instanceof Error && error.message === "PRODUCT-INVALID-ID") {
    res.status(400).json({ message: "El id no es válido" });
  } else if (error instanceof Error && error.message === "PRODUCT-NOT-FOUND") {
    res.status(404).json({ message: "Producto no encontrado" });
  } else {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const productControllers = {
  list: async (req: Request, res: Response) => {
    const products = await productUseCases.list();
    res.status(200).json(products);
  },
  getById: async (req: Request<{ id: string }>, res: Response) => {
    try {
      const product = await productUseCases.getById(req.params.id);
      res.status(200).json(product);
    } catch (error) {
      handleProductError(error, res);
    }
  },
  create: async (req: Request, res: Response) => {
    try {
      const newProduct = await productUseCases.create(matchedData(req) as Product);
      res.status(201).json(newProduct);
    } catch (error) {
      handleProductError(error, res);
    }
  },
  update: async (req: Request<{ id: string }>, res: Response) => {
    try {
      const product = await productUseCases.update(req.params.id, matchedData(req));
      res.status(200).json(product);
    } catch (error) {
      handleProductError(error, res);
    }
  },
  delete: async (req: Request<{ id: string }>, res: Response) => {
    try {
      await productUseCases.deleteById(req.params.id);
      res.status(200).json({ message: "Producto borrado correctamente" });
    } catch (error) {
      handleProductError(error, res);
    }
  },
};

export { productControllers };
