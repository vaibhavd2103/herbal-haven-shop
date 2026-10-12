import { Link } from "react-router-dom";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

export default function Cart() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    isPending,
    totalPrice,
    loading,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const anyPending = items.some(({ product }) => isPending(product.id));

  const shipping = totalPrice > 500 ? 0 : 49;

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto flex flex-col items-center px-4 py-20 text-center">
        <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground/40" />
        <h1 className="font-serif text-2xl font-bold">
          Login to View Your Cart
        </h1>
        <p className="mt-2 text-muted-foreground">
          Sign in to add items to your cart and place orders.
        </p>
        <div className="mt-6 flex gap-3">
          <Link to="/login">
            <Button>Login</Button>
          </Link>
          <Link to="/products">
            <Button variant="outline">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto flex flex-col items-center px-4 py-20 text-center">
        <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground/40 animate-pulse" />
        <h1 className="font-serif text-2xl font-bold">Loading your cart...</h1>
        <p className="mt-2 text-muted-foreground">
          Fetching the freshest herbs for you!
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex flex-col items-center px-4 py-20 text-center">
        <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground/40" />
        <h1 className="font-serif text-2xl font-bold">Your Cart is Empty</h1>
        <p className="mt-2 text-muted-foreground">
          Add some herbal goodness to your cart!
        </p>
        <Link to="/products">
          <Button className="mt-6">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl font-bold">Shopping Cart</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="space-y-4 lg:col-span-2">
          {items.map(({ product, quantity }) => {
            const busy = isPending(product.id);
            return (
              <Card
                key={product.id}
                className={
                  busy ? "opacity-70 transition-opacity" : "transition-opacity"
                }
                aria-busy={busy}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="h-20 w-20 flex-shrink-0 rounded-md bg-secondary flex items-center justify-center p-2">
                    <img
                      src={product.imageUrls[0]}
                      alt={product.name}
                      className="h-full w-full object-cover opacity-60 rounded-sm"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${product.id}`}
                      className="font-serif text-sm font-semibold hover:text-primary line-clamp-1"
                    >
                      {product.name}
                    </Link>
                    {/* <p className="text-xs text-muted-foreground">
                    {product.currency}
                  </p> */}
                    <p className="mt-1 font-serif font-bold text-primary">
                      ₹{product.price}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center rounded-md border">
                      <button
                        disabled={busy || quantity <= 1}
                        className="px-2 py-1 hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() =>
                          void removeFromCart(product.id, quantity - 1)
                        }
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="flex w-8 items-center justify-center text-sm">
                        {busy ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          quantity
                        )}
                      </span>
                      <button
                        disabled={busy}
                        className="px-2 py-1 hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() =>
                          void updateQuantity(product.id, quantity + 1)
                        }
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={busy}
                      onClick={() => void removeFromCart(product.id, 0)}
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Summary */}
        <Card className="h-fit">
          <CardContent className="p-6">
            <h2 className="font-serif text-lg font-bold">Order Summary</h2>
            <Separator className="my-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-muted-foreground">
                  Free shipping on orders above ₹500
                </p>
              )}
              <Separator />
              <div className="flex justify-between font-serif text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">₹{totalPrice + shipping}</span>
              </div>
            </div>
            {anyPending ? (
              <Button className="mt-6 w-full gap-2" disabled>
                <Loader2 className="h-4 w-4 animate-spin" /> Updating cart...
              </Button>
            ) : (
              <Link to="/checkout">
                <Button className="mt-6 w-full gap-2">
                  Proceed to Pay <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
