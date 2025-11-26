import { useState, useEffect } from 'react';
import office1 from '@/assets/office-1.jpg';
import office2 from '@/assets/office-2.jpg';
import office3 from '@/assets/office-3.jpg';

const images = [office1, office2, office3];

const BackgroundCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image}
            alt={`Office ${index + 1}`}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-secondary/30" />
        </div>
      ))}
    </div>
  );
};

export default BackgroundCarousel;
