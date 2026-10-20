import {
  SchoolStat,
  VocationalMajor,
  TeachingFactoryItem,
  PklPartner,
  BkkJobVacancy,
  StaffMember,
  Facility,
  NewsArticle,
  Announcement,
  Extracurricular,
  GalleryPhoto,
  FaqItem,
} from '../types';

export const schoolIdentity = {
  name: 'SMK Negeri 1 Ujung Batu',
  shortName: 'SMKN 1 Ujung Batu',
  district: 'Kecamatan Ujung Batu',
  regency: 'Kabupaten Rokan Hulu',
  province: 'Provinsi Riau',
  tagline: 'Terampil, Kompeten, Mandiri, dan Siap Kerja',
  motto: 'SMK BISA, SMK HEBAT — Siap Kerja, Santun, Mandiri, Kreatif',
  npsn: '10494498',
  accreditation: 'Akreditasi A',
  accreditationNo: 'SK BAN-S/M No. 817/BAN-SM/SK/2023',
  establishedYear: '2006',
  principal: {
    name: 'Drs. H. Sabaruddin, M.M.',
    nip: 'NIP. 19690815 199501 1 002',
    photo: '/images/profil/mbg.jpg',
    welcomeMessage: `Assalamu'alaikum Warahmatullahi Wabarakatuh, Salam Sejahtera untuk kita semua. Selamat datang di portal resmi SMK Negeri 1 Ujung Batu, Kabupaten Rokan Hulu, Provinsi Riau. Sebagai salah satu institusi pendidikan kejuruan unggulan di Negeri Seribu Suluk, kami berkomitmen penuh melahirkan generasi muda vokasi yang berakhlak mulia, berjiwa technopreneur, dan menguasai kompetensi nyata berstandar industri nasional maupun internasional. Melalui kurikulum selaras Dunia Usaha & Dunia Industri (DU/DI), unit Teaching Factory (TEFA), Tempat Uji Kompetensi (TUK) bersertifikasi BNSP, serta Bursa Kerja Khusus (BKK) aktif, kami siap membimbing siswa-siswi meraih masa depan cerah baik langsung bekerja, berwirausaha mandiri, maupun melanjutkan studi ke perguruan tinggi. Semoga portal ini bermanfaat sebagai sarana keterbukaan informasi, publikasi prestasi, dan jembatan kolaborasi dengan seluruh masyarakat. SMK Bisa! SMK Hebat! Vokasi Kuat, Menguatkan Indonesia!`,
  },
  contact: {
    address: 'Jl. Lingkar Penghijauan Desa Ngaso, Kec. Ujung Batu',
    phone: '0813-7109-8360',
    whatsappHelpdesk: '0813-7109-8360',
    whatsappBkk: '0813-7109-8360',
    email: 'smkn1_uba@yahoo.com',
    adminEmail: 'admin@smkn1ujungbatu.sch.id',
    bkkEmail: 'bkk.smkn1uba@gmail.com',
    operatingHours: 'Senin - Jumat: 07.15 - 16.00 WIB',
    socialMedia: {
      facebook: 'https://facebook.com/smkn1ujungbatu',
      instagram: 'https://instagram.com/smkn1ujungbatu_official',
      youtube: 'https://youtube.com/@smkn1ujungbatu',
      tiktok: 'https://tiktok.com/@smkn1ujungbatu',
    },
  },
};

export const heroSlides = [
  {
    id: 'slide-1',
    headline: 'Belajar Keterampilan Nyata, Siap Kerja & Mandiri Berwirausaha',
    subheadline:
      'Pusat keunggulan vokasi di Kabupaten Rokan Hulu dengan kurikulum selaras Dunia Usaha & Industri (DU/DI), bengkel praktik berstandar pabrikan, dan sertifikasi BNSP resmi.',
    tag: 'Tahun Ajaran 2025/2026',
    badge: 'SMK Pusat Keunggulan Vokasi Riau',
    bgImage:
      '/images/hero/belajar1.jpg',
    primaryCta: { text: 'Info PPDB Riau', link: '#ppdb' },
    secondaryCta: { text: '6 Program Keahlian', link: '#program-keahlian' },
  },
  {
    id: 'slide-2',
    headline: 'Link & Match Industri Nyata Bersama 45+ Mitra Perusahaan',
    subheadline:
      'Kerja sama intensif dengan mitra otomotif, jaringan telekomunikasi, elektronika industri, pergudangan logistik modern, dan penyiaran kreatif untuk penjaminan magang PKL.',
    tag: 'Kemitraan Industri & BKK',
    badge: 'Teaching Factory Terpadu',
    bgImage:
      '/images/hero/belajar2.jpg',
    primaryCta: { text: 'Bursa Kerja Khusus (BKK)', link: '#pkl-bkk' },
    secondaryCta: { text: 'Profil & Fasilitas Bengkel', link: '#profil' },
  },
  {
    id: 'slide-3',
    headline: 'Mencetak Lulusan Vokasi Bersertifikat Kompetensi Garuda BNSP',
    subheadline:
      'Dilengkapi Tempat Uji Kompetensi (TUK) berlisensi Badan Nasional Sertifikasi Profesi (BNSP), memastikan setiap lulusan memegang sertifikat keahlian resmi yang diakui dunia kerja.',
    tag: 'Sertifikasi BNSP',
    badge: 'Lulusan Kompeten & Terserap Kerja',
    bgImage:
      '/images/hero/belajar3.jpg',
    primaryCta: { text: 'Berita & Prestasi LKS Siswa', link: '#informasi' },
    secondaryCta: { text: 'Hubungi Sekolah', link: '#kontak' },
  },
];

