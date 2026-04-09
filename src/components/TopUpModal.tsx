import { useState } from "react";

export default function TopUpModal({ isOpen, onClose, session }) {
  const [amount, setAmount] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await fetch(
        "https://n8n-azfzwmyoqkaw.jkt1.sumopod.my.id/webhook/topup-balance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // 🔐 TOKEN SUPABASE
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            amount: Number(amount),
          }),
        }
      );

      const data = await res.json();

      // 🚀 REDIRECT KE INVOICE
      if (data.invoice_url) {
        window.location.href = data.invoice_url;
      }
    } catch (err) {
      console.error("Topup error:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-80">
        <h2 className="text-lg font-semibold mb-4">Top Up Balance</h2>

        <input
          type="number"
          placeholder="Masukkan nominal (contoh: 10000)"
          className="w-full border p-2 rounded mb-4"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="flex gap-2 mb-4">
          <button onClick={() => setAmount(50000)}>50K</button>
          <button onClick={() => setAmount(100000)}>100K</button>
          <button onClick={() => setAmount(200000)}>200K</button>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit} className="bg-blue-500 text-white px-3 py-1 rounded">
            Top Up
          </button>
        </div>
      </div>
    </div>
  );
}