import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-white pt-24 pb-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-1xl lg:text-8xl font-bold leading-[9.5] mb-11">
          <span className="text-blue-600">Deploy your App</span>
          <br />
          <span className="text-gray-900">in 15 Seconds!</span>
        </h1>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/register')}
            className="px-5 py-3 rounded-lg bg-blue-600 text-white font-semibold text-base hover:bg-blue-600 transition-all hover:shadow-lg hover:shadow-blue-200 active:scale-95"
          >
            Get Started
          </button>
          
           <a href="#templates"
            className="px-8 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold text-base hover:bg-gray-200 transition-all hover:shadow-lg active:scale-95">
            See App Templates
          </a>

        </div>
      </div>
    </section>
  );
}