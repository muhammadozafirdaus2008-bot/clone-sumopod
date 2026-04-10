import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  token: string | null;
};

export default function TopUpModal({ open, onClose, token }: Props) {
  const [amount, setAmount] = useState<number>(50000);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleTopUp = async () => {
    if (!amount || amount <= 0) {
      alert("Masukkan amount yang valid");
      return;
    }

    if (!token) {
      alert("User belum login / token tidak ada");
      return;
    }

    try {
      setLoading(true);

      console.log("SEND:", { amount, token });

      const res = await fetch(
        "https://n8n-azfzwmyoqkaw.jkt1.sumopod.my.id/webhook/topup-balance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: Number(amount),
          }),
        }
      );

      const data = await res.json();
      console.log("RESPONSE:", data);

      if (!res.ok) {
        throw new Error(data?.message || "Gagal topup");
      }

      if (!data.invoice_url) {
        throw new Error("Invoice URL tidak ditemukan");
      }

      // ✅ redirect ke invoice
      window.location.href = data.invoice_url;
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Terjadi error");
    } finally {
      setLoading(false);
    }
  };

  const preset = [50000, 100000, 200000];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl p-6 space-y-5">
        {/* header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Top Up Balance</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* amount */}
        <div>
          <label className="text-sm font-medium">
            Amount Sumopod Credit
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full mt-2 border rounded-lg px-3 py-2"
          />
        </div>

        {/* preset */}
        <div className="flex gap-2">
          {preset.map((item) => (
            <button
              key={item}
              onClick={() => setAmount(item)}
              className={`px-3 py-2 rounded-lg border ${
                amount === item
                  ? "bg-blue-600 text-white"
                  : "bg-white"
              }`}
            >
              {item.toLocaleString("id-ID")}
            </button>
          ))}
        </div>

        {/* currency */}
        <div>
          <label className="text-sm font-medium">Currency</label>
          <div className="mt-2 border rounded-lg px-3 py-2 bg-gray-50">
            IDR - Indonesian Rupiah
          </div>
        </div>

        {/* payment */}
        <div>
          <label className="text-sm font-medium">
            Payment Method
          </label>
          <div className="mt-2 border rounded-lg px-3 py-2 bg-gray-50">
            QRIS
          </div>
        </div>

        {/* note */}
        <div className="bg-yellow-50 border border-yellow-200 text-sm p-3 rounded-lg">
          Sumopod Credit is not real money and cannot be refunded or withdrawn.
        </div>

        {/* button */}
        <button
          onClick={handleTopUp}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Top Up"}
        </button>
      </div>
    </div>
  );
}