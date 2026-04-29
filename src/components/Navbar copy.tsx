import { Box, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

// Deskripsi popup untuk tiap nav item
const NAV_ITEMS = [
  {
    label: 'Home',
    href: '/',
    active: true,
    popup: 'Kembali ke halaman utama',
  },
  {
    label: 'Templates',
    href: '/templates',
    active: false,
    popup: 'Lihat semua template app siap pakai',
  },
  {
    label: 'Pricing',
    href: '#pricing',
    active: false,
    popup: 'Cek paket harga yang sesuai kebutuhanmu',
  },
  {
    label: 'Features',
    href: '#features',
    active: false,
    popup: 'Fitur-fitur unggulan SumoPod',
  },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-10 h-16 flex items-center justify-between">
        {/* Logo + Nav Links */}
        <div className="flex items-center gap-8">
          <a
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-gray-900 hover:opacity-80 transition-opacity"
          >
            <Box className="w-7 h-7 text-blue-500" strokeWidth={1.5} />
            <span>
              <span className="text-black">Sumo</span>
              <span className="text-blue-500">Pod</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item, i) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <a
                  href={item.href}
                  onClick={item.href.startsWith('/') && !item.href.startsWith('/#') ? (e) => { e.preventDefault(); navigate(item.href); } : undefined}
                  className={`font-medium text-base transition-colors ${
                    item.active
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </a>

                {/* Popup tooltip */}
                <div
                  className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50 transition-all duration-200 ${
                    hoveredIndex === i
                      ? 'opacity-100 translate-y-0 pointer-events-auto'
                      : 'opacity-0 -translate-y-1 pointer-events-none'
                  }`}
                >
                  {/* Panah segitiga */}
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 rotate-45 rounded-sm" />
                  {/* Konten popup */}
                  <div className="relative bg-gray-900 text-white text-xs font-medium px-3 py-2 rounded-lg whitespace-nowrap shadow-xl">
                    {item.popup}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-5 py-2.5 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}