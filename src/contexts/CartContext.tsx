import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Product } from "@/lib/data";
import {
  fetchCart,
  addToCartAPI,
  removeFromCartAPI,
  updateCartQuantityAPI,
  clearCartAPI,
} from "@/lib/api";
import { User } from "./AuthContext";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: (userID: string) => Promise<void>;
  totalItems: number;
  totalPrice: number;
  loading: boolean;
  refreshCart: () => Promise<void>;
}

const emptyCartContext: CartContextType = {
  items: [],
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateQuantity: async () => {},
  clearCart: async () => {},
  totalItems: 0,
  totalPrice: 0,
  loading: false,
  refreshCart: async () => {},
};

const CartContext = createContext<CartContextType>(emptyCartContext);

export function CartProvider({
  children,
  isAuthenticated,
  user,
}: {
  children: ReactNode;
  isAuthenticated: boolean;
  user: User;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const syncToLocal = (cartItems: CartItem[]) => {
    localStorage.setItem("rreva-cart", JSON.stringify(cartItems));
  };

  const refreshCart = useCallback(async () => {
    // Don't call cart API if user is not logged in
    if (!isAuthenticated || user.role !== "CUSTOMER") {
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
    void refreshCart();
  }, [refreshCart]);

  const addToCart = async (product: Product, quantity = 1) => {
    if (!isAuthenticated) return;

    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      const updated = existing
        ? prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          )
        : [...prev, { product, quantity }];

      syncToLocal(updated);
      return updated;
    });

    try {
      const apiItems = await addToCartAPI(product.id, quantity);
      if (apiItems.length > 0) {
        setItems(apiItems);
        syncToLocal(apiItems);
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const removeFromCart = async (productId: string, quantity: number) => {
    setItems((prev) => {
      const updated =
        quantity === 0
          ? prev.filter((item) => item.product.id !== productId)
          : prev.map((item) =>
              item.product.id === productId ? { ...item, quantity } : item,
            );
      syncToLocal(updated);
      return updated;
    });

    try {
      const apiItems = await removeFromCartAPI(productId, quantity);
      if (apiItems.length > 0) {
        setItems(apiItems);
        syncToLocal(apiItems);
      }
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    setItems((prev) => {
      const updated = prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      );
      syncToLocal(updated);
      return updated;
    });

    try {
      const apiItems = await updateCartQuantityAPI(productId, quantity);
      if (apiItems.length > 0) {
        setItems(apiItems);
        syncToLocal(apiItems);
      }
    } catch (error) {
      console.error("Failed to update cart quantity:", error);
    }
  };

  const clearCart = async (userID: string) => {
    setItems([]);
    localStorage.removeItem("rreva-cart");
    try {
      await clearCartAPI(userID);
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        loading,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
