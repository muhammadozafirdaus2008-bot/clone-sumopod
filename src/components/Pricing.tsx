import { Check } from 'lucide-react';

const features = [
  'Unlimited container deployments',
  'One-click deployment',
  'Automatic updates & security patches',
  'Container marketplace access',
  'Real-time monitoring',
  'Community support',
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Get started with SumoPod today and experience the power of container management
          </p>
        </div>

        <div className="flex justify-center">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 max-w-md w-full hover:shadow-md transition-shadow">
            <div className="mb-6">
              <span className="inline-block text-sm font-semibold text-blue-500 bg-blue-50 px-3 py-1 rounded-full mb-4">
                Start Today
              </span>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-5xl font-extrabold text-gray-900">FREE</span>
              </div>
              <p className="text-gray-500 text-sm">
                All the features you need to manage containers and applications effectively
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-gray-700 text-sm">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center">
                    <Check className="w-3 h-3 text-blue-500" strokeWidth={2.5} />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3">
              <a
                href="#"
                className="w-full py-3 rounded-lg bg-blue-500 text-white font-semibold text-sm text-center hover:bg-blue-600 transition-all hover:shadow-lg hover:shadow-blue-200 active:scale-95"
              >
                Get Started
              </a>
              <a
                href="#templates"
                className="w-full py-3 rounded-lg bg-gray-100 text-gray-700 font-semibold text-sm text-center hover:bg-gray-200 transition-all active:scale-95"
              >
                See App Templates
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
