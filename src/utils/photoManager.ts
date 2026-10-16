/**
 * SISTEM MANAJEMEN & PEMANGGILAN FOTO SEKOLAH
 * SMK Negeri 1 Ujung Batu
 *
 * File ini menyediakan utilitas terpusat untuk memanggil dan mengelola foto
 * yang tersimpan di dalam struktur folder:
 * public/images/
 *   ├── logo/
 *   ├── hero/
 *   ├── profil/
 *   ├── jurusan/
 *   ├── galeri/
 *   │     ├── praktik/
 *   │     ├── kegiatan/
 *   │     ├── industri/
 *   │     └── guru/
 *   ├── guru/
 *   ├── berita/
 *   └── ekskul/
 */

export type PhotoCategory =
  | 'logo'
  | 'hero'
  | 'profil'
  | 'jurusan'
  | 'galeri/praktik'
  | 'galeri/kegiatan'
  | 'galeri/industri'
  | 'galeri/guru'
  | 'guru'
  | 'berita'
  | 'poster'
  | 'ekskul';

export interface PhotoAsset {
  id: string;
  title: string;
  category: PhotoCategory;
  filename: string;
  localPath: string;
  fallbackUrl: string;
  description?: string;
  tags?: string[];
}

/**
 * Cadangan URL online berkualitas tinggi (Unsplash terkurasi pendidikan & vokasi)
 * Berfungsi sebagai automatic fallback apabila file fisik lokal belum di-upload ke folder public/images/
 */
export const FALLBACK_IMAGE_LIBRARY: Record<string, string> = {
  // Logo & Identitas Resmi Sekolah
  'logo-sekolah': '/images/logo/logo-smkn1.png',
  'tut-wuri': '/images/logo/logo-smkn1.png',

  // Hero Banners
  'hero-1': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1920',
  'hero-2': 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=1920',
  'hero-3': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1920',

  // Profil & Kepala Sekolah
  'kepala-sekolah': 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800',
  'gedung-utama': 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200',
  'sarpras-lab': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1200',
  'sarpras-bengkel': 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=1200',

  // Jurusan
  'jurusan-tkj': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1000',
  'jurusan-to': 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=1000',
  'jurusan-bdp': 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&q=80&w=1000',
  'jurusan-te': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1000',
  'jurusan-tlog': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000',
  'jurusan-bp': 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=1000',

  // Galeri Praktik
  'galeri-mesin': 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=800',
  'galeri-fiber-optic': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800',
  'galeri-broadcasting': 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800',
  'galeri-ukk': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',

  // Galeri Kegiatan & Industri
  'galeri-upacara': 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
  'galeri-kunjungan-industri': 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800',
  'galeri-pelepasan-pkl': 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=800',
  'galeri-pelatihan-guru': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800',

  // Poster Digital & PPDB
  'poster-ppdb': 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200',
  'poster-lks': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200',
  'poster-tefa': 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=1200',
  'poster-tkj': 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200',
  'poster-karya': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200',
  'poster-ekskul': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1200',
};

/**
 * Katalog Registry Foto Resmi Sekolah
 * Berisi peta struktur folder lokal dan URL cadangannya
 */
