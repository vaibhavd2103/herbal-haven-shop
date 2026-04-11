import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Minus, Plus, ArrowLeft, Star } from "lucide-react";
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
  user: {
    name: string;
    id: string;
  };
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
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([fetchProductById(id), fetchProductReviews(id)]).then(
      ([nextProduct, nextReviews]) => {
        setProduct(nextProduct ?? null);
        setReviews(nextReviews);
        setLoading(false);
      },
    );
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        Product not found.
      </div>
    );
  }

  const handleAdd = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    void addToCart(product, qty);
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
      setReviews((prev) => [newReview, ...prev]);
      setReviewText("");
      setReviewRating(5);
      toast.success("Review submitted!");
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length
    ? (
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      ).toFixed(1)
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/products"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Products
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-2">
        <AnimatedSection direction="left">
          <div className="max-w-md overflow-hidden rounded-xl bg-secondary/30 p-4 transition-transform duration-300 hover:scale-[1.02]">
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg">
              <img
                src={product.imageUrls[0]}
                alt={product.name}
                className="h-full w-full object-cover"
                width={800}
                height={800}
              />
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection direction="right">
          <div>
            <Badge variant="secondary" className="mb-2">
              {product.isActive ? "In Stock" : "Out of Stock"}
            </Badge>
            <h1 className="font-serif text-2xl font-bold md:text-3xl">
              {product.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {avgRating
                ? `⭐ ${avgRating} · ${reviews.length} reviews`
                : "No reviews yet"}
            </p>
            <p className="mt-4 text-foreground/80">{product.description}</p>

            <div className="mt-8 flex items-center gap-6">
              <span className="font-serif text-3xl font-bold text-primary">
                ₹{product.price}
              </span>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center rounded-md border">
                <button
                  className="px-3 py-2 transition-colors hover:bg-secondary"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-medium">
                  {qty}
                </span>
                <button
                  className="px-3 py-2 transition-colors hover:bg-secondary"
                  onClick={() => setQty(qty + 1)}
                >
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
                {product.ingredients.map((ingredient) => (
                  <Badge key={ingredient} variant="outline" className="text-xs">
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="mb-4 font-serif text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Benefits
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {product.benefits.map((benefit, index) => (
                  <div
                    key={benefit}
                    className="flex items-start gap-3 rounded-xl border border-border/60 bg-secondary/30 px-4 py-3 transition-colors hover:bg-secondary/50"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {index + 1}
                    </span>
                    <span className="text-sm leading-snug text-foreground/80">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="mb-4 font-serif text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                How to Use
              </h3>
              <ol className="relative ml-2 space-y-0 border-l border-primary/20">
                {product.howToUse.map((step, index) => (
                  <li key={step} className="relative pb-5 pl-6 last:pb-0">
                    <span className="absolute -left-[9px] top-[3px] flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-primary/30 bg-background">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                    </span>
                    <span className="mb-0.5 block font-serif text-md font-semibold uppercase tracking-widest text-primary/50">
                      Step {index + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-foreground/80">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </AnimatedSection>
      </div>

      <AnimatedSection className="mx-auto mt-16 max-w-2xl">
        <h2 className="mb-6 font-serif text-2xl font-bold">Customer Reviews</h2>

        {isAuthenticated ? (
          <Card className="mb-8 border-border/50">
            <CardContent className="pt-6">
              <h3 className="mb-4 font-serif text-lg font-semibold">
                Write a Review
              </h3>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-6 w-6 ${star <= reviewRating ? "fill-accent text-accent" : "text-border"}`}
                      />
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
              <p className="mb-3 text-muted-foreground">
                Please login to write a review
              </p>
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              No reviews yet. Be the first!
            </p>
          ) : (
            reviews.map((review) => (
              <Card
                key={review.id}
                className="animate-fade-in border-border/50"
              >
                <CardContent className="pb-4 pt-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-serif text-sm font-semibold">
                      {review.user.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mb-2 flex gap-0.5">
                    {Array.from({ length: review.rating }).map((_, index) => (
                      <Star
                        key={index}
                        className="h-3.5 w-3.5 fill-accent text-accent"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-foreground/80">{review.comment}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </AnimatedSection>
    </div>
  );
}
