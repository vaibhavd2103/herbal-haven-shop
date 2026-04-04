import { Link } from "react-router-dom";
import { Leaf, Droplets, Heart, Sparkles, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductCard from "@/components/ProductCard";
import { products, testimonials } from "@/lib/data";

const featuredProducts = products.slice(0, 4);

const benefits = [
  { icon: Leaf, title: "100% Natural", desc: "Every ingredient sourced from nature — no chemicals, ever." },
  { icon: Droplets, title: "Handcrafted", desc: "Made in small batches with love and traditional recipes." },
  { icon: Heart, title: "Eco-Friendly", desc: "Biodegradable packaging and sustainable practices." },
  { icon: Sparkles, title: "Chemical-Free", desc: "No parabens, sulphates, or artificial fragrances." },
];

export default function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary py-20 md:py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-primary-foreground/20" />
          <div className="absolute -right-10 bottom-10 h-48 w-48 rounded-full bg-primary-foreground/15" />
          <div className="absolute left-1/2 top-1/4 h-32 w-32 rounded-full bg-primary-foreground/10" />
        </div>
        <div className="container relative mx-auto px-4 text-center">
          <div className="mx-auto max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 px-4 py-1.5 text-sm text-primary-foreground/80">
              <Leaf className="h-4 w-4" /> Homemade Herbal Goodness
            </div>
            <h1 className="font-serif text-4xl font-bold leading-tight text-primary-foreground md:text-6xl">
              Pure. Natural.
              <br />
              <span className="text-accent-foreground">Handcrafted.</span>
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/70 md:text-xl">
              Discover RREVA CARE's range of homemade herbal products — shampoos, soaps, face washes & more, made with love from nature's finest ingredients.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/products">
                <Button size="lg" variant="secondary" className="gap-2 text-base">
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-2 text-center font-serif text-3xl font-bold">Why Choose Herbal?</h2>
          <p className="mb-12 text-center text-muted-foreground">
            Nature has everything your body needs
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b) => (
              <Card key={b.title} className="text-center transition-shadow hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-herb-light">
                    <b.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold">{b.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{b.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-secondary/50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="font-serif text-3xl font-bold">Featured Products</h2>
              <p className="mt-1 text-muted-foreground">Our most loved herbal essentials</p>
            </div>
            <Link to="/products" className="hidden text-sm font-medium text-primary hover:underline sm:block">
              View All →
            </Link>
          </div>
          <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link to="/products">
              <Button variant="outline">View All Products</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-2 text-center font-serif text-3xl font-bold">What Our Customers Say</h2>
          <p className="mb-12 text-center text-muted-foreground">Real stories from real people</p>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.id} className="transition-shadow hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="mb-3 flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic">"{t.text}"</p>
                  <p className="mt-4 font-serif text-sm font-semibold">{t.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-bold text-primary-foreground">
            Ready to Go Natural?
          </h2>
          <p className="mt-3 text-primary-foreground/70">
            Join thousands who switched to herbal. Your body will thank you.
          </p>
          <Link to="/products">
            <Button size="lg" variant="secondary" className="mt-6 gap-2">
              Explore Products <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
