import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authClient } from "@/lib/auth-client";
import { supabase } from "@/lib/supabase";

interface User {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  createdAt?: Date;
}

interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  token: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  accessToken: string | null;
  loading: boolean;
  credits: number;
  refreshCredits: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState(0);

  const fetchCredits = async (userId: string) => {
    const { data, error } = await supabase
      .from("balances")
      .select("balance")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching credits:", error.message);
      return;
    }
    if (data) setCredits(data.balance);
  };

  const refreshCredits = async () => {
    if (user) await fetchCredits(user.id);
  };

  // Cek session saat pertama load
  useEffect(() => {
    const init = async () => {
      const { data } = await authClient.getSession();
      if (data?.session && data?.user) {
        setSession(data.session as Session);
        setUser(data.user as User);
        await fetchCredits(data.user.id);
      }
      setLoading(false);
    };
    init();
  }, []);

  // Realtime balance dari Supabase (tetap pakai Supabase untuk ini)
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("balance-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "balances",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setCredits((payload.new as { balance: number }).balance);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const signOut = async () => {
    await authClient.signOut();
    setUser(null);
    setSession(null);
    setCredits(0);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        accessToken: session?.token ?? null,
        loading,
        credits,
        refreshCredits,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};