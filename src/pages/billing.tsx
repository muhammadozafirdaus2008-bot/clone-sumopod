import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, QrCode, Receipt, CreditCard, AlertTriangle, Info, X, Download } from "lucide-react";
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

// ── Smooth inertia scroll hook ──────────────────────────────────────────────
function useSmoothScroll(containerRef: React.RefObject<HTMLDivElement>) {
  const current = useRef(0);
  const target = useRef(0);
  const rafId = useRef<number>();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Wheel → intercept dan simpan target
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      target.current = Math.max(
        0,
        Math.min(
          target.current + e.deltaY * 1.2,
          el.scrollHeight - el.clientHeight
        )
      );
    };

    // RAF loop — lerp dengan faktor 0.07 (makin kecil makin "berat")
    const loop = () => {
      current.current += (target.current - current.current) * 0.07;
      el.scrollTop = current.current;
      rafId.current = requestAnimationFrame(loop);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    rafId.current = requestAnimationFrame(loop);

    return () => {
      el.removeEventListener("wheel", onWheel);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [containerRef]);
}

// ── Animated number counter ─────────────────────────────────────────────────
function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef<number | null>(null);
  const duration = 900;

  useEffect(() => {
    startRef.current = null;
    const animate = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);

  return <>{formatNumber(display)}</>;
}

// ── Receipt Modal Component ────────────────────────────────────────────────
interface ReceiptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction;
  payment?: Payment;
}

const ReceiptModal = ({ open, onOpenChange, transaction, payment }: ReceiptModalProps) => {
  const item = transaction || payment;
  if (!item) return null;

  const isTransaction = !!transaction;
  const date = new Date(item.created_at || "");
  const dateStr = date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const timeStr = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex items-center justify-between flex-row">
          <DialogTitle>Receipt</DialogTitle>
          <button onClick={() => onOpenChange(false)} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Receipt Header */}
          <div className="border-b pb-4 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 mb-3">
              <Receipt className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="font-semibold text-lg">Receipt</h3>
            <p className="text-sm text-muted-foreground">{item.id}</p>
          </div>

          {/* Details */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">{dateStr}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time</span>
              <span className="font-medium">{timeStr}</span>
            </div>

            {isTransaction ? (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Description</span>
                  <span className="font-medium">{transaction.description || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className={`font-medium ${transaction.type === "Purchase" ? "text-green-600" : "text-red-500"}`}>
                    {transaction.type}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-muted-foreground">Amount</span>
                  <span className={`font-bold text-lg ${transaction.type === "Purchase" ? "text-green-600" : "text-red-500"}`}>
                    {transaction.type === "Purchase" ? "+" : "-"}{formatNumber(transaction.amount)} credits
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Currency</span>
                  <span className="font-medium">{payment.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className={`font-medium ${payment.status?.toLowerCase() === "success" || payment.status?.toLowerCase() === "completed" ? "text-emerald-600" : "text-yellow-600"}`}>
                    {payment.status}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-bold text-lg">{formatNumber(payment.amount)} {payment.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Credits Received</span>
                  <span className="font-bold text-lg text-green-600">+{formatNumber(payment.credits || 0)} credits</span>
                </div>
              </>
            )}

            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                item.status?.toLowerCase() === "success" || item.status?.toLowerCase() === "completed"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}>
                {item.status?.toLowerCase() === "success" || item.status?.toLowerCase() === "completed" ? "✓ Completed" : "⏱ Pending"}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t pt-4 text-center text-xs text-muted-foreground">
            <p>Thank you for using SumoPod!</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button className="flex-1 gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ── Main Component ───────────────────────────────────────────────────────────
const Billing = () => {
  
  const { credits, session, user } = useAuth();
  const [realbalance, setRealbalance] = useState(0);
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [topupAmount, setTopupAmount] = useState("0");
  const [processing, setProcessing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("QRIS");
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<{ type: "transaction" | "payment"; data: Transaction | Payment } | null>(null);
  
  // Fade-in on mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  // Smooth scroll container
  const scrollRef = useRef<HTMLDivElement>(null);
  useSmoothScroll(scrollRef);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("Transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error("Transactions error:", error.message);
        if (data) setTransactions(data as Transaction[]);
      });
  }, [user, credits]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("Payments")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error("Payments error:", error.message);
        if (data) setPayments(data as Payment[]);
      });
  }, [user, credits]);

