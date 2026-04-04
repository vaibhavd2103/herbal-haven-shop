import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";

export default function Cart() {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();
  const shipping = totalPrice > 500 ? 0 : 49;

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex flex-col items-center px-4 py-20 text-center">
        <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground/40" />
        <h1 className="font-serif text-2xl font-bold">Your Cart is Empty</h1>
        <p className="mt-2 text-muted-foreground">Add some herbal goodness to your cart!</p>
        <Link to="/products"><Button className="mt-6">Browse Products</Button></Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl font-bold">Shopping Cart</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="space-y-4 lg:col-span-2">
          {items.map(({ product, quantity }) => (
            <Card key={product.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="h-20 w-20 flex-shrink-0 rounded-md bg-secondary flex items-center justify-center">
                  <img src={product.image} alt={product.name} className="h-12 w-12 object-contain opacity-60" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${product.id}`} className="font-serif text-sm font-semibold hover:text-primary line-clamp-1">
                    {product.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">{product.category}</p>
                  <p className="mt-1 font-serif font-bold text-primary">₹{product.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center rounded-md border">
                    <button className="px-2 py-1 hover:bg-secondary" onClick={() => updateQuantity(product.id, quantity - 1)}>
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm">{quantity}</span>
                    <button className="px-2 py-1 hover:bg-secondary" onClick={() => updateQuantity(product.id, quantity + 1)}>
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeFromCart(product.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <Card className="h-fit">
          <CardContent className="p-6">
            <h2 className="font-serif text-lg font-bold">Order Summary</h2>
            <Separator className="my-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{totalPrice}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : `₹${shipping}`}</span></div>
              {shipping > 0 && <p className="text-xs text-muted-foreground">Free shipping on orders above ₹500</p>}
              <Separator />
              <div className="flex justify-between font-serif text-lg font-bold">
                <span>Total</span><span className="text-primary">₹{totalPrice + shipping}</span>
              </div>
            </div>
            <Link to="/checkout">
              <Button className="mt-6 w-full gap-2">Proceed to Pay <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