export const schoolStats: SchoolStat[] = [
  {
    id: 'stat-students',
    label: 'Peserta Didik Aktif',
    value: '850+',
    description: 'Terbagi dalam 6 program keahlian unggulan',
    iconName: 'Users',
  },
  {
    id: 'stat-majors',
    label: 'Program Keahlian',
    value: '6',
    description: 'Teknologi Komputer, Otomotif, Bisnis, Elektronika, Logistik & Broadcasting',
    iconName: 'Cpu',
  },
  {
    id: 'stat-absorption',
    label: 'Terserap Kerja & Wirausaha',
    value: '88.4%',
    description: 'Bekerja di industri, mandiri berwirausaha, & kuliah di PTN/Politeknik',
    iconName: 'Briefcase',
  },
  {
    id: 'stat-partners',
    label: 'Mitra DU/DI Aktif',
    value: '45+',
    description: 'Perusahaan mitra MoU skala daerah, regional Riau, dan nasional',
    iconName: 'Handshake',
  },
];

export const vocationalMajors: VocationalMajor[] = [
  {
    id: 'tkj',
    code: 'TKJ',
    name: 'Teknik Komputer dan Jaringan',
    badge: 'Teknologi Informasi & Jaringan',
    icon: 'Network',
    description:
      'Membekali siswa dengan keahlian perancangan arsitektur jaringan LAN/WAN/Fiber Optic, konfigurasi routing MikroTik & Cisco, administrasi server Linux/Windows, cybersecurity, dan perakitan komputer.',
    bannerImage:
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1000',
    competencies: [
      'Desain & Instalasi Jaringan LAN, WAN, & Wireless Hotspot',
      'Konfigurasi Router MikroTik & Switch Manageable Cisco',
      'Administrasi Server Linux & Cloud Computing Dasar',
      'Penyambungan Kabel Fiber Optic (Fusion Splicer & OTDR)',
      'Cybersecurity & Perlindungan Firewall Jaringan',
      'Perakitan & Troubleshooting Perangkat Keras Komputer',
    ],
    careerProspects: [
      'Network Administrator & IT Support Engineer',
      'Teknisi Jaringan & Fiber Optic ISP Telekomunikasi',
      'System Administrator & Cloud Support Assistant',
      'Teknisi Perangkat Komputer & Hardware Specialist',
      'Technopreneur / Wirausaha Layanan IT & Wi-Fi Hotspot',
    ],
    workshops: [
      'Laboratorium Komputer & Jaringan Ber-AC',
      'Server Room & Fiber Optic Splicing Corner',
      'Unit Layanan Servis PC, Laptop & Printer',
    ],
    headOfDepartment: 'Hendra Wijaya, S.Kom., M.T.',
  },
  {
    id: 'to',
    code: 'TO',
    name: 'Teknik Otomotif',
    badge: 'Teknik Mesin & Kendaraan Bermotor',
    icon: 'Wrench',
    description:
      'Mendidik teknisi otomotif profesional yang menguasai servis berkala mesin bensin & diesel, sistem sasis, transmisi manual/otomatis, kelistrikan bodi, AC mobil, dan scanner diagnostik injeksi (EFI Scanner).',
    bannerImage:
      '/images/jurusan/TO.jpg',
    competencies: [
      'Tune Up & Overhaul Mesin Bensin serta Diesel',
      'Troubleshooting Sistem EFI dengan Diagnostic Scanner Modern',
      'Pemeliharaan Sistem Rem (ABS), Suspensi, & Kemudi',
      'Perawatan Sistem Transmisi Manual & Otomatis',
      'Instalasi & Perbaikan Kelistrikan Bodi serta AC Mobil',
      'Manajemen Bengkel Otomotif dan Keselamatan Kerja K3',
    ],
    careerProspects: [
      'Mekanik di Bengkel Resmi ATPM (Astra, Toyota, Daihatsu, Mitsubishi)',
      'Teknisi Armada & Mesin Pabrik Perusahaan Perkebunan Sawit',
      'Service Advisor & Quality Control Otomotif',
      'Wirausaha Bengkel Mobil/Motor Mandiri & Toko Sparepart',
      'Teknisi Alat Berat & Modifikasi Otomotif',
    ],
    workshops: [
      'Bengkel Otomotif Standar Pabrikan & Car Lift Hidrolik',
      'Lab Kelistrikan Otomotif & Diagnostic Scanner EFI',
      'Unit Teaching Factory Auto Service SMKN 1',
    ],
    headOfDepartment: 'Supriyadi, S.T.',
  },
  {
    id: 'bdp',
    code: 'BDP',
    name: 'Bisnis Daring dan Pemasaran',
    badge: 'Digital Marketing & Ritel Modern',
    icon: 'ShoppingBag',
    description:
      'Mencetak pemasar modern dan wirausahawan digital yang menguasai strategi pemasaran digital, e-commerce, live commerce, pengelolaan ritel modern, penataan produk (visual merchandising), serta komunikasi negosiasi bisnis.',
    bannerImage:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000',
    competencies: [
      'Strategi Pemasaran Digital (SEO, Social Media Ads, & Konten Kreatif)',
      'Pengelolaan Toko Online di Marketplace & TikTok Shop',
      'Sistem Kasir Point of Sales (POS) & Barcode Scanner',
      'Visual Merchandising & Tata Kelola Toko Ritel Modern',
      'Komunikasi Bisnis, Negosiasi, & Pelayanan Pelanggan Prima',
      'Penyusunan Rencana Bisnis & Analisis Pasar Produk',
    ],
    careerProspects: [
      'Digital Marketing Specialist & Content Creator Komersial',
      'Store Supervisor & Kasir Senior Ritel Modern',
      'Admin Marketplace & E-commerce Operations Specialist',
      'Sales Executive & Customer Relationship Officer',
      'Wirausahawan Muda / Tokopreneur Mandiri',
    ],
    workshops: [
      'Lab Bisnis Daring & Studio Live Streaming TikTok Shop',
      'Edumart Ritel Modern & Minimarket Sekolah',
      'Ruang Simulasi Kasir & POS Barcode System',
    ],
    headOfDepartment: 'Rina Kartika, S.Pd.',
  },
  {
    id: 'te',
    code: 'TE',
    name: 'Teknik Elektronika',
    badge: 'Elektronika Industri & Otomasi',
    icon: 'Zap',
    description:
      'Membekali siswa dengan keahlian perancangan rangkaian elektronika, sistem mikrokontroler (Arduino, ESP32, IoT), instrumentasi industri, PLC, serta perawatan dan perbaikan peralatan elektronik industri.',
    bannerImage:
      'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&q=80&w=1000',
    competencies: [
      'Desain & Analisis Rangkaian Elektronika Analog serta Digital',
      'Pemrograman Mikrokontroler & Internet of Things (IoT)',
      'Instalasi & Pemrograman Programmable Logic Controller (PLC)',
      'Teknik Solder PCB Presisi & Perakitan Perangkat Elektronika',
      'Troubleshooting Peralatan Elektronika Industri & Audio-Video',
      'Pengoperasian Alat Ukur (Multitester, Osiloskop Digital)',
    ],
    careerProspects: [
      'Teknisi Elektronika Industri & Otomasi Pabrik Pengolahan',
      'Teknisi Instrumentasi & Sistem Kendali Kontrol',
      'Junior IoT Developer & Hardware Prototyper',
      'Teknisi Audio-Video & Peralatan Elektronika Konsumen',
      'Wirausaha Servis Elektronika & Perakitan Alat Kendali',
    ],
    workshops: [
      'Laboratorium Praktik Elektronika & Soldering Station Presisi',
      'Lab Otomasi Industri & PLC Trainer Kit',
      'Unit Servis Elektronika Rumah Tangga & Audio',
    ],
    headOfDepartment: 'Ir. Ahmad Syafi’i, S.T.',
  },
  {
    id: 'tlog',
    code: 'TLOG',
    name: 'Teknik Logistik',
    badge: 'Supply Chain & Pergudangan Modern',
    icon: 'Package',
    description:
      'Program keahlian yang fokus pada manajemen rantai pasok (supply chain management), tata kelola pergudangan modern (warehousing), penanganan material, sistem inventaris digital, serta administrasi pengiriman kargo.',
    bannerImage:
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000',
    competencies: [
      'Manajemen Tata Letak Gudang & Warehousing Management System (WMS)',
      'Pengendalian Stok & Inventarisasi Barang (Stock Opname Digital)',
      'Teknik Pengemasan (Packaging) & Standardisasi Kargo Ekspedisi',
      'Prosedur Pengiriman & Penanganan Material (Material Handling)',
      'Dokumentasi Pengiriman, Ekspedisi, & Regulasi Distribusi Logistik',
      'Pengoperasian Software ERP Pergudangan Sederhana',
    ],
    careerProspects: [
      'Warehouse Supervisor Junior & Staf Pergudangan',
      'Logistics Coordinator & Supply Chain Administrator',
      'Inventory Control Staff & Stock Controller',
      'Staf Ekspedisi Kargo & Freight Forwarding Assistant',
      'Wirausaha Jasa Pengiriman & Distribusi Barang Retail',
    ],
    workshops: [
      'Ruang Praktik Simulasi Pergudangan & Mini WMS Hub',
      'Lab Komputer Supply Chain & Barcode Management',
      'Station Material Handling & Packaging Ekspedisi',
    ],
    headOfDepartment: 'Dewi Anggraini, S.E.',
  },
  {
    id: 'bp',
    code: 'BP',
    name: 'Broadcasting dan Perfilman',
    badge: 'Penyiaran TV & Sinematografi Digital',
    icon: 'Radio',
    description:
      'Mengembangkan keterampilan kreatif siswa dalam produksi program siaran televisi dan radio, tata kamera, tata suara, tata artistik, penulisan skenario, editing video sinematik, hingga siaran langsung (live broadcasting).',
    bannerImage:
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=1000',
    competencies: [
      'Teknik Pengoperasian Kamera Video Sinematik & Multi-Kamera',
      'Tata Cahaya (Lighting Studio 3 Titik) & Tata Artistik Green Screen',
      'Tata Suara (Audio Recording, Boom Mic, & Sound Mixing)',
      'Penyuntingan Video dengan Premiere Pro, DaVinci Resolve, & After Effects',
      'Penulisan Naskah Berita TV, Dokumenter, & Film Pendek',
      'Live Broadcasting, Switcher Operasi, & Podcast Production',
    ],
    careerProspects: [
      'Camera Person & Videografer Profesional Acara',
      'Video Editor & Motion Graphic Designer Junior',
      'Program Director & Switcher Operator Studio Siaran TV',
      'Audio Recordist & Sound Designer Penyiaran',
      'Content Producer, Podcaster, & Kreator Rumah Produksi',
    ],
    workshops: [
      'Studio TV & Green Screen Kedap Suara Ber-AC',
      'Studio Podcast & Perekaman Suara Akustik',
      'Lab Komputer Editing Video Sinematik 4K',
    ],
    headOfDepartment: 'Bagus Pradana, S.Sn.',
  },
];

