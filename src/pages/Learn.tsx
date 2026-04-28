import { useState, useEffect, useRef } from "react";
import { X, Play, ExternalLink, GraduationCap } from "lucide-react";

const videos = [
  { id: "HD13eq_Pmp8" },
  { id: "wRNinF7YQqQ" },
  { id: "lfmg-EJ8gm4" },
  { id: "6biMWgD6_JY" },
  { id: "CgkZ7MvWUAA" },
  { id: "bS9R6aCVEzw" },
];

/* ── Fetch title via oEmbed ── */
const useYoutubeTitle = (videoId: string) => {
  const [title, setTitle] = useState("Loading...");
  useEffect(() => {
    fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`)
      .then((r) => r.json())
      .then((d) => setTitle(d.title))
      .catch(() => setTitle("Video Tutorial"));
  }, [videoId]);
  return title;
};

/* ── Single card ── */
const VideoCard = ({
  videoId,
  index,
  onClick,
}: {
  videoId: string;
  index: number;
  onClick: () => void;
}) => {
  const title = useYoutubeTitle(videoId);
  const [hovered, setHovered] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl"
      style={{
        animation: `fadeSlideUp 0.45s ease both`,
        animationDelay: `${index * 80}ms`,
      }}
    >
      <div
        className="relative overflow-hidden rounded-2xl border bg-card transition-all duration-300"
        style={{
          borderColor: hovered ? "hsl(var(--primary) / 0.4)" : "hsl(var(--border))",
          boxShadow: hovered
            ? "0 20px 40px -12px hsl(var(--primary) / 0.18), 0 0 0 1px hsl(var(--primary) / 0.12)"
            : "0 2px 8px hsl(0 0% 0% / 0.12)",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
        }}
      >
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-muted">
          {!loaded && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-muted via-accent to-muted" />
          )}
          <img
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt={title}
            onLoad={() => setLoaded(true)}
            onError={(e) => {
              const img = e.currentTarget;
              if (!img.src.includes("mqdefault"))
                img.src = `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
            }}
            className="h-full w-full object-cover transition-transform duration-500"
            style={{ transform: hovered ? "scale(1.06)" : "scale(1)" }}
          />

          {/* Gradient overlay */}
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              background: "linear-gradient(to top, hsl(var(--card) / 0.7) 0%, transparent 50%)",
              opacity: hovered ? 0.85 : 0.5,
            }}
          />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="flex items-center justify-center rounded-full transition-all duration-300"
              style={{
                width: hovered ? 52 : 44,
                height: hovered ? 52 : 44,
                background: "hsl(0 72% 51%)",
                boxShadow: hovered
                  ? "0 0 0 8px hsl(0 72% 51% / 0.2), 0 8px 24px hsl(0 72% 51% / 0.4)"
                  : "0 4px 16px hsl(0 72% 51% / 0.35)",
              }}
            >
              <Play
                className="fill-white text-white ml-0.5"
                style={{ width: hovered ? 18 : 15, height: hovered ? 18 : 15 }}
              />
            </div>
          </div>

          {/* Badge */}
          <div className="absolute top-2.5 right-2.5">
            <span className="rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
              YouTube
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-foreground">
            {title}
          </p>
          <div className="mt-2 flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-primary/60" />
            <span className="text-[11px] text-muted-foreground">SumoPod Tutorial</span>
          </div>
        </div>
      </div>
    </button>
  );
};

/* ── Modal ── */
const VideoModal = ({
  videoId,
  onClose,
}: {
  videoId: string;
  onClose: () => void;
}) => {
  const title = useYoutubeTitle(videoId);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "hsl(0 0% 0% / 0.82)",
        backdropFilter: "blur(6px)",
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        className="w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        style={{ animation: "scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}
      >
        <div className="aspect-video w-full bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="h-full w-full border-0"
          />
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-border px-5 py-3.5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Play className="h-3.5 w-3.5 fill-primary text-primary" />
            </div>
            <p className="truncate text-sm font-semibold text-foreground">{title}</p>
          </div>
          <button
            onClick={onClose}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Main page ── */
const Learn = () => {
  const [active, setActive] = useState<string | null>(null);

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.94); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div style={{ animation: "fadeSlideUp 0.35s ease both" }}>
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Learn</h1>
          </div>
          <p className="ml-12 text-sm text-muted-foreground">
            Expand your skills with webinars and online courses
          </p>
        </div>

        {/* Section header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-foreground">Video Tutorial</h2>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
              {videos.length}
            </span>
          </div>
          <a
            href="https://www.youtube.com/@sumopod"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            View All
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((v, i) => (
            <VideoCard
              key={v.id}
              videoId={v.id}
              index={i}
              onClick={() => setActive(v.id)}
            />
          ))}
        </div>
      </div>

      {active && (
        <VideoModal videoId={active} onClose={() => setActive(null)} />
      )}
    </>
  );
};

export default Learn;