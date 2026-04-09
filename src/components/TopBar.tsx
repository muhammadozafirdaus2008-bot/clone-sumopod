import { useAuth } from "@/components/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TopBar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const initials = user?.email?.slice(0, 1).toUpperCase() ?? "U";

  return (
    <header className="flex h-16 items-center justify-end border-b border-border bg-card px-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-secondary outline-none">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">User</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 animate-scale-in">
          <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer gap-2 text-destructive focus:text-destructive">
            <LogOut className="h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default TopBar;