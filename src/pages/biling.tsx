import { useState, useEffect } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, QrCode, Receipt, CreditCard, AlertTriangle, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TopUpModal from "../components/TopUpModal";
import { supabase } from "../lib/supabase"; // sesuaikan path kamu



interface Transaction {
  id: string;
  type: "topup" | "purchase";
  amount: number;
  description: string;
  date: string;
}

const Billing = () => {
  const { credits } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { toast } = useToast();
  const [session, setSession] = useState(null);
  const [topupAmount, setTopupAmount] = useState<string>("");
  const [isLoadingTopup, setIsLoadingTopup] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    getSession();
  }, []);
  



 
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Billing</h1>
          <p className="text-sm text-muted-foreground">Manage your balance and view transaction history</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="lg">
            <QrCode className="mr-2 h-4 w-4" />
            Redeem
          </Button>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="mr-2 h-4 w-4" />
                Topup
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Top Up Balance</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Amount Input */}
                <div>
                  <Label className="text-sm font-medium">Amount Sumopod Credit</Label>
                  <Input 
                    type="number" 
                    placeholder="0"
                    value={topupAmount}
                    onChange={(e) => setTopupAmount(e.target.value)}
                    disabled={isLoadingTopup}
                    className="mt-2"
                  />
                </div>

                {/* Quick Amount Buttons */}
                <div className="flex gap-2">
                  {[
                    { label: "50.000", value: 50000 },
                    { label: "100.000", value: 100000 },
                    { label: "200.000", value: 200000 }
                  ].map((option) => (
                    <Button 
                      key={option.value}
                      variant={topupAmount === String(option.value) ? "default" : "outline"}
                      type="button"
                      onClick={() => setTopupAmount(String(option.value))}
                      disabled={isLoadingTopup}
                      className="flex-1"
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>

                {/* Currency Dropdown */}
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

                {/* Payment Method Dropdown */}
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

                {/* Warning Message */}
                <div className="flex gap-3 rounded-lg bg-orange-50 p-3">
                  <div className="flex-shrink-0 pt-0.5">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="text-sm">
                    <p className="text-orange-900">
                      Sumopod Credit is <span className="font-semibold">not real money</span> and <span className="font-semibold">cannot be refunded or withdrawn</span> once added to your account.
                    </p>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <p className="text-xs text-gray-600">
                  By topping up, you agree to our{" "}
                  <a href="#" className="text-blue-600 hover:underline font-medium">Terms of Service</a>
                  {" "}and{" "}
                  <a href="#" className="text-blue-600 hover:underline font-medium">Refund Policy</a>
                  .
                </p>
              </div>

              <DialogFooter>
                <Button
                  className="w-full"
                  size="lg"
                  disabled={!topupAmount || Number(topupAmount) <= 0 || isLoadingTopup}
                  onClick={async () => {
                    if (!topupAmount || !session?.access_token) {
                      toast({
                        title: "Error",
                        description: "Nominal harus diisi",
                        variant: "destructive"
                      });
                      return;
                    }

                    setIsLoadingTopup(true);

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
                            amount: Number(topupAmount)
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
                          description: "Redirecting to payment...",
                        });
                        setTopupAmount("");
                        setDialogOpen(false);
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
                      setIsLoadingTopup(false);
                    }
                  }}
                >
                  {isLoadingTopup ? "Processing..." : "Top Up"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Current Credits Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-50 border-blue-200">
        <CardContent className="flex items-center gap-4 py-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-blue-100">
            <CreditCard className="h-7 w-7 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Current Credits</p>
            <p className="text-4xl font-bold text-foreground">{credits}</p>
          </div>
        </CardContent>
      </Card>

      {/* Warning Alert */}
      <div className="flex gap-3 rounded-lg bg-yellow-50 border border-yellow-200 p-4">
        <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-yellow-900">
          Sumopod Credit is <span className="font-semibold">not real money</span> and <span className="font-semibold">cannot be refunded or withdrawn</span> once added to your account.
        </p>
      </div>

      {/* Tabs for Transactions and Payments */}
      <Tabs defaultValue="transactions" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transactions" className="gap-2">
            <Receipt className="h-4 w-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Payments
          </TabsTrigger>
        </TabsList>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>DATE</TableHead>
                    <TableHead>DESCRIPTION</TableHead>
                    <TableHead>TYPE</TableHead>
                    <TableHead>AMOUNT</TableHead>
                    <TableHead className="text-right">ACTIONS</TableHead>
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
                        <TableCell className="font-medium">{t.date}</TableCell>
                        <TableCell>{t.description}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center gap-1 text-sm font-medium ${
                            t.type === "topup" ? "text-green-600" : "text-red-600"
                          }`}>
                            {t.type === "topup" ? "↑" : "↓"}
                            {t.type === "topup" ? "Purchase" : "Usage"}
                          </span>
                        </TableCell>
                        <TableCell className={`font-semibold ${
                          t.type === "topup" ? "text-green-600" : "text-red-600"
                        }`}>
                          {t.type === "topup" ? "+" : "-"}{t.amount.toLocaleString("id-ID")} credits
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Download className="h-4 w-4" />
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
        <TabsContent value="payments" className="mt-4">
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
