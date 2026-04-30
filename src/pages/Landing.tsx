import { useEffect, useRef, useState, useCallback } from 'react';
import CTA from '../components/CTA';
import Features, { triggerFeaturesVisible } from '../components/Features';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar copy';
import Pricing from '../components/Pricing';

const SECTIONS = ['hero', 'pricing', 'features', 'cta-footer'];

export const SectionVisibilityContext = {
  listeners: {} as Record<number, (v: boolean) => void>,
  set(index: number, visible: boolean) {
    this.listeners[index]?.(visible);
    if (index === 2) triggerFeaturesVisible(visible);
  },
  register(index: number, fn: (v: boolean) => void) {
    this.listeners[index] = fn;
  },
};

const Landing = () => {
  const [current, setCurrent] = useState(0);
  const currentRef = useRef(0);
  const isAnimating = useRef(false);
  const wheelAccum = useRef(0);
  const wheelTimer = useRef<ReturnType<typeof setTimeout>>();
  const touchStartY = useRef(0);

  const goTo = useCallback((next: number) => {
    if (isAnimating.current) return;
    next = Math.max(0, Math.min(next, SECTIONS.length - 1));
    if (next === currentRef.current) return;
    isAnimating.current = true;
    SectionVisibilityContext.set(currentRef.current, false);
    setTimeout(() => {
      currentRef.current = next;
      setCurrent(next);
      setTimeout(() => SectionVisibilityContext.set(next, true), 50);
    }, 300);
    setTimeout(() => { isAnimating.current = false; }, 900);
  }, []);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      clearTimeout(wheelTimer.current);
      wheelAccum.current += e.deltaY;
      if (Math.abs(wheelAccum.current) >= 60) {
        const dir = wheelAccum.current > 0 ? 1 : -1;
        wheelAccum.current = 0;
        goTo(currentRef.current + dir);
      }
      wheelTimer.current = setTimeout(() => { wheelAccum.current = 0; }, 150);
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [goTo]);

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
    const onTouchEnd = (e: TouchEvent) => {
      const delta = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(delta) < 50) return;
      goTo(currentRef.current + (delta > 0 ? 1 : -1));
    };
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [goTo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') goTo(currentRef.current + 1);
      if (e.key === 'ArrowUp' || e.key === 'PageUp') goTo(currentRef.current - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo]);

  useEffect(() => {
    setTimeout(() => SectionVisibilityContext.set(0, true), 100);
  }, []);

  // Listen event dari Navbar untuk navigasi section
  useEffect(() => {
    const handler = (e: Event) => {
      const index = (e as CustomEvent<{ index: number }>).detail.index;
      goTo(index);
    };
    window.addEventListener('landing:goTo', handler);
    return () => window.removeEventListener('landing:goTo', handler);
  }, [goTo]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-white">
      <Navbar />

      {/* Dot navigator */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {SECTIONS.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} className="group flex items-center justify-end" aria-label={`Section ${i + 1}`}>
            <span className={`block rounded-full transition-all duration-300 ${
              i === current
                ? 'w-2.5 h-2.5 bg-blue-600 shadow-sm shadow-blue-300'
                : 'w-2 h-2 bg-gray-300 group-hover:bg-gray-400'
            }`} />
          </button>
        ))}
      </div>

      {/* Slide container */}
      <div
        className="w-full h-full transition-transform duration-[800ms] ease-[cubic-bezier(0.77,0,0.175,1)]"
        style={{ transform: `translateY(-${current * 100}%)` }}
      >
        {/* 0 — Hero */}
        <SectionWrapper index={0}>
          <Hero />
        </SectionWrapper>

        {/* 1 — Pricing */}
        <SectionWrapper index={1} center>
          <Pricing />
        </SectionWrapper>

        {/* 2 — Features */}
        <SectionWrapper index={2} center>
          <Features />
        </SectionWrapper>

        {/* 3 — CTA + Footer dalam 1 section */}
        <SectionWrapper index={3}>
          <div className="w-full h-full flex flex-col">
            {/* CTA: ambil sisa ruang, konten di tengah */}
            <div className="flex-1 flex items-center justify-center bg-white">
              <CTA />
            </div>
            {/* Footer: tinggi fixed di bawah */}
            <Footer />
          </div>
        </SectionWrapper>
      </div>
    </div>
  );
};

function SectionWrapper({
  index,
  children,
  center = false,
}: {
  index: number;
  children: React.ReactNode;
  center?: boolean;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    SectionVisibilityContext.register(index, setVisible);
  }, [index]);

  return (
    <div
      className={`w-full h-screen overflow-hidden transition-all duration-500 ease-out ${
        center ? 'flex items-center justify-center' : ''
      }`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
      }}
    >
      {children}
    </div>
  );
}

export default Landing;