useEffect(() => {
  if (!user) return;

  const fetchbalance = async () => {
    const { data, error } = await supabase
      .from("balances")
      .select("balance")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error ambil balance:", error);
      return;
    }

    setRealbalance(data?.balance ?? 0);
  };

  fetchbalance();
}, [user]);

  const handleTopup = async () => {
    const amount = parseInt(topupAmount);
    if (!amount || amount <= 0) {
      toast({ title: "Masukkan jumlah yang valid", variant: "destructive" });
      return;
    }
    if (!user?.id) {
      toast({ title: "Login dulu", variant: "destructive" });
      return;
    }
    setProcessing(true);
    try {
      const res = await fetch(
        "https://clone-sumopod-backend-production.up.railway.app/api/payment/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json"  },
          credentials: 'include',
         body: JSON.stringify({ amount }),

        }
      );
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (!data?.invoice_url) throw new Error("Invoice URL tidak ditemukan");
      window.location.href = data.invoice_url;
    } catch (err: any) {
      console.error("Top up error:", err);
      toast({ title: "Top up gagal", description: err.message, variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

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
    if (s === "pending") return <span className="inline-flex items-center gap-1"><span className="text-yellow-500">⏱</span> Pending</span>;
    if (s === "completed" || s === "success") return <span className="inline-flex items-center gap-1"><span className="text-emerald-500">✓</span> Completed</span>;
    return status;
  };

  const handleReceiptClick = (type: "transaction" | "payment", data: Transaction | Payment) => {
    setSelectedReceipt({ type, data });
    setReceiptOpen(true);
  };

  return (
    // Wrapper dengan smooth scroll — mengambil alih area scroll dari DashboardLayout
    <div
      ref={scrollRef}
      className="h-full overflow-y-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      {/* Seluruh konten di-fade in saat mount */}
      <div
        className="p-6 transition-all duration-700 ease-out"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(20px)",
        }}
      >
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
                <Label>Amount (IDR)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 100000"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                />
                <div className="flex gap-2 flex-wrap">
                  {QUICK_AMOUNTS.map((amt) => (
                    <Button
                      key={amt}
                      variant="outline"
                      size="sm"
                      onClick={() => setTopupAmount(String(amt))}
                    >
                      {amt.toLocaleString("id-ID")}
                    </Button>
                  ))}
                </div>
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

        {/* Receipt Modal */}
        {selectedReceipt && (
          <ReceiptModal
            open={receiptOpen}
            onOpenChange={setReceiptOpen}
            transaction={selectedReceipt.type === "transaction" ? (selectedReceipt.data as Transaction) : undefined}
            payment={selectedReceipt.type === "payment" ? (selectedReceipt.data as Payment) : undefined}
          />
        )}

        {/* Credits Card — angka counter animasi */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="flex items-center gap-4 px-5 py-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                <CreditCard className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Credits</p>
                <p className="text-3xl font-bold text-foreground">
                  <AnimatedNumber value={realbalance} />
                </p>
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

        {/* Tabs */}
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

              <TabsContent value="transactions" className="mt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-32">DATE</TableHead>
                      <TableHead className="w-64">DESCRIPTION</TableHead>
                      <TableHead className="w-32">TYPE</TableHead>
                      <TableHead className="w-40">AMOUNT</TableHead>
                      <TableHead className="w-24">ACTIONS</TableHead>
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
                          <TableCell className="truncate">{t.description || "-"}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center gap-1 text-sm font-medium ${t.type === "Purchase" ? "text-green-600" : "text-red-500"}`}>
                              {t.type === "Purchase" ? "↑" : "↓"} {t.type || "-"}
                            </span>
                          </TableCell>
                          <TableCell className={`font-semibold ${t.type === "Purchase" ? "text-green-600" : "text-red-500"}`}>
                            {t.type === "Purchase" ? "+" : "-"}{formatNumber(t.amount)} credits
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1.5 h-8"
                              onClick={() => handleReceiptClick("transaction", t)}
                            >
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

              <TabsContent value="payments" className="mt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-32">DATE</TableHead>
                      <TableHead className="w-28">CURRENCY</TableHead>
                      <TableHead className="w-32">AMOUNT</TableHead>
                      <TableHead className="w-36">CREDITS</TableHead>
                      <TableHead className="w-32">STATUS</TableHead>
                      <TableHead className="w-32 text-right">ACTIONS</TableHead>
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
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5 h-8"
                                onClick={() => handleReceiptClick("payment", p)}
                              >
                                <Receipt className="h-3.5 w-3.5" />
                                Receipt
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
    </div>
  );
};

export default Billing;