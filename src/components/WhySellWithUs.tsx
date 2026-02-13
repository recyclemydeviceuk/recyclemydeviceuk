import { Zap, Package, Shield, Leaf } from 'lucide-react';

export default function WhySellWithUs() {
  const features = [
    {
      icon: Zap,
      title: 'Fast Payment',
      description: 'Get paid within 24 hours of your phone being received.',
    },
    {
      icon: Package,
      title: 'Free Postage',
      description: 'All our recyclers offer free postage with tracked delivery.',
    },
    {
      icon: Shield,
      title: 'Data Security',
      description: 'All data is securely wiped to industry standards.',
    },
    {
      icon: Leaf,
      title: 'Eco-Friendly',
      description: 'Help reduce e-waste and protect the environment.',
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Why Sell With Us?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isHighlighted = index === 1;
            
            return (
              <div
                key={index}
                className={`p-6 rounded-xl text-center transition-all ${
                  isHighlighted
                    ? 'bg-green-50 border-2 border-primary shadow-lg'
                    : 'bg-white border border-gray-200 hover:shadow-md'
                }`}
              >
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    isHighlighted ? 'bg-primary' : 'bg-green-100'
                  }`}
                >
                  <Icon className={`w-8 h-8 ${isHighlighted ? 'text-white' : 'text-primary'}`} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
