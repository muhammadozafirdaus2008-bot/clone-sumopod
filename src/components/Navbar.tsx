import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/components/context/AuthContext";
import { Coins, LogOut, User, Box } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { user, credits, signOut } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: "Services", path: "/services", icon: Box },
    { label: "Top Up", path: "/topup", icon: Coins },
    { label: "Profile", path: "/profile", icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/services" className="flex items-center gap-2 font-bold text-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Box className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-foreground">SumoPod</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
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

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-sm font-semibold text-accent-foreground">
            <Coins className="h-4 w-4" />
            {credits} credits
          </div>
          {user && (
            <Button variant="ghost" size="icon" onClick={signOut} title="Sign out">
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
