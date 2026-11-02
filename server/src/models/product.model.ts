import { Schema, model } from "mongoose";

enum CURRENCY {
  ARS = "ARS",
  USD = "USD",
}

interface Product {
  name: string;
  description?: string;
  price: number;
  currency: CURRENCY;
  stock: number;
}

const productSchema = new Schema<Product>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: Object.values(CURRENCY), required: true },
    stock: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
);

const ProductModel = model<Product>("Product", productSchema);

export type { Product };
export { ProductModel, CURRENCY };
