import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Users,
  Building2,
  Calendar,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Briefcase,
  ShieldCheck,
  Bell,
  GraduationCap,
  ExternalLink,
  Newspaper,
  X,
  User,
  Clock,
  HelpCircle,
  MessageSquare,
} from 'lucide-react';
import { HeroSlider } from './HeroSlider';
import { PosterHeroSection } from './PosterHeroSection';
import {
  schoolIdentity,
  vocationalMajors,
  schoolStats,
  galleryPhotos,
  initialNewsArticles,
  initialAnnouncements,
} from '../data/schoolData';
import { api } from '../services/api';
import { NewsArticle, Announcement, AdminUser, GalleryPhoto } from '../types';

interface HomePageProps {
  currentUser: AdminUser | null;
  onNavigate: (page: string, subTarget?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ currentUser, onNavigate }) => {
  const [liveNews, setLiveNews] = useState<NewsArticle[]>(initialNewsArticles);
  const [liveAnnouncements, setLiveAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [liveGallery, setLiveGallery] = useState<GalleryPhoto[]>(galleryPhotos);

  // Active tab in Kabar Vokasi & Informasi Resmi
  const [infoTab, setInfoTab] = useState<'berita' | 'pengumuman' | 'form'>('berita');
  const [newsCategory, setNewsCategory] = useState<string>('Semua');

  // Modals for reading details
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);
  const [selectedAnn, setSelectedAnn] = useState<Announcement | null>(null);

  useEffect(() => {
    // Fetch latest news, announcements, and gallery from API
    api.getNews().then((data) => {
      if (data && data.length > 0) setLiveNews(data);
    });
    api.getAnnouncements().then((data) => {
      if (data && data.length > 0) setLiveAnnouncements(data);
    });
    const fetchGallery = () => {
      api.getGallery().then((data) => {
        if (data && data.length > 0) setLiveGallery(data);
      });
    };
    fetchGallery();

    window.addEventListener('focus', fetchGallery);
    window.addEventListener('storage', fetchGallery);
    return () => {
      window.removeEventListener('focus', fetchGallery);
      window.removeEventListener('storage', fetchGallery);
    };
  }, []);

  const filteredNews = liveNews.filter((item) => {
    if (newsCategory === 'Semua') return true;
    return item.category === newsCategory;
  });

  return (
    <div className="space-y-0">
      {/* 1. HERO SLIDER */}
      <HeroSlider onNavigate={onNavigate} />

      {/* 2. STATS HIGHLIGHT BAR */}
      <section className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {schoolStats.map((stat) => (
              <div key={stat.id} className="p-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#003087] font-heading mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-800 font-heading">
                  {stat.label}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SEKILAS SAMBUTAN KEPALA SEKOLAH & PROFIL SINGKAT */}
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Foto Kepala Sekolah */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-64 max-w-full">
                <div className="absolute -inset-2 rounded-xl border-4 border-[#FFB800] -z-10 translate-x-3 translate-y-3" />
                <div className="rounded-xl overflow-hidden aspect-[4/5] bg-slate-100 shadow-md">
                  <img
                    src={schoolIdentity.principal.photo}
                    alt={schoolIdentity.principal.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Teks Ringkas & CTA */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#003087] text-xs font-semibold">
                <GraduationCap className="w-3.5 h-3.5 text-[#FFB800]" />
                <span>Selamat Datang di SMK Negeri 1 Ujung Batu</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-[#003087] font-heading leading-snug">
                Pusat Keunggulan Pendidikan Vokasi Terampil, Mandiri & Siap Kerja
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                Di era transformasi industri modern, SMK Negeri 1 Ujung Batu hadir membekali putra-putri Kabupaten Rokan Hulu dengan kurikulum berbasis industri, sertifikasi profesi resmi BNSP, unit Teaching Factory (TEFA), dan jejaring kemitraan luas dengan puluhan dunia usaha dan dunia industri.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <ShieldCheck className="w-5 h-5 text-[#003087] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 font-heading">Akreditasi A & Tempat Uji BNSP</h4>
                    <p className="text-[11px] text-slate-500">Standar mutu terakreditasi BAN-S/M dengan Tempat Uji Kompetensi mandiri.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <Briefcase className="w-5 h-5 text-[#003087] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 font-heading">Penyaluran Kerja BKK Aktif</h4>
                    <p className="text-[11px] text-slate-500">Bursa Kerja Khusus aktif memfasilitasi penempatan dan rekrutmen alumni.</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigate('profil', 'sambutan')}
                  className="inline-flex items-center gap-2 bg-[#003087] hover:bg-[#002260] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  <span>Baca Profil Lengkap Sekolah</span>
                  <ArrowRight className="w-4 h-4 text-[#FFB800]" />
                </button>

                <button
                  onClick={() => onNavigate('profil', 'guru')}
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-lg border border-slate-300 transition-colors cursor-pointer"
                >
                  <Users className="w-4 h-4 text-[#003087]" />
                  <span>Daftar Guru & Tendik</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. KABAR VOKASI & PENGUMUMAN RESMI */}
      {/* ========================================================================= */}
      <section className="py-16 bg-[#F8F9FA] border-y border-slate-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#003087] text-xs font-bold uppercase tracking-wider mb-2">
                <Newspaper className="w-3.5 h-3.5 text-[#FFB800]" />
                <span>Kabar Vokasi & Pengumuman Sekolah</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#003087] font-heading mt-0.5">
                Kabar Vokasi & Informasi Resmi
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                Dapatkan rilis berita kegiatan kejuruan, edaran kedinasan resmi, dan pengumuman terbaru SMK Negeri 1 Ujung Batu.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={() => onNavigate('informasi')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#003087] hover:underline cursor-pointer"
              >
                <span>Lihat Arsip Lengkap</span>
                <ArrowRight className="w-4 h-4 text-[#FFB800]" />
              </button>
            </div>
          </div>

          {/* Feed Container */}
          <div className="space-y-6">
            {/* Tab Switcher & Category Filters */}
            <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setInfoTab('berita')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    infoTab === 'berita'
                      ? 'bg-[#003087] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#003087] hover:bg-slate-100'
                  }`}
                >
                  <Newspaper className="w-3.5 h-3.5" />
                  <span>Kabar Vokasi ({liveNews.length})</span>
                </button>

                <button
                  onClick={() => setInfoTab('pengumuman')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    infoTab === 'pengumuman'
                      ? 'bg-[#003087] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#003087] hover:bg-slate-100'
                  }`}
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Pengumuman Resmi ({liveAnnouncements.length})</span>
                </button>
              </div>

              {infoTab === 'berita' && (
                <div className="flex items-center gap-1 overflow-x-auto text-[11px] py-0.5">
                  {['Semua', 'LKS & Prestasi', 'Kegiatan PKL', 'Kunjungan Industri'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setNewsCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                        newsCategory === cat
                          ? 'bg-blue-100 text-[#003087] font-bold'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* LIST KABAR VOKASI - Responsive 3-Column Card Grid */}
            {infoTab === 'berita' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNews.slice(0, 3).map((article) => (
                  <div
                    key={article.id}
                    onClick={() => setSelectedNews(article)}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg hover:border-[#003087]/50 transition-all flex flex-col group cursor-pointer"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 flex-shrink-0">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-[#003087] text-white font-bold text-[10px] px-2.5 py-0.5 rounded-md shadow-xs">
                        {article.category}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                          <Calendar className="w-3 h-3 text-[#FFB800]" />
                          <span>{article.date}</span>
                          <span>•</span>
                          <span>{article.author}</span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 font-heading line-clamp-2 leading-snug group-hover:text-[#003087] transition-colors mb-2">
                          {article.title}
                        </h3>

                        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                          {article.excerpt}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#003087]">
                        <span>Baca Rincian</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#FFB800] group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* LIST PENGUMUMAN RESMI */}
            {infoTab === 'pengumuman' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {liveAnnouncements.slice(0, 3).map((ann) => (
                  <div
                    key={ann.id}
                    onClick={() => setSelectedAnn(ann)}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#003087] hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between gap-4 group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                            ann.important
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-blue-100 text-[#003087]'
                          }`}
                        >
                          {ann.important ? 'Penting' : 'Pengumuman'}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          Target: {ann.targetAudience}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {ann.date}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-slate-800 font-heading group-hover:text-[#003087] transition-colors line-clamp-2">
                        {ann.title}
                      </h4>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {ann.content}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#003087] group-hover:underline flex items-center gap-1">
                        <span>Buka Edaran</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#FFB800] group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4.5. HERO SLIDER POSTER SEKOLAH & PPDB (DI BAWAH PORTAL & FORMULIR) */}
      {/* ========================================================================= */}
      <PosterHeroSection onNavigate={onNavigate} />

      {/* ========================================================================= */}
      {/* 5. PILIHAN KEJURUAN UNGGULAN (DITEMPATKAN DIBAWAH KABAR VOKASI & INFORMASI) */}
      {/* ========================================================================= */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-[#FFB800] uppercase tracking-wider block font-heading">
                PILIHAN KEJURUAN UNGGULAN
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#003087] font-heading mt-1">
                6 Program Keahlian Berstandar Industri
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                Kurikulum terpadu dengan praktik bengkel mandiri, sertifikasi BNSP, dan unit Teaching Factory.
              </p>
            </div>

            <button
              onClick={() => onNavigate('program-keahlian')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#003087] hover:text-[#002260] hover:underline cursor-pointer flex-shrink-0"
            >
              <span>Jelajahi Semua Jurusan & TEFA</span>
              <ArrowRight className="w-4 h-4 text-[#FFB800]" />
            </button>
          </div>

          {/* 6 Jurusan Grid Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vocationalMajors.map((major) => (
              <div
                key={major.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={major.bannerImage}
                    alt={major.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-[#003087] text-white font-bold text-[11px] px-2.5 py-1 rounded shadow-xs">
                    {major.code}
                  </div>
                  <div className="absolute top-3 right-3 bg-[#FFB800] text-[#002260] font-bold text-[10px] px-2 py-0.5 rounded shadow-xs">
                    {major.badge}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#003087] font-heading leading-tight mb-2 group-hover:text-blue-700 transition-colors">
                      {major.name}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                      {major.description}
                    </p>

                    <div className="space-y-1.5 mb-4">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Peluang Karir:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {major.careerProspects.slice(0, 3).map((career, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium"
                          >
                            {career}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => onNavigate('program-keahlian', major.id)}
                      className="text-xs font-semibold text-[#003087] hover:text-[#002260] flex items-center gap-1 cursor-pointer"
                    >
                      <span>Lihat Kompetensi</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#FFB800]" />
                    </button>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Praktik 70%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Teaching Factory Banner */}
          <div className="mt-10 bg-[#003087] rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-2 text-center md:text-left">
              <span className="inline-block px-2.5 py-0.5 rounded bg-[#FFB800] text-[#002260] text-xs font-bold">
                Teaching Factory (TEFA)
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-heading">
                Unit Usaha Siswa yang Melayani Masyarakat Nyata
              </h3>
              <p className="text-xs sm:text-sm text-white/80 max-w-2xl">
                Dari servis kendaraan bermotor, instalasi jaringan komputer, minimarket ritel modern, hingga studio penyiaran audio-visual.
              </p>
            </div>
            <button
              onClick={() => onNavigate('program-keahlian', 'tefa')}
              className="px-5 py-2.5 rounded-xl bg-[#FFB800] hover:bg-[#e0a200] text-[#002260] font-bold text-xs sm:text-sm shadow-xs transition-colors flex-shrink-0 cursor-pointer"
            >
              Lihat Unit Produksi TEFA
            </button>
          </div>
        </div>
      </section>

      {/* 6. KEMITRAAN DU/DI & JAMINAN PKL */}
      <section className="py-16 bg-[#F8F9FA] border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold text-[#FFB800] uppercase tracking-wider block font-heading">
                LINK & MATCH DUNIA KERJA
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#003087] font-heading leading-snug">
                Kerja Sama 45+ Mitra Industri & Penyaluran Karir BKK
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                SMK Negeri 1 Ujung Batu menjalin kemitraan erat dengan berbagai industri skala lokal hingga multinasional untuk program Praktik Kerja Lapangan (PKL) 6 bulan, sertifikasi kompetensi keahlian BNSP, hingga rekrutmen alumni.
              </p>
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Jaminan penempatan PKL terverifikasi di industri</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Sertifikasi resmi BNSP di Tempat Uji Kompetensi (TUK)</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Bursa Kerja Khusus (BKK) resmi terdaftar di Dinas Tenaga Kerja</span>
                </div>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('pkl-bkk')}
                  className="inline-flex items-center gap-2 bg-[#003087] hover:bg-[#002260] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  <span>Lihat Daftar Mitra DU/DI & Lowongan Karir</span>
                  <ArrowRight className="w-4 h-4 text-[#FFB800]" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#003087] flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#003087] font-heading">
                  Praktik Kerja Lapangan (PKL)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Program magang industri selama 6 bulan untuk mengasah etos kerja nyata, kedisiplinan industri, serta adaptasi teknologi terkini.
                </p>
                <button
                  onClick={() => onNavigate('pkl-bkk', 'pkl')}
                  className="text-xs font-bold text-[#003087] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Panduan & Alur PKL</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#FFB800]" />
                </button>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#003087] font-heading">
                  Bursa Kerja Khusus (BKK)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Layanan terpadu penjaringan tenaga kerja alumni, bursa lowongan karir, dan pembekalan persiapan tes seleksi kerja.
                </p>
                <button
                  onClick={() => onNavigate('pkl-bkk', 'bkk')}
                  className="text-xs font-bold text-[#003087] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Info Lowongan Karir BKK</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#FFB800]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. DOKUMENTASI & GALERI PREVIEW */}
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-[#FFB800] uppercase tracking-wider block font-heading">
                DOKUMENTASI SEKOLAH
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#003087] font-heading mt-1">
                Dokumentasi Sekolah
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Aktivitas Siswa & Suasana Belajar Vokasi SMK Negeri 1 Ujung Batu
              </p>
            </div>
            <button
              onClick={() => onNavigate('galeri')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#003087] hover:text-[#002260] hover:underline cursor-pointer flex-shrink-0"
            >
              <span>Buka Galeri Foto Lengkap</span>
              <ArrowRight className="w-4 h-4 text-[#FFB800]" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {liveGallery.slice(0, 4).map((photo) => (
              <div
                key={`${photo.id}-${photo.imageUrl}`}
                onClick={() => onNavigate('galeri')}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 cursor-pointer shadow-xs"
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.caption || photo.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-xs font-medium text-white line-clamp-2">
                    {photo.caption || photo.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION: PPDB RIAU */}
      <section className="py-16 bg-[#002260] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 text-center relative z-10 space-y-6">
          <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-[#FFB800] text-xs font-bold border border-white/15">
            Penerimaan Peserta Didik Baru (PPDB) TA 2025/2026
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-heading leading-tight max-w-2xl mx-auto">
            Daftar ke SMKN 1 Ujung Batu via Portal Resmi PPDB Provinsi Riau
          </h2>
          <p className="text-sm sm:text-base text-white/80 max-w-xl mx-auto leading-relaxed">
            Pendaftaran peserta didik baru SMK Negeri di Kabupaten Rokan Hulu diatur secara terpusat melalui portal seleksi resmi Dinas Pendidikan Pemerintah Provinsi Riau di <strong>PPDB Riau</strong>.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://pmb.riau.go.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#FFB800] hover:bg-[#e0a200] text-[#002260] font-bold text-sm px-6 py-3.5 rounded-full transition-all shadow-md cursor-pointer font-heading"
            >
              <GraduationCap className="w-5 h-5" />
              <span>Buka Portal PPDB Riau</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={() => onNavigate('ppdb')}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-5 py-3.5 rounded-full border border-white/20 transition-all cursor-pointer font-heading"
            >
              <span>Panduan & Syarat Berkas</span>
              <ArrowRight className="w-4 h-4 text-[#FFB800]" />
            </button>
            <button
              onClick={() => onNavigate('kontak')}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium text-sm px-5 py-3.5 rounded-full border border-white/20 transition-all cursor-pointer font-heading"
            >
              <Phone className="w-4 h-4 text-[#FFB800]" />
              <span>Hubungi Kontak Sekolah</span>
            </button>
          </div>
        </div>
      </section>

      {/* 9. KONTAK RESMI & ALAMAT KAMPUS */}
      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <MapPin className="w-5 h-5 text-[#003087] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-800 font-heading">Alamat Kampus</h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  {schoolIdentity.contact.address}, Rokan Hulu, Riau
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <Phone className="w-5 h-5 text-[#003087] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-800 font-heading">Telepon & WhatsApp</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  {schoolIdentity.contact.phone}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <Mail className="w-5 h-5 text-[#003087] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-800 font-heading">Email Resmi</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  {schoolIdentity.contact.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL BACA BERITA */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-4 relative shadow-2xl animate-in fade-in">
            <button
              onClick={() => setSelectedNews(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="inline-block px-2.5 py-0.5 rounded bg-blue-50 text-[#003087] font-bold text-xs">
              {selectedNews.category}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#003087] font-heading leading-snug">
              {selectedNews.title}
            </h3>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {selectedNews.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {selectedNews.author}
              </span>
            </div>
            <div className="rounded-xl overflow-hidden aspect-[16/9] bg-slate-100">
              <img
                src={selectedNews.image}
                alt={selectedNews.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-sm text-slate-700 leading-relaxed space-y-3 pt-2">
              <p className="font-semibold text-slate-800">
                {selectedNews.excerpt}
              </p>
              <p>{selectedNews.content}</p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedNews(null)}
                className="px-5 py-2 rounded-lg bg-[#003087] text-white text-xs font-bold hover:bg-[#002260] transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL BACA PENGUMUMAN */}
      {selectedAnn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-4 relative shadow-2xl animate-in fade-in">
            <button
              onClick={() => setSelectedAnn(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#003087]" />
              <span className="text-xs font-bold text-slate-400">PENGUMUMAN RESMI</span>
            </div>
            <h3 className="text-lg font-bold text-[#003087] font-heading">
              {selectedAnn.title}
            </h3>
            <div className="text-xs text-slate-500 space-y-1">
              <div>Tanggal Rilis: <strong>{selectedAnn.date}</strong></div>
              <div>Penerima: <strong>{selectedAnn.targetAudience}</strong></div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
              {selectedAnn.content}
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedAnn(null)}
                className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-300 transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
