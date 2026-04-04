import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/lib/data";
import { toast } from "sonner";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Link to={`/products/${product.id}`}>
      <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
        <div className="aspect-square bg-secondary flex items-center justify-center overflow-hidden">
          <img
            src={product.imageUrls[0]}
            alt={product.name}
            className="h-full w-full object-cover opacity-80 transition-all group-hover:scale-110 group-hover:opacity-100"
          />
        </div>
        <CardContent className="p-4">
          {/* <span className="mb-1 inline-block rounded-full bg-herb-light px-2 py-0.5 text-[10px] font-medium text-primary">
            {product.currency}
          </span> */}
          <h3 className="font-serif text-sm font-semibold leading-tight line-clamp-2">
            {product.name}
          </h3>
          <div className="mt-1 flex items-center gap-1">
            {/* <Star className="h-3 w-3 fill-accent text-accent" /> */}
            <span className="text-xs text-muted-foreground">
              {product.isActive ? "In Stock" : "Out of Stock"}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-serif text-lg font-bold text-primary">
              ₹{product.price}
            </span>
            <Button size="sm" onClick={handleAdd} className="h-8 gap-1 text-xs">
              <ShoppingCart className="h-3 w-3" /> Add
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
