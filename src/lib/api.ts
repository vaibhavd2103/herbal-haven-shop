import { LoginResponse } from "@/contexts/AuthContext";
import { products, type Product } from "./data";
import type { CartItem } from "@/contexts/CartContext";

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("rreva-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await api.get("/products");
    return res.data.products ?? products;
  } catch {
    return products;
  }
}

export async function fetchProductById(
  id: string,
): Promise<Product | undefined> {
  try {
    const res = await api.get(`/products/${id}`);
    return res.data.product ?? products.find((p) => p.id === id);
  } catch {
    return products.find((p) => p.id === id);
  }
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

export async function forgotPassword(email: string) {
  try {
    await api.post("/auth/forgot-password", { email });
    return { success: true };
  } catch {
    // Placeholder: always succeed for demo
    return { success: true };
  }
}

// ── Cart API (requires auth) ──

export async function fetchCart(): Promise<CartItem[]> {
  try {
    const res = await api.get("/cart");
    return res.data.items ?? [];
  } catch {
    // Fallback to localStorage cart
    try {
      const stored = localStorage.getItem("rreva-cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
}

export async function addToCartAPI(productId: string, quantity: number): Promise<CartItem[]> {
  try {
    const res = await api.post("/cart/add", { productId, quantity });
    return res.data.items ?? [];
  } catch {
    // Fallback: manage locally
    return [];
  }
}

export async function removeFromCartAPI(productId: string): Promise<CartItem[]> {
  try {
    const res = await api.delete(`/cart/${productId}`);
    return res.data.items ?? [];
  } catch {
    return [];
  }
}

export async function updateCartQuantityAPI(productId: string, quantity: number): Promise<CartItem[]> {
  try {
    const res = await api.put(`/cart/${productId}`, { quantity });
    return res.data.items ?? [];
  } catch {
    return [];
  }
}

export async function clearCartAPI(): Promise<void> {
  try {
    await api.delete("/cart");
  } catch {
    // no-op
  }
}

export async function submitPaymentConfirmation(orderId: string, address: ShippingAddress) {
  // TODO: Replace with actual API call
  return new Promise((resolve) =>
    setTimeout(() => resolve({ success: true, orderId, address }), 1000),
  );
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export function generateUPIString(amount: number, orderId: string): string {
  return `upi://pay?pa=rrevacare@upi&pn=RREVA CARE&am=${amount}&cu=INR&tn=Order ${orderId}`;
}
