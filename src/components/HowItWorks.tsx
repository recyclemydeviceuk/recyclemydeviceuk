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
    <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-3 sm:mb-4 text-gray-900 px-2">
          Get an instant quote to recycle your phone in 4 easy steps!
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mt-8 sm:mt-10 md:mt-12">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="text-center">
                <div className="relative inline-block mb-4 sm:mb-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                    <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary stroke-[2]" />
                  </div>
                  <div className="absolute top-0 right-0 w-6 h-6 sm:w-7 sm:h-7 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-sm sm:text-base font-bold mb-1.5 sm:mb-2 text-gray-900 px-2">{step.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed px-2">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