export const teachingFactoryList: TeachingFactoryItem[] = [
  {
    id: 'tefa-1',
    title: 'SMKN 1 Auto Service & Bengkel Otomotif',
    majorCode: 'TO',
    description:
      'Bengkel servis terpadu yang melayani servis berkala mobil & motor, tune-up injeksi EFI, ganti oli mesin, perbaikan rem, kelistrikan, dan detailing kendaraan bagi masyarakat umum.',
    servicesOrProducts: [
      'Tune Up Injeksi & Diagnostic Scanner EFI Launch',
      'Ganti Oli Mesin & Filter Resmi',
      'Servis Rem, Suspensi, & Kelistrikan Bodi',
      'Cuci Mobil & Motor serta Detailing Interior',
    ],
    contactPerson: 'Bpk. Supriyadi, S.T. (0813-7109-8360)',
    image:
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'tefa-2',
    title: 'SMKN 1 Network & Computer Clinic',
    majorCode: 'TKJ',
    description:
      'Layanan instalasi jaringan LAN/Wi-Fi kantor dan sekolah, penarikan kabel fiber optic & splicing, install ulang OS/software, perbaikan komputer/laptop, dan perakitan PC gaming/kantor.',
    servicesOrProducts: [
      'Instalasi Jaringan LAN & Wi-Fi Hotspot Terkelola',
      'Penyambungan Splicing Fiber Optic & Testing OTDR',
      'Servis & Penggantian Sparepart Laptop/Komputer',
      'Maintenance Server Sekolah, Kantor & CCTV',
    ],
    contactPerson: 'Tim TEFA TKJ (0813-7109-8360)',
    image:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'tefa-3',
    title: 'Edumart & Business Center SMKN 1',
    majorCode: 'BDP',
    description:
      'Minimarket sekolah sebagai laboratorium ritel modern nyata, menjual alat tulis kantor, seragam sekolah, snack hasil karya siswa, serta layanan pembayaran online PPOB.',
    servicesOrProducts: [
      'Alat Tulis Kantor & Kebutuhan Sekolah Lengkap',
      'Layanan Pembayaran Listrik, Pulsa, & Tagihan Online (PPOB)',
      'Produk Makanan Ringan Kreatif Karya Siswa',
      'Pengadaan Seragam & Wearpack Praktik',
    ],
    contactPerson: 'Ibu Rina Kartika, S.Pd. (0813-7109-8360)',
    image:
      'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'tefa-4',
    title: 'Broadcasting & Creative Media Studio',
    majorCode: 'BP',
    description:
      'Unit produksi video profil sekolah/instansi dinas, liputan acara multi-kamera, siaran langsung YouTube/Facebook, pembuatan podcast, dan fotografi dokumentasi komersial.',
    servicesOrProducts: [
      'Live Streaming Multi-Kamera Acara Pernikahan & Formal',
      'Pembuatan Video Profil Perusahaan & Sekolah',
      'Jasa Perekaman Podcast & Voicing Iklan',
      'Dokumentasi Foto & Video Resolusi 4K',
    ],
    contactPerson: 'Bpk. Bagus Pradana, S.Sn. (0813-7109-8360)',
    image:
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800',
  },
];

