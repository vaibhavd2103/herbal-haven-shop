import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Minus, Plus, ArrowLeft, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { fetchProductById, fetchProductReviews, submitReview } from "@/lib/api";
import { type Product } from "@/lib/data";
import { toast } from "sonner";
import AnimatedSection from "@/components/AnimatedSection";

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([fetchProductById(id), fetchProductReviews(id)]).then(([p, r]) => {
      setProduct(p ?? null);
      setReviews(r);
      setLoading(false);
    });
  }, [id]);

  if (loading)
    return <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Loading…</div>;
  if (!product)
    return <div className="container mx-auto px-4 py-20 text-center">Product not found.</div>;

  const handleAdd = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    addToCart(product, qty);
    toast.success(`${product.name} added to cart`);
    setQty(1);
  };

  const handleReviewSubmit = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to write a review");
      navigate("/login");
      return;
    }
    if (!reviewText.trim()) {
      toast.error("Please write a review");
      return;
    }
    setSubmitting(true);
    try {
      const newReview = await submitReview(id!, reviewRating, reviewText);
      setReviews([newReview, ...reviews]);
      setReviewText("");
      setReviewRating(5);
      toast.success("Review submitted!");
    } catch {
      toast.error("Failed to submit review");
    }
    setSubmitting(false);
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "No reviews";

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/products" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Products
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-2">
        <AnimatedSection direction="left">
          <motion.div
            className="flex aspect-square items-center justify-center rounded-xl bg-secondary/30 p-4 max-w-md overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <img src={product.imageUrls[0]} alt={product.name} className="h-full w-full object-cover rounded-lg" />
          </motion.div>
        </AnimatedSection>

        <AnimatedSection direction="right">
          <div>
            <Badge variant="secondary" className="mb-2">
              {product.isActive ? "In Stock" : "Out of Stock"}
            </Badge>
            <h1 className="font-serif text-2xl font-bold md:text-3xl">{product.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {typeof avgRating === "string" ? avgRating : `⭐ ${avgRating} · ${reviews.length} reviews`}
            </p>
            <p className="mt-4 text-foreground/80">{product.description}</p>

            <div className="mt-8 flex items-center gap-6">
              <span className="font-serif text-3xl font-bold text-primary">₹{product.price}</span>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center rounded-md border">
                <button className="px-3 py-2 hover:bg-secondary transition-colors" onClick={() => setQty(Math.max(1, qty - 1))}>
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-medium">{qty}</span>
                <button className="px-3 py-2 hover:bg-secondary transition-colors" onClick={() => setQty(qty + 1)}>
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button onClick={handleAdd} className="gap-2">
                <ShoppingCart className="h-4 w-4" /> Add to Cart
              </Button>
            </div>

            <div className="mt-6">
              <h3 className="font-serif text-sm font-semibold">Ingredients</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.ingredients.map((ing) => (
                  <Badge key={ing} variant="outline" className="text-xs">{ing}</Badge>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-serif text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">Benefits</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.benefits.map((benefit, i) => (
                  <div key={benefit} className="flex items-start gap-3 rounded-xl border border-border/60 bg-secondary/30 px-4 py-3 hover:bg-secondary/50 transition-colors">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-mono font-bold">{i + 1}</span>
                    <span className="text-sm leading-snug text-foreground/80">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-serif text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">How to Use</h3>
              <ol className="relative border-l border-primary/20 ml-2 space-y-0">
                {product.howToUse.map((step, i) => (
                  <li key={step} className="relative pl-6 pb-5 last:pb-0">
                    <span className="absolute -left-[9px] top-[3px] flex h-[18px] w-[18px] items-center justify-center rounded-full bg-background border-2 border-primary/30">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                    </span>
                    <span className="font-serif text-md font-semibold uppercase tracking-widest text-primary/50 block mb-0.5">Step {i + 1}</span>
                    <p className="text-sm leading-relaxed text-foreground/80">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* Reviews Section */}
      <AnimatedSection className="mt-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-2xl font-bold mb-6">Customer Reviews</h2>

          {/* Write Review */}
          {isAuthenticated ? (
            <Card className="mb-8 border-border/50">
              <CardContent className="pt-6">
                <h3 className="font-serif text-lg font-semibold mb-4">Write a Review</h3>
                <div className="mb-4">
                  <label className="text-sm font-medium mb-2 block">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onClick={() => setReviewRating(star)} className="transition-transform hover:scale-110">
                        <Star className={`h-6 w-6 ${star <= reviewRating ? "fill-accent text-accent" : "text-border"}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <Textarea
                  placeholder="Share your experience with this product..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={3}
                  className="mb-4"
                />
                <Button onClick={handleReviewSubmit} disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Review"}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-8 border-border/50 bg-secondary/30">
              <CardContent className="py-6 text-center">
                <p className="text-muted-foreground mb-3">Please login to write a review</p>
                <Link to="/login"><Button variant="outline" size="sm">Login</Button></Link>
              </CardContent>
            </Card>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No reviews yet. Be the first!</p>
            ) : (
              reviews.map((r) => (
                <motion.div key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Card className="border-border/50">
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-serif text-sm font-semibold">{r.userName}</span>
                        <span className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-0.5 mb-2">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
                        ))}
                      </div>
                      <p className="text-sm text-foreground/80">{r.comment}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
