import { useState } from "react";
import { X } from "lucide-react";

const videos = [
  { id: "HD13eq_Pmp8" },
  { id: "wRNinF7YQqQ" },
  { id: "lfmg-EJ8gm4" },
  { id: "6biMWgD6_JY" },
  { id: "CgkZ7MvWUAA" },
  { id: "bS9R6aCVEzw" },
];

const Learn = () => {
  const [active, setActive] = useState<{ id: string } | null>(null);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Learn</h1>
        <p className="text-sm text-muted-foreground">
          Expand your skills with webinars and online courses
        </p>
      </div>

      {/* Section */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Video Tutorial</h2>
        <a
          href="https://www.youtube.com/@sumopod"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 text-xs text-primary hover:opacity-75 transition-opacity"
        >
          View All Videos
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((v) => (
          <button
            key={v.id}
            onClick={() => setActive(v)}
            className="group overflow-hidden rounded-xl border border-border bg-card text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden bg-accent">
              <img
                src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                alt="thumbnail"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  const img = e.currentTarget;
                  if (!img.src.includes("mqdefault")) {
                    img.src = `https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`;
                  }
                }}
              />
              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/10">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-600 shadow-lg shadow-red-600/40 transition-transform duration-200 group-hover:scale-110">
                  <svg className="ml-0.5 h-4 w-4 fill-white" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
            {/* Title */}
            <div className="p-3">
              <YoutubeTitle videoId={v.id} />
            </div>
          </button>
        ))}
      </div>

      {/* Modal */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActive(null)}
        >
          <div
            className="w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${active.id}?autoplay=1`}
                allow="autoplay; fullscreen"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <YoutubeTitle videoId={active.id} className="text-sm font-semibold text-foreground" />
              <button
                onClick={() => setActive(null)}
                className="ml-4 flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" /> Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Fetch YouTube title via oEmbed
const YoutubeTitle = ({ videoId, className }: { videoId: string; className?: string }) => {
  const [title, setTitle] = useState<string>("Memuat...");

  useState(() => {
    fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`)
      .then((r) => r.json())
      .then((d) => setTitle(d.title))
      .catch(() => setTitle("Video Tutorial"));
  });

  return (
    <p className={className ?? "text-sm font-semibold text-foreground leading-snug line-clamp-2"}>
      {title}
    </p>
  );
};

export default Learn;