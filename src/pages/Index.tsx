import { Link } from "react-router-dom";
import {
  Leaf,
  Droplets,
  Heart,
  Sparkles,
  Star,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductCard from "@/components/ProductCard";
import AnimatedSection from "@/components/AnimatedSection";
import { testimonials, type Product } from "@/lib/data";
import { useEffect, useState } from "react";
import { fetchProducts } from "@/lib/api";
import heroBg from "@/assets/hero-bg.jpg";
import hero from "@/assets/hero.jpg";

export default function Index() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data);
    });
  }, []);

  const featuredProducts = products.slice(0, 4);

  const benefits = [
    {
      icon: Leaf,
      title: "100% Natural",
      desc: "Every ingredient sourced from nature — no chemicals, ever.",
    },
    {
      icon: Droplets,
      title: "Handcrafted",
      desc: "Made in small batches with love and traditional recipes.",
    },
    {
      icon: Heart,
      title: "Eco-Friendly",
      desc: "Biodegradable packaging and sustainable practices.",
    },
    {
      icon: Sparkles,
      title: "Chemical-Free",
      desc: "No parabens, sulphates, or artificial fragrances.",
    },
  ];

  return (
    <div>
      <section className="relative overflow-hidden bg-primary/10 py-20 md:py-32">
        <div className="absolute inset-0">
          <img
            src={hero}
            alt="Botanical herbal product arrangement"
            className="h-full w-full object-cover opacity-50"
            width={1920}
            height={800}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background/90" />
        <div className="container relative mx-auto px-4 text-center">
          <div className="mx-auto max-w-2xl animate-fade-in">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-foreground/70">
              <Leaf className="h-4 w-4 text-primary" /> Homemade Herbal Goodness
            </div>
            <h1 className="font-serif text-4xl font-bold leading-tight text-foreground md:text-6xl">
              Natural homemade products that make daily care feel simple, safe,
              and beautiful.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
              Discover RREVA CARE&apos;s range of homemade herbal products —
              shampoos, soaps, face washes & more, made with love from
              nature&apos;s finest ingredients.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/products">
                <Button size="lg" className="gap-2 text-base">
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <h2 className="mb-2 text-center font-serif text-3xl font-bold">
              Why Choose Herbal?
            </h2>
            <p className="mb-12 text-center text-muted-foreground">
              Nature has everything your body needs
            </p>
          </AnimatedSection>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <AnimatedSection key={benefit.title} delay={index * 0.1}>
                <Card className="border-border/50 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <CardContent className="pt-6">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <benefit.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-serif text-lg font-semibold">
                      {benefit.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {benefit.desc}
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="mb-12 flex items-end justify-between">
              <div>
                <h2 className="font-serif text-3xl font-bold">
                  Featured Products
                </h2>
                <p className="mt-1 text-muted-foreground">
                  Our most loved herbal essentials
                </p>
              </div>
              <Link
                to="/products"
                className="hidden text-sm font-medium text-primary hover:underline sm:block"
              >
                View All →
              </Link>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {featuredProducts.map((product, index) => (
              <AnimatedSection key={product.id} delay={index * 0.1}>
                <ProductCard product={product} />
              </AnimatedSection>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link to="/products">
              <Button variant="outline">View All Products</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <h2 className="mb-2 text-center font-serif text-3xl font-bold">
              What Our Customers Say
            </h2>
            <p className="mb-12 text-center text-muted-foreground">
              Real stories from real people
            </p>
          </AnimatedSection>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <AnimatedSection key={testimonial.id} delay={index * 0.1}>
                <Card className="border-border/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <CardContent className="pt-6">
                    <div className="mb-3 flex gap-0.5">
                      {Array.from({ length: testimonial.rating }).map(
                        (_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-accent text-accent"
                          />
                        ),
                      )}
                    </div>
                    <p className="text-sm italic text-muted-foreground">
                      &quot;{testimonial.text}&quot;
                    </p>
                    <p className="mt-4 font-serif text-sm font-semibold">
                      {testimonial.name}
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <AnimatedSection>
        <section className="bg-primary/10 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground">
              Ready to Go Natural?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Join thousands who switched to herbal. Your body will thank you.
            </p>
            <Link to="/products">
              <Button size="lg" className="mt-6 gap-2">
                Explore Products <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
}
