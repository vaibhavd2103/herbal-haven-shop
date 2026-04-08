import { Link, Outlet, useLocation } from "react-router-dom";
import { Package, ShoppingBag, LayoutDashboard, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/products", label: "Products", icon: Package },
];

export default function AdminDashboard() {
  const location = useLocation();

  const isActive = (path: string, end?: boolean) =>
    end ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="border-b border-border/50 bg-secondary/30">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <h1 className="font-serif text-xl font-bold text-foreground">Admin Dashboard</h1>
          <Link
            to="/"
            className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Store
          </Link>
        </div>
      </div>

      <div className="container mx-auto flex flex-col gap-6 px-4 py-6 lg:flex-row">
        {/* Sidebar Nav */}
        <aside className="flex flex-row gap-2 lg:w-52 lg:flex-col lg:gap-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive(item.to, item.end)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
