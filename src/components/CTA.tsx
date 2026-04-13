import { useNavigate } from 'react-router-dom';

export default function CTA() {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="bg-blue-500 rounded-2xl px-10 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
              Ready to transform your container management?
            </h2>
            <p className="text-blue-100 text-sm max-w-lg">
              Join thousands of businesses using SumoPod to simplify their container and application infrastructure.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
           
              <a href="#templates"
              className="px-6 py-2.5 rounded-lg bg-white text-blue-500 font-semibold text-sm hover:bg-blue-50 transition-all">
            
              See App Templates
            </a>
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-2.5 rounded-lg border-2 border-white text-white font-semibold text-sm hover:bg-white/10 transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}