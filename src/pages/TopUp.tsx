import { useState } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Coins, CheckCircle } from "lucide-react";

const packages = [
  { amount: 50, price: "$5.00", bonus: "" },
  { amount: 100, price: "$9.00", bonus: "Save 10%" },
  { amount: 250, price: "$20.00", bonus: "Save 20%" },
  { amount: 500, price: "$35.00", bonus: "Best value" },
];

const TopUp = () => {
  const { credits, addCredits } = useAuth();
  const { toast } = useToast();
  const [processing, setProcessing] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const handleTopUp = async (amount: number, idx: number) => {
    setProcessing(idx);
    await new Promise((resolve) => setTimeout(resolve, 800));
    addCredits(amount);
    setProcessing(null);
    toast({ title: "Top-up successful", description: `${amount} credits added to your balance.` });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Top Up Credits</h1>
        <p className="mt-1 text-muted-foreground">Add credits to your account and unlock more services.</p>
      </div>

      <Card className="mb-6">
        <CardContent className="flex items-center gap-4 py-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent">
            <Coins className="h-6 w-6 text-accent-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current balance</p>
            <p className="text-4xl font-bold text-foreground">{credits} <span className="text-base font-normal text-muted-foreground">credits</span></p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {packages.map((pkg, idx) => (
          <Card key={pkg.amount} className={`border border-border transition hover:shadow-lg ${selected === idx ? "ring-2 ring-primary" : ""}`} onClick={() => setSelected(idx)}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-lg">{pkg.amount} Credits</CardTitle>
                {pkg.bonus ? (
                  <span className="rounded-full bg-success px-2 py-1 text-xs font-medium text-success-foreground">{pkg.bonus}</span>
                ) : null}
              </div>
              <CardDescription className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4" /> {pkg.price}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" disabled={processing !== null} onClick={(e) => { e.stopPropagation(); handleTopUp(pkg.amount, idx); }}>
                {processing === idx ? "Processing..." : "Top Up Now"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TopUp;
