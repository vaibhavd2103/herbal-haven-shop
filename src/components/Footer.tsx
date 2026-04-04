import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Leaf className="h-6 w-6" />
              <span className="font-serif text-lg font-bold">RREVA CARE</span>
            </div>
            <p className="text-sm text-primary-foreground/70">
              Pure. Natural. Handcrafted. Homemade herbal products for a
              healthier you.
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-serif font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>
                <Link to="/" className="hover:text-primary-foreground">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-primary-foreground">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-primary-foreground">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-serif font-semibold">Categories</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>Hair Care</li>
              <li>Skin Care</li>
              <li>Face Care</li>
              <li>Hygiene</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-serif font-semibold">Contact</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>rrevacare@gmail.com</li>
              <li>+91 8766749107</li>
              <li>Pune, India</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-primary-foreground/20 pt-6 text-center text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} RREVA CARE. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
