import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
} from 'lucide-react';
import { schoolIdentity, vocationalMajors } from '../data/schoolData';
import { SchoolLogo } from './common/SchoolLogo';
import { AdminUser } from '../types';

interface FooterProps {
  currentUser?: AdminUser | null;
  onNavigate?: (page: string, subTarget?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ currentUser, onNavigate = () => {} }) => {

  const handleNav = (page: string, subTarget?: string) => {
    onNavigate(page, subTarget);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#001740] text-white/80 text-xs">
      {/* Main Footer Content */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Col 1: School Identity & Description */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <SchoolLogo className="w-12 h-12 object-contain drop-shadow-md flex-shrink-0" />
              <div>
                <h3 className="text-base font-bold text-white font-heading tracking-tight leading-tight">
                  {schoolIdentity.name}
                </h3>
                <p className="text-xs text-[#FFB800] font-medium">
                  {schoolIdentity.tagline}
                </p>
              </div>
            </div>
            <p className="text-xs text-white/75 leading-relaxed">
              Sekolah Menengah Kejuruan Negeri terdepan di Kabupaten Rokan Hulu, Provinsi Riau. Berkomitmen mencetak sumber daya manusia vokasi yang berakhlak mulia, berjiwa wirausaha mandiri, dan tersertifikasi kompetensi standar industri nasional BNSP.
            </p>
            <div className="pt-2 text-xs space-y-2 text-white/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#FFB800] flex-shrink-0 mt-0.5" />
                <span>{schoolIdentity.contact.address}, Rokan Hulu, Riau</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FFB800] flex-shrink-0" />
                <span>Telp: {schoolIdentity.contact.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FFB800] flex-shrink-0" />
                <span>Email: {schoolIdentity.contact.email}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Program Keahlian */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-heading border-b border-white/20 pb-2">
              Program Keahlian
            </h4>
            <ul className="space-y-2 text-xs">
              {vocationalMajors.map((major) => (
                <li key={major.id}>
                  <button
                    onClick={() => handleNav('program-keahlian', major.id)}
                    className="hover:text-[#FFB800] transition-colors flex items-center gap-2 text-left cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800]" />
                    <span>{major.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Link Cepat */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-heading border-b border-white/20 pb-2">
              Tautan Cepat
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('profil')} className="hover:text-[#FFB800] transition-colors cursor-pointer text-left">
                  Profil Sekolah
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('pkl-bkk', 'pkl')} className="hover:text-[#FFB800] transition-colors cursor-pointer text-left">
                  Mitra PKL & DU/DI
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('pkl-bkk', 'bkk')} className="hover:text-[#FFB800] transition-colors cursor-pointer text-left">
                  Bursa Kerja Khusus (BKK)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('informasi', 'berita')} className="hover:text-[#FFB800] transition-colors cursor-pointer text-left">
                  Berita & Prestasi
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('kesiswaan')} className="hover:text-[#FFB800] transition-colors cursor-pointer text-left">
                  Kesiswaan & Ekskul
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('informasi', 'faq')} className="hover:text-[#FFB800] transition-colors cursor-pointer text-left">
                  Tanya Jawab (FAQ)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('jadwal')} className="hover:text-[#FFB800] transition-colors cursor-pointer text-left font-medium text-white/95">
                  Jadwal & Guru Pengajar
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('galeri')} className="hover:text-[#FFB800] transition-colors cursor-pointer text-left">
                  Galeri Foto Sekolah
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('ppdb')} className="hover:text-[#FFB800] transition-colors font-semibold text-[#FFB800] cursor-pointer text-left">
                  PPDB Riau
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Jam Pelayanan & Akreditasi */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-heading border-b border-white/20 pb-2">
              Pelayanan
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#FFB800] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Jam Kerja:</span>
                  <span>{schoolIdentity.contact.operatingHours}</span>
                </div>
              </div>
              <div className="bg-white/10 p-3 rounded-xl border border-white/15">
                <span className="text-[11px] text-white/70 block">NPSN & Akreditasi:</span>
                <span className="font-bold text-[#FFB800] text-sm block">
                  {schoolIdentity.npsn}
                </span>
                <span className="text-[11px] text-white font-medium">
                  {schoolIdentity.accreditation}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-[#00102b] py-4 border-t border-white/10 text-center text-xs text-white/60">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © {new Date().getFullYear()} {schoolIdentity.name}. Hak Cipta Dilindungi.
          </div>
          <div className="text-[11px] text-white/50">
            Kabupaten Rokan Hulu, Provinsi Riau
          </div>
        </div>
      </div>
    </footer>
  );
};
