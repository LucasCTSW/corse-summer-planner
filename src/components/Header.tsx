
import { useEffect, useState } from 'react';
import { formatCountdown, getRemainingTime } from '@/lib/logic';
import { TRIP_DATE } from '@/lib/data';

const Header = () => {
  const [countdown, setCountdown] = useState(getRemainingTime());
  
  // Simulate weather - fixed value as per requirements
  const weather = { temp: '25°C', condition: 'Nuageux' };
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getRemainingTime());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <header className="bg-gradient-to-r from-corsica-blue to-corsica-light-blue text-white py-4 px-4 sm:px-6 wave-bg sticky top-0 z-10">
      <div className="container mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">
          Voyage en Corse 🏝️
        </h1>
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 text-sm md:text-base mb-2 md:mb-0">
            <span className="font-medium">Porto-Vecchio:</span>
            <span>{weather.temp}</span>
            <span>{weather.condition}</span>
          </div>
          
          <div className="text-sm md:text-base font-mono bg-black/20 rounded-full px-3 py-1">
            <span className="font-medium">Départ: </span>
            <span>{formatCountdown(countdown)}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
