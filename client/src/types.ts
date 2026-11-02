export type Role = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export type Currency = "ARS" | "USD";

export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  currency: Currency;
  stock: number;
}

// Lo que devuelven /auth/login y /auth/register
export interface AuthResponse {
  token: string;
  user: User;
}
