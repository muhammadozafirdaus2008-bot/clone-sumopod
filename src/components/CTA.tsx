import { useNavigate } from 'react-router-dom';

export default function CTA() {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-5xl mx-auto px-6">
      <div className="relative overflow-hidden bg-blue-600 rounded-2xl px-10 py-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-blue-200">
        {/* Subtle inner grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        {/* Glow */}
        <div
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #fff 0%, transparent 70%)' }}
        />

        <div className="relative">
          <p className="text-blue-200 text-xs font-semibold tracking-widest uppercase mb-2">Get Started Today</p>
          <h2
            className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Ready to transform your<br className="hidden md:block" /> container management?
          </h2>
          <p className="text-blue-100 text-sm max-w-md font-light leading-relaxed">
            Join thousands of businesses using SumoPod to simplify their container and application infrastructure.
          </p>
        </div>

        <div className="relative flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <a
            href="#templates"
            className="px-6 py-2.5 rounded-xl bg-white text-blue-600 font-semibold text-sm hover:bg-blue-50 transition-all active:scale-95 shadow-sm"
          >
            See App Templates
          </a>
          <button
            onClick={() => navigate('/register')}
            className="px-6 py-2.5 rounded-xl border-2 border-white/60 text-white font-semibold text-sm hover:bg-white/10 transition-all active:scale-95"
          >
            Get Started
          </button>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');
      `}</style>
    </div>
  );
}