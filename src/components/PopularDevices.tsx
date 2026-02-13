import { ChevronRight } from 'lucide-react';

interface Device {
  name: string;
  price: string;
  image?: string;
}

interface PopularDevicesProps {
  title: string;
  devices: Device[];
}

export default function PopularDevices({ title, devices }: PopularDevicesProps) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button className="flex items-center space-x-1 text-primary hover:text-primary-dark font-semibold">
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {devices.map((device, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-4 hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-200 hover:border-primary"
            >
              <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                {device.image ? (
                  <img src={device.image} alt={device.name} className="w-full h-full object-contain p-4" />
                ) : (
                  <div className="w-20 h-28 bg-gray-300 rounded-lg"></div>
                )}
              </div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1 text-center line-clamp-2">
                {device.name}
              </h3>
              <p className="text-xs text-gray-500 text-center mb-2">up to {device.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
