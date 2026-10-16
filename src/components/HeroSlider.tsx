import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Award,
} from 'lucide-react';
import { heroSlides } from '../data/schoolData';

interface HeroSliderProps {
  onNavigate: (sectionId: string, subTarget?: string) => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <section className="relative min-h-[500px] sm:min-h-[560px] lg:min-h-[600px] py-14 sm:py-20 flex items-center bg-[#00173d] overflow-hidden">
      {/* Background Slides */}
      {heroSlides.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
            }`}
          >
            {/* Background with Dark Navy Gradient Overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[8000ms] ease-out scale-105"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(0, 20, 56, 0.94) 0%, rgba(0, 32, 92, 0.84) 50%, rgba(0, 16, 44, 0.74) 100%), url(${slide.bgImage})`,
              }}
            />
          </div>
        );
      })}

      {/* Hero Content Layer */}
      <div className="relative z-20 w-full max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="max-w-[760px] text-white">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FFB800] text-xs font-bold tracking-wider uppercase mb-4 shadow-xs">
            <Award className="w-3.5 h-3.5" />
            <span>{heroSlides[currentSlide].badge}</span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4 font-heading text-white">
            {heroSlides[currentSlide].headline}
          </h1>

          {/* Subheadline */}
          <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-7 max-w-[640px] font-normal leading-relaxed">
            {heroSlides[currentSlide].subheadline}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate(heroSlides[currentSlide].primaryCta.link.replace('#', ''))}
              className="inline-flex items-center gap-2 bg-[#FFB800] hover:bg-[#e6a600] text-[#002260] px-6 py-3 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-102 cursor-pointer font-heading"
            >
              <span>{heroSlides[currentSlide].primaryCta.text}</span>
              <ArrowRight className="w-4 h-4 text-[#002260]" />
            </button>

            <button
              onClick={() => onNavigate(heroSlides[currentSlide].secondaryCta.link.replace('#', ''))}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold backdrop-blur-xs transition-all hover:scale-102 cursor-pointer font-heading"
            >
              <span>{heroSlides[currentSlide].secondaryCta.text}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Slider Controls */}
      <button
        onClick={prevSlide}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
        className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/35 hover:bg-[#FFB800] text-white hover:text-[#002260] flex items-center justify-center transition-all backdrop-blur-xs cursor-pointer"
        aria-label="Slide sebelumnya"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
        className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/35 hover:bg-[#FFB800] text-white hover:text-[#002260] flex items-center justify-center transition-all backdrop-blur-xs cursor-pointer"
        aria-label="Slide berikutnya"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Hero Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
              i === currentSlide ? 'w-8 bg-[#FFB800]' : 'w-2 bg-white/40 hover:bg-white'
            }`}
            aria-label={`Pindah ke slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
