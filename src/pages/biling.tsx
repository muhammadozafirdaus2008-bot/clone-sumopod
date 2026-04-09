import { useState } from "react";
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
  DialogDescription, // ⬅️ INI KURANG
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

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

 <Dialog>
  <DialogTrigger asChild>
    <Button size="sm">
      <Plus className="mr-1.5 h-4 w-4" />
      Topup
    </Button>
  </DialogTrigger>

  <DialogContent className="sm:max-w-md">
  <DialogHeader>
    <DialogTitle>Top Up Balance</DialogTitle>
    <DialogDescription>
      Add credits to your account
    </DialogDescription>
  </DialogHeader>

  {/* INPUT */}
  <div className="space-y-4">
    <div>
      <Label>Amount Sumopod Credit</Label>
      <Input type="number" placeholder="0" />
    </div>

    {/* QUICK BUTTON */}
    <div className="flex gap-2">
      {[50000, 100000, 200000].map((amt) => (
        <Button key={amt} variant="outline">
          {amt.toLocaleString("id-ID")}
        </Button>
      ))}
    </div>

    {/* CURRENCY */}
    <div>
      <Label>Currency</Label>
      <Input value="IDR - Indonesian Rupiah" disabled />
    </div>

    {/* PAYMENT */}
    <div>
      <Label>Payment Method</Label>
      <Input value="QRIS" disabled />
    </div>

    {/* WARNING */}
    <div className="text-sm bg-yellow-50 border border-yellow-200 rounded p-3">
      Sumopod Credit is not real money and cannot be refunded or withdrawn.
    </div>
  </div> {/* ⬅️ INI YANG SERING KELUPA */}

  <DialogFooter>
    <Button className="w-full">Top Up</Button>
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