export const pklPartners: PklPartner[] = [
  {
    id: 'partner-1',
    name: 'PT. Sawit Rokan Perdana / Pabrik Kelapa Sawit Rohul',
    sector: 'Agroindustri & Kelistrikan Mesin Pabrik',
    location: 'Kabupaten Rokan Hulu',
    relevantMajors: ['TO', 'TE', 'TLOG'],
    logoPlaceholder: 'PKS Rohul',
  },
  {
    id: 'partner-2',
    name: 'Bengkel Resmi Astra Otoservice / Dealer Motor Ujung Batu',
    sector: 'Otomotif & Transportasi',
    location: 'Ujung Batu & Pasir Pengaraian',
    relevantMajors: ['TO'],
    logoPlaceholder: 'Astra Motor',
  },
  {
    id: 'partner-3',
    name: 'PT. Telkom Akses / Provider Jaringan Internet Riau',
    sector: 'Telekomunikasi & Jaringan Fiber Optic',
    location: 'Rokan Hulu & Pekanbaru',
    relevantMajors: ['TKJ', 'TE'],
    logoPlaceholder: 'Telkom Akses',
  },
  {
    id: 'partner-4',
    name: 'Pusat Distribusi Logistik Regional Riau Barat',
    sector: 'Supply Chain & Pergudangan Modern',
    location: 'Rokan Hulu & Kampar',
    relevantMajors: ['TLOG', 'BDP'],
    logoPlaceholder: 'Logistik Riau',
  },
  {
    id: 'partner-5',
    name: 'Riau Televisi (RTV) & Rumah Produksi Penyiaran Kreatif',
    sector: 'Media Penyiaran & Broadcasting TV',
    location: 'Pekanbaru & Rokan Hulu',
    relevantMajors: ['BP'],
    logoPlaceholder: 'Riau TV',
  },
  {
    id: 'partner-6',
    name: 'Dinas Komunikasi & Informatika Kab. Rokan Hulu',
    sector: 'Pemerintahan, IT & Hubungan Masyarakat',
    location: 'Pasir Pengaraian & Ujung Batu',
    relevantMajors: ['TKJ', 'BP', 'BDP'],
    logoPlaceholder: 'Diskominfo',
  },
];

export const bkkVacancies: BkkJobVacancy[] = [
  {
    id: 'vac-1',
    companyName: 'PT. Mitra Otomotif Riau (Bengkel Resmi)',
    position: 'Junior Automotive Technician & EFI Specialist',
    location: 'Ujung Batu / Pekanbaru',
    majorsNeeded: ['TO'],
    deadline: '30 November 2025',
    type: 'Full Time',
    status: 'Buka',
  },
  {
    id: 'vac-2',
    companyName: 'PT. Nusantara Fiber Connect',
    position: 'Fiber Optic Splicer & Network Field Technician',
    location: 'Kabupaten Rokan Hulu',
    majorsNeeded: ['TKJ'],
    deadline: '15 Desember 2025',
    type: 'Kontrak / Full Time',
    status: 'Buka',
  },
  {
    id: 'vac-3',
    companyName: 'PT. Sentosa Ritel Gemilang',
    position: 'Store Supervisor Trainee & Digital Marketer',
    location: 'Ujung Batu & Sekitarnya',
    majorsNeeded: ['BDP', 'TLOG'],
    deadline: '10 Desember 2025',
    type: 'Full Time',
    status: 'Buka',
  },
  {
    id: 'vac-4',
    companyName: 'Studio Penyiaran & Media Kreatif Riau',
    position: 'Camera Operator & Video Editor Junior',
    location: 'Pekanbaru / Hybrid',
    majorsNeeded: ['BP'],
    deadline: '25 November 2025',
    type: 'Full Time',
    status: 'Buka',
  },
];

