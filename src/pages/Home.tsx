import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import PopularDevices from '../components/PopularDevices';
import WhySellWithUs from '../components/WhySellWithUs';
import Footer from '../components/Footer';
import { brandAPI } from '../services/api';

interface Brand {
  _id: string;
  name: string;
}

export default function Home() {
  const [topBrands, setTopBrands] = useState<string[]>([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await brandAPI.getAllBrands();
        if (response.success && response.data) {
          // Get top 4 brands
          const brandNames = response.data.slice(0, 4).map((brand: Brand) => brand.name);
          setTopBrands(brandNames);
        }
      } catch (error) {
        console.error('Error fetching brands:', error);
        // Fallback to default brands if API fails
        setTopBrands(['Apple', 'Samsung', 'Google', 'OnePlus']);
      }
    };

    fetchBrands();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <HowItWorks />
      {topBrands.map((brandName, index) => (
        <PopularDevices key={brandName} brandName={brandName} />
      ))}
      <WhySellWithUs />
      <Footer />
    </div>
  );
}
