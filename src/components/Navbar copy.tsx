import { Box, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
      scrolled ? 'shadow-md' : ''
    }`}>
      <div className="max-w-7xl mx-auto px-10 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900 hover:opacity-80 transition-opacity ">
            <Box className="w-7 h-7 text-blue-500" strokeWidth={1.5} />
            <span>
              <span className="text-black-500">Sumo</span><span className="text-blue-500">Pod</span>
            </span>
          </a>
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-blue-600 font-medium text-base hover:text-blue-600 transition-colors">Home</a>
            <a href="#templates" className="text-black-600 font-medium text-base hover:text-gray-900 transition-colors">Templates</a>
            <a href="#pricing" className="text-black-600 font-medium text-base hover:text-gray-900 transition-colors">Pricing</a>
            <a href="#features" className="text-black-600 font-medium text-base hover:text-gray-900 transition-colors">Features</a>
          </div>
        </div>
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
