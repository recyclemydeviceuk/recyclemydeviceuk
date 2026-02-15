import { Zap, Package, Shield, Leaf } from 'lucide-react';
import { useState } from 'react';

export default function WhySellWithUs() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
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
    <section className="py-8 sm:py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-10 md:mb-12 text-gray-800 px-4">
          Why Sell With Us?
        </h2>

        {/* Desktop Grid View */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6 lg:px-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isHighlighted = index === 1;
            
            return (
              <div
                key={index}
                className={`p-4 sm:p-5 md:p-6 rounded-xl text-center transition-all ${
                  isHighlighted
                    ? 'bg-green-50 border-2 border-primary shadow-lg'
                    : 'bg-white border border-gray-200 hover:shadow-md'
                }`}
              >
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full flex items-center justify-center ${
                    isHighlighted ? 'bg-primary' : 'bg-green-100'
                  }`}
                >
                  <Icon className={`w-7 h-7 sm:w-8 sm:h-8 ${isHighlighted ? 'text-white' : 'text-primary'}`} />
                </div>
                <h3 className="text-base sm:text-lg font-bold mb-1.5 sm:mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Mobile Slider View */}
        <div className="sm:hidden">
          <div 
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 px-4"
            onScroll={(e) => {
              const scrollLeft = e.currentTarget.scrollLeft;
              const slideWidth = e.currentTarget.offsetWidth;
              const newSlide = Math.round(scrollLeft / slideWidth);
              setCurrentSlide(newSlide);
            }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isHighlighted = index === 1;
              
              return (
                <div
                  key={index}
                  className="min-w-full snap-center"
                >
                  <div
                    className={`p-6 rounded-xl text-center transition-all mx-2 ${
                      isHighlighted
                        ? 'bg-green-50 border-2 border-primary shadow-lg'
                        : 'bg-white border border-gray-200'
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
                    <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Slider Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  const slider = document.querySelector('.overflow-x-auto') as HTMLElement;
                  if (slider) {
                    slider.scrollTo({
                      left: index * slider.offsetWidth,
                      behavior: 'smooth'
                    });
                  }
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide 
                    ? 'bg-primary w-6' 
                    : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
