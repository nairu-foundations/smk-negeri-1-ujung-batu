import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  Phone,
  Mail,
  Clock,
  ChevronDown,
  Lock,
  ShieldCheck,
  ChevronRight,
  BookOpen,
  Wrench,
  Network,
  ShoppingBag,
  Zap,
  Package,
  Radio,
  Briefcase,
  Users,
  Building2,
  HelpCircle,
  HeartHandshake,
  FileText,
  Award,
  Bell,
  GraduationCap,
  ExternalLink,
  History,
  Layers,
  Home,
  Calendar,
  Image as ImageIcon,
  MapPin,
} from 'lucide-react';
import { SchoolLogo } from './common/SchoolLogo';
import { schoolIdentity } from '../data/schoolData';
import { AdminUser } from '../types';

interface NavbarProps {
  activeSection: string;
  currentUser: AdminUser | null;
  onNavigate: (sectionId: string, subTarget?: string) => void;
  subTarget?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  currentUser,
  onNavigate,
  subTarget,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Kunci scroll halaman latar belakang (body scroll lock) ketika menu hamburger mobile dibuka
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalOverscroll = document.body.style.overscrollBehavior;

      document.body.style.overflow = 'hidden';
      document.body.style.overscrollBehavior = 'none';

      return () => {
        document.body.style.overflow = originalOverflow || '';
        document.body.style.overscrollBehavior = originalOverscroll || '';
      };
    } else {
      document.body.style.overflow = '';
      document.body.style.overscrollBehavior = '';
    }
  }, [mobileMenuOpen]);

  // Tutup menu mobile ketika tombol Escape ditekan, layar diperbesar ke desktop (lg), atau popstate (back browser)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    const handleResize = () => {
      if (window.innerWidth >= 1024 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    const handlePopState = () => {
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [mobileMenuOpen]);

  // Tutup menu mobile otomatis jika activeSection berubah
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [activeSection]);

  const handleLinkClick = (sectionId: string, subTarget?: string) => {
    onNavigate(sectionId, subTarget);
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const handleMouseEnter = (id: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(id);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const toggleMobileAccordion = (id: string) => {
    setMobileExpanded((prev) => (prev === id ? null : id));
  };

  const navigationItems = [
    { id: 'beranda', label: 'Beranda' },
    {
      id: 'profil',
      label: 'Profil',
      dropdown: [
        {
          id: 'profil-sambutan',
          label: 'Sambutan Kepala Sekolah',
          desc: 'Pesan kepemimpinan & visi vokasi',
          section: 'profil',
          subTarget: 'sambutan',
          icon: Users,
        },
        {
          id: 'profil-visi-misi',
          label: 'Visi & Misi',
          desc: 'Arah pengembangan mutu pendidikan',
          section: 'profil',
          subTarget: 'visi-misi',
          icon: Award,
        },
        {
          id: 'profil-sejarah',
          label: 'Sejarah & Akreditasi',
          desc: 'Perjalanan sekolah & sertifikasi mutu BAN-SM',
          section: 'profil',
          subTarget: 'sejarah',
          icon: History,
        },
        {
          id: 'profil-struktur',
          label: 'Struktur Organisasi',
          desc: 'Bagan kepemimpinan & tata kelola sekolah',
          section: 'profil',
          subTarget: 'struktur',
          icon: Layers,
        },
        {
          id: 'profil-guru',
          label: 'Guru & Tenaga Kependidikan',
          desc: 'Profil dewan guru & staf tata usaha',
          section: 'profil',
          subTarget: 'guru',
          icon: BookOpen,
        },
        {
          id: 'profil-sarpras',
          label: 'Sarana & Fasilitas',
          desc: 'Laboratorium, bengkel & sarana olahraga',
          section: 'profil',
          subTarget: 'sarpras',
          icon: Building2,
        },
      ],
    },
    {
      id: 'program-keahlian',
      label: 'Jurusan',
      dropdown: [
        {
          id: 'tkj',
          code: 'TKJ',
          label: 'Teknik Komputer & Jaringan',
          section: 'program-keahlian',
          subTarget: 'tkj',
          icon: Network,
        },
        {
          id: 'to',
          code: 'TO',
          label: 'Teknik Otomotif',
          section: 'program-keahlian',
          subTarget: 'to',
          icon: Wrench,
        },
        {
          id: 'bdp',
          code: 'BDP',
          label: 'Bisnis Daring & Pemasaran',
          section: 'program-keahlian',
          subTarget: 'bdp',
          icon: ShoppingBag,
        },
        {
          id: 'te',
          code: 'TE',
          label: 'Teknik Elektronika',
          section: 'program-keahlian',
          subTarget: 'te',
          icon: Zap,
        },
        {
          id: 'tlog',
          code: 'TLOG',
          label: 'Teknik Logistik',
          section: 'program-keahlian',
          subTarget: 'tlog',
          icon: Package,
        },
        {
          id: 'bp',
          code: 'BP',
          label: 'Broadcasting & Perfilman',
          section: 'program-keahlian',
          subTarget: 'bp',
          icon: Radio,
        },
        {
          id: 'tefa',
          code: 'TEFA',
          label: 'Teaching Factory (Unit Usaha Siswa)',
          section: 'program-keahlian',
          subTarget: 'tefa',
          icon: Briefcase,
          highlight: true,
        },
      ],
    },
    {
      id: 'pkl-bkk',
      label: 'Kemitraan',
      dropdown: [
        {
          id: 'mitra-dudi',
          label: 'Mitra Industri (DU/DI)',
          desc: 'Kerja sama magang & kurikulum industri',
          section: 'pkl-bkk',
          subTarget: 'pkl',
          icon: Building2,
        },
        {
          id: 'pkl-info',
          label: 'Praktik Kerja Lapangan (PKL)',
          desc: 'Prosedur & panduan praktik kerja siswa',
          section: 'pkl-bkk',
          subTarget: 'pkl',
          icon: FileText,
        },
        {
          id: 'bkk-info',
          label: 'Bursa Kerja Khusus (BKK)',
          desc: 'Penyaluran alumni & lowongan karir',
          section: 'pkl-bkk',
          subTarget: 'bkk',
          icon: Briefcase,
        },
        {
          id: 'sertifikasi-info',
          label: 'Uji Sertifikasi BNSP',
          desc: 'Standardisasi kompetensi LSP P-1',
          section: 'pkl-bkk',
          subTarget: 'sertifikasi',
          icon: Award,
        },
      ],
    },
    {
      id: 'kesiswaan',
      label: 'Kesiswaan',
      dropdown: [
        {
          id: 'kesiswaan-osis',
          label: 'OSIS & Kepengurusan',
          desc: 'Organisasi siswa dan program kerja',
          section: 'kesiswaan',
          subTarget: 'osis',
          icon: Users,
        },
        {
          id: 'kesiswaan-ekskul',
          label: 'Ekstrakurikuler',
          desc: 'Pramuka, Paskibra, Olahraga & Seni',
          section: 'kesiswaan',
          subTarget: 'ekskul',
          icon: Award,
        },
        {
          id: 'kesiswaan-bk',
          label: 'Bimbingan Konseling & Karir',
          desc: 'Konsultasi minat, bakat & studi lanjut',
          section: 'kesiswaan',
          subTarget: 'bk',
          icon: HeartHandshake,
        },
      ],
    },
    {
      id: 'informasi',
      label: 'Informasi',
      dropdown: [
        {
          id: 'info-berita',
          label: 'Berita & Prestasi LKS',
          desc: 'Kabar terkini dan prestasi siswa',
          section: 'informasi',
          subTarget: 'berita',
          icon: FileText,
        },
        {
          id: 'info-pengumuman',
          label: 'Pengumuman Resmi Sekolah',
          desc: 'Surat edaran kedinasan & jadwal ujian',
          section: 'informasi',
          subTarget: 'pengumuman',
          icon: Bell,
        },
        {
          id: 'info-faq',
          label: 'Tanya Jawab (FAQ)',
          desc: 'Pertanyaan seputar kurikulum & sekolah',
          section: 'informasi',
          subTarget: 'faq',
          icon: HelpCircle,
        },
      ],
    },
    { id: 'jadwal', label: 'Jadwal' },
    { id: 'galeri', label: 'Galeri' },
    { id: 'kontak', label: 'Kontak' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top Bar: Running Line Teks Bergerak dari Kanan ke Kiri */}
      <div className="bg-[#002260] text-white border-b border-[#001740] text-xs py-1.5 overflow-hidden relative select-none z-10">
        <div className="flex items-center">
          {/* Label Badge Statis di Kiri untuk Memberikan Konteks Resmi */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-0.5 bg-[#001740] text-[#FFB800] text-[11px] font-bold uppercase tracking-wider shrink-0 z-20 shadow-xs border-r border-white/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span>Info Resmi</span>
          </div>

          {/* Marquee Ticker Track (Bergerak dari Kanan ke Kiri) */}
          <div className="flex-1 overflow-hidden relative">
            <div className="animate-marquee-left flex items-center whitespace-nowrap">
              {/* Blok 1 */}
              <div className="flex items-center gap-6 sm:gap-8 px-4 text-[12px] font-normal tracking-wide text-white/90">
                {/* Jadwal Pelayanan & Pembelajaran Senin - Jumat */}
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#FFB800] shrink-0" />
                  <span className="font-medium text-white/80">Jadwal Sekolah:</span>
                  <span className="text-white font-semibold">Senin – Jumat ({schoolIdentity.contact.operatingHours.replace('Senin - Jumat: ', '')})</span>
                </div>

                <span className="text-white/20 select-none">|</span>

                {/* Nomor Telepon / Helpdesk */}
                <a
                  href={`tel:${schoolIdentity.contact.phone.replace(/[^0-9]/g, '')}`}
                  className="flex items-center gap-1.5 text-white/90 hover:text-[#FFB800] transition-colors group cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-[#FFB800] shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-white/80">Telp / WhatsApp:</span>
                  <span className="text-white font-semibold group-hover:underline">{schoolIdentity.contact.phone}</span>
                </a>

                <span className="text-white/20 select-none">|</span>

                {/* Email Sekolah */}
                <a
                  href={`mailto:${schoolIdentity.contact.email}`}
                  className="flex items-center gap-1.5 text-white/90 hover:text-[#FFB800] transition-colors group cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-[#FFB800] shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-white/80">Email Resmi:</span>
                  <span className="text-white font-semibold group-hover:underline">{schoolIdentity.contact.email}</span>
                </a>

                <span className="text-white/20 select-none">|</span>

                {/* Alamat & Identitas */}
                <div className="flex items-center gap-1.5 text-white/85">
                  <MapPin className="w-3.5 h-3.5 text-[#FFB800] shrink-0" />
                  <span>{schoolIdentity.name} · Desa Ngaso, Ujung Batu, Kab. Rokan Hulu, Riau</span>
                </div>

                <span className="text-white/20 select-none">|</span>

                {/* Akreditasi & NPSN */}
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 text-[#FFB800] font-semibold text-[11px] bg-white/10 px-2 py-0.5 rounded">
                    NPSN: {schoolIdentity.npsn} • {schoolIdentity.accreditation}
                  </span>
                </div>
              </div>

              {/* Blok 2 (Duplikasi untuk Seamless Infinite Loop) */}
              <div className="flex items-center gap-6 sm:gap-8 px-4 text-[12px] font-normal tracking-wide text-white/90" aria-hidden="true">
                {/* Jadwal Pelayanan & Pembelajaran Senin - Jumat */}
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#FFB800] shrink-0" />
                  <span className="font-medium text-white/80">Jadwal Sekolah:</span>
                  <span className="text-white font-semibold">Senin – Jumat ({schoolIdentity.contact.operatingHours.replace('Senin - Jumat: ', '')})</span>
                </div>

                <span className="text-white/20 select-none">|</span>

                {/* Nomor Telepon / Helpdesk */}
                <a
                  href={`tel:${schoolIdentity.contact.phone.replace(/[^0-9]/g, '')}`}
                  className="flex items-center gap-1.5 text-white/90 hover:text-[#FFB800] transition-colors group cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-[#FFB800] shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-white/80">Telp / WhatsApp:</span>
                  <span className="text-white font-semibold group-hover:underline">{schoolIdentity.contact.phone}</span>
                </a>

                <span className="text-white/20 select-none">|</span>

                {/* Email Sekolah */}
                <a
                  href={`mailto:${schoolIdentity.contact.email}`}
                  className="flex items-center gap-1.5 text-white/90 hover:text-[#FFB800] transition-colors group cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-[#FFB800] shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-white/80">Email Resmi:</span>
                  <span className="text-white font-semibold group-hover:underline">{schoolIdentity.contact.email}</span>
                </a>

                <span className="text-white/20 select-none">|</span>

                {/* Alamat & Identitas */}
                <div className="flex items-center gap-1.5 text-white/85">
                  <MapPin className="w-3.5 h-3.5 text-[#FFB800] shrink-0" />
                  <span>{schoolIdentity.name} · Desa Ngaso, Ujung Batu, Kab. Rokan Hulu, Riau</span>
                </div>

                <span className="text-white/20 select-none">|</span>

                {/* Akreditasi & NPSN */}
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 text-[#FFB800] font-semibold text-[11px] bg-white/10 px-2 py-0.5 rounded">
                    NPSN: {schoolIdentity.npsn} • {schoolIdentity.accreditation}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all duration-200 ${
          scrolled ? 'py-2 shadow-sm' : 'py-3'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            {/* School Brand Identity */}
            <a
              href="#beranda"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('beranda');
              }}
              className="flex items-center gap-3 group cursor-pointer"
            >
              <SchoolLogo className="w-10 h-10 object-contain drop-shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform" />
              <div className="flex flex-col">
                <span className="text-[15px] sm:text-[17px] font-bold text-[#003087] tracking-tight leading-tight group-hover:text-[#002260] transition-colors font-heading">
                  SMKN 1 UJUNG BATU
                </span>
                <span className="text-[11px] sm:text-xs text-slate-500 font-medium leading-none mt-0.5">
                  Rokan Hulu, Riau
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navigationItems.map((item) => {
                if (item.dropdown) {
                  const isAnySubActive = item.dropdown.some((sub) => activeSection === sub.section);
                  const isDropdownOpen = activeDropdown === item.id;
                  return (
                    <div
                      key={item.id}
                      className="relative"
                      onMouseEnter={() => handleMouseEnter(item.id)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <button
                        className={`flex items-center gap-1 px-3 py-2 text-[13.5px] font-medium rounded-md transition-all cursor-pointer ${
                          isDropdownOpen || isAnySubActive
                            ? 'text-[#003087] bg-blue-50/70 font-semibold'
                            : 'text-slate-700 hover:text-[#003087] hover:bg-slate-50'
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                            isDropdownOpen ? 'rotate-180 text-[#003087]' : ''
                          }`}
                        />
                      </button>

                      {/* Dropdown Menu Card */}
                      {isDropdownOpen && (
                        <div className="absolute top-full left-0 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                          <div
                            className={`bg-white rounded-xl shadow-lg border border-slate-200/90 py-2 ${
                              item.id === 'program-keahlian' ? 'w-80' : 'w-72'
                            }`}
                          >
                            {item.dropdown.map((subItem) => {
                              const IconComponent = subItem.icon;
                              return (
                                <button
                                  key={subItem.id}
                                  onClick={() => handleLinkClick(subItem.section, (subItem as any).subTarget)}
                                  className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 hover:text-[#003087] transition-all flex items-start gap-2.5 group cursor-pointer"
                                >
                                  {IconComponent && (
                                    <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-blue-50 group-hover:text-[#003087] transition-colors">
                                      <IconComponent className="w-3.5 h-3.5" />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[13px] font-semibold text-slate-800 group-hover:text-[#003087] transition-colors">
                                        {subItem.label}
                                      </span>
                                      {'code' in subItem && (
                                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 group-hover:bg-[#003087] group-hover:text-white transition-colors">
                                          {subItem.code}
                                        </span>
                                      )}
                                    </div>
                                    {'desc' in subItem && subItem.desc && (
                                      <p className="text-[11px] text-slate-500 leading-tight truncate mt-0.5">
                                        {subItem.desc}
                                      </p>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleLinkClick(item.id)}
                    className={`px-3 py-2 text-[13.5px] font-medium rounded-md transition-all cursor-pointer ${
                      isActive
                        ? 'text-[#003087] bg-blue-50/70 font-semibold'
                        : 'text-slate-700 hover:text-[#003087] hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}

              {/* PPDB RIAU & ADMIN ACTION BUTTONS - Compact Minimalist Bubbles */}
              <div className="ml-1.5 pl-2.5 border-l border-slate-200/80 flex items-center gap-1.5">
                {/* PPDB Button - Ultra-compact sleek bubble */}
                <button
                  onClick={() => handleLinkClick('ppdb')}
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                    activeSection === 'ppdb'
                      ? 'bg-amber-400 border-amber-500 text-slate-950 shadow-2xs'
                      : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-300/60 text-amber-900 hover:border-amber-400'
                  }`}
                  title="Pendaftaran Siswa Baru PPDB Riau"
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                  </span>
                  <GraduationCap className="w-3 h-3 text-amber-800" />
                  <span>PPDB</span>
                </button>

                {/* Admin Button - Ultra-compact sleek bubble */}
                <button
                  onClick={() => handleLinkClick(currentUser ? 'admin' : 'login')}
                  className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                    activeSection === 'admin' || activeSection === 'login'
                      ? 'bg-blue-900 border-blue-950 text-white shadow-2xs'
                      : currentUser
                      ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300/80 text-emerald-900 font-semibold'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-white'
                  }`}
                >
                  {currentUser ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span className="font-semibold text-[10.5px]">Admin</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-2.5 h-2.5 text-amber-400" />
                      <span className="text-[10.5px]">Login</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Mobile & Tablet Actions: PPDB Badge + Admin Status + Menu Toggle */}
            <div className="lg:hidden flex items-center gap-1.5 sm:gap-2">
              {/* PPDB Button */}
              <button
                onClick={() => handleLinkClick('ppdb')}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                  activeSection === 'ppdb'
                    ? 'bg-amber-400 border-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-300/80 text-amber-900'
                }`}
                title="Pendaftaran Siswa Baru PPDB"
              >
                <GraduationCap className="w-3.5 h-3.5 text-amber-800 flex-shrink-0" />
                <span className="font-bold">PPDB</span>
                <span className="hidden sm:inline text-[11px] font-medium text-amber-800/80">2026/2027</span>
              </button>

              {/* Admin Button */}
              <button
                onClick={() => handleLinkClick(currentUser ? 'admin' : 'login')}
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 sm:px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                  currentUser
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                    : 'bg-slate-900 border-slate-800 text-white hover:bg-slate-800'
                }`}
                title={currentUser ? 'Panel Admin' : 'Login Admin'}
              >
                {currentUser ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="hidden sm:inline font-semibold">Admin</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3 text-amber-400 flex-shrink-0" />
                    <span className="hidden sm:inline">Login</span>
                  </>
                )}
              </button>

              {/* Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`w-10 h-10 min-w-[40px] flex items-center justify-center rounded-xl transition-all cursor-pointer border ${
                  mobileMenuOpen
                    ? 'bg-[#003087] text-white border-[#003087] shadow-sm'
                    : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#003087] border-slate-200 active:scale-95'
                }`}
                aria-label={mobileMenuOpen ? 'Tutup Menu Navigasi' : 'Buka Menu Navigasi'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Backdrop overlay di belakang drawer mobile & tablet */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-xs transition-opacity lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Modern Slide-Over Drawer for Mobile & Tablet */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-y-0 right-0 z-[70] w-full sm:w-[420px] md:w-[450px] max-w-full bg-white shadow-2xl flex flex-col h-full lg:hidden border-l border-slate-200 animate-in slide-in-from-right duration-250 ease-out"
          role="dialog"
          aria-modal="true"
          aria-label="Menu Navigasi Mobile dan Tablet"
        >
          {/* 1. Drawer Header: Institutional & Formal */}
          <div className="px-5 py-3.5 sm:py-4 bg-[#002260] text-white flex items-center justify-between border-b border-[#001740] flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <SchoolLogo className="w-10 h-10 object-contain flex-shrink-0 drop-shadow-sm" />
              <div className="min-w-0">
                <span className="text-sm sm:text-base font-bold font-heading block truncate text-white tracking-tight">
                  SMKN 1 UJUNG BATU
                </span>
                <span className="text-[11px] text-white/75 block truncate">
                  {schoolIdentity.accreditation} · NPSN {schoolIdentity.npsn}
                </span>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer flex-shrink-0"
              aria-label="Tutup Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 2. Drawer Body (Scrollable with smooth overscroll) */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-5 py-4 space-y-4 text-slate-800">
            {/* Quick Action Highlight: PPDB Online 2026/2027 */}
            <button
              onClick={() => handleLinkClick('ppdb')}
              className={`w-full text-left p-3.5 rounded-2xl transition-all cursor-pointer flex items-center justify-between border min-h-[52px] ${
                activeSection === 'ppdb'
                  ? 'bg-amber-400 border-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-amber-50 hover:bg-amber-100/80 border-amber-200 text-amber-950'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-900 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-xs sm:text-sm truncate">
                      Pendaftaran PPDB 2026/2027
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-200 text-amber-900 flex-shrink-0">
                      Dibuka
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-900/80 mt-0.5 truncate">
                    Jalur Zonasi, Prestasi & Afirmasi SMKN 1 Ujung Batu
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-800 flex-shrink-0 ml-2" />
            </button>

            {/* Section: MENU UTAMA */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 font-heading block mb-2">
                Navigasi Utama
              </span>
              <div className="space-y-1">
                {/* 1. Beranda */}
                <button
                  onClick={() => handleLinkClick('beranda')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-between min-h-[46px] ${
                    activeSection === 'beranda'
                      ? 'bg-[#003087] text-white shadow-xs'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Home className={`w-4 h-4 ${activeSection === 'beranda' ? 'text-[#FFB800]' : 'text-slate-400'}`} />
                    <span>Beranda Sekolah</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 ${activeSection === 'beranda' ? 'text-white/60' : 'text-slate-300'}`} />
                </button>

                {/* 2. Profil Sekolah Accordion */}
                <div className="rounded-xl overflow-hidden border border-slate-200/80 bg-slate-50/60">
                  <button
                    onClick={() => toggleMobileAccordion('profil')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer min-h-[46px] ${
                      mobileExpanded === 'profil' || activeSection === 'profil'
                        ? 'bg-blue-50/80 text-[#003087]'
                        : 'text-slate-800 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <SchoolLogo className="w-4 h-4 object-contain flex-shrink-0" />
                      <span>Profil & Mutu Sekolah</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200/60">
                        6 Menu
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                          mobileExpanded === 'profil' ? 'rotate-180 text-[#003087]' : ''
                        }`}
                      />
                    </div>
                  </button>
                  {mobileExpanded === 'profil' && (
                    <div className="bg-white px-2.5 py-2 space-y-1 border-t border-slate-100">
                      {[
                        { id: 'sambutan', label: 'Sambutan Kepala Sekolah', icon: Users },
                        { id: 'visi-misi', label: 'Visi & Misi Satuan Pendidikan', icon: Award },
                        { id: 'sejarah', label: 'Sejarah & Akreditasi A BAN-S/M', icon: History },
                        { id: 'struktur', label: 'Struktur Organisasi & Tata Kelola', icon: Layers },
                        { id: 'guru', label: 'Guru & Tenaga Kependidikan', icon: BookOpen },
                        { id: 'sarpras', label: 'Sarana & Fasilitas Kampus', icon: Building2 },
                      ].map((item) => {
                        const isSubActive = activeSection === 'profil' && subTarget === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleLinkClick('profil', item.id)}
                            className={`w-full text-left py-2.5 px-3 rounded-lg flex items-center justify-between transition-colors text-xs cursor-pointer min-h-[42px] ${
                              isSubActive
                                ? 'bg-blue-50 text-[#003087] font-bold border border-blue-200/60 shadow-2xs'
                                : 'text-slate-700 hover:text-[#003087] hover:bg-blue-50/50'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <item.icon className={`w-3.5 h-3.5 flex-shrink-0 ${isSubActive ? 'text-[#003087]' : 'text-slate-400'}`} />
                              <span>{item.label}</span>
                            </div>
                            <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 ${isSubActive ? 'text-[#003087]' : 'text-slate-300'}`} />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 3. Program Keahlian Accordion */}
                <div className="rounded-xl overflow-hidden border border-slate-200/80 bg-slate-50/60">
                  <button
                    onClick={() => toggleMobileAccordion('jurusan')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer min-h-[46px] ${
                      mobileExpanded === 'jurusan' || activeSection === 'program-keahlian'
                        ? 'bg-blue-50/80 text-[#003087]'
                        : 'text-slate-800 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Wrench className="w-4 h-4 text-[#003087] flex-shrink-0" />
                      <span>Program Keahlian (6 Jurusan)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200/60">
                        Vokasi
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                          mobileExpanded === 'jurusan' ? 'rotate-180 text-[#003087]' : ''
                        }`}
                      />
                    </div>
                  </button>
                  {mobileExpanded === 'jurusan' && (
                    <div className="bg-white px-2.5 py-2 space-y-1 border-t border-slate-100">
                      {[
                        { code: 'TKJ', label: 'Teknik Komputer & Jaringan', icon: Network, id: 'tkj' },
                        { code: 'TO', label: 'Teknik Otomotif', icon: Wrench, id: 'to' },
                        { code: 'BDP', label: 'Bisnis Daring & Pemasaran', icon: ShoppingBag, id: 'bdp' },
                        { code: 'TE', label: 'Teknik Elektronika Industri', icon: Zap, id: 'te' },
                        { code: 'TLOG', label: 'Teknik Logistik', icon: Package, id: 'tlog' },
                        { code: 'BP', label: 'Broadcasting & Perfilman', icon: Radio, id: 'bp' },
                        { code: 'TEFA', label: 'Teaching Factory (Unit Usaha Siswa)', icon: Briefcase, id: 'tefa' },
                      ].map((item) => {
                        const isSubActive = activeSection === 'program-keahlian' && subTarget === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleLinkClick('program-keahlian', item.id)}
                            className={`w-full text-left py-2.5 px-3 rounded-lg flex items-center justify-between transition-colors text-xs cursor-pointer min-h-[42px] ${
                              isSubActive
                                ? 'bg-blue-50 text-[#003087] font-bold border border-blue-200/60 shadow-2xs'
                                : 'text-slate-700 hover:text-[#003087] hover:bg-blue-50/50'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <item.icon className={`w-3.5 h-3.5 flex-shrink-0 ${isSubActive ? 'text-[#003087]' : 'text-slate-400'}`} />
                              <span className="truncate">{item.label}</span>
                            </div>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ml-2 ${
                              isSubActive ? 'bg-[#003087] text-white' : 'bg-blue-100 text-[#003087]'
                            }`}>
                              {item.code}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 4. Kemitraan Accordion */}
                <div className="rounded-xl overflow-hidden border border-slate-200/80 bg-slate-50/60">
                  <button
                    onClick={() => toggleMobileAccordion('kemitraan')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer min-h-[46px] ${
                      mobileExpanded === 'kemitraan' || activeSection === 'pkl-bkk'
                        ? 'bg-blue-50/80 text-[#003087]'
                        : 'text-slate-800 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Building2 className="w-4 h-4 text-[#003087] flex-shrink-0" />
                      <span>Kemitraan Industri</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200/60">
                        DU/DI & BKK
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                          mobileExpanded === 'kemitraan' ? 'rotate-180 text-[#003087]' : ''
                        }`}
                      />
                    </div>
                  </button>
                  {mobileExpanded === 'kemitraan' && (
                    <div className="bg-white px-2.5 py-2 space-y-1 border-t border-slate-100">
                      {[
                        { label: 'Mitra Industri (DU/DI)', sub: 'pkl', icon: Building2 },
                        { label: 'Praktik Kerja Lapangan (PKL)', sub: 'pkl', icon: FileText },
                        { label: 'Bursa Kerja Khusus (BKK)', sub: 'bkk', icon: Briefcase },
                        { label: 'Uji Sertifikasi BNSP LSP P-1', sub: 'sertifikasi', icon: Award },
                      ].map((item, idx) => {
                        const isSubActive = activeSection === 'pkl-bkk' && subTarget === item.sub;
                        return (
                          <button
                            key={idx}
                            onClick={() => handleLinkClick('pkl-bkk', item.sub)}
                            className={`w-full text-left py-2.5 px-3 rounded-lg flex items-center justify-between transition-colors text-xs cursor-pointer min-h-[42px] ${
                              isSubActive
                                ? 'bg-blue-50 text-[#003087] font-bold border border-blue-200/60 shadow-2xs'
                                : 'text-slate-700 hover:text-[#003087] hover:bg-blue-50/50'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <item.icon className={`w-3.5 h-3.5 flex-shrink-0 ${isSubActive ? 'text-[#003087]' : 'text-slate-400'}`} />
                              <span>{item.label}</span>
                            </div>
                            <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 ${isSubActive ? 'text-[#003087]' : 'text-slate-300'}`} />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 5. Kesiswaan Accordion */}
                <div className="rounded-xl overflow-hidden border border-slate-200/80 bg-slate-50/60">
                  <button
                    onClick={() => toggleMobileAccordion('kesiswaan')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer min-h-[46px] ${
                      mobileExpanded === 'kesiswaan' || activeSection === 'kesiswaan'
                        ? 'bg-blue-50/80 text-[#003087]'
                        : 'text-slate-800 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-[#003087] flex-shrink-0" />
                      <span>Kesiswaan & Ekskul</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200/60">
                        OSIS & Ekskul
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                          mobileExpanded === 'kesiswaan' ? 'rotate-180 text-[#003087]' : ''
                        }`}
                      />
                    </div>
                  </button>
                  {mobileExpanded === 'kesiswaan' && (
                    <div className="bg-white px-2.5 py-2 space-y-1 border-t border-slate-100">
                      {[
                        { label: 'OSIS & Majelis Perwakilan Kelas', sub: 'osis', icon: Users },
                        { label: 'Ekstrakurikuler Siswa', sub: 'ekskul', icon: Award },
                        { label: 'Bimbingan Konseling & Karir (BK)', sub: 'bk', icon: HeartHandshake },
                      ].map((item, idx) => {
                        const isSubActive = activeSection === 'kesiswaan' && subTarget === item.sub;
                        return (
                          <button
                            key={idx}
                            onClick={() => handleLinkClick('kesiswaan', item.sub)}
                            className={`w-full text-left py-2.5 px-3 rounded-lg flex items-center justify-between transition-colors text-xs cursor-pointer min-h-[42px] ${
                              isSubActive
                                ? 'bg-blue-50 text-[#003087] font-bold border border-blue-200/60 shadow-2xs'
                                : 'text-slate-700 hover:text-[#003087] hover:bg-blue-50/50'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <item.icon className={`w-3.5 h-3.5 flex-shrink-0 ${isSubActive ? 'text-[#003087]' : 'text-slate-400'}`} />
                              <span>{item.label}</span>
                            </div>
                            <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 ${isSubActive ? 'text-[#003087]' : 'text-slate-300'}`} />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 6. Jadwal Pelajaran */}
                <button
                  onClick={() => handleLinkClick('jadwal')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-between min-h-[46px] ${
                    activeSection === 'jadwal'
                      ? 'bg-[#003087] text-white shadow-xs'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Calendar className={`w-4 h-4 ${activeSection === 'jadwal' ? 'text-[#FFB800]' : 'text-slate-400'}`} />
                    <span>Jadwal Pelajaran & Guru</span>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                    activeSection === 'jadwal' ? 'bg-white/20 text-white' : 'bg-blue-50 text-[#003087] border border-blue-100'
                  }`}>
                    Interaktif
                  </span>
                </button>

                {/* 7. Berita & Informasi Accordion */}
                <div className="rounded-xl overflow-hidden border border-slate-200/80 bg-slate-50/60">
                  <button
                    onClick={() => toggleMobileAccordion('informasi')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer min-h-[46px] ${
                      mobileExpanded === 'informasi' || activeSection === 'informasi'
                        ? 'bg-blue-50/80 text-[#003087]'
                        : 'text-slate-800 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Bell className="w-4 h-4 text-[#003087] flex-shrink-0" />
                      <span>Warta Berita & Pengumuman</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200/60">
                        Informasi
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                          mobileExpanded === 'informasi' ? 'rotate-180 text-[#003087]' : ''
                        }`}
                      />
                    </div>
                  </button>
                  {mobileExpanded === 'informasi' && (
                    <div className="bg-white px-2.5 py-2 space-y-1 border-t border-slate-100">
                      {[
                        { label: 'Warta Berita & Prestasi Siswa', sub: 'berita', icon: FileText },
                        { label: 'Pengumuman Resmi Sekolah', sub: 'pengumuman', icon: Bell },
                        { label: 'Tanya Jawab Seputar Sekolah (FAQ)', sub: 'faq', icon: HelpCircle },
                      ].map((item, idx) => {
                        const isSubActive = activeSection === 'informasi' && subTarget === item.sub;
                        return (
                          <button
                            key={idx}
                            onClick={() => handleLinkClick('informasi', item.sub)}
                            className={`w-full text-left py-2.5 px-3 rounded-lg flex items-center justify-between transition-colors text-xs cursor-pointer min-h-[42px] ${
                              isSubActive
                                ? 'bg-blue-50 text-[#003087] font-bold border border-blue-200/60 shadow-2xs'
                                : 'text-slate-700 hover:text-[#003087] hover:bg-blue-50/50'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <item.icon className={`w-3.5 h-3.5 flex-shrink-0 ${isSubActive ? 'text-[#003087]' : 'text-slate-400'}`} />
                              <span>{item.label}</span>
                            </div>
                            <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 ${isSubActive ? 'text-[#003087]' : 'text-slate-300'}`} />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 8. Galeri Foto */}
                <button
                  onClick={() => handleLinkClick('galeri')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-between min-h-[46px] ${
                    activeSection === 'galeri'
                      ? 'bg-[#003087] text-white shadow-xs'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ImageIcon className={`w-4 h-4 ${activeSection === 'galeri' ? 'text-[#FFB800]' : 'text-slate-400'}`} />
                    <span>Galeri Dokumentasi Foto</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 ${activeSection === 'galeri' ? 'text-white/60' : 'text-slate-300'}`} />
                </button>

                {/* 9. Kontak & Lokasi */}
                <button
                  onClick={() => handleLinkClick('kontak')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-between min-h-[46px] ${
                    activeSection === 'kontak'
                      ? 'bg-[#003087] text-white shadow-xs'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Phone className={`w-4 h-4 ${activeSection === 'kontak' ? 'text-[#FFB800]' : 'text-slate-400'}`} />
                    <span>Kontak & Lokasi Kampus</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 ${activeSection === 'kontak' ? 'text-white/60' : 'text-slate-300'}`} />
                </button>
              </div>
            </div>

            {/* Section: AKSES & KONTAK RESMI */}
            <div className="pt-3 border-t border-slate-200/80 space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 font-heading block">
                Akses & Layanan Sekolah
              </span>

              {/* Admin Access Button */}
              <button
                onClick={() => handleLinkClick(currentUser ? 'admin' : 'login')}
                className={`w-full flex items-center justify-center gap-2 font-semibold text-xs sm:text-sm py-3 px-4 rounded-xl border transition-all cursor-pointer shadow-xs min-h-[46px] ${
                  currentUser
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100'
                    : 'bg-[#002260] hover:bg-[#001740] border-[#001740] text-white'
                }`}
              >
                {currentUser ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Buka Panel Dashboard Admin</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-[#FFB800] flex-shrink-0" />
                    <span>Login Petugas / Administrator</span>
                  </>
                )}
              </button>

              {/* Contact Info Card */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 text-[11px] uppercase tracking-wide">
                    Hubungi Sekolah
                  </span>
                  <span className="text-[10px] text-slate-500">Pelayanan Cepat</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Phone className="w-3.5 h-3.5 text-[#003087] flex-shrink-0 mt-0.5" />
                  <a href={`tel:${schoolIdentity.contact.phone.replace(/[^0-9]/g, '')}`} className="hover:underline font-medium text-slate-800 hover:text-[#003087]">
                    {schoolIdentity.contact.phone}
                  </a>
                </div>
                <div className="flex items-start gap-2.5">
                  <Mail className="w-3.5 h-3.5 text-[#003087] flex-shrink-0 mt-0.5" />
                  <a href={`mailto:${schoolIdentity.contact.email}`} className="hover:underline truncate text-slate-700 hover:text-[#003087]">
                    {schoolIdentity.contact.email}
                  </a>
                </div>
                <div className="flex items-start gap-2.5 text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
                  <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span>{schoolIdentity.contact.operatingHours}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
