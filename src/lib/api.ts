import { LoginResponse } from "@/contexts/AuthContext";
import { products, type Product } from "./data";

// Placeholder API calls — replace with real endpoints when backend is ready

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export async function fetchProducts(): Promise<Product[]> {
  const res = await api.get("/products");
  return res.data.products;
}

export async function fetchProductById(
  id: string,
): Promise<Product | undefined> {
  const res = await api.get(`/products/${id}`);
  return res.data.product;
}

export async function loginUser(email: string, password: string) {
  const res = (await api.post("/auth/login", { email, password })) as {
    data: LoginResponse;
  };
  return res.data;
}

export async function signupUser(
  name: string,
  email: string,
  password: string,
) {
  const res = (await api.post("/auth/signup", { name, email, password })) as {
    data: LoginResponse;
  };
  return res.data;
}

export async function submitPaymentConfirmation(orderId: string) {
  // TODO: Replace with actual API call
  return new Promise((resolve) =>
    setTimeout(() => resolve({ success: true, orderId }), 1000),
  );
}

export function generateUPIString(amount: number, orderId: string): string {
  // Placeholder UPI string — replace with your actual UPI ID
  return `upi://pay?pa=rrevacare@upi&pn=RREVA CARE&am=${amount}&cu=INR&tn=Order ${orderId}`;
}
