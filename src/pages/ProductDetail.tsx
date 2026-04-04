import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, Minus, Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { fetchProductById } from "@/lib/api";
import { type Product } from "@/lib/data";
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

  if (loading)
    return (
      <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">
        Loading…
      </div>
    );
  if (!product)
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        Product not found.
      </div>
    );

  const handleAdd = () => {
    addToCart(product, qty);
    toast.success(`${product.name} added to cart`);
    setQty(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/products"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Products
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="flex aspect-square items-center justify-center justify-self-center rounded-lg bg-secondary p-4 max-w-md">
          <img
            src={product.imageUrls[0]}
            alt={product.name}
            className="h-full w-full object-cover opacity-100 rounded-md"
          />
        </div>

        {/* Details */}
        <div>
          <Badge variant="secondary" className="mb-2">
            {product.isActive ? "In Stock" : "Out of Stock"}
          </Badge>
          <h1 className="font-serif text-2xl font-bold md:text-3xl">
            {product.name}
          </h1>

          <p className="mt-4 text-foreground/80">{product.description}</p>

          {/* Price & Cart */}
          <div className="mt-8 flex items-center gap-6">
            <span className="font-serif text-3xl font-bold text-primary">
              ₹{product.price}
            </span>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-md border">
              <button
                className="px-3 py-2 hover:bg-secondary"
                onClick={() => setQty(Math.max(1, qty - 1))}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-medium">
                {qty}
              </span>
              <button
                className="px-3 py-2 hover:bg-secondary"
                onClick={() => setQty(qty + 1)}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button onClick={handleAdd} className="gap-2">
              <ShoppingCart className="h-4 w-4" /> Add to Cart
            </Button>
          </div>

          {/* Ingredients */}
          <div className="mt-6">
            <h3 className="font-serif text-sm font-semibold">Ingredients</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.ingredients.map((ing) => (
                <Badge key={ing} variant="outline" className="text-xs">
                  {ing}
                </Badge>
              ))}
            </div>
          </div>

          {/* ── Benefits ── */}
          <div className="mt-8">
            <h3 className="font-serif text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Benefits
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.benefits.map((benefit, i) => (
                <div
                  key={benefit}
                  className="flex items-start gap-3 rounded-xl border border-border/60 bg-secondary/40 px-4 py-3 hover:bg-secondary transition-colors"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-mono font-bold">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-snug text-foreground/80">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── How to Use ── */}
          <div className="mt-8">
            <h3 className="font-serif text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              How to Use
            </h3>
            <ol className="relative border-l border-primary/20 ml-2 space-y-0">
              {product.howToUse.map((step, i) => (
                <li key={step} className="relative pl-6 pb-5 last:pb-0">
                  <span className="absolute -left-[9px] top-[3px] flex h-[18px] w-[18px] items-center justify-center rounded-full bg-background border-2 border-primary/40">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                  </span>
                  <span className="font-serif text-md font-semibold uppercase tracking-widest text-primary/50 block mb-0.5">
                    Step {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-foreground/80">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
