import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1593640495253-23196b27a87f?auto=format&fit=crop&w=1200&q=80',
    title: 'Next‑Gen Laptops',
    subtitle: 'Power through work & play',
    link: '/catalog?category=Laptops',
  },
  {
    image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1200&q=80',
    title: 'Build Your Dream PC',
    subtitle: 'Custom components starting at ₦25,000',
    link: '/catalog?category=Components',
  },
  {
    image: 'https://images.unsplash.com/photo-1588200908342-23b585c03e16?auto=format&fit=crop&w=1200&q=80',
    title: 'Gaming Peripherals',
    subtitle: 'Unleash your true potential',
    link: '/catalog?category=Accessories',
  },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const length = slides.length;

  const nextSlide = () => setCurrent(current === length - 1 ? 0 : current + 1);
  const prevSlide = () => setCurrent(current === 0 ? length - 1 : current - 1);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [current]);

  return (
    <div className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden bg-gray-900">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center px-4">
            <h2 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h2>
            <p className="text-lg md:text-2xl mb-8">{slide.subtitle}</p>
            <Link
              to={slide.link}
              className="bg-brand-500 hover:bg-brand-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition"
            >
              Shop Now
            </Link>
          </div>
        </div>
      ))}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition"
      >
        <FiChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition"
      >
        <FiChevronRight size={24} />
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full ${
              idx === current ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;