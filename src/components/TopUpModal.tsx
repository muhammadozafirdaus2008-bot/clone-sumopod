import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TopUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TopUpModal({ open, onOpenChange }: TopUpModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const amounts = [50000, 100000, 200000];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl shadow-lg">
        
        {/* HEADER */}
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Top Up Balance
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Add credits to your account
          </DialogDescription>
        </DialogHeader>

        {/* BODY */}
        <div className="space-y-6">
          
          {/* AMOUNT INPUT */}
          <div className="space-y-2">
            <Label>Amount</Label>
            <Input type="number" placeholder="Enter amount" />
          </div>

          {/* QUICK BUTTON */}
          <div className="flex gap-2">
            {amounts.map((amt) => (
              <Button
                key={amt}
                type="button"
                variant={selectedAmount === amt ? "default" : "outline"}
                className="flex-1"
                onClick={() => setSelectedAmount(amt)}
              >
                {amt.toLocaleString("id-ID")}
              </Button>
            ))}
          </div>

          {/* CURRENCY */}
          <div className="space-y-2">
            <Label>Currency</Label>
            <Input value="IDR - Indonesian Rupiah" disabled />
          </div>

          {/* PAYMENT METHOD */}
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Input value="QRIS" disabled />
          </div>

          {/* WARNING */}
          <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
            Sumopod Credit is not real money and cannot be refunded or withdrawn.
          </div>
        </div>

        {/* FOOTER */}
        <DialogFooter>
          <Button className="w-full">Top Up</Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}