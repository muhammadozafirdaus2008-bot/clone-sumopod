import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/client";
import type { User, Session } from "@supabase/supabase-js";
import type { AuthChangeEvent } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  credits: number;
  addCredits: (amount: number) => void;
  spendCredits: (amount: number) => boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CREDITS_KEY = "sumopod_credits";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState(100);

  useEffect(() => {
const { data: listener } = supabase.auth.onAuthStateChange(
  (_event: AuthChangeEvent, session: Session | null) => {
    setSession(session);
    setUser(session?.user ?? null);
    setLoading(false);

    if (session?.user) {
      const saved = localStorage.getItem(`${CREDITS_KEY}_${session.user.id}`);
      if (saved !== null) setCredits(Number(saved));
      else {
        setCredits(100);
        localStorage.setItem(`${CREDITS_KEY}_${session.user.id}`, "100");
      }
    }
  }
);
const subscription = listener?.subscription;

  const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error(error);
    return;
  }

  const session = data.session;

  setSession(session);
  setUser(session?.user ?? null);
  setLoading(false);

  if (session?.user) {
    const saved = localStorage.getItem(`${CREDITS_KEY}_${session.user.id}`);
    if (saved !== null) setCredits(Number(saved));
    else {
      setCredits(100);
      localStorage.setItem(`${CREDITS_KEY}_${session.user.id}`, "100");
    }
  }
};

getSession();

    return () => subscription.unsubscribe();
  }, []);

  const persist = (userId: string, val: number) => {
    setCredits(val);
    localStorage.setItem(`${CREDITS_KEY}_${userId}`, String(val));
  };

  const addCredits = (amount: number) => {
    if (!user) return;
    persist(user.id, credits + amount);
  };

  const spendCredits = (amount: number): boolean => {
    if (!user || credits < amount) return false;
    persist(user.id, credits - amount);
    return true;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, credits, addCredits, spendCredits, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
