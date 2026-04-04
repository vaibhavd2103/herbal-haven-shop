import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { generateUPIString, submitPaymentConfirmation } from "@/lib/api";
import { toast } from "sonner";

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const navigate = useNavigate();

  const shipping = totalPrice > 500 ? 0 : 49;
  const grandTotal = totalPrice + shipping;
  const orderId = `ORD-${Date.now()}`;
  const upiString = generateUPIString(grandTotal, orderId);

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      await submitPaymentConfirmation(orderId);
      setConfirmed(true);
      clearCart();
      toast.success("Payment confirmed! Thank you for your order.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setConfirming(false);
    }
  };

  if (confirmed) {
    return (
      <div className="container mx-auto flex flex-col items-center px-4 py-20 text-center">
        <CheckCircle2 className="mb-4 h-20 w-20 text-primary" />
        <h1 className="font-serif text-3xl font-bold">Order Confirmed!</h1>
        <p className="mt-2 text-muted-foreground">Order ID: {orderId}</p>
        <p className="mt-1 text-sm text-muted-foreground">We'll notify you once your herbal goodies are on the way.</p>
        <Button className="mt-8" onClick={() => navigate("/products")}>Continue Shopping</Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex flex-col items-center px-4 py-20 text-center">
        <h1 className="font-serif text-2xl font-bold">No items to checkout</h1>
        <Button className="mt-4" onClick={() => navigate("/products")}>Browse Products</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl font-bold">Checkout</h1>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {/* Order Summary */}
        <Card>
          <CardContent className="p-6">
            <h2 className="font-serif text-lg font-bold">Order Summary</h2>
            <Separator className="my-4" />
            <div className="space-y-3">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{product.name} × {quantity}</span>
                  <span>₹{product.price * quantity}</span>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{totalPrice}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : `₹${shipping}`}</span></div>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between font-serif text-xl font-bold">
              <span>Total</span><span className="text-primary">₹{grandTotal}</span>
            </div>
          </CardContent>
        </Card>

        {/* Payment QR */}
        <Card>
          <CardContent className="flex flex-col items-center p-6 text-center">
            <h2 className="font-serif text-lg font-bold">Scan & Pay</h2>
            <p className="mt-1 text-sm text-muted-foreground">Scan the QR code with any UPI app to pay</p>
            <div className="mt-6 rounded-lg border-2 border-dashed border-primary/30 p-4">
              <QRCodeSVG value={upiString} size={200} level="H" />
            </div>
            <p className="mt-4 font-serif text-2xl font-bold text-primary">₹{grandTotal}</p>
            <p className="mt-1 text-xs text-muted-foreground">Order ID: {orderId}</p>
            <Button
              className="mt-6 w-full gap-2"
              onClick={handleConfirm}
              disabled={confirming}
            >
              {confirming ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              I've Completed Payment
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