export const staffMembers: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'Drs. H. Sabaruddin, M.M.',
    nip: 'NIP. 19690815 199501 1 002',
    role: 'Kepala Sekolah',
    category: 'Pimpinan',
    majorOrSubject: 'Manajemen Pendidikan Kejuruan',
    photo: 'public/images/guru/guru4.jpg',
  },
  {
    id: 'staff-2',
    name: 'Dra. Hj. Nuraini, M.Pd.',
    nip: 'NIP. 19750214 200212 2 003',
    role: 'Wakil Kepala Sekolah Bid. Kurikulum',
    category: 'Pimpinan',
    majorOrSubject: 'Kurikulum Merdeka & Penguatan Vokasi',
    photo: 'public/images/guru/guru1.jpg',
  },
  {
    id: 'staff-3',
    name: 'Bambang Irawan, S.Pd.',
    nip: 'NIP. 19780905 200501 1 008',
    role: 'Wakil Kepala Sekolah Bid. Kesiswaan',
    category: 'Pimpinan',
    majorOrSubject: 'Karakter & Kedisiplinan Taruna Siswa',
    photo: 'public/images/guru/guru2.jpg',
  },
  {
    id: 'staff-4',
    name: 'Ir. Hendra Wijaya, S.T., M.Kom.',
    nip: 'NIP. 19830719 200902 1 004',
    role: 'Waka Hubungan Industri (Hubin) & BKK',
    category: 'Pimpinan',
    majorOrSubject: 'Kemitraan Industri, PKL & Penyaluran Karir',
    photo: 'public/images/guru/guru3.jpg',
  },
  {
    id: 'staff-5',
    name: 'Supriyadi, S.T.',
    nip: 'NIP. 19840618 200902 1 005',
    role: 'Ketua Program Keahlian Teknik Otomotif',
    category: 'Produktif',
    majorOrSubject: 'Teknik Otomotif & Diagnostik EFI',
    photo: 'public/images/guru/guru5.jpg',
  },
  {
    id: 'staff-6',
    name: 'Rina Kartika, S.Pd.',
    nip: 'NIP. 19910415 201701 2 006',
    role: 'Ketua Program Keahlian Bisnis Daring & Pemasaran',
    category: 'Produktif',
    majorOrSubject: 'Digital Marketing & Manajemen Ritel',
    photo: 'public/images/guru/guru6.jpg',
  },
  {
    id: 'staff-7',
    name: 'Bagus Pradana, S.Sn.',
    nip: 'NIP. 19930829 201903 1 007',
    role: 'Ketua Program Keahlian Broadcasting & Perfilman',
    category: 'Produktif',
    majorOrSubject: 'Sinematografi & Produksi Siaran TV',
    photo: 'public/images/guru/guru7.jpg',
  },
  {
    id: 'staff-8',
    name: 'Siti Aminah, S.Pd., Kons.',
    nip: 'NIP. 19861104 201101 2 018',
    role: 'Koordinator Bimbingan Konseling (BK)',
    category: 'Normatif Adaptif',
    majorOrSubject: 'Konseling Karir & Kesiapan Mental Industri',
    photo: 'public/images/guru/guru8.jpg',
  },
];

export const schoolFacilities: Facility[] = [
  {
    id: 'fac-1',
    title: 'Laboratorium Komputer & Jaringan',
    category: 'Bengkel / Lab Kejuruan',
    description:
      'Laboratorium komputer berpendingin udara (AC) dengan puluhan unit PC client spesifikasi tinggi, workstation jaringan, switch/router MikroTik & Cisco, serta koneksi fiber optic kecepatan tinggi.',
    specs: '40 Unit PC Intel Core i5/i7, Server Rack Cisco & MikroTik CCR, Fiber Splicer, Full AC',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'fac-2',
    title: 'Bengkel Otomotif & Mesin',
    category: 'Bengkel / Lab Kejuruan',
    description:
      'Bengkel praktik kejuruan standar industri yang dilengkapi car lift hidrolik, scanner diagnostik injeksi (EFI Scanner), engine stand bensin dan diesel, serta kelistrikan kendaraan bermotor.',
    specs: 'Car Lift Hidrolik, Diagnostic Scanner EFI Launch X431, Engine Stand Bensin & Diesel, Tune-Up Kit',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'fac-3',
    title: 'Studio Broadcasting TV & Green Screen',
    category: 'Bengkel / Lab Kejuruan',
    description:
      'Studio penyiaran dan produksi konten audio-visual berperedam suara akustik, dilengkapi kamera video sinematik, lighting studio 3 titik, green screen studio, switcher multi-kamera, dan studio podcast.',
    specs: 'Studio Green Screen Kedap Suara, Kamera Sony Cinema, Softbox Lighting Kit, Switcher HD',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'fac-4',
    title: 'Perpustakaan & E-Library',
    category: 'Fasilitas Umum',
    description:
      'Pusat sumber belajar dengan ribuan koleksi buku kejuruan, manual teknik otomotif, literatur IT, jurnal vokasi, serta area baca nyaman dan e-library berbasis komputer.',
    specs: 'Koleksi 4.500+ Judul Buku & Jurnal, Komputer Akses Digital Library, Ruang Diskusi Nyaman',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'fac-5',
    title: 'Lapangan Olahraga & Upacara',
    category: 'Sarana Olahraga & Ibadah',
    description:
      'Sarana multifungsi luar ruangan beralas cor sintetis untuk upacara bendera hari Senin, apel kedisiplinan taruna, serta kegiatan futsal, bola voli, dan bola basket.',
    specs: 'Standar Futsal & Voli, Ring Basket Portabel, Garis Lintasan, Kapasitas 1.000 Siswa',
    image: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&q=80&w=800',
  },
];

