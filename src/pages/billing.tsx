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
  credits: number;
  currency: string;
  status: string;
  invoice_url?: string;
  created_at?: string;
}

const QUICK_AMOUNTS = [50_000, 100_000, 200_000];

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "-";
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
};

const formatNumber = (n: number) => n.toLocaleString("id-ID");

const Billing = () => {
  const { credits, session } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [topupAmount, setTopupAmount] = useState("0");
  const [processing, setProcessing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("QRIS");

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

  // ✅ PERBAIKAN: Fungsi handleTopup yang benar (hanya 1 try-catch)
  const handleTopup = async () => {
    const amount = parseInt(topupAmount);

    if (!amount || amount <= 0) {
      toast({ title: "Masukkan jumlah yang valid", variant: "destructive" });
      return;
    }

    if (!session?.user?.id) {
      toast({ title: "Login dulu", variant: "destructive" });
      return;
    }

    setProcessing(true);

    try {
      const res = await fetch(
        "https://n8n-azfzwmyoqkaw.jkt1.sumopod.my.id/webhook/topup-balance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: session.user.id,
            amount: amount,
            currency: "IDR",
            payment_method: paymentMethod,
          }),
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      console.log("RESPONSE N8N:", data);

      if (!data?.invoice_url) {
        throw new Error("Invoice URL tidak ditemukan");
      }

      // ✅ Redirect ke Xendit payment
      window.location.href = data.invoice_url;

    } catch (err: any) {
      console.error("Top up error:", err);
      toast({
        title: "Top up gagal",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  }; // ✅ Tutup fungsi di sini

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      success: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      completed: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      pending: "bg-yellow-100 text-yellow-700 border border-yellow-200",
      failed: "bg-red-100 text-red-700 border border-red-200",
    };
    return map[status?.toLowerCase()] ?? "bg-gray-100 text-gray-700 border border-gray-200";
  };

  const getStatusLabel = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "pending") return (
      <span className="inline-flex items-center gap-1">
        <span className="text-yellow-500">⏱</span> Pending
      </span>
    );
    if (s === "completed" || s === "success") return (
      <span className="inline-flex items-center gap-1">
        <span className="text-emerald-500">✓</span> Completed
      </span>
    );
    return status;
  };

  return (
    <div>
      {/* Header */}
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
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="IDR">🇮🇩 IDR Indonesian Rupiah</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select defaultValue="QRIS" onValueChange={setPaymentMethod}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="QRIS">QRIS</SelectItem>
                  <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <p className="text-sm text-amber-800">
                Sumopod Credit is <strong>not real money</strong> and{" "}
                <strong>cannot be refunded or withdrawn</strong> once added to your account.
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

      {/* Current Credits + Warning dalam 1 Card */}
      <Card className="mb-6">
        <CardContent className="p-0">
          <div className="flex items-center gap-4 px-5 py-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
              <CreditCard className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Credits</p>
              <p className="text-3xl font-bold text-foreground">{formatNumber(credits)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 border-t border-amber-200 bg-amber-50 px-4 py-3 rounded-b-lg">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
            <p className="text-sm text-amber-800">
              Sumopod Credit is <strong>not real money</strong> and{" "}
              <strong>cannot be refunded or withdrawn</strong> once added to your account.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Card */}
      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="transactions">
            <div className="px-4 pt-2 pb-0 border-b border-gray-200">
              <TabsList className="bg-gray-100 p-1 h-auto gap-1 rounded-lg">
                <TabsTrigger
                  value="transactions"
                  className="gap-1.5 px-4 py-2 rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground"
                >
                  <CreditCard className="h-4 w-4" />
                  Transactions
                </TabsTrigger>
                <TabsTrigger
                  value="payments"
                  className="gap-1.5 px-4 py-2 rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground"
                >
                  <Receipt className="h-4 w-4" />
                  Payments
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Transactions Tab */}
            <TabsContent value="transactions" className="mt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-64">DATE</TableHead>
                    <TableHead className="w-64">DESCRIPTION</TableHead>
                    <TableHead className="w-27">TYPE</TableHead>
                    <TableHead className="w-50">AMOUNT</TableHead>
                    <TableHead className="w-20">ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="text-muted-foreground">{formatDate(t.created_at)}</TableCell>
                        <TableCell>{t.description || "-"}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center gap-1 text-sm font-medium ${t.type === "Purchase" ? "text-green-600" : "text-red-500"}`}>
                            {t.type === "Purchase" ? "↑" : "↓"} {t.type || "-"}
                          </span>
                        </TableCell>
                        <TableCell className={`font-semibold ${t.type === "Purchase" ? "text-green-600" : "text-red-500"}`}>
                          {t.type === "Purchase" ? "+" : "-"}{formatNumber(t.amount)} credits
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" className="gap-1.5 h-8">
                            <Receipt className="h-3.5 w-3.5" />
                            Receipt
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments" className="mt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32">DATE</TableHead>
                    <TableHead className="w-28">CURRENCY</TableHead>
                    <TableHead className="w-32">AMOUNT</TableHead>
                    <TableHead className="w-36">CREDITS</TableHead>
                    <TableHead className="w-32">STATUS</TableHead>
                    <TableHead className="w-28 text-right">ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                        No payments found
                      </TableCell>
                    </TableRow>
                  ) : (
                    payments.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="text-muted-foreground">{formatDate(p.created_at)}</TableCell>
                        <TableCell>{p.currency || "IDR"}</TableCell>
                        <TableCell className="font-bold">{formatNumber(p.amount)}</TableCell>
                        <TableCell>{formatNumber(p.credits || p.amount)} credits</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(p.status)}`}>
                            {getStatusLabel(p.status)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {p.status?.toLowerCase() === "pending" ? (
                            <Button
                              size="sm"
                              className="h-8 bg-blue-600 hover:bg-blue-700 text-white"
                              onClick={() => p.invoice_url && (window.location.href = p.invoice_url)}
                            >
                              Pay
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" className="gap-1.5 h-8">
                              <Receipt className="h-3.5 w-3.5" />
                              Invoice
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Billing;