import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/context/AuthContext";
import { Coins, User, Box, Settings, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const { user, credits, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    await signOut();
    navigate("/login");
  };

  const handleSettings = () => {
    setOpen(false);
    navigate("/settings");
  };

  const navItems = [
    { label: "Services", path: "/services", icon: Box },
    { label: "Top Up", path: "/topup", icon: Coins },
    { label: "Profile", path: "/profile", icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="container flex h-16 items-center justify-between">
        
        {/* Logo */}
        <Link to="/services" className="flex items-center gap-2 font-bold text-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Box className="h-4 w-4 text-primary-foreground" />
          </div>
          <span>SumoPod</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm ${
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3 relative">
          
          {/* Credits */}
          <div className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-sm font-semibold">
            <Coins className="h-4 w-4" />
            {credits} credits
          </div>

          {/* Profile */}
          {user && (
            <div className="relative" ref={dropdownRef}>
              
              {/* Trigger */}
              <button
                onClick={() => setOpen(!open)}
                className="cursor-pointer flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <div className="h-8 w-8 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold text-sm">
                  {user.email?.[0].toUpperCase()}
                </div>
                <div className="hidden md:block text-sm">
                  <p className="font-medium text-foreground">{user.email}</p>
                </div>
              </button>

              {/* Dropdown Menu */}
              {open && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  
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
          )}

        </div>
      </div>
    </header>
  );
};

export default Navbar;