import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { fetchOrders, approvePayment, rejectPayment, updateOrderStatus, type Order } from "@/lib/adminApi";
import { useToast } from "@/hooks/use-toast";

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const data = await fetchOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id: string) => {
    const updated = await approvePayment(id);
    setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    toast({ title: "Payment approved", description: `Order ${id} payment approved.` });
  };

  const handleReject = async (id: string) => {
    const updated = await rejectPayment(id);
    setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    toast({ title: "Payment rejected", description: `Order ${id} payment rejected.`, variant: "destructive" });
  };

  const handleStatusChange = async (id: string, status: Order["status"]) => {
    const updated = await updateOrderStatus(id, status);
    setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    toast({ title: "Status updated", description: `Order ${id} → ${status}` });
  };

  const paymentBadge = (status: Order["paymentStatus"]) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      approved: "default",
      pending: "secondary",
      rejected: "destructive",
    };
    return <Badge variant={variants[status] ?? "outline"}>{status}</Badge>;
  };

  if (loading) return <p className="py-8 text-center text-muted-foreground">Loading orders…</p>;

  return (
    <div className="space-y-4">
      <h2 className="font-serif text-lg font-semibold text-foreground">Orders & Payments</h2>

      {orders.map((order) => (
        <Card key={order.id} className="border-border/50">
          <CardHeader className="flex flex-col gap-2 pb-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">{order.id}</CardTitle>
              <p className="text-xs text-muted-foreground">
                {order.customerName} • {new Date(order.createdAt).toLocaleDateString("en-IN")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {paymentBadge(order.paymentStatus)}
              <Badge variant="outline">{order.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg bg-secondary/30 p-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-foreground">{item.productName} × {item.quantity}</span>
                  <span className="text-muted-foreground">₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="mt-2 flex justify-between border-t border-border/50 pt-2 text-sm font-semibold">
                <span>Total</span>
                <span>₹{order.total}</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">📍 {order.shippingAddress}</p>

            <div className="flex flex-wrap items-center gap-2">
              {order.paymentStatus === "pending" && (
                <>
                  <Button size="sm" onClick={() => handleApprove(order.id)} className="gap-1">
                    <Check className="h-3 w-3" /> Approve Payment
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleReject(order.id)} className="gap-1">
                    <X className="h-3 w-3" /> Reject
                  </Button>
                </>
              )}

              <Select
                value={order.status}
                onValueChange={(val) => handleStatusChange(order.id, val as Order["status"])}
              >
                <SelectTrigger className="h-9 w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
