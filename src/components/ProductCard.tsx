import { Link, useNavigate } from "react-router-dom";
import { Loader2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import type { Product } from "@/lib/data";
import { toast } from "sonner";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, isPending } = useCart();
  const adding = isPending(product.id);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (adding) return;
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    if (await addToCart(product)) {
      toast.success(`${product.name} added to cart`);
    }
  };

  return (
    <Link to={`/products/${product.id}`}>
      <Card className="group overflow-hidden border-border/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="flex aspect-square items-center justify-center overflow-hidden bg-secondary/50">
          <img
            src={product.imageUrls[0]}
            alt={product.name}
            loading="lazy"
            width={400}
            height={400}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="line-clamp-2 font-serif text-sm font-semibold leading-tight">
            {product.name}
          </h3>
          <div className="mt-1 flex items-center gap-1">
            <span className="text-xs text-muted-foreground">
              {product.isActive ? "In Stock" : "Out of Stock"}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-mono text-xl font-bold text-primary">
              ₹{product.price}{" "}
              <span className="text-sm text-muted-foreground ">
                MRP:₹
                <span className="font-normal line-through">{product.mrp}</span>
              </span>
            </span>
            <Button
              size="sm"
              onClick={handleAdd}
              // aria-disabled (not disabled): this button sits inside a <Link>, and
              // clicks on a truly disabled button fall through and navigate.
              aria-disabled={adding}
              aria-busy={adding}
              className="h-8 w-[5.5rem] shrink-0 gap-1 text-xs aria-disabled:cursor-not-allowed aria-disabled:opacity-60"
            >
              {/* pointer-events-none: the icon is swapped while loading, and a click
                  whose target node was removed would fall through to the <Link>. */}
              <span className="pointer-events-none inline-flex items-center gap-1">
                {adding ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <ShoppingCart className="h-3 w-3" />
                )}
                {adding ? "Adding" : "Add"}
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
