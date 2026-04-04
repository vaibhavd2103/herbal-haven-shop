import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, Star, Minus, Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { fetchProductById } from "@/lib/api";
import { products, type Product } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import { toast } from "sonner";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchProductById(id).then((p) => {
      setProduct(p ?? null);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Loading…</div>;
  if (!product) return <div className="container mx-auto px-4 py-20 text-center">Product not found.</div>;

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAdd = () => {
    addToCart(product, qty);
    toast.success(`${product.name} added to cart`);
    setQty(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/products" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to Products
      </Link>

      <div className="mt-4 grid gap-8 md:grid-cols-2">
        {/* Image */}
        <div className="flex aspect-square items-center justify-center rounded-lg bg-secondary">
          <img src={product.image} alt={product.name} className="h-48 w-48 object-contain opacity-60" />
        </div>

        {/* Details */}
        <div>
          <Badge variant="secondary" className="mb-2">{product.category}</Badge>
          <h1 className="font-serif text-2xl font-bold md:text-3xl">{product.name}</h1>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-muted"}`} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">{product.rating}/5</span>
          </div>

          <p className="mt-4 text-foreground/80">{product.description}</p>

          <div className="mt-6">
            <h3 className="font-serif text-sm font-semibold">Ingredients</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.ingredients.map((ing) => (
                <Badge key={ing} variant="outline" className="text-xs">{ing}</Badge>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center gap-6">
            <span className="font-serif text-3xl font-bold text-primary">₹{product.price}</span>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-md border">
              <button className="px-3 py-2 hover:bg-secondary" onClick={() => setQty(Math.max(1, qty - 1))}><Minus className="h-4 w-4" /></button>
              <span className="w-10 text-center text-sm font-medium">{qty}</span>
              <button className="px-3 py-2 hover:bg-secondary" onClick={() => setQty(qty + 1)}><Plus className="h-4 w-4" /></button>
            </div>
            <Button onClick={handleAdd} className="gap-2">
              <ShoppingCart className="h-4 w-4" /> Add to Cart
            </Button>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 font-serif text-2xl font-bold">You May Also Like</h2>
          <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
