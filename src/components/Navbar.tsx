import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X, User, LogOut, Leaf, Shield } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCart();
  const { isAuthenticated, user, logout } = useAuth();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <Leaf className="h-7 w-7 text-primary" />
          <span className="font-serif text-xl font-bold text-foreground">
            RREVA CARE
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}

          <Link to="/cart" className="relative">
            <ShoppingCart className="h-5 w-5 text-foreground/70 transition-colors hover:text-primary" />
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 animate-scale-in items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {totalItems}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {user?.role === "admin" && (
                <Link to="/admin">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Shield className="h-4 w-4" /> Admin
                  </Button>
                </Link>
              )}
              <span className="text-sm text-muted-foreground">
                Hi, {user?.name}
              </span>
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm" className="gap-1">
                <User className="h-4 w-4" /> Login
              </Button>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {totalItems}
              </span>
            )}
          </Link>
          <button onClick={() => setMobileOpen((open) => !open)}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="animate-accordion-down overflow-hidden border-t border-border/50 bg-background px-4 md:hidden">
          <div className="pb-4 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block py-2 text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="block py-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                    onClick={() => setMobileOpen(false)}
                  >
                    ⚙ Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="block w-full py-2 text-left text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
                >
                  Logout ({user?.name})
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block py-2 text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
                onClick={() => setMobileOpen(false)}
              >
                Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
