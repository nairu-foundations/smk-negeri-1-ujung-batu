import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface PosterItem {
  id: string;
  image: string;
  fallbackUrl?: string;
  alt: string;
}

interface PosterHeroSectionProps {
  onNavigate?: (page: string, sub?: string) => void;
  className?: string;
  customPosters?: PosterItem[];
}

export const defaultPosters: PosterItem[] = [
  {
    id: 'poster-ppdb-2026',
    image: '/images/poster/poster3.jpg',
    fallbackUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200',
    alt: 'Poster Resmi PPDB SMK Negeri 1 Ujung Batu T.A 2026/2027',
  },
  {
    id: 'poster-prestasi-lks',
    image: '/images/poster/poster2.jpg',
    fallbackUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200',
    alt: 'Poster Prestasi Juara LKS Vokasi Otomotif',
  },
  {
    id: 'poster-tefa-industri',
    image: '/images/poster/poster1.jpg',
    fallbackUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=1200',
    alt: 'Poster Teaching Factory & Kemitraan Industri DU/DI',
  },
  {
    id: 'poster-tkj-fiberoptic',
    image: '/images/poster/poster4.jpg',
    fallbackUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200',
    alt: 'Poster Jurusan Teknik Komputer & Jaringan Fiber Optik',
  },
];

export const PosterHeroSection: React.FC<PosterHeroSectionProps> = ({
  className = '',
  customPosters,
}) => {
  const posters = customPosters && customPosters.length > 0 ? customPosters : defaultPosters;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Fungsi pindah slide otomatis (Autoplay setiap 4 detik)
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % posters.length);
  }, [posters.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + posters.length) % posters.length);
  }, [posters.length]);

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovered, nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 40) {
      nextSlide();
    } else if (diff < -40) {
      prevSlide();
    }
    setTouchStartX(null);
  };

  return (
    <section className={`py-4 sm:py-6 bg-slate-50/70 ${className}`}>
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div
          className="relative w-full h-[300px] sm:h-[360px] md:h-[400px] lg:h-[440px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-slate-200/90 bg-slate-900 group select-none"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* ANTIMASI TRANSISI FRAMER MOTION */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={posters[currentIndex].id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0 w-full h-full"
            >
              {/* Ambient Blurred Background */}
              <div
                className="absolute inset-0 bg-cover bg-center filter blur-xl scale-110 opacity-30 brightness-75"
                style={{ backgroundImage: `url(${posters[currentIndex].image})` }}
              />

              {/* Foto Utama Poster */}
              <img
                src={posters[currentIndex].image}
                alt={posters[currentIndex].alt}
                draggable={false}
                onError={(e) => {
                  if (posters[currentIndex].fallbackUrl && e.currentTarget.src !== posters[currentIndex].fallbackUrl) {
                    e.currentTarget.src = posters[currentIndex].fallbackUrl;
                  }
                }}
                className="relative z-10 w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* NAVIGASI PANAH */}
          <button
            onClick={prevSlide}
            aria-label="Poster Sebelumnya"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-white text-white hover:text-slate-900 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer shadow-md active:scale-90"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={nextSlide}
            aria-label="Poster Selanjutnya"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-white text-white hover:text-slate-900 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer shadow-md active:scale-90"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* INDIKATOR TITIK */}
          <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/35 backdrop-blur-md">
            {posters.map((_, i) => {
              const isActive = i === currentIndex;
              return (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Lihat poster ke-${i + 1}`}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'w-6 h-1.5 bg-[#FFB800] shadow-xs'
                      : 'w-1.5 h-1.5 bg-white/50 hover:bg-white'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};