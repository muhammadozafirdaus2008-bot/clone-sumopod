import { useAuth } from "@/components/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Coins, Mail, Calendar, LogOut } from "lucide-react";

const Profile = () => {
  const { user, credits, signOut } = useAuth();

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "U";

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="mb-8 text-3xl font-bold text-foreground">Profile</h1>

      <Card>
        <CardHeader className="items-center text-center">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">{initials}</AvatarFallback>
          </Avatar>
          <CardTitle className="mt-4">{user?.email}</CardTitle>
          <CardDescription>Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg bg-secondary p-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium text-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-secondary p-3">
            <Coins className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Credit Balance</p>
              <p className="text-sm font-medium text-foreground">{credits} credits</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-secondary p-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Joined</p>
              <p className="text-sm font-medium text-foreground">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;