import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth-client";
import { useAuth } from "@/components/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Box, Eye, EyeOff } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Asep",
    role: "Developer",
    quote: "SumoPod makes deploying automation tools as easy as clicking a button. We went from hours of setup to live in under a minute.",
  },
  {
    name: "Alessandro Fabian",
    role: "Software Engineer",
    quote: "Dengan SumoPod, saya bisa deploy aplikasi dalam hitungan detik. Tidak perlu lagi khawatir soal konfigurasi server yang rumit.",
  },
  {
    name: "Dario Cipriano",
    role: "DevOps Engineer",
    quote: "Platform terbaik untuk deployment container. Simple, cepat, dan reliable. SumoPod benar-benar mengubah cara saya bekerja.",
  },
  {
    name: "Ucok Markocop",
    role: "Full Stack Developer",
    quote: "SumoPod itu gampang banget dipakenya. Dari yang tadinya bingung deploy, sekarang bisa sambil ngopi pun beres.",
  },
  {
    name: "Muhammad Ghozali Firdaus",
    role: "Founder, SumoPod",
    quote: "Saya membangun SumoPod karena ingin semua orang bisa menikmati teknologi automation tanpa hambatan teknis.",
  },
  {
    name: "Cristiano Ronaldo",
    role: "Pesepak Bola Profesional",
    quote: "\"Siuuu!\" — Bahkan saya pun kagum. SumoPod se-efisien tendangan bebas saya. Deploy dalam detik, tanpa kompromi.",
  },
  {
    name: "Luka Dončić",
    role: "Pesepak Bola Profesional",
    quote: "\"Wow, unbelievable!\" — SumoPod adalah assist terbaik yang pernah saya terima. Dari setup ke live, secepat fast break saya.",
  },
  {
    name: "Mario Mandžukić",
    role: "Pesepak Bola Profesional",
    quote: "Di lapangan maupun di cloud, saya selalu all-in. SumoPod memberi saya kepercayaan diri yang sama seperti saat mencetak gol di final.",
  },
  {
    name: "Christopher Nkunku",
    role: "Pesepak Bola Profesional",
    quote: "Kecepatan dan presisi — itulah gaya bermain saya, dan itulah yang SumoPod berikan. Deploy kilat, zero error.",
  },
  {
    name: "Dennis Ritchie",
    role: "Pionir Bahasa C & Unix",
    quote: "If I were alive today, I'd use SumoPod. Simplicity is the soul of great software — and this platform embodies that perfectly.",
  },
  {
    name: "Anders Hejlsberg",
    role: "Creator of C# & TypeScript",
    quote: "Type safety in code, reliability in deployment. SumoPod brings the same rigor to infrastructure that TypeScript brings to development.",
  },
  {
    name: "Charles Babbage",
    role: "Bapak Komputer Modern",
    quote: "Had I imagined a machine this capable, I would have dreamed bigger. SumoPod turns complex computations into child's play.",
  },
  {
    name: "Ada Lovelace",
    role: "Programmer Pertama di Dunia",
    quote: "The engine I envisioned could compute anything — SumoPod proves that vision. Automation made elegant, powerful, and accessible.",
  },
  {
    name: "Alan Turing",
    role: "Bapak Ilmu Komputer",
    quote: "Can machines deploy themselves? With SumoPod, the answer is nearly yes. A testament to what intelligence — artificial or otherwise — can achieve.",
  },
];

const Login = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "facebook" | null>(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length);
        setFade(true);
      }, 400);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!loading && user) return <Navigate to="/learn" replace />;

  const t = TESTIMONIALS[testimonialIndex];
  const initials = t.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitting(true);
  const { error, data } = await authClient.signIn.email({ email, password });
  console.log("signIn result:", { error, data });

  const session = await authClient.getSession();
  console.log("session after login:", session);

  setSubmitting(false);
  if (error) {
    toast({ title: "Login failed", description: error.message, variant: "destructive" });
    return;
  }
  window.location.href = "/learn";
};

  const handleOAuth = async (provider: "google" | "facebook") => {
    setOauthLoading(provider);
    await authClient.signIn.social({
      provider,
      callbackURL: window.location.origin + "/learn",
    });
    setOauthLoading(null);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 flex-col justify-between p-12">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Box className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-lg">
            Sumo<span className="text-blue-400">Pod</span>
          </span>
        </div>

        {/* Rotating testimonial */}
        <div
          className="transition-all duration-400 ease-in-out"
          style={{ opacity: fade ? 1 : 0, transform: fade ? "translateY(0)" : "translateY(8px)" }}
        >
          <blockquote className="text-gray-300 text-lg leading-relaxed mb-6">
            "{t.quote}"
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
              {initials}
            </div>
            <div>
              <p className="text-white text-sm font-medium">{t.name}</p>
              <p className="text-gray-500 text-xs">{t.role}</p>
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex gap-1.5 mt-6">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => { setFade(false); setTimeout(() => { setTestimonialIndex(i); setFade(true); }, 400); }}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === testimonialIndex ? "w-6 bg-blue-500" : "w-1.5 bg-gray-700"
                }`}
              />
            ))}
          </div>
        </div>

        <p className="text-gray-600 text-xs">&copy; {new Date().getFullYear()} SumoPod. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <Box className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-gray-900">Sumo<span className="text-blue-600">Pod</span></span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-sm text-gray-500 mb-8">Sign in to your account to continue</p>

          {/* OAuth */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleOAuth("google")}
              disabled={!!oauthLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 shadow-sm disabled:opacity-60"
            >
              {oauthLoading === "google" ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" />
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              Continue with Google
            </button>

            <button
              onClick={() => handleOAuth("facebook")}
              disabled={!!oauthLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 shadow-sm disabled:opacity-60"
            >
              {oauthLoading === "facebook" ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              )}
              Continue with Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gray-50 px-3 text-xs text-gray-400 uppercase tracking-wider">or</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-xs text-blue-600 hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={submitting}
              className="w-full py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 mt-2">
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 font-medium hover:underline">Sign up</Link>
          </p>
          <p className="mt-4 text-center text-xs text-gray-400 leading-relaxed">
            By continuing, you agree to SumoPod's{" "}
            <a href="#" className="underline">Terms of Service</a> and{" "}
            <a href="#" className="underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;