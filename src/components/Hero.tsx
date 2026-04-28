import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const LINES = [
  { text: 'Deploy your App', color: 'text-blue-600' },
  { text: 'in 15 Seconds!', color: 'text-gray-900' },
];

const TYPING_SPEED = 60;
const DELETING_SPEED = 30;
const PAUSE_AFTER_TYPED = 15000;
const PAUSE_BETWEEN_LINES = 120;
const PAUSE_AFTER_DELETED = 600;

export default function Hero() {
  const navigate = useNavigate();

  const [displayed, setDisplayed] = useState(['', '']);
  const [currentLine, setCurrentLine] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'deleting'>('typing');

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === 'typing') {
      const line = LINES[currentLine];
      const current = displayed[currentLine];

      if (current.length < line.text.length) {
        timeout = setTimeout(() => {
          setDisplayed(prev => {
            const next = [...prev];
            next[currentLine] = line.text.slice(0, current.length + 1);
            return next;
          });
        }, TYPING_SPEED);
      } else if (currentLine < LINES.length - 1) {
        timeout = setTimeout(() => setCurrentLine(c => c + 1), PAUSE_BETWEEN_LINES);
      } else {
        // Semua selesai diketik, pause 15 detik lalu hapus
        timeout = setTimeout(() => setPhase('deleting'), PAUSE_AFTER_TYPED);
      }
    } else if (phase === 'deleting') {
      const current = displayed[currentLine];

      if (current.length > 0) {
        timeout = setTimeout(() => {
          setDisplayed(prev => {
            const next = [...prev];
            next[currentLine] = current.slice(0, -1);
            return next;
          });
        }, DELETING_SPEED);
      } else if (currentLine > 0) {
        timeout = setTimeout(() => setCurrentLine(c => c - 1), PAUSE_BETWEEN_LINES);
      } else {
        // Semuanya terhapus, mulai lagi
        timeout = setTimeout(() => {
          setDisplayed(['', '']);
          setCurrentLine(0);
          setPhase('typing');
        }, PAUSE_AFTER_DELETED);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayed, currentLine, phase]);

  const isDone = phase === 'typing' && currentLine === LINES.length - 1 && displayed[LINES.length - 1] === LINES[LINES.length - 1].text;

  return (
   <section className="relative min-h-screen flex flex-col items-center justify-start pt-32 text-center px-6 bg-white overflow-hidden">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />
      {/* Blue glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full opacity-[0.08] blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #3b82f6 0%, transparent 70%)' }}
      />

      <div className="relative max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-gray-200 bg-white shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Cloud Deployment Platform</span>
        </div>

        {/* Heading - kedua baris ikut typing */}
        <h1 className="hero-heading text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.15] mb-10 tracking-tight">
          {/* Baris 1 */}
          <span className="block text-blue-600" style={{ minHeight: '1.15em' }}>
            {displayed[0]}
            {currentLine === 0 && (
              <span className="cursor bg-blue-500" />
            )}
          </span>
          {/* Baris 2 */}
          <span className="block text-gray-900" style={{ minHeight: '1.15em' }}>
            {displayed[1]}
            {currentLine === 1 && (
              <span className="cursor bg-gray-900" />
            )}
            {/* Cursor tetap berkedip di baris 2 saat fase pause (semua sudah diketik) */}
            {isDone && (
              <span className="cursor bg-gray-900" />
            )}
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed font-light">
          From code to live in seconds. No DevOps expertise needed —&nbsp;
          just click, ship, use.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-base transition-all duration-200 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 active:scale-95"
          >
            Get Started → 
          </button>
          <a
            href="#templates"
            className="px-8 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold text-base hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 active:scale-95 shadow-sm"
          >
            See App Templates →
          </a>
        </div>

        {/* Social proof */}
        <p className="mt-10 text-sm text-gray-400 tracking-wide">
          Trusted by <span className="text-gray-700 font-semibold">1</span> developers worldwide
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&display=swap');

        .hero-heading {
          font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .cursor {
          display: inline-block;
          width: 3px;
          height: 0.82em;
          margin-left: 4px;
          vertical-align: middle;
          border-radius: 1px;
          animation: blink 0.65s step-end infinite;
        }
      `}</style>
    </section>
  );
}