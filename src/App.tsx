import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { SchoolProfile } from './components/SchoolProfile';
import { VocationalPrograms } from './components/VocationalPrograms';
import { PklBkkSection } from './components/PklBkkSection';
import { KesiswaanPage } from './components/KesiswaanPage';
import { InformasiPage } from './components/InformasiPage';
import { GallerySection } from './components/GallerySection';
import { ContactSection } from './components/ContactSection';
import { PpdbPage } from './components/PpdbPage';
import { LoginPage } from './components/LoginPage';
import { AdminDashboard } from './components/AdminDashboard';
import { JadwalPembelajaranPage } from './components/JadwalPembelajaranPage';
import { Footer } from './components/Footer';
import { api, authStorage } from './services/api';
import { AdminUser } from './types';

// Helper untuk parsing hash URL (contoh: #profil?sub=visi-misi atau #ppdb)
const parseLocationFromHash = (): { page: string; sub?: string } => {
  try {
    const raw = window.location.hash || '';
    const clean = raw.replace(/^#\/?/, '').trim();
    if (!clean) return { page: 'beranda' };

    const [pagePart, queryPart] = clean.split('?');
    let sub: string | undefined = undefined;
    if (queryPart) {
      const params = new URLSearchParams(queryPart);
      sub = params.get('sub') || undefined;
    }
    return { page: pagePart || 'beranda', sub };
  } catch {
    return { page: 'beranda' };
  }
};

// Helper untuk membangun hash URL yang konsisten dan bookmarkable
const buildLocationHash = (page: string, sub?: string): string => {
  if (page === 'beranda' && !sub) return '#beranda';
  return `#${page}${sub ? `?sub=${encodeURIComponent(sub)}` : ''}`;
};

// Normalisasi rute dan proteksi autentikasi admin
const normalizeTargetRoute = (pageId: string, sub?: string, isAuthenticated?: boolean) => {
  let targetPage = pageId;
  let targetSub = sub;

  // Normalisasi legacy alias jika ada
  if (pageId === 'berita-pengumuman') {
    targetPage = 'informasi';
    targetSub = targetSub || 'berita';
  } else if (pageId === 'faq') {
    targetPage = 'informasi';
    targetSub = 'faq';
  } else if (pageId === 'layanan-bk') {
    targetPage = 'kesiswaan';
    targetSub = 'bk';
  }

  // Auth gate untuk halaman admin
  if (targetPage === 'admin' && !isAuthenticated) {
    targetPage = 'login';
  } else if (targetPage === 'login' && isAuthenticated) {
    targetPage = 'admin';
  }

  return { targetPage, targetSub };
};

// Peta SEO Metadata Dinamis per Halaman
const PAGE_SEO_CONFIG: Record<string, { title: string; description: string }> = {
  beranda: {
    title: 'SMK Negeri 1 Ujung Batu - Terampil, Kompeten, Mandiri, dan Siap Kerja',
    description: 'Website Resmi SMK Negeri 1 Ujung Batu, Rokan Hulu, Riau - Terampil, Kompeten, Mandiri, dan Siap Kerja dengan Sistem Informasi Berita & Pengumuman Sekolah.',
  },
  profil: {
    title: 'Profil & Sejarah Sekolah - SMK Negeri 1 Ujung Batu',
    description: 'Profil lengkap, visi & misi, sejarah, struktur kepemimpinan, dan sarana prasarana SMK Negeri 1 Ujung Batu.',
  },
  'program-keahlian': {
    title: 'Program Keahlian & Jurusan Vokasi - SMK Negeri 1 Ujung Batu',
    description: '6 Konsentrasi Keahlian Unggulan: TKRO, TBSM, TKJ, BDP, Teknik Elektronika Industri, dan Tata Logistik berstandar industri.',
  },
  'pkl-bkk': {
    title: 'PKL Industri & Bursa Kerja Khusus (BKK) - SMK Negeri 1 Ujung Batu',
    description: 'Penyaluran kerja alumni, kemitraan magang industri DU/DI terakreditasi, dan Bursa Kerja Khusus aktif SMKN 1 Ujung Batu.',
  },
  jadwal: {
    title: 'Jadwal Pembelajaran & Guru Pengajar - SMK Negeri 1 Ujung Batu',
    description: 'Jadwal pelajaran interaktif kurikulum merdeka dan daftar dewan guru pengajar SMK Negeri 1 Ujung Batu.',
  },
  kesiswaan: {
    title: 'Kesiswaan, OSIS & Ekstrakurikuler - SMK Negeri 1 Ujung Batu',
    description: 'Wadah pengembangan karakter, kegiatan OSIS, MPK, Pramuka, Rohis, dan aneka ekstrakurikuler SMKN 1 Ujung Batu.',
  },
  informasi: {
    title: 'Warta Berita & Pengumuman Resmi - SMK Negeri 1 Ujung Batu',
    description: 'Rilis berita kegiatan terkini, prestasi siswa, surat edaran, dan pengumuman resmi dinas SMKN 1 Ujung Batu.',
  },
  galeri: {
    title: 'Galeri Foto & Fasilitas Kampus - SMK Negeri 1 Ujung Batu',
    description: 'Dokumentasi foto kegiatan praktik bengkel, laboratorium komputer, upacara, dan fasilitas belajar SMKN 1 Ujung Batu.',
  },
  ppdb: {
    title: 'Informasi PPDB Online - SMK Negeri 1 Ujung Batu',
    description: 'Panduan jalur pendaftaran peserta didik baru, persyaratan berkas, dan posko konsultasi PPDB SMKN 1 Ujung Batu.',
  },
  kontak: {
    title: 'Kontak & Lokasi Kampus - SMK Negeri 1 Ujung Batu',
    description: 'Alamat lengkap, nomor telepon, WhatsApp helpdesk, dan formulir pesan resmi SMK Negeri 1 Ujung Batu.',
  },
  login: {
    title: 'Login Administrator - SMK Negeri 1 Ujung Batu',
    description: 'Portal autentikasi sistem informasi dan administrasi website SMK Negeri 1 Ujung Batu.',
  },
  admin: {
    title: 'Panel Admin Dashboard - SMK Negeri 1 Ujung Batu',
    description: 'Pengelolaan konten berita, pengumuman, dan data sekolah SMK Negeri 1 Ujung Batu.',
  },
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>(() => {
    const parsed = parseLocationFromHash();
    return parsed.page || 'beranda';
  });
  const [subTarget, setSubTarget] = useState<string | undefined>(() => {
    const parsed = parseLocationFromHash();
    return parsed.sub;
  });
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  // Dynamic SEO Synchronization
  useEffect(() => {
    const seo = PAGE_SEO_CONFIG[currentPage] || PAGE_SEO_CONFIG.beranda;
    document.title = seo.title;

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', seo.description);
    }
  }, [currentPage]);

  // Check auth session on startup
  useEffect(() => {
    api.checkAuth().then((user) => {
      if (user) {
        setCurrentUser(user);
      }
    });
  }, []);

  // Sinkronisasi navigasi browser (Browser History: popstate, pushState, go to back)
  useEffect(() => {
    const initial = parseLocationFromHash();
    const isAuthed = !!authStorage.getUser();
    const { targetPage, targetSub } = normalizeTargetRoute(initial.page, initial.sub, isAuthed);

    setCurrentPage(targetPage);
    setSubTarget(targetSub);

    // Pastikan history state terisi pada first load jika belum ada
    if (!window.history.state || !window.history.state.page) {
      window.history.replaceState(
        { page: targetPage, sub: targetSub },
        '',
        buildLocationHash(targetPage, targetSub)
      );
    }

    // Handler ketika user menekan tombol "Back" / "Kembali" pada browser, swipe back di mobile, atau Alt+Left
    const handlePopState = (event: PopStateEvent) => {
      let page: string;
      let sub: string | undefined;

      if (event.state && typeof event.state.page === 'string') {
        page = event.state.page;
        sub = event.state.sub;
      } else {
        const parsed = parseLocationFromHash();
        page = parsed.page;
        sub = parsed.sub;
      }

      const authed = !!authStorage.getUser();
      const normalized = normalizeTargetRoute(page, sub, authed);

      setCurrentPage(normalized.targetPage);
      setSubTarget(normalized.targetSub);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (pageId: string, sub?: string, replace: boolean = false) => {
    const isAuthed = !!currentUser || !!authStorage.getUser();
    const { targetPage, targetSub } = normalizeTargetRoute(pageId, sub, isAuthed);

    // Jika target sama persis dengan halaman saat ini, scroll ke atas
    if (targetPage === currentPage && targetSub === subTarget) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const newHash = buildLocationHash(targetPage, targetSub);

    if (replace) {
      window.history.replaceState({ page: targetPage, sub: targetSub }, '', newHash);
    } else {
      window.history.pushState({ page: targetPage, sub: targetSub }, '', newHash);
    }

    setCurrentPage(targetPage);
    setSubTarget(targetSub);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler kembali ke halaman sebelumnya (go to back)
  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      handleNavigate('beranda');
    }
  };

  const handleLoginSuccess = (user: AdminUser) => {
    setCurrentUser(user);
    handleNavigate('admin', undefined, true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    handleNavigate('beranda', undefined, true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If on login or admin view, render specialized layouts
  if (currentPage === 'login') {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onNavigateHome={handleGoBack}
      />
    );
  }

  if (currentPage === 'admin' && currentUser) {
    return (
      <AdminDashboard
        currentUser={currentUser}
        activeTabProp={subTarget}
        onTabChange={(tab) => {
          handleNavigate('admin', tab, false);
        }}
        onLogout={handleLogout}
        onNavigateHome={() => handleNavigate('beranda')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-[#FFB800] selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        activeSection={currentPage}
        currentUser={currentUser}
        onNavigate={handleNavigate}
        subTarget={subTarget}
      />

      {/* Main Content Area */}
      <main className="flex-grow pt-[84px] md:pt-[88px]">
        {currentPage === 'beranda' && (
          <HomePage
            currentUser={currentUser}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'profil' && (
          <SchoolProfile
            initialTab={subTarget}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'program-keahlian' && (
          <VocationalPrograms
            initialMajorId={subTarget}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'pkl-bkk' && (
          <PklBkkSection
            initialTab={subTarget}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'kesiswaan' && (
          <KesiswaanPage
            initialTab={subTarget}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'informasi' && (
          <InformasiPage
            initialTab={subTarget}
            currentUser={currentUser}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'galeri' && (
          <GallerySection
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'ppdb' && (
          <PpdbPage
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'jadwal' && (
          <JadwalPembelajaranPage
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'kontak' && (
          <ContactSection
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer
        currentUser={currentUser}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
