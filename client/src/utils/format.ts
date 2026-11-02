import type { Currency } from "../types";

export function formatPrice(price: number, currency: Currency) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency }).format(price);
}
