import React, { useState } from 'react';

interface SchoolLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  alt?: string;
  withContainer?: boolean;
}

const SIZE_MAP = {
  xs: 'w-7 h-7',
  sm: 'w-9 h-9',
  md: 'w-11 h-11',
  lg: 'w-14 h-14',
  xl: 'w-20 h-20',
};

// Urutan pencarian file logo yang dibuat oleh pengguna di folder public/images/logo/
const LOGO_SOURCES = [
  '/images/logo/logo%20smkn1.png',
  '/images/logo/logo-smkn1.png',
  '/images/logo/logo.png',
  '/favicon.png',
];

/**
 * Komponen Logo Resmi SMK Negeri 1 Ujung Batu
 * Menampilkan file logo yang diunggah pengguna di public/images/logo/
 */
export const SchoolLogo: React.FC<SchoolLogoProps> = ({
  className = '',
  size,
  alt = 'Logo SMK Negeri 1 Ujung Batu',
  withContainer = false,
}) => {
  const [sourceIndex, setSourceIndex] = useState(0);
  const [allFailed, setAllFailed] = useState(false);

  const dimensionClass = size ? SIZE_MAP[size] : '';
  const finalClass = `${dimensionClass} ${className}`.trim();

  const handleImageError = () => {
    if (sourceIndex < LOGO_SOURCES.length - 1) {
      setSourceIndex((prev) => prev + 1);
    } else {
      setAllFailed(true);
    }
  };

  // Jika salah satu file gambar logo berhasil dimuat
  if (!allFailed) {
    const currentSrc = LOGO_SOURCES[sourceIndex];
    const imgElement = (
      <img
        src={currentSrc}
        alt={alt}
        className={`object-contain transition-transform duration-200 select-none ${finalClass || 'w-10 h-10'}`}
        onError={handleImageError}
        loading="eager"
        decoding="sync"
      />
    );

    if (withContainer) {
      return (
        <div className="p-1 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 shadow-xs flex items-center justify-center flex-shrink-0">
          {imgElement}
        </div>
      );
    }

    return imgElement;
  }

  // Fallback cadangan jika seluruh path gambar gagal
  const fallbackBadge = (
    <div
      className={`rounded-lg bg-[#003087] text-[#FFB800] border-2 border-[#FFB800] flex items-center justify-center font-bold text-xs tracking-wider shadow-xs ${finalClass || 'w-10 h-10'}`}
    >
      SMK
    </div>
  );

  return fallbackBadge;
};

export default SchoolLogo;
