import { useState } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { HelpCircle, Mail, Send, MessageSquare, CheckCircle } from "lucide-react";

type Category = "bug" | "saran" | "pertanyaan" | "billing" | "lainnya";

const categories: { value: Category; label: string; emoji: string }[] = [
  { value: "bug", label: "Bug / Error", emoji: "🐛" },
  { value: "saran", label: "Saran", emoji: "💡" },
  { value: "pertanyaan", label: "Pertanyaan", emoji: "❓" },
  { value: "billing", label: "Billing", emoji: "💳" },
  { value: "lainnya", label: "Lainnya", emoji: "📝" },
];

const tips = [
  "Sertakan nama service atau ID saat melaporkan masalah",
  "Jelaskan masalah secara detail beserta langkah-langkah yang dilakukan",
  "Sertakan pesan error yang muncul jika ada",
  "Beritahu kami apa yang ingin kamu lakukan sebelum masalah terjadi",
];

const Support = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.user_metadata?.full_name ?? "");
  const [category, setCategory] = useState<Category>("pertanyaan");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const userEmail = user?.email ?? "";

  const handleSubmit = () => {
    if (!name.trim() || !message.trim()) return;

    const subject = `[SumoPod Support] ${categories.find((c) => c.value === category)?.label} - ${name}`;
    const body = `Nama: ${name}\nEmail: ${userEmail}\nKategori: ${categories.find((c) => c.value === category)?.label}\n\n${message}\n\n---\nDikirim dari SumoPod Support`;

    window.location.href = `mailto:m.ghozalifirdaus.it@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  const isValid = name.trim().length > 0 && message.trim().length > 0;

  return (
    <div style={{ animation: "fadeSlideUp 0.35s ease both" }}>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <HelpCircle className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Support</h1>
        </div>
        <p className="ml-12 text-sm text-muted-foreground">
          Get help and support for your SumoPod services
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* ── Form ── */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Kirim Pesan</h2>
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Nama
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama kamu"
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
              />
            </div>

            {/* Email (readonly) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Email
              </label>
              <div className="flex items-center gap-2.5 rounded-xl border border-border bg-muted/40 px-3.5 py-2.5">
                <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{userEmail || "Tidak tersedia"}</span>
                <span className="ml-auto rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  Auto
                </span>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Kategori
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setCategory(c.value)}
                    className="flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all duration-150"
                    style={{
                      borderColor: category === c.value ? "hsl(var(--primary))" : "hsl(var(--border))",
                      background: category === c.value ? "hsl(var(--primary) / 0.1)" : "transparent",
                      color: category === c.value ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                    }}
                  >
                    <span>{c.emoji}</span>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Keluhan / Saran
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ceritakan masalah atau saranmu secara detail..."
                rows={5}
                className="w-full resize-none rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
              />
              <p className="text-right text-[11px] text-muted-foreground">
                {message.length} karakter
              </p>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!isValid || sent}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: sent ? "hsl(142 72% 29%)" : "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
                boxShadow: isValid && !sent ? "0 4px 16px hsl(var(--primary) / 0.3)" : "none",
                transform: isValid && !sent ? "translateY(0)" : undefined,
              }}
            >
              {sent ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Email client terbuka!
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Kirim ke Support
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Sidebar info ── */}
        <div className="space-y-4">
          {/* Email support card */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10">
                <Mail className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Email Support</p>
                <p className="text-[11px] text-muted-foreground">Response dalam 1x24 jam</p>
              </div>
            </div>
            <div className="rounded-lg bg-muted/40 px-3 py-2">
              <p className="text-[11px] text-muted-foreground mb-0.5">Kirim ke</p>
              <p className="text-xs font-semibold text-foreground break-all">
                m.ghozalifirdaus.it@gmail.com
              </p>
            </div>
          </div>

          {/* Tips card */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm font-semibold text-foreground mb-3">
              Sebelum menghubungi support
            </p>
            <ul className="space-y-2.5">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                  <p className="text-[12px] text-muted-foreground leading-relaxed">{tip}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;