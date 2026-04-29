import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar copy";
import Footer from "../components/Footer";

// ── Data ──────────────────────────────────────────────────────────────────────
const CATEGORIES = ["All", "Business", "Productivity", "Communication", "Entertainment"];

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  price: number;
  icon: string;
  color: string;
}

const TEMPLATES: Template[] = [
  {
    id: "n8n",
    name: "n8n",
    description: "Workflow automation tool with 200+ integrations. Similar to Zapier.",
    category: "Productivity",
    tags: ["Automation", "Integration"],
    price: 15000,
    icon: "⚙️",
    color: "#EA4B71",
  },
  {
    id: "activepieces",
    name: "Activepieces",
    description:
      "Open source workflow automation tool with hundreds of integrations. An alternative to Zapier.",
    category: "Productivity",
    tags: ["Automation", "Integration", "Open Source"],
    price: 85000,
    icon: "🔗",
    color: "#6C47FF",
  },
  {
    id: "waha",
    name: "WAHA Plus Cloud",
    description:
      "Self-hosted WhatsApp HTTP API (REST API) for unlimited sessions, multimedia messages, and built-in integrations.",
    category: "Communication",
    tags: ["WhatsApp API", "Messaging", "Self-hosted"],
    price: 20000,
    icon: "💬",
    color: "#25D366",
  },
];

function formatRupiah(n: number) {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

// ── Component ─────────────────────────────────────────────────────────────────
const TemplatesPage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = TEMPLATES.filter((t) => {
    const matchCat = activeCategory === "All" || t.category === activeCategory;
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* ── Hero / Header ──────────────────────────────────────────────────── */}
      <section
        className="relative w-full pt-32 pb-16 flex flex-col items-center text-center overflow-hidden"
        style={{ background: "linear-gradient(180deg, #f7f8fc 0%, #ffffff 100%)" }}
      >
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(37,99,235,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,.06) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <span
          className="relative z-10 mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-600"
          style={{ letterSpacing: "0.14em" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
          Application Templates
        </span>

        {/* Title — matches Hero.tsx serif style */}
        <h1
          className="relative z-10 max-w-2xl text-5xl md:text-6xl font-bold leading-tight text-gray-900"
          style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
        >
          <span className="text-blue-600">Application</span>
          <br />
          <span className="text-gray-900">Templates</span>
        </h1>

        <p className="relative z-10 mt-5 max-w-lg text-base text-gray-500 leading-relaxed">
          Choose from our curated collection of application templates and deploy them in seconds.
        </p>

        {/* Search bar */}
        <div className="relative z-10 mt-8 w-full max-w-xl">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-700 shadow-sm outline-none ring-0 transition focus:border-blue-400 focus:shadow-md placeholder:text-gray-400"
          />
        </div>
      </section>

      {/* ── Filters + Grid ─────────────────────────────────────────────────── */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 pb-24">
        {/* Filter row */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded p-1.5 transition-colors ${viewMode === "grid" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-600"}`}
              title="Grid view"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
                <rect x="1" y="1" width="6" height="6" rx="1" />
                <rect x="9" y="1" width="6" height="6" rx="1" />
                <rect x="1" y="9" width="6" height="6" rx="1" />
                <rect x="9" y="9" width="6" height="6" rx="1" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded p-1.5 transition-colors ${viewMode === "list" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-600"}`}
              title="List view"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <span className="text-5xl mb-4">🔍</span>
            <p className="text-lg font-medium">No templates found</p>
            <p className="text-sm mt-1">Try a different search or category.</p>
          </div>
        )}

        {/* Grid view */}
        {viewMode === "grid" && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((t) => (
              <TemplateCard key={t.id} template={t} onDeploy={() => navigate("/register")} />
            ))}
          </div>
        )}

        {/* List view */}
        {viewMode === "list" && filtered.length > 0 && (
          <div className="flex flex-col gap-4">
            {filtered.map((t) => (
              <TemplateListRow key={t.id} template={t} onDeploy={() => navigate("/register")} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

// ── Card (grid) ───────────────────────────────────────────────────────────────
function TemplateCard({ template: t, onDeploy }: { template: Template; onDeploy: () => void }) {
  return (
    <div className="group relative flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-blue-200">
      {/* Category badge */}
      <span className="absolute top-4 right-4 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500">
        {t.category}
      </span>

      {/* Icon */}
      <div
        className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-2xl shadow-sm"
        style={{ background: `${t.color}18`, border: `1px solid ${t.color}30` }}
      >
        {t.icon}
      </div>

      {/* Name + description */}
      <h3 className="text-lg font-bold text-gray-900 mb-1">{t.name}</h3>
      <p className="text-sm text-gray-500 leading-relaxed flex-1 line-clamp-3">{t.description}</p>

      {/* Tags */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {t.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600 border border-blue-100"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Price + CTA */}
      <div className="mt-5 flex items-center justify-between">
        <div>
          <p className="text-xl font-bold text-gray-900">{formatRupiah(t.price)}</p>
          <p className="text-xs text-gray-400">/month</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-lg border border-gray-200 p-2 text-gray-400 transition hover:border-gray-300 hover:text-gray-600"
            title="Preview"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
          <button
            onClick={onDeploy}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 active:scale-95"
          >
            Deploy Now
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── List Row ──────────────────────────────────────────────────────────────────
function TemplateListRow({ template: t, onDeploy }: { template: Template; onDeploy: () => void }) {
  return (
    <div className="flex items-center gap-5 rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-md">
      {/* Icon */}
      <div
        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-2xl"
        style={{ background: `${t.color}18`, border: `1px solid ${t.color}30` }}
      >
        {t.icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="font-bold text-gray-900">{t.name}</h3>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{t.category}</span>
        </div>
        <p className="text-sm text-gray-500 truncate">{t.description}</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {t.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600 border border-blue-100">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Price + CTA */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="text-right">
          <p className="font-bold text-gray-900">{formatRupiah(t.price)}</p>
          <p className="text-xs text-gray-400">/month</p>
        </div>
        <button
          onClick={onDeploy}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 active:scale-95"
        >
          Deploy Now
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default TemplatesPage;