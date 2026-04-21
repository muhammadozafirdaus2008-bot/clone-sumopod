import { useAuth } from "@/components/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Settings, LogOut, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "../hooks/useTheme";

const TopBar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { isDark, toggle } = useTheme();
  const initials = user?.email?.slice(0, 1).toUpperCase() ?? "U";
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <header className="flex h-16 items-center justify-end border-b border-border bg-card px-6 gap-3">

      {/* Dark mode toggle */}
      <button
        onClick={toggle}
        className="flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-background hover:bg-secondary transition-colors"
        title={isDark ? "Switch to Light Mode" : "Switch to Night Mode"}
      >
        {isDark ? (
          <Sun className="h-4 w-4 text-yellow-500" />
        ) : (
          <Moon className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-secondary outline-none">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{displayName}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={toggle} className="cursor-pointer gap-2">
            {isDark ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4" />}
            {isDark ? "Light Mode" : "Night Mode"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut()}
            className="cursor-pointer gap-2 text-destructive focus:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default TopBar;