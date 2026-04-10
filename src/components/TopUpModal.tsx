import { useState } from "react";

export default function TopUpModal({
  open,
  onClose,
  token,
}: {
  open: boolean;
  onClose: () => void;
  token: string | null;
}) {
  const [amount, setAmount] = useState(50000);
  const [loading, setLoading] = useState(false);

  const handleTopUp = async () => {
    try {
      if (!token) {
        alert("User belum login");
        return;
      }

      setLoading(true);

      const res = await fetch(
        "https://n8n-azfzwmyoqkaw.jkt1.sumopod.my.id/webhook/topup-balance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // 🔥 pakai dari props
          },
          body: JSON.stringify({
            amount: amount,
          }),
        }
      );

      const data = await res.json();

      if (data.invoice_url) {
        window.location.href = data.invoice_url;
      } else {
        alert("Gagal membuat invoice");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIX DI SINI
  if (!open) return null;

  return (
    <div className="modal">
      <h2>Top Up Balance</h2>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />

      <button onClick={handleTopUp} disabled={loading}>
        {loading ? "Processing..." : "Top Up"}
      </button>

      <button onClick={onClose}>Close</button>
    </div>
  );
}