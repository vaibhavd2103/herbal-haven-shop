import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle2, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { generateUPIString, submitPaymentConfirmation, type ShippingAddress } from "@/lib/api";
import { useIsMobileDevice } from "@/hooks/use-mobile-detect";
import { toast } from "sonner";

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [step, setStep] = useState<"address" | "payment">("address");
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const navigate = useNavigate();
  const isMobile = useIsMobileDevice();

  const shipping = totalPrice > 500 ? 0 : 49;
  const grandTotal = totalPrice + shipping;
  const orderId = `ORD-${Date.now()}`;
  const upiString = generateUPIString(grandTotal, orderId);

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName || !address.phone || !address.addressLine1 || !address.city || !address.state || !address.pincode) {
      toast.error("Please fill all required address fields");
      return;
    }
    if (!/^\d{10}$/.test(address.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    if (!/^\d{6}$/.test(address.pincode)) {
      toast.error("Please enter a valid 6-digit pincode");
      return;
    }
    setStep("payment");
  };

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      await submitPaymentConfirmation(orderId, address);
      setConfirmed(true);
      clearCart();
      toast.success("Payment confirmed! Thank you for your order.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setConfirming(false);
    }
  };

  const handleUPIOpen = () => {
    window.location.href = upiString;
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

      {/* Steps indicator */}
      <div className="mt-4 flex items-center gap-2 text-sm">
        <span className={`rounded-full px-3 py-1 font-medium ${step === "address" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
          1. Address
        </span>
        <span className="text-muted-foreground">→</span>
        <span className={`rounded-full px-3 py-1 font-medium ${step === "payment" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
          2. Payment
        </span>
      </div>

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

        {/* Address or Payment */}
        {step === "address" ? (
          <Card>
            <CardContent className="p-6">
              <h2 className="font-serif text-lg font-bold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" /> Shipping Address
              </h2>
              <form onSubmit={handleAddressSubmit} className="mt-4 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input id="fullName" value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} placeholder="Your full name" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} placeholder="10-digit mobile" maxLength={10} />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="addr1">Address Line 1 *</Label>
                  <Input id="addr1" value={address.addressLine1} onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })} placeholder="House/Flat no., Street" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="addr2">Address Line 2</Label>
                  <Input id="addr2" value={address.addressLine2} onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })} placeholder="Landmark (optional)" />
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="space-y-1">
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} placeholder="City" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="state">State *</Label>
                    <Input id="state" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} placeholder="State" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input id="pincode" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} placeholder="6 digits" maxLength={6} />
                  </div>
                </div>
                <Button type="submit" className="w-full mt-2">
                  Continue to Payment
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center p-6 text-center">
              <h2 className="font-serif text-lg font-bold">
                {isMobile ? "Pay via UPI" : "Scan & Pay"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {isMobile ? "Tap the button below to open your UPI app" : "Scan the QR code with any UPI app to pay"}
              </p>

              {/* Shipping info summary */}
              <div className="mt-3 w-full rounded-lg bg-secondary/50 p-3 text-left text-xs text-muted-foreground">
                <p className="font-medium text-foreground">{address.fullName} • {address.phone}</p>
                <p>{address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ""}</p>
                <p>{address.city}, {address.state} - {address.pincode}</p>
                <button
                  onClick={() => setStep("address")}
                  className="mt-1 text-primary text-xs hover:underline"
                >
                  Change address
                </button>
              </div>

              {isMobile ? (
                <Button
                  className="mt-6 w-full gap-2 text-base"
                  size="lg"
                  onClick={handleUPIOpen}
                >
                  Pay ₹{grandTotal} Now
                </Button>
              ) : (
                <div className="mt-6 rounded-lg border-2 border-dashed border-primary/30 p-4">
                  <QRCodeSVG value={upiString} size={200} level="H" />
                </div>
              )}

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
        )}
      </div>
    </div>
  );
}
