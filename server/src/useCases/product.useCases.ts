import { isValidObjectId } from "mongoose";
import { Product } from "../models/product.model";
import { productServices } from "../services/product.service";

const ensureValidId = (id: string) => {
  if (!isValidObjectId(id)) {
    throw new Error("PRODUCT-INVALID-ID");
  }
};

const productUseCases = {
  create: async (product: Product) => {
    return await productServices.create(product);
  },
  list: async () => {
    return await productServices.list();
  },
  getById: async (id: string) => {
    ensureValidId(id);
    const productFound = await productServices.getById(id);
    if (!productFound) {
      throw new Error("PRODUCT-NOT-FOUND");
    }
    return productFound;
  },
  update: async (id: string, data: Partial<Product>) => {
    ensureValidId(id);
    const productUpdated = await productServices.update(id, data);
    if (!productUpdated) {
      throw new Error("PRODUCT-NOT-FOUND");
    }
    return productUpdated;
  },
  deleteById: async (id: string) => {
    ensureValidId(id);
    const productDeleted = await productServices.deleteById(id);
    if (!productDeleted) {
      throw new Error("PRODUCT-NOT-FOUND");
    }
  },
};

export { productUseCases };
