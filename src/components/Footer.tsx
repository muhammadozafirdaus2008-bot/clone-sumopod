import { Box, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-10 px-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mb-10">
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="flex items-center gap-2 font-bold text-2xl text-white mb-3">
              <Box className="w-7 h-7 text-blue-400" strokeWidth={1.5} />
             <span>
              <span className="text-black-500">Sumo</span><span className="text-blue-500">Pod</span>
            </span>
            </a>
            <p className="text-base leading-relaxed">
              SumoPod offers seamless container and application purchasing solutions for businesses of all sizes.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-base transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-base transition-colors">Get Started</a></li>
              <li><a href="/login" className="hover:base t-white transition-colors">Login</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4 text-lg">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Refund Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                support@sumopod.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                +62851-9005-2577
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-12">
          <p className="text-sm text-center">&copy; {new Date().getFullYear()} SumoPod. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}