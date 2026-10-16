import React, { useState, useEffect } from 'react';
import { Maximize2, X } from 'lucide-react';
import { galleryPhotos } from '../data/schoolData';
import { GalleryPhoto } from '../types';
import { PageHeader } from './PageHeader';
import { SchoolImage } from './common/SchoolImage';
import { api } from '../services/api';

interface GallerySectionProps {
  onNavigate: (page: string) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [lightboxPhoto, setLightboxPhoto] = useState<GalleryPhoto | null>(null);
  const [livePhotos, setLivePhotos] = useState<GalleryPhoto[]>(galleryPhotos);

  useEffect(() => {
    api.getGallery().then((data) => {
      if (data && data.length > 0) {
        setLivePhotos(data);
      }
    });
  }, []);

  const filteredPhotos = livePhotos.filter((item) => {
    if (selectedCategory === 'Semua') return true;
    return item.category === selectedCategory;
  });

  return (
    <div id="galeri" className="min-h-screen bg-white">
      {/* Page Header */}
      <PageHeader
        title="Galeri & Dokumentasi Sekolah"
        subtitle="Potret visual fasilitas bengkel praktik, kegiatan belajar mengajar vokasi, kunjungan industri, dan kebersamaan keluarga besar SMK Negeri 1 Ujung Batu."
        badge="Dokumentasi Visual"
        breadcrumbs={[{ label: 'Galeri Foto' }]}
        onNavigate={onNavigate}
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">

        {/* Filter Categories */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {['Semua', 'Praktik Bengkel/Lab', 'Kegiatan Siswa', 'Kunjungan Industri', 'Guru & Tendik'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer font-heading border ${
                selectedCategory === cat
                  ? 'bg-[#003087] border-[#003087] text-white shadow-2xs'
                  : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPhotos.map((photo: GalleryPhoto) => (
            <div
              key={photo.id}
              onClick={() => setLightboxPhoto(photo)}
              className="bg-white rounded-xl overflow-hidden shadow-xs hover:shadow-md border border-slate-200 transition-all group cursor-pointer flex flex-col justify-between"
            >
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <SchoolImage
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-bold bg-[#003087]/90 text-white">
                  {photo.category}
                </span>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-white text-[#003087] flex items-center justify-center shadow">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="p-4">
                <h4 className="text-sm font-bold text-[#003087] line-clamp-1 group-hover:text-[#002260] transition-colors font-heading mb-1">
                  {photo.title}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {photo.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {lightboxPhoto && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setLightboxPhoto(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightboxPhoto(null)}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="max-h-[65vh] bg-black flex items-center justify-center">
                <SchoolImage
                  src={lightboxPhoto.imageUrl}
                  alt={lightboxPhoto.title}
                  className="max-h-[65vh] w-auto max-w-full object-contain"
                />
              </div>
              <div className="p-5">
                <span className="inline-block px-2 py-0.5 bg-blue-50 text-[#003087] text-xs font-bold rounded mb-1">
                  {lightboxPhoto.category}
                </span>
                <h3 className="text-lg font-bold text-[#003087] font-heading">
                  {lightboxPhoto.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  {lightboxPhoto.caption}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
