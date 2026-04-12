import { LoginResponse, User } from "@/contexts/AuthContext";
import { products, type Product } from "./data";
import type { CartItem } from "@/contexts/CartContext";
import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("rreva-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.response?.data?.message) return error.response.data.message;
    if (error.response?.status === 401)
      return "Session expired. Please login again.";
    if (error.response?.status === 403)
      return "You don't have permission for this action.";
    if (error.response?.status === 404) return "Resource not found.";
    if (error.response?.status && error.response.status >= 500)
      return "Server error. Please try again later.";
    if (error.code === "ERR_NETWORK")
      return "Network error. Please check your connection.";
  }
  return "Something went wrong. Please try again.";
}

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
  try {
    const res = (await api.post("/auth/login", { email, password })) as {
      data: LoginResponse;
    };
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function signupUser(
  name: string,
  email: string,
  password: string,
) {
  try {
    const res = (await api.post("/auth/signup", { name, email, password })) as {
      data: LoginResponse;
    };
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function forgotPassword(email: string) {
  try {
    await api.post("/auth/forgot-password", { email });
    return { success: true };
  } catch {
    return { success: true };
  }
}

// ── Cart API ──

export async function fetchCart(): Promise<CartItem[]> {
  try {
    const res = await api.get("/cart");
    return res.data.cart.items ?? [];
  } catch {
    try {
      const stored = localStorage.getItem("rreva-cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
}

export async function addToCartAPI(
  productId: string,
  quantity: number,
): Promise<CartItem[]> {
  try {
    const res = await api.post("/cart/items", { productId, quantity });
    return res.data.cart.items ?? [];
  } catch {
    return [];
  }
}

export async function removeFromCartAPI(
  productId: string,
  quantity: number,
): Promise<CartItem[]> {
  try {
    const res = await api.delete(`/cart/itemsRemove`, {
      data: { productId, quantity },
    });
    return res.data.cart.items ?? [];
  } catch {
    return [];
  }
}

export async function updateCartQuantityAPI(
  productId: string,
  quantity: number,
): Promise<CartItem[]> {
  try {
    const res = await api.post("/cart/items", { productId, quantity });
    return res.data.cart.items ?? [];
  } catch {
    return [];
  }
}

export async function clearCartAPI(userID: string): Promise<void> {
  try {
    await api.delete(`/cart/${userID}`);
  } catch {
    // no-op
  }
}

export interface PlaceOrderResponse {
  orderId: string;
  status: "pending_payment";
  paymentStatus: "pending_payment";
}

export async function submitPaymentConfirmation(
  items: { productId: string; quantity: number }[],
  address: string,
  phoneNumber: string,
  totalPrice: number,
): Promise<PlaceOrderResponse> {
  try {
    const res = await api.post("/checkout/session", {
      items,
      address,
      phoneNumber,
      totalPrice,
    });
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

// ── Orders API ──

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  user: User;
  items: {
    productId: string;
    orderId: string;
    unitPrice: number;
    nameSnapshot: string;
    quantity: number;
    product: Product;
  }[];
  totalPrice: number;
  status:
    | "PENDING_PAYMENT"
    | "PLACED"
    | "APPROVED"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";
  paymentStatus: "UNPAID" | "PAID" | "REFUNDED";
  address: string;
  createdAt: string;
}

export async function fetchMyOrders(): Promise<Order[]> {
  try {
    const res = await api.get("/orders/");
    return res.data.orders ?? [];
  } catch {
    return [];
  }
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
  return `upi://pay?pa=sheeladangeiaf13-1@okicici&pn=RREVA CARE&am=${amount}&cu=INR&tn=Order ${orderId}`;
}

// ── Reviews API ──

export interface Review {
  id: string;
  user: {
    name: string;
    id: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export async function fetchProductReviews(
  productId: string,
): Promise<Review[]> {
  try {
    const res = await api.get(`/products/${productId}/reviews`);
    return res.data.reviews;
  } catch (error) {
    console.error(error);
  }
}

export async function submitReview(
  productId: string,
  rating: number,
  comment: string,
): Promise<Review> {
  try {
    const res = await api.post(`/products/${productId}/review`, {
      rating,
      comment,
    });
    return res.data.review;
  } catch (error) {
    console.error(error);
  }
}

export async function getAllReviews(): Promise<Review[]> {
  try {
    const res = await api.get("/products/reviews");
    return res.data.reviews;
  } catch (error) {
    console.error(error);
    return [];
  }
}
