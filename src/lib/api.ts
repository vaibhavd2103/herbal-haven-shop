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
  // // TODO: Replace with actual API call
  // return new Promise((resolve) =>
  //   setTimeout(() => resolve(products.find((p) => p.id === id)), 200),
  // );
  const res = await api.get(`/products/${id}`);
  return res.data.product;
}

export async function loginUser(email: string, _password: string) {
  // TODO: Replace with actual API call
  return new Promise((resolve) =>
    setTimeout(() => resolve({ id: "user-1", email, name: "User" }), 500),
  );
}

export async function signupUser(
  name: string,
  email: string,
  _password: string,
) {
  // TODO: Replace with actual API call
  return new Promise((resolve) =>
    setTimeout(() => resolve({ id: "user-1", email, name }), 500),
  );
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
