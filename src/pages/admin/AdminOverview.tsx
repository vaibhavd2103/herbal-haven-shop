import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingBag, IndianRupee, Clock } from "lucide-react";
import { fetchOrders, type Order } from "@/lib/adminApi";
import { fetchAdminProducts } from "@/lib/adminApi";
import type { Product } from "@/lib/data";

export default function AdminOverview() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchOrders()
      .then(setOrders)
      .catch(() => {});
    fetchAdminProducts().then(setProducts);
  }, []);

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "PAID")
    .reduce((sum, o) => sum + o.totalPrice, 0);
  const pendingPayments = orders.filter(
    (o) => o.paymentStatus === "UNPAID",
  ).length;

  const stats = [
    {
      label: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
      color: "text-primary",
    },
    {
      label: "Total Products",
      value: products.length,
      icon: Package,
      color: "text-accent",
    },
    {
      label: "Revenue",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "text-primary",
    },
    {
      label: "Pending Payments",
      value: pendingPayments,
      icon: Clock,
      color: "text-destructive",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-lg font-semibold text-foreground">
        Overview
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-lg bg-secondary/30 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {order.id}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.user.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    ₹{order.totalPrice}
                  </p>
                  <span
                    className={cn(
                      "inline-block rounded-full px-2 py-0.5 text-[10px] font-medium",
                      order.paymentStatus === "PAID" &&
                        "bg-primary/15 text-primary",
                      order.paymentStatus === "UNPAID" &&
                        "bg-accent/15 text-accent",
                      order.paymentStatus === "REFUNDED" &&
                        "bg-destructive/15 text-destructive",
                    )}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
