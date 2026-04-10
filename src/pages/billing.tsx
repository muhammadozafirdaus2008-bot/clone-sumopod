import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, QrCode, CreditCard, Receipt } from "lucide-react";

export default function Billing() {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Billing</h1>
          <p className="text-sm text-muted-foreground">
            Manage your balance and view transaction history
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <QrCode className="w-4 h-4 mr-1" />
            Redeem
          </Button>

          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Topup
          </Button>
        </div>
      </div>

      {/* CURRENT CREDIT */}
      <Card>
        <CardContent className="flex items-center gap-4 py-5">
          <div className="p-3 rounded-lg bg-accent">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Current Credits
            </p>
            <p className="text-3xl font-bold">0</p>
          </div>
        </CardContent>
      </Card>

      {/* WARNING */}
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm p-4 rounded-lg">
        Sumopod Credit is <b>not real money</b> and cannot be refunded or withdrawn once added to your account.
      </div>

      {/* TABS */}
      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions" className="gap-1">
            <Receipt className="w-4 h-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

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
                    <TableHead>ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-32 text-muted-foreground">
                      No transactions found
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardContent className="text-center py-10 text-muted-foreground">
              No payments found
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ================= MODAL TOP UP ================= */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Top Up Balance</DialogTitle>
            <DialogDescription>
              Add credits to your account
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* INPUT */}
            <div>
              <Label>Amount</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {/* QUICK BUTTON */}
            <div className="flex gap-2">
              {[50000, 100000, 200000].map((amt) => (
                <Button
                  key={amt}
                  variant="outline"
                  onClick={() => setAmount(String(amt))}
                >
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
          </div>

          <DialogFooter>
            <Button className="w-full">
              Top Up
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}