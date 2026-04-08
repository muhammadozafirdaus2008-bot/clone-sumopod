import { useAuth } from "@/components/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const TopBar = () => {
  const { user } = useAuth();
  const initials = user?.email?.slice(0, 1).toUpperCase() ?? "U";

  return (
    <header className="flex h-16 items-center justify-end border-b border-border bg-card px-6">
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">User</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default TopBar;