export const initialNewsArticles: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Siswa Teknik Otomotif SMKN 1 Ujung Batu Raih Juara 1 LKS Tingkat Kabupaten Rokan Hulu',
    slug: 'juara-1-lks-otomotif-rohul',
    category: 'LKS & Prestasi',
    date: '14 Agustus 2025',
    author: 'Tim Humas SMKN 1',
    excerpt:
      'Prestasi membanggakan diraih kontingen SMK Negeri 1 Ujung Batu pada bidang Automobile Technology dalam ajang LKS SMK tingkat Kabupaten Rokan Hulu.',
    content:
      'Prestasi membanggakan kembali diukir oleh putra daerah. Siswa perwakilan Program Keahlian Teknik Otomotif (TO) SMK Negeri 1 Ujung Batu sukses menyabet Juara 1 dalam Lomba Kompetensi Siswa (LKS) SMK Tingkat Kabupaten Rokan Hulu untuk bidang lomba Automobile Technology. Perlombaan yang berlangsung sengit di Pasir Pengaraian tersebut menguji ketepatan diagnosa EFI, tune up mesin berstandar pabrikan, serta pemecahan masalah electrical fault injection. Dengan perolehan skor 94,8, wakil SMKN 1 Ujung Batu dipastikan mewakili Kabupaten Rokan Hulu ke ajang LKS Tingkat Provinsi Riau mendatang.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'news-2',
    title: 'Pelepasan 180 Siswa Kelas XI Mengikuti Praktik Kerja Lapangan (PKL) di 35 Perusahaan Industri Mitra',
    slug: 'pelepasan-pkl-smkn1-ujung-batu',
    category: 'Kegiatan PKL',
    date: '02 Juli 2025',
    author: 'Pokja PKL & Humas',
    excerpt:
      'Kepala Sekolah bersama perwakilan asosiasi industri resmi melepas ratusan siswa untuk mengasah keahlian kerja nyata selama 6 bulan.',
    content:
      'Sebanyak 180 siswa kelas XI dari 6 kompetensi keahlian resmi dilepas dalam upacara pemberangkatan Praktik Kerja Lapangan (PKL) periode tahun ajaran berjalan. Para siswa akan ditempatkan di 35 Dunia Usaha dan Dunia Industri (DU/DI) yang tersebar di wilayah Rokan Hulu, Kampar, Pekanbaru, hingga Dumai. Sebelum diberangkatkan, seluruh siswa telah menjalani pembekalan intensif terkait etika kerja industri, Keselamatan dan Kesehatan Kerja (K3), serta penandatanganan pakta integritas kedisiplinan.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'news-3',
    title: 'Kunjungan Industri Jurusan TKJ & Broadcasting ke Data Center & Stasiun Televisi di Pekanbaru',
    slug: 'kunjungan-industri-tkj-broadcasting',
    category: 'Kunjungan Industri',
    date: '20 Mei 2025',
    author: 'Koordinator Jurusan TKJ & BP',
    excerpt:
      'Mengenal teknologi server backbone fiber optic dan proses produksi siaran televisi digital secara langsung.',
    content:
      'Rombongan siswa program keahlian TKJ dan Broadcasting dan Perfilman SMKN 1 Ujung Batu melaksanakan Kunjungan Industri (KI) ke fasilitas data center penyedia layanan internet terkemuka dan stasiun penyiaran publik di Kota Pekanbaru. Dalam kunjungan edukatif ini, siswa TKJ diajak melihat arsitektur rack server berskala enterprise, konfigurasi redundant fiber optic, dan sistem pengamanan cybersecurity. Sementara siswa Broadcasting mendalami tata kelola ruang kendali switcher studio siaran langsung.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'news-4',
    title: 'Bursa Kerja Khusus (BKK) Gelar Rekrutmen Kampus Bersama PT. Sentosa Ritel Gemilang',
    slug: 'rekrutmen-bkk-kampus-smkn1',
    category: 'Kegiatan Sekolah',
    date: '10 September 2025',
    author: 'Tim BKK SMKN 1',
    excerpt:
      'Lebih dari 60 alumni dan siswa tingkat akhir mengikuti psikotes dan wawancara kerja langsung di Aula Utama SMKN 1 Ujung Batu.',
    content:
      'Bursa Kerja Khusus (BKK) SMK Negeri 1 Ujung Batu memfasilitasi pelaksanaan walk-in interview dan tes seleksi kerja langsung oleh HRD salah satu perusahaan ritel terkemuka di Sumatera. Dari seleksi tahap pertama yang meliputi tes ketelitian, logika dasar, dan wawancara kompetensi, sebanyak 32 peserta berhasil lolos ke tahap penandatanganan kontrak kerja.',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800',
  },
];

export const initialAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Pelaksanaan Asesmen Sumatif Akhir Semester (SAS) Ganjil Tahun Ajaran 2025/2026',
    targetAudience: 'Siswa',
    date: '24 November 2025',
    important: true,
    content:
      'Diberitahukan kepada seluruh peserta didik kelas X, XI, dan XII bahwa Asesmen Sumatif Akhir Semester (SAS) Ganjil akan diselenggarakan pada tanggal 1 - 10 Desember 2025 berbasis Computer Based Test (CBT) di laboratorium komputer sekolah. Harap mempersiapkan kartu ujian dan nomor registrasi masing-masing.',
  },
  {
    id: 'ann-2',
    title: 'Undangan Rapat Pleno Komite Sekolah & Sosialisasi Program PKL Kelas XI',
    targetAudience: 'Orang Tua',
    date: '08 November 2025',
    important: false,
    content:
      'Mengharap kehadiran Bapak/Ibu orang tua/wali siswa kelas XI pada hari Sabtu, 15 November 2025, pukul 08.30 WIB di Aula SMKN 1 Ujung Batu dalam rangka musyawarah program sekolah dan pembiayaan asuransi PKL industri siswa.',
  },
  {
    id: 'ann-3',
    title: 'Informasi Penyaluran Lowongan Kerja BKK & Beasiswa Kuliah Vokasi SNBP',
    targetAudience: 'Alumni & DU/DI',
    date: '01 November 2025',
    important: true,
    content:
      'Pendaftaran penelusuran tamatan dan jalur Seleksi Nasional Masuk Perguruan Tinggi Vokasi / Politeknik Negeri untuk alumni SMKN 1 Ujung Batu telah dibuka. Silakan hubungi koordinator BK & BKK sekolah untuk pengurusan surat rekomendasi kepala sekolah.',
  },
  {
    id: 'ann-4',
    title: 'Jadwal Uji Kompetensi Keahlian (UKK) Mandiri Bersama Asesor BNSP',
    targetAudience: 'Guru & Tendik',
    date: '18 Oktober 2025',
    important: true,
    content:
      'Diberitahukan kepada seluruh Ketua Program Keahlian dan instruktur bengkel/lab bahwa verifikasi Tempat Uji Kompetensi (TUK) oleh asesor LSP P-1 Nasional akan dijadwalkan pada akhir semester ganjil. Mohon kelengkapan alat dan bahan disiapkan sesuai standar SKKNI.',
  },
];

