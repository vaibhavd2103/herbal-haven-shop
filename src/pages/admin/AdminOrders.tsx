import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Check, X, Loader2 } from "lucide-react";
import {
  fetchOrders,
  approvePayment,
  rejectPayment,
  approveOrder,
  type Order,
  changeOrderStatus,
} from "@/lib/adminApi";
import { useToast } from "@/hooks/use-toast";

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedOrderType, setSelectedOrderType] = useState(null);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      const updated = await approvePayment(id);
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
      toast({
        title: "Payment verified",
        description: `Order ${id} marked as Placed.`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to approve",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      const updated = await rejectPayment(id);
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
      toast({
        title: "Payment rejected",
        description: `Order ${id} payment rejected and order cancelled.`,
        variant: "destructive",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to reject",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatusChange = async (id: string, status: Order["status"]) => {
    setActionLoading(id);
    try {
      if (status === "APPROVED") {
        const updated = await approveOrder(id);
        setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
        toast({
          title: "Status updated",
          description: `Order ${id} → ${status}`,
        });
      } else {
        const updated = await changeOrderStatus(id, status);
        setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
        toast({
          title: "Status updated",
          description: `Order ${id} → ${status}`,
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const paymentBadge = (status: Order["paymentStatus"]) => {
    const config: Record<
      string,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        label: string;
      }
    > = {
      UNPAID: { variant: "secondary", label: "Unpaid" },
      PAID: { variant: "default", label: "Paid" },
      REFUNDED: { variant: "outline", label: "Refunded" },
    };
    const c = config[status] ?? { variant: "outline" as const, label: status };
    return <Badge variant={c.variant}>{c.label}</Badge>;
  };

  const statusBadge = (status: Order["status"]) => {
    const config: Record<
      string,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        label: string;
      }
    > = {
      PENDING_PAYMENT: { variant: "secondary", label: "Pending Payment" },
      PLACED: { variant: "outline", label: "Placed" },
      APPROVED: { variant: "secondary", label: "Approved" },
      SHIPPED: { variant: "default", label: "Shipped" },
      DELIVERED: { variant: "default", label: "Delivered" },
      CANCELLED: { variant: "destructive", label: "Cancelled" },
    };
    const c = config[status] ?? { variant: "outline" as const, label: status };
    return <Badge variant={c.variant}>{c.label}</Badge>;
  };

  if (loading)
    return (
      <p className="py-8 text-center text-muted-foreground">Loading orders…</p>
    );

  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={load} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <p className="py-8 text-center text-muted-foreground">No orders found.</p>
    );
  }

  const getAddress = (order: Order) => {
    return JSON.parse(order.address);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center w-full justify-between">
        <h2 className="font-serif text-lg font-semibold text-foreground">
          Orders & Payments
        </h2>
        <div className="flex items-center gap-2">
          <p className="text-sm text-black/50">Select order type: </p>
          <Select
            value={selectedOrderType}
            onValueChange={(val) => setSelectedOrderType(val)}
          >
            <SelectTrigger className="h-9 w-40 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>All</SelectItem>
              <SelectItem value="PLACED">Placed</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="SHIPPED">Shipped</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {orders.map((order) => {
        const address = getAddress(order);
        if (selectedOrderType !== null && order.status !== selectedOrderType) {
          return null;
        }
        return (
          <Card key={order.id} className="border-border/50">
            <CardHeader className="flex flex-col gap-2 pb-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-base font-mono">
                  {order.id}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {order.user.name} •{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[12px]">Payment Status:</span>{" "}
                {paymentBadge(order.paymentStatus)}
                <span className="text-[12px]">Order Status:</span>{" "}
                {statusBadge(order.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg bg-secondary/30 p-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-foreground">
                      {item.nameSnapshot} × {item.quantity}
                    </span>
                    <span className="text-muted-foreground">
                      ₹{item.unitPrice * item.quantity}
                    </span>
                  </div>
                ))}
                <div className="mt-2 flex justify-between border-t border-border/50 pt-2 text-sm font-semibold">
                  <span>Total</span>
                  <span>₹{order.totalPrice}</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                📍 {address.addressLine1}, {address.addressLine2},{" "}
                {address.city}, {address.state}, {address.pincode}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                {order.paymentStatus === "UNPAID" &&
                  order.status === "PENDING_PAYMENT" && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleApprove(order.id)}
                      className="gap-1"
                      disabled={actionLoading === order.id}
                    >
                      {actionLoading === order.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Check className="h-3 w-3" />
                      )}
                      Verify & Place
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(order.id)}
                      className="gap-1"
                      disabled={actionLoading === order.id}
                    >
                      <X className="h-3 w-3" /> Reject
                    </Button>
                  </>
                )}

                {order.paymentStatus === "PAID" && (
                  <Select
                    value={order.status}
                    onValueChange={(val) =>
                      handleStatusChange(order.id, val as Order["status"])
                    }
                  >
                    <SelectTrigger className="h-9 w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PLACED">Placed</SelectItem>
                      <SelectItem value="APPROVED">Approved</SelectItem>
                      <SelectItem value="SHIPPED">Shipped</SelectItem>
                      <SelectItem value="DELIVERED">Delivered</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
