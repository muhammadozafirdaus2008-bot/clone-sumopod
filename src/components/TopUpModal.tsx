import { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/components/context/AuthContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  session: any;
}

export default function TopUpModal({ isOpen, onClose, session }: Props) {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addCredits } = useAuth();

  const handleSetAmount = (value: number) => {
    setAmount(String(value));
  };

  const handleSubmit = async () => {
    if (!amount || Number(amount) <= 0) {
      toast({
        title: "Error",
        description: "Masukkan nominal yang valid",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // simulasi sukses
      await new Promise((r) => setTimeout(r, 1000));

      addCredits(Number(amount));

      toast({
        title: "Success",
        description: "Top up berhasil!",
      });

      setAmount("");
      onClose();
    } catch (err) {
      toast({
        title: "Error",
        description: "Gagal top up",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md shadow-xl mx-4">
        
        {/* Header */}
        <div className="flex justify-between p-6 border-b">
          <h2 className="font-semibold">Top Up Balance</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <Label>Amount</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            {[50000, 100000, 200000].map((val) => (
              <Button
                key={val}
                variant={amount === String(val) ? "default" : "outline"}
                onClick={() => handleSetAmount(val)}
              >
                {val}
              </Button>
            ))}
          </div>

          <div className="flex gap-2 bg-orange-50 p-3 rounded">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <p className="text-sm">
              Credit tidak bisa direfund
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t">
          <Button
            onClick={handleSubmit}
            disabled={!amount || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Processing...
              </>
            ) : (
              "Top Up"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}