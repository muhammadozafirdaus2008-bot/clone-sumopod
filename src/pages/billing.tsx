import { useState, useEffect } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, QrCode, Receipt, CreditCard, AlertTriangle, Info } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: string;
  description: string;
  status: string;
  created_at?: string;
}

interface Payment {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  created_at?: string;
}

const QUICK_AMOUNTS = [50_000, 100_000, 200_000];

const Billing = () => {
  const { credits, session } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [topupAmount, setTopupAmount] = useState("0");
  const [processing, setProcessing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch transactions
  useEffect(() => {
    if (!session?.user) return;
    supabase
      .from("Transactions")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error("Transactions error:", error.message);
        if (data) setTransactions(data as Transaction[]);
      });
  }, [session?.user, credits]);

  // Fetch payments
  useEffect(() => {
    if (!session?.user) return;
    supabase
      .from("Payments")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error("Payments error:", error.message);
        if (data) setPayments(data as Payment[]);
      });
  }, [session?.user, credits]);

  const handleTopup = async () => {
    const amount = parseInt(topupAmount);
    if (!amount || amount <= 0) {
      toast({ title: "Masukkan jumlah yang valid", variant: "destructive" });
      return;
    }
    if (!session?.access_token) {
      toast({ title: "Silakan login terlebih dahulu", variant: "destructive" });
      return;
    }

    setProcessing(true);
    try {
      // Refresh session biar token fresh
      const { data: { session: freshSession } } = await supabase.auth.getSession();
      if (!freshSession?.access_token) throw new Error("Session expired, silakan login ulang");

      const res = await fetch(
        "https://n8n-azfzwmyoqkaw.jkt1.sumopod.my.id/webhook/topup-balance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${freshSession.access_token}`,
          },
          body: JSON.stringify({
            amount,
            user_id: freshSession.user.id,
          }),
        }
      );

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();

      if (data.invoice_url) {
        setDialogOpen(false);
        window.location.href = data.invoice_url;
      } else {
        throw new Error("No invoice URL returned");
      }
    } catch (err: any) {
      toast({
        title: "Top up gagal",
        description: err.message || "Terjadi kesalahan",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return map[status] ?? "bg-gray-100 text-gray-700";
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
          <Button size="sm" onClick={() => { setTopupAmount("0"); setDialogOpen(true); }}>
            <Plus className="mr-1.5 h-4 w-4" />
            Topup
          </Button>
        </div>
      </div>

      {/* Top Up Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Top Up Balance</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 pt-2">
            <div className="space-y-2">
              <Label>Amount Sumopod Credit</Label>
              <Input
                type="number"
                min="0"
                value={topupAmount}
                onChange={(e) => setTopupAmount(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              {QUICK_AMOUNTS.map((amt) => (
                <Button
                  key={amt}
                  variant="outline"
                  className="flex-1"
                  onClick={() => setTopupAmount(String(amt))}
                >
                  {amt.toLocaleString("id-ID")}
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              <Label>Currency</Label>
              <Select defaultValue="IDR">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IDR">🇮🇩 IDR Indonesian Rupiah</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select defaultValue="QRIS">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="QRIS">QRIS</SelectItem>
                  <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 dark:border-amber-700 dark:bg-amber-950/30">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <p className="text-sm text-amber-800 dark:text-amber-300">
                Sumopod Credit is <strong>not real money</strong> and <strong>cannot be refunded or withdrawn</strong> once added to your account.
              </p>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              By topping up, you agree to our{" "}
              <a href="#" className="underline text-primary">Terms of Service</a> and{" "}
              <a href="#" className="underline text-primary">Refund Policy</a>.
            </p>

            <Button className="w-full" onClick={handleTopup} disabled={processing}>
              {processing ? "Processing..." : "Top Up"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Current Credits */}
      <Card className="mb-6">
        <CardContent className="flex items-center gap-4 py-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
            <CreditCard className="h-6 w-6 text-accent-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Credits</p>
            <p className="text-3xl font-bold text-foreground">{credits.toLocaleString("id-ID")}</p>
          </div>
        </CardContent>
      </Card>

      {/* Warning */}
      <div className="mb-6 flex items-center gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 dark:border-amber-700 dark:bg-amber-950/30">
        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
        <p className="text-sm text-amber-800 dark:text-amber-300">
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

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>DATE</TableHead>
                    <TableHead>DESCRIPTION</TableHead>
                    <TableHead>TYPE</TableHead>
                    <TableHead>AMOUNT</TableHead>
                    <TableHead>STATUS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="h-32 text-center text-muted-foreground">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell>
                          {t.created_at ? new Date(t.created_at).toLocaleString("id-ID") : "-"}
                        </TableCell>
                         <TableCell>{t.description || "-"}</TableCell>
                         <TableCell>
                          <span className={`inline-flex items-center gap-1 text-sm font-medium ${t.type === "Purchase" ? "text-green-600" : "text-red-500"}`}>
                            {t.type === "Purchase" ? "↑" : "↓"} {t.type || "-"}
                           </span>
                         </TableCell>
                         <TableCell className={`font-medium ${ t.type === "Purchase" ? "text-green-600" : "text-red-500"}`}>
                          {t.type === "Purchase" ? "+" : "-"}{t.amount.toLocaleString("id-ID")} credits
                          </TableCell>
                         <TableCell>
                         <Button variant="outline" size="sm" className="gap-1.5">
                            <Receipt className="h-3.5 w-3.5" />
                              Receipt
                              </Button>
                            </TableCell>
                            </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>DATE</TableHead>
                    <TableHead>AMOUNT</TableHead>
                    <TableHead>STATUS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="h-32 text-center text-muted-foreground">
                        No payments found
                      </TableCell>
                    </TableRow>
                  ) : (
                    payments.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>
                          {p.created_at ? new Date(p.created_at).toLocaleString("id-ID") : "-"}
                        </TableCell>
                        <TableCell className="font-medium">
                          {p.amount.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadge(p.status)}`}>
                            {p.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Billing;