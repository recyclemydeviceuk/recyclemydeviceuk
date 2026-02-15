import { ChevronRight, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deviceAPI } from '../services/api';

interface Device {
  _id: string;
  name: string;
  brand: {
    _id: string;
    name: string;
  };
  image: string;
  storageOptions?: string[];
}

interface PopularDevicesProps {
  brandName: string;
}

export default function PopularDevices({ brandName }: PopularDevicesProps) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        const response = await deviceAPI.getAllDevices({ brand: brandName });
        if (response.success && response.data) {
          setDevices(response.data.slice(0, 12)); // Max 12 devices
        }
      } catch (error) {
        console.error(`Error fetching ${brandName} devices:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, [brandName]);
  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (devices.length === 0) {
    return null; // Don't show section if no devices
  }

  return (
    <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Popular {brandName} Devices</h2>
          <button 
            onClick={() => navigate(`/sell-your-phone?brand=${encodeURIComponent(brandName)}`)}
            className="flex items-center space-x-1 text-primary hover:text-primary-dark text-sm sm:text-base font-semibold transition-colors whitespace-nowrap"
          >
            <span className="hidden sm:inline">View All</span>
            <span className="sm:hidden">All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {devices.map((device) => (
            <Link
              key={device._id}
              to={`/phone/${device._id}`}
              className="bg-white rounded-lg p-3 sm:p-4 hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-200 hover:border-primary block"
            >
              <div className="aspect-square bg-gray-100 rounded-lg mb-2 sm:mb-3 flex items-center justify-center">
                <img 
                  src={device.image || 'https://storage.googleapis.com/atomjuice-product-images/apple/iphone-16-pro/default.png'} 
                  alt={device.name} 
                  className="w-full h-full object-contain p-2 sm:p-4"
                  onError={(e) => {
                    e.currentTarget.src = 'https://storage.googleapis.com/atomjuice-product-images/apple/iphone-16-pro/default.png';
                  }}
                />
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-800 mb-1 text-center line-clamp-2 min-h-[2.5rem] sm:min-h-[2rem] flex items-center justify-center">
                {device.name}
              </h3>
              <p className="text-[10px] sm:text-xs text-primary text-center font-semibold">Get Quote</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
