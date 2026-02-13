import Header from '../components/Header';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import PopularDevices from '../components/PopularDevices';
import WhySellWithUs from '../components/WhySellWithUs';
import Footer from '../components/Footer';

export default function Home() {
  const appleDevices = [
    { name: 'iPhone 16 Pro Max', price: '£850' },
    { name: 'iPhone 16 Pro', price: '£750' },
    { name: 'iPhone 16 Plus', price: '£650' },
    { name: 'iPhone 16', price: '£580' },
    { name: 'iPhone 15 Pro Max', price: '£720' },
    { name: 'iPhone 15 Pro', price: '£620' },
    { name: 'iPhone 15 Plus', price: '£520' },
    { name: 'iPhone 15', price: '£450' },
    { name: 'iPhone 14 Pro Max', price: '£580' },
    { name: 'iPhone 14 Pro', price: '£500' },
    { name: 'iPhone 14 Plus', price: '£420' },
    { name: 'iPhone 14', price: '£380' },
  ];

  const samsungDevices = [
    { name: 'Galaxy S24 Ultra', price: '£780' },
    { name: 'Galaxy S24+', price: '£600' },
    { name: 'Galaxy S24', price: '£480' },
    { name: 'Galaxy S23 Ultra', price: '£620' },
    { name: 'Galaxy S23+', price: '£480' },
    { name: 'Galaxy S23', price: '£400' },
    { name: 'Galaxy S22 Ultra', price: '£480' },
    { name: 'Galaxy S22+', price: '£380' },
    { name: 'Galaxy S22', price: '£320' },
    { name: 'Galaxy S21 Ultra', price: '£380' },
    { name: 'Galaxy S21+', price: '£300' },
    { name: 'Galaxy S21', price: '£260' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <HowItWorks />
      <PopularDevices title="Popular Apple Devices" devices={appleDevices} />
      <PopularDevices title="Popular Samsung Devices" devices={samsungDevices} />
      <WhySellWithUs />
      <Footer />
    </div>
  );
}
