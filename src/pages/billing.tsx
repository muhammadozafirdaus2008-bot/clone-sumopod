import { useState } from "react";
import { useAuth } from "@/components/context/AuthContext";
import TopUpModal from "@/components/TopUpModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, QrCode, Receipt, CreditCard, AlertTriangle } from "lucide-react";


interface Transaction {
  id: string;
  type: "topup" | "purchase";
  amount: number;
  description: string;
  date: string;
}

const Billing = () => {
  const { credits, addCredits } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [topupAmount, setTopupAmount] = useState("");
  const [processing, setProcessing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const handleTopup = async () => {
    const amount = parseInt(topupAmount);
    if (!amount || amount <= 0) {
      toast({ title: "Invalid amount", variant: "destructive" });
      return;
    }
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1500));
    addCredits(amount);
    setTransactions((prev) => [
      { id: crypto.randomUUID(), type: "topup", amount, description: `Top up ${amount} credits`, date: new Date().toLocaleString() },
      ...prev,
    ]);
    setProcessing(false);
    setDialogOpen(false);
    setTopupAmount("");
    toast({ title: "Top up successful!", description: `${amount} credits added to your account.` });
  };

  return (
  <>
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Billing</h1>
          <p className="text-sm text-muted-foreground">
            Manage your balance and view transaction history
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <QrCode className="mr-1.5 h-4 w-4" />
            Redeem
          </Button>

          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            Topup
          </Button>
        </div>
      </div>

      {/* Current Credits */}
      <Card className="mb-6">
        <CardContent className="flex items-center gap-4 py-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
            <CreditCard className="h-6 w-6 text-accent-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Credits</p>
            <p className="text-3xl font-bold text-foreground">{credits}</p>
          </div>
        </CardContent>
      </Card>

      {/* Warning */}
      <div className="mb-6 flex items-center gap-3 rounded-lg border border-warning-border bg-warning-bg px-4 py-3">
        <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
        <p className="text-sm text-warning-foreground">
          Sumopod Credit is <strong>not real money</strong> and cannot be refunded.
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No transactions found
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No payments found
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>

    {/* ✅ MODAL DI LUAR DIV */}
    <TopUpModal
      isOpen={open}
      onClose={() => setOpen(false)}
      session={null}
    />
  </>
  );
};

export default Billing;