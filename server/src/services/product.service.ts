import { Product, ProductModel } from "../models/product.model";

const productServices = {
  create: async (product: Product) => {
    return await ProductModel.create(product);
  },
  list: async () => {
    return await ProductModel.find().sort({ createdAt: -1 });
  },
  getById: async (id: string) => {
    return await ProductModel.findById(id);
  },
  // returnDocument "after": devuelve el producto ya modificado; runValidators: aplica las reglas del schema
  update: async (id: string, data: Partial<Product>) => {
    return await ProductModel.findByIdAndUpdate(id, data, { returnDocument: "after", runValidators: true });
  },
  deleteById: async (id: string) => {
    return await ProductModel.findByIdAndDelete(id);
  },
};

export { productServices };
