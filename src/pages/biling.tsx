import { useState } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, QrCode, Receipt, CreditCard, AlertTriangle } from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Billing</h1>
          <p className="text-sm text-muted-foreground">Manage your balance and view transaction history</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <QrCode className="mr-1.5 h-4 w-4" />
            Redeem
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-1.5 h-4 w-4" />
                Topup
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Top Up Credits</DialogTitle>
                <DialogDescription>Add credits to your SumoPod account.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (credits)</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="1"
                    placeholder="Enter amount"
                    value={topupAmount}
                    onChange={(e) => setTopupAmount(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleTopup} disabled={processing}>
                  {processing ? "Processing..." : "Confirm Top Up"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
          Sumopod Credit is <strong>not real money</strong> and <strong>cannot be refunded or withdrawn</strong> once added to your account.
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions" className="gap-1.5">
            <Receipt className="h-4 w-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-1.5">
            <CreditCard className="h-4 w-4" />
            Payments
          </TabsTrigger>
        </TabsList>
        <TabsContent value="transactions">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>DESCRIPTION</TableHead>
                    <TableHead>TYPE</TableHead>
                    <TableHead>AMOUNT</TableHead>
                    <TableHead>DATE</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell>{t.description}</TableCell>
                        <TableCell>
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            t.type === "topup" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                          }`}>
                            {t.type}
                          </span>
                        </TableCell>
                        <TableCell className={t.type === "topup" ? "text-success" : "text-destructive"}>
                          {t.type === "topup" ? "+" : "-"}{t.amount}
                        </TableCell>
                        <TableCell>{t.date}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
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
  );
};

export default Billing;
