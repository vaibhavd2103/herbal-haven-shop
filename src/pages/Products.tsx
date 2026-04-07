import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import AnimatedSection from "@/components/AnimatedSection";
import { fetchProducts } from "@/lib/api";
import type { Product } from "@/lib/data";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <AnimatedSection>
        <h1 className="font-serif text-3xl font-bold">Our Products</h1>
        <p className="mt-1 text-muted-foreground">Handcrafted herbal care for every need</p>
      </AnimatedSection>

      {loading ? (
        <div className="mt-12 text-center text-muted-foreground">Loading products…</div>
      ) : products.length === 0 ? (
        <div className="mt-12 text-center text-muted-foreground">No products found.</div>
      ) : (
        <div className="mt-8 grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p, i) => (
            <AnimatedSection key={p.id} delay={i * 0.05}>
              <ProductCard product={p} />
            </AnimatedSection>
          ))}
        </div>
      )}
    </div>
  );
}
