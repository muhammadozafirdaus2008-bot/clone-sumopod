import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  token: string;
};

export default function TopUpModal({ open, onClose, token }: Props) {
  const [amount, setAmount] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!amount) return alert("Masukkan jumlah top up");

    try {
      setLoading(true);

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

      if (data?.invoice_url) {
        window.location.href = data.invoice_url;
      } else {
        alert("Gagal mendapatkan invoice");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6 z-10">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Top Up Balance</h2>
          <p className="text-sm text-gray-500">
            Add credits to your account
          </p>
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label className="text-sm font-medium">Amount</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="mt-2 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Quick Select */}
        <div className="flex gap-2 mb-4">
          {[50000, 100000, 200000].map((val) => (
            <button
              key={val}
              onClick={() => setAmount(val)}
              className={`px-3 py-2 rounded-lg border text-sm ${
                amount === val
                  ? "bg-blue-600 text-white border-blue-600"
                  : "hover:bg-gray-100"
              }`}
            >
              {val.toLocaleString()}
            </button>
          ))}
        </div>

        {/* Currency */}
        <div className="mb-4">
          <label className="text-sm font-medium">Currency</label>
          <input
            disabled
            value="IDR - Indonesian Rupiah"
            className="mt-2 w-full border rounded-lg px-3 py-2 bg-gray-100"
          />
        </div>

        {/* Payment */}
        <div className="mb-4">
          <label className="text-sm font-medium">Payment Method</label>
          <input
            disabled
            value="QRIS"
            className="mt-2 w-full border rounded-lg px-3 py-2 bg-gray-100"
          />
        </div>

        {/* Warning */}
        <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm rounded-lg p-3">
          Sumopod Credit is not real money and cannot be refunded or withdrawn.
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          {loading ? "Processing..." : "Top Up"}
        </button>
      </div>
    </div>
  );
}