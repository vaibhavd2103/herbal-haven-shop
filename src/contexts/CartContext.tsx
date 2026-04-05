import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Product } from "@/lib/data";
import { fetchCart, addToCartAPI, removeFromCartAPI, updateCartQuantityAPI, clearCartAPI } from "@/lib/api";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  loading: boolean;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children, isAuthenticated }: { children: ReactNode; isAuthenticated: boolean }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const syncToLocal = (cartItems: CartItem[]) => {
    localStorage.setItem("rreva-cart", JSON.stringify(cartItems));
  };

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const cartItems = await fetchCart();
      setItems(cartItems);
      syncToLocal(cartItems);
    } catch {
      try {
        const stored = localStorage.getItem("rreva-cart");
        setItems(stored ? JSON.parse(stored) : []);
      } catch {
        setItems([]);
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      const updated = existing
        ? prev.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i)
        : [...prev, { product, quantity }];
      syncToLocal(updated);
      return updated;
    });
    const apiItems = await addToCartAPI(product.id, quantity);
    if (apiItems.length > 0) {
      setItems(apiItems);
      syncToLocal(apiItems);
    }
  };

  const removeFromCart = async (productId: string) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.product.id !== productId);
      syncToLocal(updated);
      return updated;
    });
    const apiItems = await removeFromCartAPI(productId);
    if (apiItems.length > 0) {
      setItems(apiItems);
      syncToLocal(apiItems);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }
    setItems((prev) => {
      const updated = prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i));
      syncToLocal(updated);
      return updated;
    });
    const apiItems = await updateCartQuantityAPI(productId, quantity);
    if (apiItems.length > 0) {
      setItems(apiItems);
      syncToLocal(apiItems);
    }
  };

  const clearCart = async () => {
    setItems([]);
    localStorage.removeItem("rreva-cart");
    await clearCartAPI();
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, loading, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
