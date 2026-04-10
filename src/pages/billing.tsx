import { useState } from "react";
import TopUpModal from "../components/TopUpModal";

export default function BillingPage() {
  const [open, setOpen] = useState(false);

  // TODO: ganti dengan token asli dari supabase
  const token = "YOUR_SUPABASE_TOKEN";

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Billing</h1>
          <p className="text-gray-500 text-sm">
            Manage your balance and view transaction history
          </p>
        </div>

        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg border bg-white">
            Redeem
          </button>

          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white"
          >
            + Topup
          </button>
        </div>
      </div>

      {/* CARD CREDIT */}
      <div className="bg-white rounded-xl border p-4 flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          💳
        </div>
        <div>
          <p className="text-sm text-gray-500">Current Credits</p>
          <p className="text-xl font-semibold">0</p>
        </div>
      </div>

      {/* WARNING */}
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm rounded-lg p-4">
        Sumopod Credit is not real money and cannot be refunded or withdrawn once added to your account.
      </div>

      {/* TABS */}
      <div className="bg-white rounded-xl border p-4">
        <div className="flex gap-4 mb-4">
          <button className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600">
            Transactions
          </button>
          <button className="px-3 py-1 text-gray-500">
            Payments
          </button>
        </div>

        <div className="text-center text-gray-400 py-10">
          No transactions found
        </div>
      </div>

      {/* MODAL */}
      <TopUpModal
        open={open}
        onClose={() => setOpen(false)}
        token={token}
      />
    </div>
  );
}