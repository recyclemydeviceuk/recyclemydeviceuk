import { Search, Zap } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener('mousemove', handleMouseMove);
      return () => section.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="bg-primary py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute w-96 h-96 bg-white rounded-full blur-3xl transition-all duration-300 ease-out"
          style={{
            left: `${mousePosition.x - 192}px`,
            top: `${mousePosition.y - 192}px`,
          }}
        />
      </div>
      
      {/* Digital Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${(i * 5 + mousePosition.x / 10) % 100}%`,
              top: `${(i * 7 + mousePosition.y / 10) % 100}%`,
              opacity: 0.3,
              animationDelay: `${i * 0.1}s`,
              transition: 'all 0.3s ease-out',
            }}
          />
        ))}
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Get the Best Price for Your Old Phone
            </h1>
            <p className="text-lg mb-8 text-white/90">
              Compare prices from trusted recyclers and get paid instantly. Free postage, fast payment, eco-friendly recycling.
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-full p-1.5 flex items-center shadow-lg mb-4">
              <input
                type="text"
                placeholder="Search e.g. iPhone 14, Samsung S23..."
                className="flex-1 px-6 py-3 outline-none text-gray-700 bg-transparent placeholder:text-gray-500"
              />
              <button className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors flex items-center space-x-2 whitespace-nowrap">
                <Search className="w-5 h-5" />
                <span>Search</span>
              </button>
            </div>

            <div className="text-sm text-white/80">
              or <Link to="/sell-your-phone" className="underline hover:text-white transition-colors">browse all phones</Link>
            </div>
          </div>

          {/* Right - Price Comparison Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-5 max-w-sm mx-auto lg:mx-0">
            {/* Fast Payment Badge */}
            <div className="flex items-center justify-center space-x-1.5 mb-3 bg-white border border-primary rounded-lg px-2.5 py-1.5 w-fit ml-auto">
              <Zap className="w-3.5 h-3.5 text-primary fill-primary" />
              <span className="text-xs font-semibold text-gray-800">Fast Payment</span>
            </div>

            <h3 className="text-base font-bold text-primary mb-2 text-center">
              COMPARE & GET TOP PRICE
            </h3>

            <div className="mb-3 text-center">
              <p className="text-xs text-gray-600">iPhone 16 Pro Max 256GB</p>
            </div>

            {/* Price Comparison */}
            <div className="space-y-2.5 mb-3">
              <div className="relative flex items-center justify-between p-3 border-2 border-primary rounded-xl bg-white">
                <div className="absolute -top-2.5 right-2 bg-primary text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  BEST PRICE
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-red-500 font-bold text-base">fone</div>
                  <div>
                    <p className="font-semibold text-xs text-gray-900">Sell Your Fone</p>
                    <p className="text-[10px] text-gray-500">Same day payment</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-primary">£820</div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                    <span className="text-blue-600 text-[10px] font-bold">CM</span>
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-gray-900">Cash My Mobile</p>
                    <p className="text-[10px] text-gray-500">1-2 day payment</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">£785</div>
              </div>
            </div>

            {/* Savings */}
            <div className="bg-pink-50 rounded-lg p-2.5 mb-3">
              <p className="text-xs font-semibold text-primary text-center">
                Save £35 by comparing sellers!
              </p>
            </div>

            {/* CTA Button */}
            <button className="w-full bg-primary text-white py-2.5 rounded-xl font-bold hover:bg-primary-dark transition-colors text-sm">
              Compare Prices Now →
            </button>

            {/* Free Postage Badge */}
            <div className="flex items-center justify-center mt-3 space-x-1.5">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="text-xs text-gray-600 font-medium">Free Postage</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
