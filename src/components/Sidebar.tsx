import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/components/context/AuthContext";
import {
  Box, MessageSquare, Bot, Cloud, Wallet,
  Monitor, Database, Globe, Mail,
  Receipt, Users, Settings, HelpCircle,
  GraduationCap, Users2, ChevronDown
} from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const sections: NavSection[] = [
  {
    title: "LEARNING",
    items: [
      { label: "Learn", path: "/learn", icon: GraduationCap },
      { label: "Community", path: "/community", icon: Users2 },
    ],
  },
  {
    title: "SERVICES",
    items: [
      { label: "Chat", path: "/chat", icon: MessageSquare },
      { label: "AI", path: "/ai", icon: Bot },
      { label: "Services", path: "/services", icon: Cloud },
      { label: "Wallet", path: "/wallet", icon: Wallet },
    ],
  },
  {
    title: "INFRASTRUCTURE",
    items: [
      { label: "VPS", path: "/vps", icon: Monitor },
      { label: "Database", path: "/database", icon: Database },
      { label: "Domains", path: "/domains", icon: Globe },
    ],
  },
  {
    title: "COMMUNICATION",
    items: [
      { label: "Email SMTP", path: "/email-smtp", icon: Mail },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      { label: "Billing", path: "/billing", icon: Receipt },
      { label: "Affiliate", path: "/affiliate", icon: Users },
      { label: "Settings", path: "/settings", icon: Settings },
      { label: "Support", path: "/support", icon: HelpCircle },
    ],
  },
];

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 20;
    setIsAtBottom(atBottom);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el.removeEventListener("scroll", checkScroll);
  }, [checkScroll]);

  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Box className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold text-foreground">SumoPod</span>
      </div>

      {/* Navigation */}
      <div className="relative flex-1 overflow-hidden">
        <nav
          ref={scrollRef}
          className="h-full overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
        >
          {sections.map((section) => (
            <div key={section.title}>
              <p className="mb-1.5 px-2 text-[11px] font-semibold tracking-wider text-muted-foreground">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-all duration-200 ease-out perspective ${
                        active
                          ? "bg-accent text-primary"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground hover:shadow-lg hover:-translate-y-1 hover:scale-105"
                      }`}
                      style={{
                        transformOrigin: 'center bottom',
                      }}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Scroll for more button - fades out when at bottom */}
        <div
          className={`pointer-events-none absolute bottom-0 left-0 right-0 transition-opacity duration-300 ${
            isAtBottom ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="bg-gradient-to-t from-card via-card/80 to-transparent px-3 pb-2 pt-6">
            <button
              onClick={scrollToBottom}
              className="pointer-events-auto flex w-full items-center justify-center gap-1 rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
            >
              <ChevronDown className="h-4 w-4 animate-bounce" />
              Scroll for More
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;