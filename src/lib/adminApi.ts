import type { Product } from "./data";
import { products as mockProducts } from "./data";
import axios from "axios";

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

// ── Orders ──

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "approved" | "rejected";
  shippingAddress: string;
  createdAt: string;
}

const dummyOrders: Order[] = [
  {
    id: "ORD-1001",
    customerName: "Priya Sharma",
    customerEmail: "priya@example.com",
    items: [
      {
        productId: "1",
        productName: "Amla & Shikakai Herbal Shampoo",
        quantity: 2,
        price: 349,
      },
      {
        productId: "3",
        productName: "Coconut & Shea Butter Moisturiser",
        quantity: 1,
        price: 399,
      },
    ],
    total: 1097,
    status: "pending",
    paymentStatus: "pending",
    shippingAddress: "123 MG Road, Mumbai, MH 400001",
    createdAt: "2025-04-01T10:30:00Z",
  },
  {
    id: "ORD-1002",
    customerName: "Ravi Kumar",
    customerEmail: "ravi@example.com",
    items: [
      {
        productId: "5",
        productName: "Bhringraj Hair Oil",
        quantity: 3,
        price: 299,
      },
    ],
    total: 897,
    status: "confirmed",
    paymentStatus: "approved",
    shippingAddress: "45 Jayanagar, Bangalore, KA 560041",
    createdAt: "2025-04-02T14:20:00Z",
  },
  {
    id: "ORD-1003",
    customerName: "Sneha Patel",
    customerEmail: "sneha@example.com",
    items: [
      {
        productId: "2",
        productName: "Turmeric & Sandalwood Face Wash",
        quantity: 1,
        price: 279,
      },
      {
        productId: "6",
        productName: "Rose & Glycerin Face Mist",
        quantity: 2,
        price: 229,
      },
    ],
    total: 737,
    status: "shipped",
    paymentStatus: "approved",
    shippingAddress: "78 Law Garden, Ahmedabad, GJ 380006",
    createdAt: "2025-04-03T09:15:00Z",
  },
  {
    id: "ORD-1004",
    customerName: "Anita Desai",
    customerEmail: "anita@example.com",
    items: [
      {
        productId: "4",
        productName: "Neem & Tulsi Herbal Soap",
        quantity: 5,
        price: 149,
      },
    ],
    total: 745,
    status: "pending",
    paymentStatus: "pending",
    shippingAddress: "12 Civil Lines, Delhi, DL 110001",
    createdAt: "2025-04-05T16:45:00Z",
  },
];

const ordersStore = [...dummyOrders];

export async function fetchOrders(): Promise<Order[]> {
  try {
    const res = await api.get("/admin/orders");
    return res.data.orders;
  } catch {
    return [...ordersStore];
  }
}

export async function approvePayment(orderId: string): Promise<Order> {
  try {
    const res = await api.put(`/admin/orders/${orderId}/approve-payment`);
    return res.data.order;
  } catch {
    const order = ordersStore.find((o) => o.id === orderId);
    if (order) {
      order.paymentStatus = "approved";
      order.status = "confirmed";
    }
    return order!;
  }
}

export async function rejectPayment(orderId: string): Promise<Order> {
  try {
    const res = await api.put(`/admin/orders/${orderId}/reject-payment`);
    return res.data.order;
  } catch {
    const order = ordersStore.find((o) => o.id === orderId);
    if (order) {
      order.paymentStatus = "rejected";
      order.status = "cancelled";
    }
    return order!;
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"],
): Promise<Order> {
  try {
    const res = await api.put(`/admin/orders/${orderId}/status`, { status });
    return res.data.order;
  } catch {
    const order = ordersStore.find((o) => o.id === orderId);
    if (order) order.status = status;
    return order!;
  }
}

// ── Products CRUD ──

let productsStore = [...mockProducts];

export async function fetchAdminProducts(): Promise<Product[]> {
  try {
    const res = await api.get("/admin/products");
    return res.data.products;
  } catch {
    return [...productsStore];
  }
}

export async function createProduct(
  product: Omit<Product, "id" | "createdAt" | "updatedAt">,
): Promise<Product> {
  try {
    const res = await api.post("/admin/products", product);
    return res.data.product;
  } catch {
    const newProduct: Product = {
      ...product,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    productsStore.push(newProduct);
    return newProduct;
  }
}

export async function updateProduct(
  id: string,
  data: Partial<Product>,
): Promise<Product> {
  try {
    const res = await api.put(`/admin/products/${id}`, data);
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
    // Return dummy object URLs for preview
    return files.map((file) => URL.createObjectURL(file));
  }
}
