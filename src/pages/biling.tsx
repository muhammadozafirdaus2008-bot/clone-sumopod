import { useState } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, QrCode, Receipt, CreditCard, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

  <Button size="sm" onClick={() => navigate("/topup")}>
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
      <div className="mb-6 flex items-center justify-between">
  
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
