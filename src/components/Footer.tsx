import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t bg-secondary/50">
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="font-serif text-lg font-bold text-foreground">RREVA CARE</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Pure. Natural. Handcrafted. Homemade herbal products for a healthier you.
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-serif font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-primary transition-colors">Products</Link></li>
              <li><Link to="/cart" className="hover:text-primary transition-colors">Cart</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-serif font-semibold text-foreground">Categories</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Hair Care</li>
              <li>Skin Care</li>
              <li>Face Care</li>
              <li>Hygiene</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-serif font-semibold text-foreground">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>rrevacare@gmail.com</li>
              <li>+91 8766749107</li>
              <li>Pune, India</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} RREVA CARE. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
