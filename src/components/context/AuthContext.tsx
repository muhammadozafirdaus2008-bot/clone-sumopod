import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface AppUser {
  id: string;
  email: string;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  credits: number;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  addCredits: (amount: number) => void;
  spendCredits: (amount: number) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = "sumopod_users";
const SESSION_KEY = "sumopod_session";
const CREDITS_KEY = "sumopod_credits";
const INITIAL_CREDITS = 100;

interface StoredUser {
  id: string;
  email: string;
  password: string;
}

const loadStoredUsers = (): Record<string, StoredUser> => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? "{}") as Record<string, StoredUser>;
  } catch {
    return {};
  }
};

const saveStoredUsers = (users: Record<string, StoredUser>) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const getStoredCredits = (userId: string) => {
  return Number(localStorage.getItem(`${CREDITS_KEY}_${userId}`) ?? INITIAL_CREDITS);
};

const saveStoredCredits = (userId: string, amount: number) => {
  localStorage.setItem(`${CREDITS_KEY}_${userId}`, String(amount));
};

const saveSession = (user: AppUser) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState(INITIAL_CREDITS);

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      const saved = JSON.parse(session) as AppUser;
      setUser(saved);
      setCredits(getStoredCredits(saved.id));
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const users = loadStoredUsers();
    const normalized = email.toLowerCase();
    const storedUser = users[normalized];

    if (!storedUser || storedUser.password !== password) {
      return { success: false, message: "Invalid email or password" };
    }

    const nextUser: AppUser = { id: storedUser.id, email: storedUser.email };
    setUser(nextUser);
    saveSession(nextUser);
    setCredits(getStoredCredits(nextUser.id));

    return { success: true };
  };

  const register = async (email: string, password: string) => {
    const normalized = email.toLowerCase();
    const users = loadStoredUsers();

    if (users[normalized]) {
      return { success: false, message: "Email already registered" };
    }

    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      email: normalized,
      password,
    };

    users[normalized] = newUser;
    saveStoredUsers(users);
    saveStoredCredits(newUser.id, INITIAL_CREDITS);

    const nextUser: AppUser = { id: newUser.id, email: newUser.email };
    setUser(nextUser);
    saveSession(nextUser);
    setCredits(INITIAL_CREDITS);

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setCredits(INITIAL_CREDITS);
    clearSession();
  };

  const addCredits = (amount: number) => {
    if (!user) return;
    const nextAmount = credits + amount;
    setCredits(nextAmount);
    saveStoredCredits(user.id, nextAmount);
  };

  const spendCredits = (amount: number) => {
    if (!user || credits < amount) return false;
    const nextAmount = credits - amount;
    setCredits(nextAmount);
    saveStoredCredits(user.id, nextAmount);
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, loading, credits, login, register, logout, addCredits, spendCredits }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
