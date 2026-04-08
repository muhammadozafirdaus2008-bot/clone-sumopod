import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/client";

const ProfileDropdown = ({ user }: any) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login"); // langsung ke login
  };

  return (
    <div className="relative">
      {/* Trigger (nama + avatar) */}
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center">
          {user?.email?.[0]?.toUpperCase()}
        </div>

        <div className="text-left">
          <p className="text-sm font-medium">{user?.user_metadata?.full_name || "User"}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border bg-white shadow-lg p-2 z-50">
          
          <button
            onClick={() => navigate("/settings")}
            className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md"
          >
            ⚙️ Settings
          </button>

          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-red-500"
          >
            🚪 Logout
          </button>

        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;