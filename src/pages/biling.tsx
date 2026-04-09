import { useState, useEffect } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, QrCode, Receipt, CreditCard, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  const { credits, } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const navigate = useNavigate();
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
          <p className="text-orange-900 font-medium">
            Sumopod Credit is <span className="font-semibold">not real money</span> and <span className="font-semibold">cannot be refunded or withdrawn</span> once added to your account.
          </p>
        </div>
      </div>

      {/* Terms and Conditions */}
      <p className="text-xs text-gray-600">
        By topping up, you agree to our{" "}
        <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
        {" "}and{" "}
        <a href="#" className="text-blue-600 hover:underline">Refund Policy</a>
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
              // Reset form sebelum redirect
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
     
  
  {/* KIRI */}
  <div>
    <h1 className="text-2xl font-bold text-foreground">Billing</h1>
    <p className="text-sm text-muted-foreground">
      Manage your balance and view transaction history
    </p>
  </div>

  {/* KANAN */}
  <div className="flex items-center gap-2">
    <Button variant="outline" size="sm">
      <QrCode className="mr-1.5 h-4 w-4" />
      Redeem
    </Button>

    <Button size="sm" onClick={() => navigate("/topup")}>
  <Plus className="mr-1.5 h-4 w-4" />
  Topup
</Button>
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
