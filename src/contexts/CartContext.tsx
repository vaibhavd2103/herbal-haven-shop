import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
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
import { toast } from "sonner";
import { User } from "./AuthContext";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  /** Resolve to true when the server confirmed the change, false if it was skipped or failed. */
  addToCart: (product: Product, quantity?: number) => Promise<boolean>;
  removeFromCart: (productId: string, quantity: number) => Promise<boolean>;
  updateQuantity: (productId: string, quantity: number) => Promise<boolean>;
  isPending: (productId: string) => boolean;
  clearCart: (userID: string) => Promise<void>;
  totalItems: number;
  totalPrice: number;
  loading: boolean;
  refreshCart: () => Promise<void>;
}

const emptyCartContext: CartContextType = {
  items: [],
  addToCart: async () => false,
  removeFromCart: async () => false,
  updateQuantity: async () => false,
  isPending: () => false,
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
  user: User | null;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const syncToLocal = (cartItems: CartItem[]) => {
    localStorage.setItem("rreva-cart", JSON.stringify(cartItems));
  };

  const refreshCart = useCallback(async () => {
    // Don't call cart API if user is not logged in
    if (!isAuthenticated || user?.role !== "CUSTOMER") {
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
  }, [isAuthenticated, user?.role]);

  useEffect(() => {
    void refreshCart();
  }, [refreshCart]);

  // Product ids with a request in flight. The ref is the synchronous guard (state
  // lags a render behind, so rapid double-clicks would slip through it); the state
  // drives the loading UI.
  const inFlightRef = useRef<Set<string>>(new Set());
  const [pendingIds, setPendingIds] = useState<ReadonlySet<string>>(new Set());
  const itemsRef = useRef<CartItem[]>([]);
  itemsRef.current = items;

  const isPending = useCallback(
    (productId: string) => pendingIds.has(productId),
    [pendingIds],
  );

  const applyServerCart = (apiItems: CartItem[]) => {
    setItems(apiItems);
    syncToLocal(apiItems);
  };

  /**
   * Runs one cart mutation per product at a time. Extra clicks while a request is
   * in flight are ignored (the buttons are disabled too), and the cart only ever
   * shows what the server confirmed, so the numbers never flicker or go stale.
   */
  const runMutation = async (
    productId: string,
    request: () => Promise<CartItem[]>,
    errorMessage: string,
  ): Promise<boolean> => {
    if (inFlightRef.current.has(productId)) return false;
    inFlightRef.current.add(productId);
    setPendingIds(new Set(inFlightRef.current));
    try {
      applyServerCart(await request());
      return true;
    } catch (error) {
      console.error(errorMessage, error);
      toast.error(errorMessage);
      return false;
    } finally {
      inFlightRef.current.delete(productId);
      setPendingIds(new Set(inFlightRef.current));
    }
  };

  const currentQuantity = (productId: string) =>
    itemsRef.current.find((item) => item.product.id === productId)?.quantity ??
    0;

  const addToCart = (product: Product, quantity = 1) => {
    if (!isAuthenticated) return Promise.resolve(false);
    // The API sets the quantity, so send the new total, not the increment.
    return runMutation(
      product.id,
      () => addToCartAPI(product.id, currentQuantity(product.id) + quantity),
      "Could not add to cart. Please try again.",
    );
  };

  const removeFromCart = (productId: string, quantity: number) =>
    runMutation(
      productId,
      () => removeFromCartAPI(productId, quantity),
      "Could not update your cart. Please try again.",
    );

  const updateQuantity = (productId: string, quantity: number) =>
    runMutation(
      productId,
      () => updateCartQuantityAPI(productId, quantity),
      "Could not update your cart. Please try again.",
    );

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
        isPending,
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
