import { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/components/context/AuthContext";

export default function TopUpModal({ isOpen, onClose, session }) {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addCredits } = useAuth();

  const handleSetAmount = (value: number) => {
    setAmount(String(value));
  };

  const handleSubmit = async () => {
    if (!amount || Number(amount) <= 0) {
      toast({
        title: "Error",
        description: "Silakan masukkan nominal yang valid",
        variant: "destructive"
      });
      return;
    }

    if (!session?.access_token) {
      toast({
        title: "Error",
        description: "Session tidak valid, silakan login kembali",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(
        "https://n8n-azfzwmyoqkaw.jkt1.sumopod.my.id/webhook/topup-balance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            amount: Number(amount),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "API Error");
      }

      if (data.invoice_url) {
        toast({
          title: "Success",
          description: "Redirecting to payment page...",
        });
        
        // Reset dan tutup modal sebelum redirect
        setAmount("");
        onClose();
        
        // Redirect ke payment
        window.location.href = data.invoice_url;
      } else {
        throw new Error("No invoice URL returned");
      }
    } catch (err: any) {
      console.error("Topup error:", err);
      toast({
        title: "Error",
        description: err?.message || "Gagal melakukan top up",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md shadow-xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">Top Up Balance</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Amount Input */}
          <div>
            <Label htmlFor="amount" className="text-sm font-medium">
              Amount Sumopod Credit
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isLoading}
              className="mt-2"
            />
          </div>

          {/* Quick Buttons */}
          <div className="flex gap-2">
            {[
              { label: "50.000", value: 50000 },
              { label: "100.000", value: 100000 },
              { label: "200.000", value: 200000 }
            ].map((option) => (
              <Button
                key={option.value}
                variant={amount === String(option.value) ? "default" : "outline"}
                onClick={() => handleSetAmount(option.value)}
                disabled={isLoading}
                type="button"
                className="flex-1"
              >
                {option.label}
              </Button>
            ))}
          </div>

          {/* Currency */}
          <div>
            <Label className="text-sm font-medium">Currency</Label>
            <Select defaultValue="idr">
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="idr">ID IDR - Indonesian Rupiah</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment Method */}
          <div>
            <Label className="text-sm font-medium">Payment Method</Label>
            <Select defaultValue="qris">
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="qris">QRIS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Warning */}
          <div className="flex gap-3 rounded-lg bg-orange-50 p-3">
            <div className="flex-shrink-0 pt-0.5">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
            </div>
            <div className="text-sm">
              <p className="text-orange-900">
                Sumopod Credit is <span className="font-semibold">not real money</span> and{" "}
                <span className="font-semibold">cannot be refunded or withdrawn</span> once added to your account.
              </p>
            </div>
          </div>

          {/* Terms */}
          <p className="text-xs text-gray-600">
            By topping up, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:underline font-medium">
              Terms of Service
            </a>
            {" "}and{" "}
            <a href="#" className="text-blue-600 hover:underline font-medium">
              Refund Policy
            </a>
            .
          </p>
        </div>

        {/* Footer */}
        <div className="border-t p-6">
          <Button
            onClick={handleSubmit}
            disabled={!amount || Number(amount) <= 0 || isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Top Up"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}