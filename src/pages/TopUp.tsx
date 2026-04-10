import { useState } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Coins, CreditCard, CheckCircle } from "lucide-react";

const packages = [
  { amount: 50, price: "$5.00", bonus: "" },
  { amount: 100, price: "$9.00", bonus: "Save 10%" },
  { amount: 250, price: "$20.00", bonus: "Save 20%" },
  { amount: 500, price: "$35.00", bonus: "Best value" },
];

const TopUp = () => {
  const { credits, user } = useAuth();
  const { toast } = useToast();
  const [processing, setProcessing] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const handleTopUp = async (amount: number, idx: number) => {
    if (!user) {
      toast({
        title: "Error",
        description: "User not logged in",
      });
      return;
    }

    setProcessing(idx);

    try {
     const res = await fetch("https://n8n-azfzwmyoqkaw.jkt1.sumopod.my.id/webhook-test/topup-balance", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    user_id: user.id,
    amount: amount
  })
});

const data = await res.json();

// 🔥 INI YANG BIKIN PINDAH KE QRIS
window.location.href = data.invoice_url;

      toast({
        title: "Top up request sent!",
        description: "Waiting for payment confirmation...",
      });

    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to top up",
      });
    }

    setProcessing(null);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Top Up Credits</h1>
        <p className="mt-1 text-muted-foreground">Add credits to your account to purchase services.</p>
      </div>

      <Card className="mb-6">
        <CardContent className="flex items-center gap-4 pt-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
            <Coins className="h-6 w-6 text-accent-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current balance</p>
            <p className="text-3xl font-bold text-foreground">
              {credits} <span className="text-base font-normal text-muted-foreground">credits</span>
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {packages.map((pkg, idx) => (
          <Card
            key={idx}
            className={`cursor-pointer transition-all hover:shadow-md ${selected === idx ? "ring-2 ring-primary" : ""}`}
            onClick={() => setSelected(idx)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{pkg.amount} Credits</CardTitle>
                {pkg.bonus && (
                  <span className="rounded-full bg-success px-2 py-0.5 text-xs font-medium text-success-foreground">
                    {pkg.bonus}
                  </span>
                )}
              </div>
              <CardDescription className="flex items-center gap-1">
                <CreditCard className="h-3.5 w-3.5" /> {pkg.price}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                disabled={processing !== null}
                onClick={(e) => { e.stopPropagation(); handleTopUp(pkg.amount, idx); }}
              >
                {processing === idx ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" /> Purchase
                  </span>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TopUp;