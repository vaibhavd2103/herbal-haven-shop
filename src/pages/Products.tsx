import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { fetchProducts } from "@/lib/api";
import { categories, type Product } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("name");

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  // const filtered = products
  //   .filter((p) => activeCategory === "All" || p.category === activeCategory)
  //   .sort((a, b) => {
  //     if (sortBy === "price-asc") return a.price - b.price;
  //     if (sortBy === "price-desc") return b.price - a.price;
  //     return a.name.localeCompare(b.name);
  //   });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl font-bold">Our Products</h1>
      <p className="mt-1 text-muted-foreground">
        Handcrafted herbal care for every need
      </p>

      {/* Filters */}
      {/* <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeCategory === "All" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory("All")}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
        <div className="ml-auto">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price-asc">Price: Low → High</SelectItem>
              <SelectItem value="price-desc">Price: High → Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div> */}

      {/* Grid */}
      {loading ? (
        <div className="mt-12 text-center text-muted-foreground">
          Loading products…
        </div>
      ) : products.length === 0 ? (
        <div className="mt-12 text-center text-muted-foreground">
          No products found.
        </div>
      ) : (
        <div className="mt-8 grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
