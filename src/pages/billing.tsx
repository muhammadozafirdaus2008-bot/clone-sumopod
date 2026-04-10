import { useEffect, useState } from "react";
import TopUpModal from "../components/TopUpModal";
import { supabase } from "../lib/supabase";

export default function BillingPage() {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const getToken = async () => {
      const { data } = await supabase.auth.getSession();
      setToken(data.session?.access_token || null);
    };
    getToken();
  }, []);

  return (
    <div className="p-6">
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        + Topup
      </button>

      <TopUpModal
        open={open}
        onClose={() => setOpen(false)}
        token={token}
      />
    </div>
  );
}