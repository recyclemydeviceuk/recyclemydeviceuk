import { Search, BarChart3, Send, Wallet } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      icon: Search,
      title: 'Search for your phone',
      description: 'Find the device you\'re looking to recycle.',
    },
    {
      number: 2,
      icon: BarChart3,
      title: 'Choose an offer',
      description: 'Compare quotes and pick which recycler to sell to.',
    },
    {
      number: 3,
      icon: Send,
      title: 'Send your phone',
      description: 'Pop your phone in the post to your chosen recycler.',
    },
    {
      number: 4,
      icon: Wallet,
      title: 'Get paid!',
      description: 'Your phone is checked and payment is made.',
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
          Get an instant quote to recycle your phone in 4 easy steps!
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                    <Icon className="w-10 h-10 text-primary stroke-[2]" />
                  </div>
                  <div className="absolute top-0 right-0 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-base font-bold mb-2 text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
