import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/context/AuthContext";
import { Coins, User, Box } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { user, credits, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: "Services", path: "/services", icon: Box },
    { label: "Top Up", path: "/topup", icon: Coins },
    { label: "Profile", path: "/profile", icon: User },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

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
            <div className="relative">
              
              {/* Trigger */}
              <div
                onClick={() => setOpen(!open)}
                className="cursor-pointer flex items-center gap-2"
              >
                <div className="h-8 w-8 flex items-center justify-center rounded-full bg-red-500 text-white font-bold">
                  {user.email?.[0].toUpperCase()}
                </div>
                <div className="hidden md:block text-sm">
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              {/* Dropdown */}
              {open && (
                <div className="absolute right-0 mt-2 w-40 rounded-lg border bg-white shadow-lg z-50">
                  
                  <button
                    onClick={() => navigate("/settings")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    ⚙️ Settings
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                  >
                    🚪 Logout
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