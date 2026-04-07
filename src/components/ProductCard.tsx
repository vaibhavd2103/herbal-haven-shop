import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import type { Product } from "@/lib/data";
import { toast } from "sonner";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Link to={`/products/${product.id}`}>
      <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
        <Card className="group overflow-hidden transition-shadow hover:shadow-lg border-border/50">
          <div className="aspect-square bg-secondary/50 flex items-center justify-center overflow-hidden">
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
            <h3 className="font-serif text-sm font-semibold leading-tight line-clamp-2">
              {product.name}
            </h3>
            <div className="mt-1 flex items-center gap-1">
              <span className="text-xs text-muted-foreground">
                {product.isActive ? "In Stock" : "Out of Stock"}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-serif text-lg font-bold text-primary">₹{product.price}</span>
              <Button size="sm" onClick={handleAdd} className="h-8 gap-1 text-xs">
                <ShoppingCart className="h-3 w-3" /> Add
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