export const PHOTO_CATALOG: PhotoAsset[] = [
  // 0. Identitas & Lambang Resmi Sekolah
  {
    id: 'logo-smkn1',
    title: 'Logo Resmi SMK Negeri 1 Ujung Batu',
    category: 'logo',
    filename: 'logo smkn1.png',
    localPath: '/images/logo/logo-smkn1.png',
    fallbackUrl: '/images/logo/logo-smkn1.png',
    description: 'Lambang resmi perisai segilima, bintang emas, gear teknologi, obor ilmu, padi & kapas, serta pita Ujung Batu',
    tags: ['logo', 'identitas', 'lambang', 'smk'],
  },

  // 1. Profil & Pimpinan
  {
    id: 'profil-kepala-sekolah',
    title: 'Foto Kepala Sekolah (Drs. H. Sabarudin, M.Pd.)',
    category: 'profil',
    filename: 'kepala-sekolah.jpg',
    localPath: '/images/profil/kepala-sekolah.jpg',
    fallbackUrl: FALLBACK_IMAGE_LIBRARY['kepala-sekolah'],
    description: 'Potret formal pimpinan SMKN 1 Ujung Batu untuk sambutan dan profil sekolah',
    tags: ['pimpinan', 'kepala sekolah', 'profil'],
  },
  {
    id: 'profil-gedung-utama',
    title: 'Gedung Utama & Kampus Hijau',
    category: 'profil',
    filename: 'gedung-utama.jpg',
    localPath: '/images/profil/gedung-utama.jpg',
    fallbackUrl: FALLBACK_IMAGE_LIBRARY['gedung-utama'],
    description: 'Tampak depan gerbang utama dan ruang perkantoran kampus',
    tags: ['gedung', 'sarpras', 'kampus'],
  },

  // 2. Banner Hero
  {
    id: 'hero-banner-1',
    title: 'Banner Utama: Vokasi Unggul Berkarakter',
    category: 'hero',
    filename: 'banner-utama.jpg',
    localPath: '/images/hero/banner-utama.jpg',
    fallbackUrl: FALLBACK_IMAGE_LIBRARY['hero-1'],
    description: 'Slider beranda utama menampilkan suasana kelas dan bengkel modern',
    tags: ['hero', 'slider', 'beranda'],
  },
  {
    id: 'hero-banner-2',
    title: 'Banner Kedua: Praktik Industri & TEFA',
    category: 'hero',
    filename: 'banner-industri.jpg',
    localPath: '/images/hero/banner-industri.jpg',
    fallbackUrl: FALLBACK_IMAGE_LIBRARY['hero-2'],
    description: 'Dokumentasi keterlibatan siswa pada Teaching Factory dan bengkel resmi',
    tags: ['hero', 'tefa', 'industri'],
  },

  // 3. Program Keahlian
  {
    id: 'jurusan-tkj',
    title: 'Teknik Komputer & Jaringan (TKJ)',
    category: 'jurusan',
    filename: 'tkj.jpg',
    localPath: '/images/jurusan/tkj.jpg',
    fallbackUrl: FALLBACK_IMAGE_LIBRARY['jurusan-tkj'],
    description: 'Laboratorium jaringan komputer, fiber optic, dan rack router Mikrotik/Cisco',
    tags: ['jurusan', 'tkj', 'it', 'jaringan'],
  },
  {
    id: 'jurusan-to',
    title: 'Teknik Otomotif (TO)',
    category: 'jurusan',
    filename: 'to.jpg',
    localPath: '/images/jurusan/to.jpg',
    fallbackUrl: FALLBACK_IMAGE_LIBRARY['jurusan-to'],
    description: 'Bengkel servis mobil injeksi EFI, spooring balancing, dan motor listrik',
    tags: ['jurusan', 'otomotif', 'to', 'mesin'],
  },
  {
    id: 'jurusan-bdp',
    title: 'Bisnis Daring & Pemasaran (BDP)',
    category: 'jurusan',
    filename: 'bdp.jpg',
    localPath: '/images/jurusan/bdp.jpg',
    fallbackUrl: FALLBACK_IMAGE_LIBRARY['jurusan-bdp'],
    description: 'Laboratorium retail modern, e-commerce marketplace, dan kasir POS digital',
    tags: ['jurusan', 'bdp', 'bisnis', 'marketing'],
  },
  {
    id: 'jurusan-te',
    title: 'Teknik Elektronika Industri (TE)',
    category: 'jurusan',
    filename: 'te.jpg',
    localPath: '/images/jurusan/te.jpg',
    fallbackUrl: FALLBACK_IMAGE_LIBRARY['jurusan-te'],
    description: 'Bengkel kendali PLC, mikrokontroler IoT, sensor industri, dan otomasi',
    tags: ['jurusan', 'te', 'elektronika', 'plc'],
  },
  {
    id: 'jurusan-tlog',
    title: 'Teknik Logistik Pergudangan (TLOG)',
    category: 'jurusan',
    filename: 'tlog.jpg',
    localPath: '/images/jurusan/tlog.jpg',
    fallbackUrl: FALLBACK_IMAGE_LIBRARY['jurusan-tlog'],
    description: 'Simulasi pergudangan modern WMS, supply chain, dan barcode inventory',
    tags: ['jurusan', 'tlog', 'logistik', 'gudang'],
  },
  {
    id: 'jurusan-bp',
    title: 'Broadcasting & Perfilman (BP)',
    category: 'jurusan',
    filename: 'bp.jpg',
    localPath: '/images/jurusan/bp.jpg',
    fallbackUrl: FALLBACK_IMAGE_LIBRARY['jurusan-bp'],
    description: 'Studio green screen podcast siaran TV digital, lighting, dan editing film',
    tags: ['jurusan', 'broadcasting', 'bp', 'film', 'multimedia'],
  },

  // 4. Galeri Praktik
  {
    id: 'galeri-praktik-1',
    title: 'Praktik Overhaul Mesin Otomotif',
    category: 'galeri/praktik',
    filename: 'mesin-overhaul.jpg',
    localPath: '/images/galeri/praktik/mesin-overhaul.jpg',
    fallbackUrl: FALLBACK_IMAGE_LIBRARY['galeri-mesin'],
    description: 'Siswa kelas XII mempraktikkan overhaul mesin mobil 4 silinder',
    tags: ['galeri', 'praktik', 'otomotif'],
  },
  {
    id: 'galeri-praktik-2',
    title: 'Splicing Fiber Optic & Rack Server Lab TKJ',
    category: 'galeri/praktik',
    filename: 'splicing-fo.jpg',
    localPath: '/images/galeri/praktik/splicing-fo.jpg',
    fallbackUrl: FALLBACK_IMAGE_LIBRARY['galeri-fiber-optic'],
    description: 'Penyambungan kabel serat optik dengan fussion splicer redaman rendah',
    tags: ['galeri', 'praktik', 'tkj', 'fiber'],
  },
  {
    id: 'galeri-praktik-3',
    title: 'Produksi Iklan Produk di Studio Green Screen',
    category: 'galeri/praktik',
    filename: 'green-screen.jpg',
    localPath: '/images/galeri/praktik/green-screen.jpg',
    fallbackUrl: FALLBACK_IMAGE_LIBRARY['galeri-broadcasting'],
    description: 'Shooting video komersial siswa Broadcasting dengan tata lampu studio',
    tags: ['galeri', 'praktik', 'studio', 'broadcasting'],
  },
  {
    id: 'galeri-praktik-4',
    title: 'Uji Kompetensi Keahlian (UKK) Asesor BNSP',
    category: 'galeri/praktik',
    filename: 'ukk-bnsp.jpg',
    localPath: '/images/galeri/praktik/ukk-bnsp.jpg',
    fallbackUrl: FALLBACK_IMAGE_LIBRARY['galeri-ukk'],
    description: 'Ujian praktik sertifikasi profesi nasional di Tempat Uji Kompetensi',
    tags: ['galeri', 'praktik', 'ukk', 'bnsp'],
  },

  // 5. Galeri Kegiatan & Industri
  {
    id: 'galeri-kegiatan-1',
    title: 'Upacara Hardiknas di Lapangan Utama',
    category: 'galeri/kegiatan',
    filename: 'upacara-hardiknas.jpg',
    localPath: '/images/galeri/kegiatan/upacara-hardiknas.jpg',
    fallbackUrl: FALLBACK_IMAGE_LIBRARY['galeri-upacara'],
    description: 'Peringatan Hari Pendidikan Nasional segenap dewan guru dan siswa',
    tags: ['galeri', 'kegiatan', 'upacara'],
  },
  {
    id: 'galeri-industri-1',
    title: 'Kunjungan Industri ke Data Center Provider Pekanbaru',
    category: 'galeri/industri',
    filename: 'ki-pekanbaru.jpg',
    localPath: '/images/galeri/industri/ki-pekanbaru.jpg',
    fallbackUrl: FALLBACK_IMAGE_LIBRARY['galeri-kunjungan-industri'],
    description: 'Studi lapangan siswa dan guru ke fasilitas NOC penyedia internet',
    tags: ['galeri', 'industri', 'ki', 'datacenter'],
  },
  {
    id: 'galeri-industri-2',
    title: 'Pelepasan Siswa PKL ke Mitra Industri',
    category: 'galeri/industri',
    filename: 'pelepasan-pkl.jpg',
    localPath: '/images/galeri/industri/pelepasan-pkl.jpg',
    fallbackUrl: FALLBACK_IMAGE_LIBRARY['galeri-pelepasan-pkl'],
    description: 'Upacara pemberangkatan magang kerja industri ke 35+ perusahaan mitra',
    tags: ['galeri', 'industri', 'pkl'],
  },
  {
    id: 'galeri-guru-1',
    title: 'Up-Skilling & Pelatihan Asesor Kejuruan Guru',
    category: 'galeri/guru',
    filename: 'pelatihan-asesor.jpg',
    localPath: '/images/galeri/guru/pelatihan-asesor.jpg',
    fallbackUrl: FALLBACK_IMAGE_LIBRARY['galeri-pelatihan-guru'],
    description: 'Peningkatan kompetensi pedagogik dan teknis guru produktif SMK',
    tags: ['galeri', 'guru', 'pelatihan'],
  },
];