export const extracurriculars: Extracurricular[] = [
  {
    id: 'ekskul-1',
    name: 'Klub Robotika, IoT & Coding',
    category: 'Kejuruan & Teknologi',
    description:
      'Wadah riset dan perakitan mikrokontroler Arduino/ESP32, modul smart-home mini, robot line follower, dan logika pemrograman software.',
    coach: 'Bpk. Hendra Wijaya, S.Kom.',
    schedule: 'Rabu & Sabtu, 15.30 - 17.00 WIB',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600',
    achievements: ['Juara 2 Inovasi Teknologi Tepat Guna Rohul'],
  },
  {
    id: 'ekskul-2',
    name: 'Otomotif Modification & Tuning Club',
    category: 'Kejuruan & Teknologi',
    description:
      'Ekskul terapan untuk siswa yang gemar mendalami modifikasi sistem kelistrikan, setting audio mobil, dan perawatan mesin performa tinggi.',
    coach: 'Bpk. Supriyadi, S.T.',
    schedule: 'Jumat, 14.30 - 16.30 WIB',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'ekskul-3',
    name: 'Creative Cinematography & Content Club',
    category: 'Kejuruan & Teknologi',
    description:
      'Belajar teknik pengambilan gambar sinematik, pembuatan film pendek festival pelajar, ilustrasi digital, dan fotografi jurnalistik.',
    coach: 'Bpk. Bagus Pradana, S.Sn.',
    schedule: 'Kamis, 15.00 - 17.00 WIB',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=600',
    achievements: ['Finalis Festival Film Pelajar Provinsi Riau'],
  },
  {
    id: 'ekskul-4',
    name: 'Pramuka Penegak Ambalan Tuanku Tambusai',
    category: 'Wajib & Kepanduan',
    description:
      'Pendidikan karakter kedisiplinan, kepemimpinan, kepanduan, pertolongan pertama, dan kegiatan penjelajahan alam bebas Rokan Hulu.',
    coach: 'Kak Ruslan, S.Pd.',
    schedule: 'Jumat Sore, 15.00 - 17.30 WIB',
    image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'ekskul-5',
    name: 'Palang Merah Remaja (PMR Wira)',
    category: 'Wajib & Kepanduan',
    description:
      'Pelatihan pertolongan pertama kecelakaan kerja (P3K) di bengkel, donor darah berkala, dan kepedulian sosial kemanusiaan.',
    coach: 'Ibu Siti Aminah, S.Pd.',
    schedule: 'Sabtu, 09.00 - 11.30 WIB',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'ekskul-6',
    name: 'Pasukan Pengibar Bendera (Paskibra)',
    category: 'Wajib & Kepanduan',
    description:
      'Latihan baris berbaris (PBB) formasi presisi, disiplin taruna, dan penjaringan seleksi calon Paskibraka Kabupaten Rokan Hulu.',
    coach: 'Pelatih Paskibra Kabupaten',
    schedule: 'Selasa & Sabtu, 15.30 - 17.30 WIB',
    image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'ekskul-7',
    name: 'Klub Futsal & Sepak Bola Vokasi',
    category: 'Olahraga & Seni',
    description:
      'Pembinaan teknik, stamina fisik, dan strategi pertandingan turnamen futsal antar-pelajar se-Kabupaten Rokan Hulu.',
    coach: 'Coach Ahmad Rizal, S.Pd.',
    schedule: 'Senin & Kamis, 16.00 - 18.00 WIB',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'ekskul-8',
    name: 'Kerohanian Islam (Rohis) & Hadroh',
    category: 'Keagamaan',
    description:
      'Kajian keislaman mingguan, seni musik hadroh sholawat, tahsin Al-Qur an, dan kepanitiaan peringatan hari besar Islam.',
    coach: 'Ust. Syamsul Huda, S.Pd.I.',
    schedule: 'Jumat Pagi & Sore, 06.45 & 15.30 WIB',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
  },
];

