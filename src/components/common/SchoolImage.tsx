import React, { useState } from 'react';
import { resolvePhotoSource, PhotoCategory, getPhotoUrl } from '../../utils/photoManager';
import { ImageOff, Loader2 } from 'lucide-react';

interface SchoolImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /**
   * Bisa berupa path lokal, ID dari katalog foto, atau URL online langsung
   */
  src?: string;
  /**
   * Atau gunakan kombinasi kategori dan nama file
   */
  category?: PhotoCategory;
  filename?: string;
  /**
   * URL cadangan opsional jika gambar utama tidak dapat dimuat
   */
  fallback?: string;
  /**
   * Label alt wajib untuk aksesibilitas dan SEO
   */
  alt: string;
  className?: string;
  /**
   * Tampilkan skeleton loader ketika gambar sedang memuat
   */
  showSkeleton?: boolean;
}

export const SchoolImage: React.FC<SchoolImageProps> = ({
  src,
  category,
  filename,
  fallback,
  alt,
  className = '',
  showSkeleton = true,
  ...rest
}) => {
  // Hitung initial source
  let initialSrc = '';
  if (category && filename) {
    initialSrc = getPhotoUrl(category, filename);
  } else if (src) {
    initialSrc = src;
  }

  const { src: resolvedSrc, fallback: defaultFallback } = resolvePhotoSource(
    initialSrc,
    fallback
  );

  const [currentSrc, setCurrentSrc] = useState<string>(resolvedSrc);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const handleError = () => {
    // Jika path lokal belum ada file fisiknya, otomatis pindah ke fallback online
    if (currentSrc !== defaultFallback && defaultFallback) {
      setCurrentSrc(defaultFallback);
    } else {
      setHasError(true);
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Skeleton Loading State */}
      {showSkeleton && !isLoaded && !hasError && (
        <div className="absolute inset-0 bg-slate-100 animate-pulse flex items-center justify-center text-slate-300">
          <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
        </div>
      )}

      {/* Fallback Error Placeholder jika keduanya gagal */}
      {hasError ? (
        <div className="w-full h-full min-h-[120px] bg-slate-100 border border-slate-200 rounded-lg flex flex-col items-center justify-center text-slate-400 p-4 text-center">
          <ImageOff className="w-6 h-6 mb-1 text-slate-400" />
          <span className="text-xs font-medium text-slate-500">Foto belum tersedia</span>
          <span className="text-[10px] text-slate-400 mt-0.5 max-w-[180px] truncate">{alt}</span>
        </div>
      ) : (
        <img
          src={currentSrc}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...rest}
        />
      )}
    </div>
  );
};
