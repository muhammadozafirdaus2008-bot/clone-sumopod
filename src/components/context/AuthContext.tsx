import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  credits: number;
  refreshCredits: () => Promise<void>;
  signOut: () => Promise<void>;
  spendCredits: (amount: number, description: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState(0);

  const fetchCredits = async (userId: string) => {
    const { data, error } = await supabase
      .from("Balances")
      .select("balance")
      .eq("user_id", userId)
      .maybeSingle(); // ✅ FIX

    if (error) {
      console.error("Error fetching credits:", error.message);
      return;
    }

    if (data) setCredits(data.balance);
  };

  const refreshCredits = async () => {
    if (user) await fetchCredits(user.id);
  };

 const spendCredits = async (amount: number, description: string) => {
  const { data, error } = await supabase.rpc("spend_credits", {
    p_amount: amount,
    p_description: description,
  });

  if (error) {
    console.error("spendCredits error:", error.message);
    return false;
  }

  return data === true;
};

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) fetchCredits(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) fetchCredits(session.user.id);
      else setCredits(0);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("balance-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Balances",
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
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setCredits(0);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, credits, spendCredits, refreshCredits, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};