import { useEffect, useState } from "react";
import TopUpModal from "../components/TopUpModal";
import { supabase } from "../lib/supabase";

export default function BillingPage() {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getToken = async () => {
      const { data } = await supabase.auth.getSession();

      const accessToken = data.session?.access_token || null;

      console.log("🔥 TOKEN DARI SUPABASE:", accessToken); // DEBUG

      setToken(accessToken);
      setLoading(false);
    };

    getToken();
  }, []);

  // 🚫 kalau belum login
  if (!loading && !token) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Billing</h1>
        <p className="text-red-500 mt-2">
          Kamu belum login. Silakan login dulu.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Billing</h1>
          <p className="text-gray-500 text-sm">
            Manage your balance and view transaction history
          </p>
        </div>

        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded-lg bg-white">
            Redeem
          </button>

          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            + Topup
          </button>
        </div>
      </div>

      {/* CREDIT CARD */}
      <div className="border rounded-xl p-6 flex items-center gap-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          💳
        </div>
        <div>
          <p className="text-sm text-gray-500">Current Credits</p>
          <p className="text-2xl font-semibold">0</p>
        </div>
      </div>

      {/* WARNING */}
      <div className="border border-yellow-300 bg-yellow-50 p-4 rounded-lg text-sm">
        Sumopod Credit is not real money and cannot be refunded or withdrawn
        once added to your account.
      </div>

      {/* TABS */}
      <div className="border rounded-xl">
        <div className="flex border-b">
          <button className="px-4 py-2 text-blue-600 border-b-2 border-blue-600">
            Transactions
          </button>
          <button className="px-4 py-2 text-gray-500">
            Payments
          </button>
        </div>

        {/* TABLE */}
        <div className="p-6 text-center text-gray-500">
          No transactions found
        </div>
      </div>

      {/* MODAL */}
      <TopUpModal
        open={open}
        onClose={() => setOpen(false)}
        token={token} // 🔥 TOKEN DIKIRIM KE MODAL
      />
    </div>
  );
}