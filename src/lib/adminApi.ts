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
    const res = await api.patch(`/admin/orders/${orderId}/place`);
    return res.data.order;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function rejectPayment(orderId: string): Promise<Order> {
  try {
    const res = await api.patch(`/admin/orders/${orderId}/rejectPayment`);
    return res.data.order;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function approveOrder(orderId: string): Promise<Order> {
  try {
    const res = await api.patch(`/admin/orders/${orderId}/approve`);
    return res.data.order;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function changeOrderStatus(
  orderId: string,
  status: Order["status"],
): Promise<Order> {
  try {
    const res = await api.patch(
      `/admin/orders/${orderId}/updateOrderStatus/${status}`,
      {
        status,
      },
    );
    return res.data.order;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

// ── Products CRUD ──

let productsStore = [...mockProducts];

// ── Shared types ──

type ProductFields = Omit<Product, "id" | "createdAt" | "updatedAt">;

export type CreateProductPayload = ProductFields & {
  /** New image files to upload to Cloudinary */
  images?: File[];
};

export type UpdateProductPayload = Partial<ProductFields> & {
  /** New image files to upload to Cloudinary */
  images?: File[];
  /**
   * Existing Cloudinary URLs the client wants to keep.
   *
   * - Omit this field entirely → server leaves imageUrls untouched.
   * - Pass an empty array     → server deletes all existing images.
   * - Pass a subset           → server deletes removed URLs, keeps the rest,
   *                             then appends any newly uploaded ones.
   */
  existingImageUrls?: string[];
};

/**
 * Builds a multipart/form-data payload that matches the backend's expected
 * shape (Zod CreateSchema / UpdateSchema):
 *
 *  • Scalar fields       → single append
 *  • Array fields        → repeated keys  (ingredients=x&ingredients=y …)
 *  • existingImageUrls   → repeated keys  (tells server which Cloudinary URLs
 *                          to keep; omit the field entirely to leave images alone)
 *  • images              → File objects appended under "images"
 */
function buildProductFormData(product: UpdateProductPayload): FormData {
  const formData = new FormData();

  // Scalar fields
  const scalarFields = [
    "name",
    "description",
    "price",
    "currency",
    "isActive",
    "mrp",
  ] as const;
  for (const field of scalarFields) {
    if (product[field] !== undefined) {
      formData.append(field, String(product[field]));
    }
  }

  // Array fields — appended one-by-one so multer/Zod receives them as arrays
  const arrayFields = ["ingredients", "benefits", "howToUse"] as const;
  for (const field of arrayFields) {
    const values = product[field];
    if (Array.isArray(values)) {
      values.forEach((v) => formData.append(field, v));
    }
  }

  // Existing Cloudinary URLs to keep.
  // Only append when explicitly provided — omitting signals the server to
  // leave the stored imageUrls completely untouched.
  if (product.existingImageUrls !== undefined) {
    product.existingImageUrls.forEach((url) =>
      formData.append("existingImageUrls", url),
    );
  }

  // New image files
  product.images?.forEach((file) => formData.append("images", file));

  return formData;
}

export async function fetchAdminProducts(): Promise<Product[]> {
  try {
    const res = await api.get("/products");
    return res.data.products;
  } catch {
    return [...productsStore];
  }
}

export async function createProduct(
  product: CreateProductPayload,
): Promise<Product> {
  try {
    const formData = buildProductFormData(product);
    // Do NOT set Content-Type manually — axios must auto-generate the boundary
    // (e.g. multipart/form-data; boundary=---...). Without it multer cannot parse files.
    const res = await api.post("/products", formData);
    return res.data.product;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function updateProduct(
  id: string,
  data: UpdateProductPayload,
): Promise<Product> {
  try {
    const formData = buildProductFormData(data);
    // Same reason — let axios set the boundary automatically
    const res = await api.put(`/products/${id}`, formData);
    return res.data.product;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await api.delete(`/products/${id}`);
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
    const res = await api.post(`/admin/products/${productId}/images`, formData);
    return res.data.imageUrls;
  } catch {
    return files.map((file) => URL.createObjectURL(file));
  }
}