export const galleryPhotos: GalleryPhoto[] = [
  {
    id: 'gal-1',
    title: 'Praktik Overhaul Mesin Otomotif di Bengkel TO',
    category: 'Praktik Bengkel/Lab',
    caption: 'Siswa kelas XII mempraktikkan pembongkaran dan perakitan kembali blok silinder mesin mobil berstandar 5R.',
    imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'gal-2',
    title: 'Konfigurasi Rack Router & Splicing Kabel Optik di Lab TKJ',
    category: 'Praktik Bengkel/Lab',
    caption: 'Sesi latihan penyambungan fiber optic menggunakan Fusion Splicer dengan redaman mendekati 0.01 dB.',
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'gal-3',
    title: 'Simulasi Pembuatan Konten Video Iklan di Studio Green Screen',
    category: 'Praktik Bengkel/Lab',
    caption: 'Siswa Broadcasting merekam video komersial produk UMKM Rokan Hulu dengan tata lampu studio 3 titik.',
    imageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'gal-4',
    title: 'Penerjunan Siswa PKL di Bengkel Resmi Mitra Industri',
    category: 'Kunjungan Industri',
    caption: 'Guru pembimbing mengantarkan dan menyerahkan peserta didik ke Supervisor Bengkel Mitra di Ujung Batu.',
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'gal-5',
    title: 'Upacara Peringatan Hari Pendidikan Nasional di Lapangan Utama',
    category: 'Kegiatan Siswa',
    caption: 'Barisan siswa dan dewan guru dengan khidmat mengikuti upacara bendera di lapangan kampus SMKN 1 Ujung Batu.',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'gal-6',
    title: 'Kunjungan Studi Industri ke Data Center Provider di Pekanbaru',
    category: 'Kunjungan Industri',
    caption: 'Siswa TKJ mendengarkan pemaparan Network Operation Center (NOC) dari engineer industri.',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'gal-7',
    title: 'Pelatihan Guru Kejuruan (Up-skilling Industri)',
    category: 'Guru & Tendik',
    caption: 'Tenaga pendidik SMKN 1 Ujung Batu mengikuti sertifikasi asesor kompetensi kejuruan tingkat provinsi.',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'gal-8',
    title: 'Pelaksanaan Uji Kompetensi Keahlian (UKK) Bersama Asesor BNSP',
    category: 'Praktik Bengkel/Lab',
    caption: 'Pengujian ketat sertifikasi BNSP oleh praktisi industri eksternal untuk melahirkan teknisi bersertifikat.',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
  },
];

export const faqList: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Umum SMK',
    question: 'Apa keunggulan bersekolah di SMK Negeri 1 Ujung Batu?',
    answer:
      'Keunggulan utama adalah kurikulum 70% praktik bengkel/lab berstandar industri, penguasaan sertifikasi profesi resmi BNSP yang diakui secara nasional, unit Teaching Factory (TEFA) di mana siswa melayani pesanan nyata masyarakat, serta jaminan magang PKL di 45+ mitra perusahaan.',
  },
  {
    id: 'faq-2',
    category: 'PKL & BKK',
    question: 'Bagaimana sistem Praktik Kerja Lapangan (PKL) di SMK Negeri 1 Ujung Batu?',
    answer:
      'PKL dilaksanakan wajib bagi siswa kelas XI selama 3 hingga 6 bulan di Dunia Usaha dan Dunia Industri (DU/DI) mitra resmi sekolah. Sekolah telah menjalin kerja sama dengan 45+ mitra industri di Rokan Hulu, Pekanbaru, Kampar, hingga luar provinsi dengan pendampingan guru monitoring dan instruktur perusahaan.',
  },
  {
    id: 'faq-3',
    category: 'Umum SMK',
    question: 'Apakah lulusan SMK Negeri 1 Ujung Batu bisa melanjutkan kuliah?',
    answer:
      'Sangat bisa! Lulusan SMK memiliki ijazah setara pendidikan menengah atas yang diakui pemerintah. Siswa kami dapat mengikuti jalur SNBP, SNBT, maupun politeknik vokasi (seperti Politeknik Caltex Riau, Politeknik Negeri Padang, Politeknik Negeri Medan, Universitas Riau) dengan bekal portofolio teknis yang kuat.',
  },
  {
    id: 'faq-4',
    category: 'Program Keahlian',
    question: 'Jurusan apa saja yang tersedia di SMK Negeri 1 Ujung Batu?',
    answer:
      'Terdapat 6 Program Keahlian unggulan: 1) Teknik Komputer dan Jaringan (TKJ), 2) Teknik Otomotif (TO), 3) Bisnis Daring dan Pemasaran (BDP), 4) Teknik Elektronika (TE), 5) Teknik Logistik (TLOG), dan 6) Broadcasting dan Perfilman (BP).',
  },
  {
    id: 'faq-5',
    category: 'PKL & BKK',
    question: 'Bagaimana bantuan penyaluran kerja alumni melalui BKK?',
    answer:
      'SMK Negeri 1 Ujung Batu memiliki Bursa Kerja Khusus (BKK) resmi terdaftar di Dinas Tenaga Kerja yang aktif menginformasikan lowongan kerja, memfasilitasi rekrutmen kampus (walk-in interview di sekolah), pelatihan pembuatan CV, serta penyaluran alumni ke mitra industri.',
  },
  {
    id: 'faq-6',
    category: 'Program Keahlian',
    question: 'Apakah siswa mendapatkan sertifikasi resmi selain ijazah?',
    answer:
      'Ya! Seluruh siswa mengikuti Uji Kompetensi Keahlian (UKK) yang dinilai langsung oleh asesor eksternal dari Tempat Uji Kompetensi (TUK) berlisensi Badan Nasional Sertifikasi Profesi (BNSP). Lulusan menerima Sertifikat Garuda Emas BNSP.',
  },
];

export const bkServices = [
  {
    title: 'Konseling Karir & Kesiapan Kerja Industri',
    description:
      'Bimbingan pemetaan minat karir, bedah kepribadian kerja, teknik penyusunan CV ATS-friendly, dan simulasi wawancara HRD.',
    icon: 'Compass',
  },
  {
    title: 'Peminatan & Adaptasi Kejuruan',
    description:
      'Pendampingan siswa dalam menyesuaikan ritme belajar praktik bengkel, kedisiplinan 5R, dan budaya kerja industri.',
    icon: 'Target',
  },
  {
    title: 'Konsultasi Studi Lanjut ke Politeknik & PTN',
    description:
      'Informasi jalur beasiswa KIP Kuliah Vokasi, pemilihan jurusan linear di Politeknik Negeri, dan persiapan tes SNBT.',
    icon: 'GraduationCap',
  },
  {
    title: 'Konseling Pribadi & Pengembangan Karakter',
    description:
      'Ruang aman dan rahasia untuk berkonsultasi mengenai motivasi belajar, manajemen stres, pertemanan, dan masalah keluarga.',
    icon: 'HeartHandshake',
  },
];
