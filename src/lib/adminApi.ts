import { User } from "@/contexts/AuthContext";
import type { Product } from "./data";
import { products as mockProducts } from "./data";
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
      return "Unauthorized. Please login again.";
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

// ── Orders ──

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
  status: "PENDING_PAYMENT" | "PLACED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentStatus: "PENDING_PAYMENT" | "VERIFIED_PAYMENT" | "REJECTED_PAYMENT";
  address: string;
  createdAt: string;
}

export async function fetchOrders(): Promise<Order[]> {
  try {
    const res = await api.get("/admin/orders");
    return res.data.orders;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function approvePayment(orderId: string): Promise<Order> {
  try {
    const res = await api.put(`/admin/orders/${orderId}/approve-payment`);
    return res.data.order;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function rejectPayment(orderId: string): Promise<Order> {
  try {
    const res = await api.put(`/admin/orders/${orderId}/reject-payment`);
    return res.data.order;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"],
): Promise<Order> {
  try {
    const res = await api.put(`/admin/orders/${orderId}/status`, { status });
    return res.data.order;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

// ── Products CRUD ──

let productsStore = [...mockProducts];

export async function fetchAdminProducts(): Promise<Product[]> {
  try {
    const res = await api.get("/products");
    return res.data.products;
  } catch {
    return [...productsStore];
  }
}

export async function createProduct(
  product: Omit<Product, "id" | "createdAt" | "updatedAt">,
): Promise<Product> {
  try {
    const res = await api.post("/products", product);
    return res.data.product;
  } catch (error) {
    console.error(error);
  }
}

export async function updateProduct(
  id: string,
  data: Partial<Product>,
): Promise<Product> {
  try {
    const res = await api.put(`/products/${id}`, data);
    return res.data.product;
  } catch {
    const idx = productsStore.findIndex((p) => p.id === id);
    if (idx !== -1) {
      productsStore[idx] = {
        ...productsStore[idx],
        ...data,
        updatedAt: new Date().toISOString(),
      };
    }
    return productsStore[idx];
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await api.delete(`/admin/products/${id}`);
  } catch {
    productsStore = productsStore.filter((p) => p.id !== id);
  }
}

export async function uploadProductImages(
  productId: string,
  files: File[],
): Promise<string[]> {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    const res = await api.post(
      `/admin/products/${productId}/images`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return res.data.imageUrls;
  } catch {
    return files.map((file) => URL.createObjectURL(file));
  }
}
