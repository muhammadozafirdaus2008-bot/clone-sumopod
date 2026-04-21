import { ShoppingBag, MousePointerClick, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

const features = [
  {
    icon: ShoppingBag,
    title: 'Container Marketplace',
    description:
      'Explore and purchase from our extensive container library, all verified and ready for instant deployment.',
  },
  {
    icon: MousePointerClick,
    title: 'One-Click Deployment',
    description:
      'Deploy containers to your infrastructure with one click, eliminating complex configuration processes.',
  },
  {
    icon: RefreshCw,
    title: 'Automatic Updates',
    description:
      'Keep your containers and applications up to date with automatic version updates and security patches.',
  },
];

// Hook: deteksi apakah parent SectionWrapper sedang visible
// Caranya: cek opacity parent via ResizeObserver / pakai prop drilling
// Solusi simpel: Features subscribe ke SectionVisibilityContext index=2
let _setFeaturesVisible: ((v: boolean) => void) | null = null;
export function triggerFeaturesVisible(v: boolean) {
  _setFeaturesVisible?.(v);
}

export default function Features() {
  const [sectionVisible, setSectionVisible] = useState(false);

  useEffect(() => {
    _setFeaturesVisible = setSectionVisible;
    return () => { _setFeaturesVisible = null; };
  }, []);

  return (
    <section
      id="features"
      className="relative min-h-screen flex flex-col justify-center py-24 px-6 bg-white overflow-hidden"
    >
      {/* Same grid as Hero */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full opacity-[0.06] blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #3b82f6 0%, transparent 70%)' }}
      />

      <div className="relative max-w-7xl mx-auto w-full">
        {/* Title */}
        <div
          className="text-center mb-14 transition-all duration-600 ease-out"
          style={{
            opacity: sectionVisible ? 1 : 0,
            transform: sectionVisible ? 'translateY(0)' : 'translateY(20px)',
            transitionDuration: '600ms',
          }}
        >
          <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full border border-gray-200 bg-white shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Features</span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Everything you need in one platform
          </h2>
          <p className="text-gray-400 text-base max-w-md mx-auto font-light leading-relaxed">
            SumoPod offers comprehensive solutions for container and application management
          </p>
        </div>

        {/* Cards grid — staggered pop-up */}
        <div id="templates" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="p-7 rounded-2xl border border-gray-100 bg-white shadow-sm hover:border-blue-100 hover:shadow-md hover:shadow-blue-50 transition-all duration-300 group"
                style={{
                  opacity: sectionVisible ? 1 : 0,
                  transform: sectionVisible ? 'translateY(0) scale(1)' : 'translateY(36px) scale(0.97)',
                  transition: `opacity 550ms ease-out ${150 + i * 120}ms, transform 550ms ease-out ${150 + i * 120}ms`,
                }}
              >
                <div className="w-11 h-11 rounded-xl bg-blue-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200">
                  <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-light">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');
      `}</style>
    </section>
  );
}