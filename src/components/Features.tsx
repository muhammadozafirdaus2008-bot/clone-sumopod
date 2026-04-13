import { ShoppingBag, MousePointerClick, RefreshCw } from 'lucide-react';

const features = [
  {
    icon: ShoppingBag,
    title: 'Container Marketplace',
    description:
      'Explore and purchase from our extensive container library, all verified and ready for instant deployment.',
  },
  {
    icon: MousePointerClick,
    title: 'One-Click Deployment',
    description:
      'Deploy containers to your infrastructure with one click, eliminating complex configuration processes.',
  },
  {
    icon: RefreshCw,
    title: 'Automatic Updates',
    description:
      'Keep your containers and applications up to date with automatic version updates and security patches.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Everything you need in one platform
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            SumoPod offers comprehensive solutions for container and application management
          </p>
        </div>

        <div id="templates" className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="p-8 rounded-2xl border border-gray-100 bg-gray-50 hover:border-blue-100 hover:bg-blue-50/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
