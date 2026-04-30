import { Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const features = [
  'Unlimited container deployments',
  'One-click deployment',
  'Automatic updates & security patches',
  'Container marketplace access',
  'Real-time monitoring',
  'Community support',
];

export default function Pricing() {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [cardVisible, setCardVisible] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    const makeObserver = (
      ref: React.RefObject<HTMLDivElement>,
      setter: (v: boolean) => void
    ) => {
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { setter(true); obs.disconnect(); } },
        { threshold: 0.2 }
      );
      if (ref.current) obs.observe(ref.current);
      return obs;
    };
    const o1 = makeObserver(titleRef, setTitleVisible);
    const o2 = makeObserver(cardRef, setCardVisible);
    return () => { o1.disconnect(); o2.disconnect(); };
  }, []);

  return (
    <section id="pricing" className="relative py-20 px-6 bg-white overflow-hidden">
      {/* Grid bg */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
        backgroundSize: '64px 64px',
      }} />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] rounded-full opacity-[0.06] blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #3b82f6 0%, transparent 70%)' }} />

      <div className="relative max-w-7xl mx-auto">
        {/* Title */}
        <div ref={titleRef} className="text-center mb-10 transition-all duration-700"
          style={{ opacity: titleVisible ? 1 : 0, transform: titleVisible ? 'translateY(0)' : 'translateY(24px)' }}>
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-gray-200 bg-white shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Pricing</span>
          </div>
          <h2 className="pricing-heading text-4xl md:text-5xl font-bold text-gray-900 mb-2 tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-400 text-sm max-w-sm mx-auto font-light leading-relaxed">
            Get started with SumoPod today and experience the power of container management
          </p>
        </div>

        {/* Card */}
        <div className="flex justify-center">
          <div ref={cardRef}
            className="relative bg-white rounded-2xl border border-gray-100 shadow-md p-5 w-full max-w-[300px] transition-all duration-700"
            style={{ opacity: cardVisible ? 1 : 0, transform: cardVisible ? 'translateY(0) scale(1)' : 'translateY(36px) scale(0.97)' }}>

            <div className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at top, rgba(59,130,246,0.04) 0%, transparent 70%)' }} />

            <div className="relative">
              <span className="inline-block text-xs font-semibold text-blue-500 bg-blue-50 px-2.5 py-0.5 rounded-full mb-3 tracking-wide">
                Start Today
              </span>
              <div className="mb-0.5">
                <span className="pricing-heading text-3xl font-bold text-gray-900">FREE</span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed mb-3 font-light">
                All the features you need to manage containers and applications effectively
              </p>

              <div className="border-t border-gray-100 mb-3" />

              <ul className="space-y-1.5 mb-5">
                {features.map((feature, i) => (
                  <li key={feature} className="flex items-center gap-2 text-gray-600 text-xs transition-all duration-500"
                    style={{ opacity: cardVisible ? 1 : 0, transform: cardVisible ? 'translateX(0)' : 'translateX(-10px)', transitionDelay: cardVisible ? `${280 + i * 55}ms` : '0ms' }}>
                    <span className="flex-shrink-0 w-3.5 h-3.5 rounded-full bg-blue-50 flex items-center justify-center">
                      <Check className="w-2 h-2 text-blue-500" strokeWidth={3} />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-1.5">
                <button onClick={() => navigate('/register')} className="w-full py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs text-center hover:bg-blue-700 transition-all hover:shadow-md hover:shadow-blue-200 active:scale-95">
                  Get Started
                </button>
                <button onClick={() => navigate('/templates')} className="w-full py-2 rounded-xl border border-gray-200 bg-white text-gray-600 font-semibold text-xs text-center hover:bg-gray-50 transition-all active:scale-95">
                  See App Templates
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');
        .pricing-heading { font-family: 'Playfair Display', Georgia, serif; }
      `}</style>
    </section>
  );
}