import { useState } from "react";
import { useAuth } from "@/components/context/AuthContext";
import {
  HelpCircle, Mail, Send, CheckCircle2,
  Bug, Lightbulb, CircleHelp, CreditCard, FileText,
} from "lucide-react";

type Category = "bug" | "saran" | "pertanyaan" | "billing" | "lainnya";

const categories: {
  value: Category;
  label: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}[] = [
  { value: "bug",        label: "Bug / Error",  icon: Bug,         color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
  { value: "saran",      label: "Saran",         icon: Lightbulb,   color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
  { value: "pertanyaan", label: "Pertanyaan",    icon: CircleHelp,  color: "#3b82f6", bg: "rgba(59,130,246,0.08)" },
  { value: "billing",    label: "Billing",       icon: CreditCard,  color: "#8b5cf6", bg: "rgba(139,92,246,0.08)" },
  { value: "lainnya",    label: "Lainnya",       icon: FileText,    color: "#6b7280", bg: "rgba(107,114,128,0.08)" },
];

const tips = [
  "Sertakan nama service atau ID saat melaporkan masalah",
  "Jelaskan masalah secara detail beserta langkah-langkah yang dilakukan",
  "Sertakan pesan error yang muncul jika ada",
  "Beritahu kami apa yang ingin kamu lakukan sebelum masalah terjadi",
];

const Support = () => {
  const { user } = useAuth();
  const [name, setName]         = useState(user?.user_metadata?.full_name ?? "");
  const [category, setCategory] = useState<Category>("pertanyaan");
  const [message, setMessage]   = useState("");
  const [sent, setSent]         = useState(false);

  const userEmail = user?.email ?? "";
  const isValid   = name.trim().length > 0 && message.trim().length > 0;
  const activeCat = categories.find((c) => c.value === category)!;

  const handleSubmit = () => {
    if (!isValid) return;
    const subject = `[SumoPod Support] ${activeCat.label} — ${name}`;
    const body    = `Nama: ${name}\nEmail: ${userEmail}\nKategori: ${activeCat.label}\n\n${message}\n\n---\nDikirim dari SumoPod Support`;
    window.location.href = `mailto:m.ghozalifirdaus.it@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div style={{ animation: "spUp .38s ease both" }}>
      <style>{`
        @keyframes spUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        @keyframes spPop {
          0%  { opacity:0; transform:scale(.92); }
          60% { transform:scale(1.03); }
          100%{ opacity:1; transform:scale(1); }
        }
        .sp-input {
          width:100%; border-radius:.75rem;
          border:1.5px solid hsl(var(--border));
          background:hsl(var(--background));
          padding:.65rem 1rem; font-size:.875rem;
          color:hsl(var(--foreground));
          transition:border-color .18s, box-shadow .18s;
          outline:none;
        }
        .sp-input::placeholder { color:hsl(var(--muted-foreground)/0.5); }
        .sp-input:focus {
          border-color:hsl(var(--primary)/.5);
          box-shadow:0 0 0 3px hsl(var(--primary)/.12);
        }
      `}</style>

      {/* ── Page header ── */}
      <div className="mb-8 flex items-start gap-4">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
          style={{ background:"hsl(var(--primary)/.1)" }}
        >
          <HelpCircle className="h-5 w-5" style={{ color:"hsl(var(--primary))" }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Support</h1>
          <p className="text-sm text-muted-foreground">Get help and support for your SumoPod services</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

        {/* ── Main form ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Form card */}
          <div
            className="rounded-2xl border"
            style={{
              borderColor:"hsl(var(--border))",
              background:"hsl(var(--card))",
              boxShadow:"0 1px 3px hsl(0 0% 0%/.06), 0 4px 16px hsl(0 0% 0%/.04)",
            }}
          >
            {/* Card header strip */}
            <div
              className="flex items-center gap-3 rounded-t-2xl border-b px-6 py-4"
              style={{ borderColor:"hsl(var(--border))", background:"hsl(var(--muted)/.4)" }}
            >
              <Mail className="h-4 w-4" style={{ color:"hsl(var(--primary))" }} />
              <span className="text-sm font-semibold text-foreground">Kirim Pesan ke Support</span>
            </div>

            <div className="p-6 space-y-5">

              {/* Name + Email row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    Nama
                  </label>
                  <input
                    className="sp-input"
                    placeholder="Nama lengkap kamu"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    Email
                  </label>
                  <div
                    className="flex items-center gap-2.5 rounded-[.75rem] border px-4 py-[.65rem]"
                    style={{
                      borderColor:"hsl(var(--border))",
                      background:"hsl(var(--muted)/.5)",
                    }}
                  >
                    <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="flex-1 truncate text-sm text-muted-foreground">{userEmail}</span>
                    <span
                      className="rounded-md px-1.5 py-0.5 text-[10px] font-bold"
                      style={{ background:"hsl(var(--primary)/.12)", color:"hsl(var(--primary))" }}
                    >
                      AUTO
                    </span>
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                  Kategori
                </label>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {categories.map((c) => {
                    const active = category === c.value;
                    const Icon = c.icon;
                    return (
                      <button
                        key={c.value}
                        onClick={() => setCategory(c.value)}
                        className="flex flex-col items-center gap-1.5 rounded-xl border py-3 px-2 text-center transition-all duration-150"
                        style={{
                          borderColor: active ? c.color : "hsl(var(--border))",
                          background:  active ? c.bg   : "transparent",
                          boxShadow:   active ? `0 0 0 1px ${c.color}` : "none",
                          transform:   active ? "scale(1.04)" : "scale(1)",
                        }}
                      >
                        <Icon
                          className="h-4 w-4"
                          style={{ color: active ? c.color : "hsl(var(--muted-foreground))" }}
                        />
                        <span
                          className="text-[11px] font-semibold leading-tight"
                          style={{ color: active ? c.color : "hsl(var(--muted-foreground))" }}
                        >
                          {c.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                  Keluhan / Saran
                </label>
                <textarea
                  className="sp-input"
                  style={{ minHeight:140, resize:"vertical" }}
                  placeholder="Ceritakan masalah atau saranmu secara detail. Semakin detail semakin cepat kami bantu 🙏"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">
                    Minimal 10 karakter
                  </span>
                  <span
                    className="text-[11px] font-semibold"
                    style={{ color: message.length >= 10 ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))" }}
                  >
                    {message.length} karakter
                  </span>
                </div>
              </div>

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={!isValid || sent}
                className="relative flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold tracking-wide transition-all duration-200 disabled:cursor-not-allowed"
                style={{
                  background: sent
                    ? "hsl(142 72% 29%)"
                    : isValid
                    ? "hsl(var(--primary))"
                    : "hsl(var(--muted))",
                  color: isValid || sent
                    ? "hsl(var(--primary-foreground))"
                    : "hsl(var(--muted-foreground))",
                  boxShadow: isValid && !sent
                    ? "0 4px 20px hsl(var(--primary)/.35)"
                    : "none",
                  transform: isValid && !sent ? "translateY(-1px)" : "none",
                }}
              >
                {sent ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Email client terbuka — terima kasih!
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
        </div>

        {/* ── Right sidebar ── */}
        <div className="space-y-4">

          {/* Contact card */}
          <div
            className="rounded-2xl border overflow-hidden"
            style={{
              borderColor:"hsl(var(--border))",
              background:"hsl(var(--card))",
              boxShadow:"0 1px 3px hsl(0 0% 0%/.06)",
            }}
          >
            <div
              className="px-5 py-4"
              style={{
                background:"linear-gradient(135deg, hsl(var(--primary)/.08) 0%, hsl(var(--primary)/.02) 100%)",
                borderBottom:"1px solid hsl(var(--border))",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background:"hsl(var(--primary)/.12)" }}
                >
                  <Mail className="h-5 w-5" style={{ color:"hsl(var(--primary))" }} />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Email Support</p>
                  <p className="text-[11px] text-muted-foreground">Response dalam 1×24 jam</p>
                </div>
              </div>
            </div>
            <div className="px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                Kirim langsung ke
              </p>
              <p className="text-xs font-semibold text-foreground break-all">
                m.ghozalifirdaus.it@gmail.com
              </p>
            </div>
          </div>

          {/* Tips card */}
          <div
            className="rounded-2xl border p-5"
            style={{
              borderColor:"hsl(var(--border))",
              background:"hsl(var(--card))",
              boxShadow:"0 1px 3px hsl(0 0% 0%/.06)",
            }}
          >
            <p className="mb-4 text-sm font-bold text-foreground">
              Sebelum menghubungi support
            </p>
            <ul className="space-y-3">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                    style={{
                      background:"hsl(var(--primary)/.1)",
                      color:"hsl(var(--primary))",
                    }}
                  >
                    {i + 1}
                  </span>
                  <p className="text-[12px] leading-relaxed text-muted-foreground">{tip}</p>
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