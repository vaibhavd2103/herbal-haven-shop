import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { fetchMyOrders, type Order } from "@/lib/api";

const statusConfig: Record<
  string,
  {
    label: string;
    icon: React.ReactNode;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  PENDING_PAYMENT: {
    label: "Pending Payment",
    icon: <Clock className="h-4 w-4" />,
    variant: "outline",
  },
  PLACED: {
    label: "Placed",
    icon: <CheckCircle2 className="h-4 w-4" />,
    variant: "secondary",
  },
  SHIPPED: {
    label: "Shipped",
    icon: <Truck className="h-4 w-4" />,
    variant: "default",
  },
  DELIVERED: {
    label: "Delivered",
    icon: <Package className="h-4 w-4" />,
    variant: "default",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: <XCircle className="h-4 w-4" />,
    variant: "destructive",
  },
};

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto flex flex-col items-center px-4 py-20 text-center">
        <Package className="mb-4 h-16 w-16 text-muted-foreground/40 animate-pulse" />
        <h1 className="font-serif text-2xl font-bold">
          Loading your orders...
        </h1>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto flex flex-col items-center px-4 py-20 text-center">
        <Package className="mb-4 h-16 w-16 text-muted-foreground/40" />
        <h1 className="font-serif text-2xl font-bold">No Orders Yet</h1>
        <p className="mt-2 text-muted-foreground">
          Start shopping to see your orders here.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const getAddress = (order: Order) => {
    return JSON.parse(order.address);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 flex items-center gap-3">
        <Link
          to="/products"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="font-serif text-3xl font-bold">My Orders</h1>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const config =
            statusConfig[order.status] ?? statusConfig.pending_payment;
          const address = getAddress(order);
          return (
            <Card key={order.id} className="overflow-hidden border-border/60">
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Order{" "}
                      <span className="font-mono font-bold">
                        #{order.id.slice(0, 8)}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <Badge
                    variant={config.variant}
                    className="flex w-fit items-center gap-1.5 px-3 py-1"
                  >
                    {config.icon}
                    {config.label}
                  </Badge>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-foreground/80">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        ₹{(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="flex items-center justify-between">
                  <span className="font-medium">Total</span>
                  <span className="text-lg font-bold text-primary">
                    ₹{order.totalPrice.toFixed(2)}
                  </span>
                </div>

                {order.address && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    📍 {address.addressLine1}, {address.addressLine2},{" "}
                    {address.city}, {address.state}, {address.pincode}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