/**
 * Helper fungsi untuk menghasilkan path foto yang rapi dan aman.
 * Jika file berada di folder public, URL yang di-render adalah `/images/<category>/<filename>`.
 *
 * Contoh pemanggilan:
 * getPhotoUrl('jurusan', 'tkj.jpg') -> "/images/jurusan/tkj.jpg"
 * getPhotoUrl('galeri/praktik', 'mesin-overhaul.jpg') -> "/images/galeri/praktik/mesin-overhaul.jpg"
 */
export function getPhotoUrl(category: PhotoCategory, filename: string): string {
  // Normalisasi string
  const cleanCat = category.replace(/^\/+|\/+$/g, '');
  const cleanName = filename.replace(/^\/+/, '');
  return `/images/${cleanCat}/${cleanName}`;
}

/**
 * Mencari foto dari katalog berdasarkan ID atau nama file
 */
export function findPhotoInCatalog(identifier: string): PhotoAsset | undefined {
  return PHOTO_CATALOG.find(
    (item) =>
      item.id === identifier ||
      item.filename === identifier ||
      item.localPath === identifier
  );
}

/**
 * Mendapatkan URL foto dengan fallback otomatis:
 * Mengembalikan objek yang berisi path lokal dan fallback online-nya
 */
export function resolvePhotoSource(
  input: string,
  fallback?: string
): { src: string; fallback: string } {
  // Jika input sudah merupakan HTTP URL eksternal (Unsplash, Cloudinary, dll)
  if (input.startsWith('http://') || input.startsWith('https://')) {
    return {
      src: input,
      fallback: fallback || input,
    };
  }

  // Jika input adalah ID di catalog
  const found = findPhotoInCatalog(input);
  if (found) {
    return {
      src: found.localPath,
      fallback: fallback || found.fallbackUrl,
    };
  }

  // Jika input adalah path lokal biasa seperti "/images/jurusan/tkj.jpg"
  return {
    src: input.startsWith('/') ? input : `/${input}`,
    fallback: fallback || FALLBACK_IMAGE_LIBRARY['gedung-utama'],
  };
}
