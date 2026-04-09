import { useAuth } from "@/components/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, LogOut } from "lucide-react";

const TopBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const initials = user?.email?.slice(0, 1).toUpperCase() ?? "U";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    logout();
    navigate("/login");
  };

  const handleSettings = () => {
    setIsOpen(false);
    navigate("/settings");
  };

  return (
    <header className="flex h-16 items-center justify-end border-b border-border bg-card px-6">
      <div className="flex items-center gap-3 relative" ref={dropdownRef}>
        
        {/* User Info */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">User</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <Avatar className="h-10 w-10 cursor-pointer">
            <AvatarFallback className="bg-orange-500 text-white text-sm font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            
            {/* Settings Option */}
            <button
              onClick={handleSettings}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors first:rounded-t-lg"
            >
              <Settings className="h-4 w-4 text-gray-500" />
              <span>Settings</span>
            </button>

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Logout Option */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors last:rounded-b-lg"
            >
              <LogOut className="h-4 w-4 text-red-500" />
              <span>Logout</span>
            </button>

          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;
