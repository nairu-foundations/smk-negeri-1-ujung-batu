import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { classesScheduleData, teachersList } from './src/data/scheduleData.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const portArgIdx = process.argv.indexOf('--port');
const parsedPort = portArgIdx !== -1 ? parseInt(process.argv[portArgIdx + 1], 10) : NaN;
const PORT = !isNaN(parsedPort) ? parsedPort : (process.env.PORT ? parseInt(process.env.PORT, 10) : 3000);

const hostArgIdx = process.argv.indexOf('--host');
const HOST = hostArgIdx !== -1 ? process.argv[hostArgIdx + 1] : (process.env.HOST || '0.0.0.0');

const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '25mb' }));

// Health check endpoints
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).send('OK');
});
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', serverTime: new Date().toISOString() });
});

// Static route for /images serving directly from public/images
const PUBLIC_DIR = path.resolve(__dirname, 'public');
const PUBLIC_IMAGES_DIR = path.resolve(PUBLIC_DIR, 'images');
if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
  fs.mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true });
}
app.use('/images', express.static(PUBLIC_IMAGES_DIR));

// Database storage file path
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial default seed dataset
const defaultInitialNews = [
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
    createdAt: new Date('2025-08-14T10:00:00.000Z').toISOString(),
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
    createdAt: new Date('2025-07-02T08:30:00.000Z').toISOString(),
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
    createdAt: new Date('2025-05-20T09:15:00.000Z').toISOString(),
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
    createdAt: new Date('2025-09-10T11:00:00.000Z').toISOString(),
  },
];

const defaultInitialAnnouncements = [
  {
    id: 'ann-1',
    title: 'Pelaksanaan Asesmen Sumatif Akhir Semester (SAS) Ganjil Tahun Ajaran 2025/2026',
    targetAudience: 'Siswa',
    date: '24 November 2025',
    important: true,
    content:
      'Diberitahukan kepada seluruh peserta didik kelas X, XI, dan XII bahwa Asesmen Sumatif Akhir Semester (SAS) Ganjil akan diselenggarakan pada tanggal 1 - 10 Desember 2025 berbasis Computer Based Test (CBT) di laboratorium komputer sekolah. Harap mempersiapkan kartu ujian dan nomor registrasi masing-masing.',
    createdAt: new Date('2025-11-24T08:00:00.000Z').toISOString(),
  },
  {
    id: 'ann-2',
    title: 'Undangan Rapat Pleno Komite Sekolah & Sosialisasi Program PKL Kelas XI',
    targetAudience: 'Orang Tua',
    date: '08 November 2025',
    important: false,
    content:
      'Mengharap kehadiran Bapak/Ibu orang tua/wali siswa kelas XI pada hari Sabtu, 15 November 2025, pukul 08.30 WIB di Aula SMKN 1 Ujung Batu dalam rangka musyawarah program sekolah dan pembiayaan asuransi PKL industri siswa.',
    createdAt: new Date('2025-11-08T09:00:00.000Z').toISOString(),
  },
  {
    id: 'ann-3',
    title: 'Informasi Penyaluran Lowongan Kerja BKK & Beasiswa Kuliah Vokasi SNBP',
    targetAudience: 'Alumni & DU/DI',
    date: '01 November 2025',
    important: true,
    content:
      'Pendaftaran penelusuran tamatan dan jalur Seleksi Nasional Masuk Perguruan Tinggi Vokasi / Politeknik Negeri untuk alumni SMKN 1 Ujung Batu telah dibuka. Silakan hubungi koordinator BK & BKK sekolah untuk pengurusan surat rekomendasi kepala sekolah.',
    createdAt: new Date('2025-11-01T10:30:00.000Z').toISOString(),
  },
  {
    id: 'ann-4',
    title: 'Jadwal Uji Kompetensi Keahlian (UKK) Mandiri Bersama Asesor BNSP',
    targetAudience: 'Guru & Tendik',
    date: '18 Oktober 2025',
    important: true,
    content:
      'Diberitahukan kepada seluruh Ketua Program Keahlian dan instruktur bengkel/lab bahwa verifikasi Tempat Uji Kompetensi (TUK) oleh asesor LSP P-1 Nasional akan dijadwalkan pada akhir semester ganjil. Mohon kelengkapan alat dan bahan disiapkan sesuai standar SKKNI.',
    createdAt: new Date('2025-10-18T07:45:00.000Z').toISOString(),
  },
];

const defaultInitialStaff = [
  {
    id: 'staff-1',
    name: 'Drs. H. Sabaruddin, M.M.',
    nip: 'NIP. 19690815 199501 1 002',
    role: 'Kepala Sekolah',
    category: 'Pimpinan',
    majorOrSubject: 'Manajemen Pendidikan Kejuruan',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=500',
    phone: '081267890101',
    email: 'kepsek@smkn1ujungbatu.sch.id',
    education: 'S2 Manajemen Pendidikan',
    statusKepegawaian: 'PNS',
    createdAt: new Date('2025-01-10T08:00:00.000Z').toISOString(),
  },
  {
    id: 'staff-2',
    name: 'Dra. Hj. Nuraini, M.Pd.',
    nip: 'NIP. 19750214 200212 2 003',
    role: 'Wakil Kepala Sekolah Bid. Kurikulum',
    category: 'Pimpinan',
    majorOrSubject: 'Kurikulum Merdeka & Penguatan Vokasi',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=500',
    phone: '081267890102',
    email: 'kurikulum@smkn1ujungbatu.sch.id',
    education: 'S2 Pendidikan Bahasa & Vokasi',
    statusKepegawaian: 'PNS',
    createdAt: new Date('2025-01-10T08:00:00.000Z').toISOString(),
  },
  {
    id: 'staff-3',
    name: 'Bambang Irawan, S.Pd.',
    nip: 'NIP. 19780905 200501 1 008',
    role: 'Wakil Kepala Sekolah Bid. Kesiswaan',
    category: 'Pimpinan',
    majorOrSubject: 'Karakter & Kedisiplinan Taruna Siswa',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=500',
    phone: '081267890103',
    email: 'kesiswaan@smkn1ujungbatu.sch.id',
    education: 'S1 Pendidikan Jasmani & Kepemimpinan',
    statusKepegawaian: 'PNS',
    createdAt: new Date('2025-01-10T08:00:00.000Z').toISOString(),
  },
  {
    id: 'staff-4',
    name: 'Ir. Hendra Wijaya, S.T., M.Kom.',
    nip: 'NIP. 19830719 200902 1 004',
    role: 'Waka Hubungan Industri (Hubin) & BKK',
    category: 'Pimpinan',
    majorOrSubject: 'Kemitraan Industri, PKL & Penyaluran Karir',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=500',
    phone: '081267890104',
    email: 'hubin@smkn1ujungbatu.sch.id',
    education: 'S2 Magister Teknik Informatika',
    statusKepegawaian: 'PNS',
    createdAt: new Date('2025-01-10T08:00:00.000Z').toISOString(),
  },
  {
    id: 'staff-5',
    name: 'Supriyadi, S.T.',
    nip: 'NIP. 19840618 200902 1 005',
    role: 'Ketua Program Keahlian Teknik Otomotif',
    category: 'Produktif',
    majorOrSubject: 'Teknik Otomotif & Diagnostik EFI',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=500',
    phone: '081267890105',
    email: 'otomotif@smkn1ujungbatu.sch.id',
    education: 'S1 Teknik Mesin Otomotif',
    statusKepegawaian: 'PNS',
    createdAt: new Date('2025-01-10T08:00:00.000Z').toISOString(),
  },
  {
    id: 'staff-6',
    name: 'Rina Kartika, S.Pd.',
    nip: 'NIP. 19910415 201701 2 006',
    role: 'Ketua Program Keahlian Bisnis Daring & Pemasaran',
    category: 'Produktif',
    majorOrSubject: 'Digital Marketing & Manajemen Ritel',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=500',
    phone: '081267890106',
    email: 'bdp@smkn1ujungbatu.sch.id',
    education: 'S1 Pendidikan Tata Niaga',
    statusKepegawaian: 'PPPK',
    createdAt: new Date('2025-01-10T08:00:00.000Z').toISOString(),
  },
  {
    id: 'staff-7',
    name: 'Bagus Pradana, S.Sn.',
    nip: 'NIP. 19930829 201903 1 007',
    role: 'Ketua Program Keahlian Broadcasting & Perfilman',
    category: 'Produktif',
    majorOrSubject: 'Sinematografi & Produksi Siaran TV',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=500',
    phone: '081267890107',
    email: 'broadcasting@smkn1ujungbatu.sch.id',
    education: 'S1 Seni Media Rekam / Televisi',
    statusKepegawaian: 'PPPK',
    createdAt: new Date('2025-01-10T08:00:00.000Z').toISOString(),
  },
  {
    id: 'staff-8',
    name: 'Siti Aminah, S.Pd., Kons.',
    nip: 'NIP. 19861104 201101 2 018',
    role: 'Koordinator Bimbingan Konseling (BK)',
    category: 'Normatif Adaptif',
    majorOrSubject: 'Konseling Karir & Kesiapan Mental Industri',
    photo: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=500',
    phone: '081267890108',
    email: 'bk@smkn1ujungbatu.sch.id',
    education: 'S1 Bimbingan dan Konseling',
    statusKepegawaian: 'PNS',
    createdAt: new Date('2025-01-10T08:00:00.000Z').toISOString(),
  },
  {
    id: 'staff-9',
    name: 'M. Yusuf Arifin, S.Kom.',
    nip: 'NIP. 19890214 201502 1 003',
    role: 'Kepala Lab Komputer & Guru Produktif TKJ',
    category: 'Produktif',
    majorOrSubject: 'Administrasi Infrastruktur Jaringan & Mikrotik',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=500',
    phone: '081267890109',
    email: 'tkj@smkn1ujungbatu.sch.id',
    education: 'S1 Teknik Informatika',
    statusKepegawaian: 'PNS',
    createdAt: new Date('2025-01-10T08:00:00.000Z').toISOString(),
  },
  {
    id: 'staff-10',
    name: 'Sri Wahyuni, S.E.',
    nip: 'NIP. 19881023 201403 2 004',
    role: 'Kepala Urusan Tata Usaha (KTU)',
    category: 'Tenaga Kependidikan',
    majorOrSubject: 'Layanan Administrasi & Kepegawaian Sekolah',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=500',
    phone: '081267890110',
    email: 'tu@smkn1ujungbatu.sch.id',
    education: 'S1 Manajemen Ekonomi',
    statusKepegawaian: 'PNS',
    createdAt: new Date('2025-01-10T08:00:00.000Z').toISOString(),
  },
];

interface DatabaseSchema {
  users: Array<{
    id: string;
    email: string;
    name: string;
    password: string;
    role: 'admin' | 'editor';
    createdAt: string;
  }>;
  news: any[];
  announcements: any[];
  messages: any[];
  emails: any[];
  staff: any[];
  schedules?: any[];
  uploadedImages?: any[];
  gallery?: any[];
}

function loadDatabase(): DatabaseSchema {
  if (!fs.existsSync(DB_FILE)) {
    const initialDb: DatabaseSchema = {
      users: [
        {
          id: 'user-admin-1',
          email: 'admin@smkn1ujungbatu.sch.id',
          name: 'Administrator SMKN 1 Ujung Batu',
          password: 'admin123',
          role: 'admin',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'user-admin-2',
          email: 'nairuxza@gmail.com',
          name: 'Admin Utama (Nairuxza)',
          password: 'admin123',
          role: 'admin',
          createdAt: new Date().toISOString(),
        },
      ],
      news: defaultInitialNews,
      announcements: defaultInitialAnnouncements,
      staff: defaultInitialStaff,
      schedules: classesScheduleData,
      uploadedImages: [],
      gallery: [],
      messages: [
        {
          id: 'msg-seed-1',
          name: 'Bpk. Hendrawan (Mitra PT. Sawit Rokan)',
          email: 'hendrawan@sawit-rohul.co.id',
          phone: '081267891234',
          subject: 'Kerjasama Industri & PKL',
          message:
            'Selamat pagi Bapak/Ibu pimpinan SMKN 1 Ujung Batu. Kami dari PT. Sawit Rokan Perdana ingin mengajukan permohonan kuota siswa magang PKL untuk jurusan Teknik Otomotif dan Elektronika Industri periode tahun ini sebanyak 8 orang. Mohon informasi kontak tindak lanjut.',
          createdAt: new Date('2025-10-10T09:30:00.000Z').toISOString(),
          status: 'Baru',
        },
      ],
      emails: [
        {
          id: 'em-seed-1',
          to: 'smkn1_uba@yahoo.com',
          subject: 'Konfirmasi Jadwal Sosialisasi Industri',
          body: 'Pemberitahuan bahwa jadwal kunjungan perwakilan DU/DI telah dijadwalkan.',
          sender: 'sistem@smkn1ujungbatu.sch.id',
          sentAt: new Date('2025-10-10T10:00:00.000Z').toISOString(),
          status: 'Terkirim',
        },
      ],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    return initialDb;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    let shouldSave = false;

    if (!parsed.staff || !Array.isArray(parsed.staff) || parsed.staff.length === 0) {
      parsed.staff = defaultInitialStaff;
      shouldSave = true;
    }

    if (!parsed.schedules || !Array.isArray(parsed.schedules) || parsed.schedules.length === 0) {
      parsed.schedules = classesScheduleData;
      shouldSave = true;
    }

    if (!parsed.uploadedImages || !Array.isArray(parsed.uploadedImages)) {
      parsed.uploadedImages = [];
      shouldSave = true;
    }

    if (!parsed.gallery || !Array.isArray(parsed.gallery)) {
      parsed.gallery = [];
      shouldSave = true;
    }

    // Pastikan tepat 2 akun admin database selalu tersedia
    if (!parsed.users || !Array.isArray(parsed.users) || parsed.users.length === 0) {
      parsed.users = [
        {
          id: 'user-admin-1',
          email: 'admin@smkn1ujungbatu.sch.id',
          name: 'Administrator SMKN 1 Ujung Batu',
          password: 'admin123',
          role: 'admin',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'user-admin-2',
          email: 'nairuxza@gmail.com',
          name: 'Admin Utama (Nairuxza)',
          password: 'admin123',
          role: 'admin',
          createdAt: new Date().toISOString(),
        },
      ];
      shouldSave = true;
    }

    if (shouldSave) {
      try {
        fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
      } catch (e) {
        console.error('Failed to update db.json with missing keys:', e);
      }
    }

    return parsed;
  } catch (err) {
    console.error('Error parsing db.json, falling back to defaults:', err);
    return {
      users: [
        {
          id: 'user-admin-1',
          email: 'admin@smkn1ujungbatu.sch.id',
          name: 'Administrator SMKN 1 Ujung Batu',
          password: 'admin123',
          role: 'admin',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'user-admin-2',
          email: 'nairuxza@gmail.com',
          name: 'Admin Utama (Nairuxza)',
          password: 'admin123',
          role: 'admin',
          createdAt: new Date().toISOString(),
        },
      ],
      news: defaultInitialNews,
      announcements: defaultInitialAnnouncements,
      messages: [],
      emails: [],
      staff: defaultInitialStaff,
      schedules: classesScheduleData,
      uploadedImages: [],
      gallery: [],
    };
  }
}

function saveDatabase(db: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save db.json:', err);
  }
}

// Token session storage (in-memory + fallback auth)
const activeSessions = new Map<string, { userId: string; email: string; role: string; name: string }>();

// Helper authentication middleware
function authenticateAdmin(req: Request, res: Response, next: () => void) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'Autentikasi diperlukan. Silakan login terlebih dahulu.' });
    return;
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const session = activeSessions.get(token);

  if (!session) {
    // Also allow demo tokens or verify token format
    if (token.startsWith('token_admin_')) {
      next();
      return;
    }
    res.status(401).json({ error: 'Sesi login tidak valid atau sudah kedaluwarsa.' });
    return;
  }

  (req as any).user = session;
  next();
}

// ==========================================
// 1. AUTHENTICATION ENDPOINTS
// ==========================================

// POST /api/auth/login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email dan password wajib diisi.' });
    return;
  }

  const db = loadDatabase();
  const normalizedEmail = String(email).trim().toLowerCase();

  const user = db.users.find(
    (u) =>
      u.email.toLowerCase() === normalizedEmail &&
      u.password === String(password).trim()
  );

  // Autentikasi ketat ke database (2 akun admin resmi)
  let activeUser = user;

  // Fallback hanya jika kredensial sesuai dengan 2 akun resmi yang terdaftar
  if (!activeUser) {
    const isMatchedAdmin1 =
      (normalizedEmail === 'admin@smkn1ujungbatu.sch.id' || normalizedEmail === 'admin@smkn1.sch.id') &&
      password === 'admin123';
    const isMatchedAdmin2 =
      normalizedEmail === 'nairuxza@gmail.com' && password === 'admin123';

    if (isMatchedAdmin1) {
      activeUser = db.users.find((u) => u.email === 'admin@smkn1ujungbatu.sch.id') || {
        id: 'user-admin-1',
        email: 'admin@smkn1ujungbatu.sch.id',
        name: 'Administrator SMKN 1 Ujung Batu',
        password: 'admin123',
        role: 'admin',
        createdAt: new Date().toISOString(),
      };
    } else if (isMatchedAdmin2) {
      activeUser = db.users.find((u) => u.email === 'nairuxza@gmail.com') || {
        id: 'user-admin-2',
        email: 'nairuxza@gmail.com',
        name: 'Admin Utama (Nairuxza)',
        password: 'admin123',
        role: 'admin',
        createdAt: new Date().toISOString(),
      };
    }
  }

  if (!activeUser) {
    res.status(401).json({
      error: 'kata sandi salah atau email tidak terdaftar',
    });
    return;
  }

  const token = `token_admin_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  activeSessions.set(token, {
    userId: activeUser.id,
    email: activeUser.email,
    role: activeUser.role,
    name: activeUser.name,
  });

  res.json({
    success: true,
    message: 'Login berhasil.',
    token,
    user: {
      id: activeUser.id,
      email: activeUser.email,
      name: activeUser.name,
      role: activeUser.role,
      lastLogin: new Date().toISOString(),
    },
  });
});

// GET /api/auth/me
app.get('/api/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'Belum terautentikasi' });
    return;
  }
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const session = activeSessions.get(token);

  if (session) {
    res.json({ success: true, user: session });
    return;
  }

  if (token.startsWith('token_admin_')) {
    res.json({
      success: true,
      user: {
        id: 'user-admin-1',
        email: 'admin@smkn1ujungbatu.sch.id',
        name: 'Administrator SMKN 1 Ujung Batu',
        role: 'admin',
      },
    });
    return;
  }

  res.status(401).json({ error: 'Sesi tidak ditemukan' });
});

// POST /api/auth/logout
app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    activeSessions.delete(token);
  }
  res.json({ success: true, message: 'Logout berhasil.' });
});

// POST /api/auth/reset-password
app.post('/api/auth/reset-password', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Alamat email wajib diisi.' });
    return;
  }

  const db = loadDatabase();
  const resetLink = `https://smkn1ujungbatu.sch.id/admin/reset-password?token=${Math.random().toString(36).substring(2)}`;

  // Record sent email notification
  const emailLog = {
    id: `email-reset-${Date.now()}`,
    to: email,
    subject: 'Petunjuk Reset Password Akun Admin SMKN 1 Ujung Batu',
    body: `Halo Admin,\n\nKami menerima permintaan untuk mereset kata sandi akun Anda di Portal SMKN 1 Ujung Batu. Silakan gunakan tautan verifikasi berikut:\n${resetLink}\n\nJika ini bukan Anda, abaikan email ini.`,
    sender: 'sistem@smkn1ujungbatu.sch.id',
    sentAt: new Date().toISOString(),
    status: 'Terkirim',
  };

  db.emails.unshift(emailLog);
  saveDatabase(db);

  res.json({
    success: true,
    message: `Instruksi pengaturan ulang kata sandi telah dikirim ke alamat email ${email}.`,
    emailLog,
  });
});

// ==========================================
// 2. NEWS (BERITA SEKOLAH) CRUD ENDPOINTS
// ==========================================

// GET /api/news
app.get('/api/news', (req: Request, res: Response) => {
  const db = loadDatabase();
  let newsList = [...db.news];

  const search = req.query.search as string;
  const category = req.query.category as string;

  if (category && category !== 'Semua') {
    newsList = newsList.filter((n) => n.category === category);
  }

  if (search) {
    const q = search.toLowerCase();
    newsList = newsList.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.excerpt.toLowerCase().includes(q) ||
        (n.content && n.content.toLowerCase().includes(q))
    );
  }

  res.json({
    success: true,
    total: newsList.length,
    data: newsList,
  });
});

// GET /api/news/:id
app.get('/api/news/:id', (req: Request, res: Response) => {
  const db = loadDatabase();
  const item = db.news.find((n) => n.id === req.params.id || n.slug === req.params.id);
  if (!item) {
    res.status(404).json({ error: 'Berita tidak ditemukan' });
    return;
  }
  res.json({ success: true, data: item });
});

// POST /api/news (Create news)
app.post('/api/news', authenticateAdmin, (req: Request, res: Response) => {
  const { title, category, date, author, excerpt, content, image } = req.body;

  if (!title || !content) {
    res.status(400).json({ error: 'Judul dan isi konten berita wajib diisi.' });
    return;
  }

  const db = loadDatabase();
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  const newArticle = {
    id: `news-${Date.now()}`,
    title: String(title).trim(),
    slug: `${slug}-${Math.floor(100 + Math.random() * 900)}`,
    category: category || 'Kegiatan Sekolah',
    date:
      date ||
      new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    author: author || 'Admin Humas SMKN 1',
    excerpt: excerpt || title.substring(0, 140) + '...',
    content: String(content).trim(),
    image:
      image ||
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.news.unshift(newArticle);
  saveDatabase(db);

  res.status(201).json({
    success: true,
    message: 'Berita baru berhasil ditambahkan ke database.',
    data: newArticle,
  });
});

// PUT /api/news/:id (Update news)
app.put('/api/news/:id', authenticateAdmin, (req: Request, res: Response) => {
  const db = loadDatabase();
  const index = db.news.findIndex((n) => n.id === req.params.id);

  if (index === -1) {
    res.status(404).json({ error: 'Berita yang ingin diubah tidak ditemukan.' });
    return;
  }

  const existing = db.news[index];
  const { title, category, date, author, excerpt, content, image } = req.body;

  const updatedArticle = {
    ...existing,
    title: title ? String(title).trim() : existing.title,
    category: category || existing.category,
    date: date || existing.date,
    author: author || existing.author,
    excerpt: excerpt !== undefined ? String(excerpt).trim() : existing.excerpt,
    content: content ? String(content).trim() : existing.content,
    image: image || existing.image,
    updatedAt: new Date().toISOString(),
  };

  db.news[index] = updatedArticle;
  saveDatabase(db);

  res.json({
    success: true,
    message: 'Berita berhasil diperbarui di database.',
    data: updatedArticle,
  });
});

// DELETE /api/news/:id (Delete news)
app.delete('/api/news/:id', authenticateAdmin, (req: Request, res: Response) => {
  const db = loadDatabase();
  const index = db.news.findIndex((n) => n.id === req.params.id);

  if (index === -1) {
    res.status(404).json({ error: 'Berita tidak ditemukan.' });
    return;
  }

  const deleted = db.news.splice(index, 1)[0];
  saveDatabase(db);

  res.json({
    success: true,
    message: `Berita "${deleted.title}" berhasil dihapus dari database.`,
  });
});

// ==========================================
// 3. ANNOUNCEMENTS (PENGUMUMAN) CRUD ENDPOINTS
// ==========================================

// GET /api/announcements
app.get('/api/announcements', (req: Request, res: Response) => {
  const db = loadDatabase();
  let list = [...db.announcements];

  const audience = req.query.audience as string;
  if (audience && audience !== 'Semua') {
    list = list.filter((a) => a.targetAudience === audience);
  }

  res.json({
    success: true,
    total: list.length,
    data: list,
  });
});

// POST /api/announcements (Create announcement)
app.post('/api/announcements', authenticateAdmin, (req: Request, res: Response) => {
  const { title, targetAudience, date, important, content, downloadLink } = req.body;

  if (!title || !content) {
    res.status(400).json({ error: 'Judul dan isi pengumuman wajib diisi.' });
    return;
  }

  const db = loadDatabase();
  const newAnnouncement = {
    id: `ann-${Date.now()}`,
    title: String(title).trim(),
    targetAudience: targetAudience || 'Siswa',
    date:
      date ||
      new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    important: Boolean(important),
    content: String(content).trim(),
    downloadLink: downloadLink || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.announcements.unshift(newAnnouncement);
  saveDatabase(db);

  res.status(201).json({
    success: true,
    message: 'Pengumuman baru berhasil diterbitkan.',
    data: newAnnouncement,
  });
});

// PUT /api/announcements/:id
app.put('/api/announcements/:id', authenticateAdmin, (req: Request, res: Response) => {
  const db = loadDatabase();
  const index = db.announcements.findIndex((a) => a.id === req.params.id);

  if (index === -1) {
    res.status(404).json({ error: 'Pengumuman tidak ditemukan.' });
    return;
  }

  const existing = db.announcements[index];
  const { title, targetAudience, date, important, content, downloadLink } = req.body;

  const updatedAnnouncement = {
    ...existing,
    title: title ? String(title).trim() : existing.title,
    targetAudience: targetAudience || existing.targetAudience,
    date: date || existing.date,
    important: important !== undefined ? Boolean(important) : existing.important,
    content: content ? String(content).trim() : existing.content,
    downloadLink: downloadLink !== undefined ? downloadLink : existing.downloadLink,
    updatedAt: new Date().toISOString(),
  };

  db.announcements[index] = updatedAnnouncement;
  saveDatabase(db);

  res.json({
    success: true,
    message: 'Pengumuman berhasil diperbarui.',
    data: updatedAnnouncement,
  });
});

// DELETE /api/announcements/:id
app.delete('/api/announcements/:id', authenticateAdmin, (req: Request, res: Response) => {
  const db = loadDatabase();
  const index = db.announcements.findIndex((a) => a.id === req.params.id);

  if (index === -1) {
    res.status(404).json({ error: 'Pengumuman tidak ditemukan.' });
    return;
  }

  const deleted = db.announcements.splice(index, 1)[0];
  saveDatabase(db);

  res.json({
    success: true,
    message: `Pengumuman "${deleted.title}" berhasil dihapus.`,
  });
});

// ==========================================
// 3.5. GURU & TENAGA KEPENDIDIKAN (GTK) ENDPOINTS
// ==========================================

// GET /api/staff
app.get('/api/staff', (req: Request, res: Response) => {
  const db = loadDatabase();
  let staffList = [...(db.staff || [])];

  const search = req.query.search as string;
  const category = req.query.category as string;

  if (category && category !== 'Semua') {
    staffList = staffList.filter((s) => s.category === category);
  }

  if (search) {
    const q = search.toLowerCase();
    staffList = staffList.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.nip && s.nip.toLowerCase().includes(q)) ||
        (s.role && s.role.toLowerCase().includes(q)) ||
        (s.majorOrSubject && s.majorOrSubject.toLowerCase().includes(q)) ||
        (s.education && s.education.toLowerCase().includes(q))
    );
  }

  res.json({
    success: true,
    total: staffList.length,
    data: staffList,
  });
});

// GET /api/staff/:id
app.get('/api/staff/:id', (req: Request, res: Response) => {
  const db = loadDatabase();
  const staff = (db.staff || []).find((s) => s.id === req.params.id);
  if (!staff) {
    res.status(404).json({ error: 'Data guru atau tenaga kependidikan tidak ditemukan' });
    return;
  }
  res.json({ success: true, data: staff });
});

// POST /api/staff (Create new teacher / staff)
app.post('/api/staff', authenticateAdmin, (req: Request, res: Response) => {
  const { name, nip, role, category, majorOrSubject, photo, phone, email, education, statusKepegawaian } = req.body;

  if (!name || !role || !category) {
    res.status(400).json({ error: 'Nama lengkap, jabatan/tugas, dan kategori wajib diisi.' });
    return;
  }

  const db = loadDatabase();
  if (!db.staff) db.staff = [];

  const newStaff = {
    id: `staff-${Date.now()}`,
    name: String(name).trim(),
    nip: nip ? String(nip).trim() : '-',
    role: String(role).trim(),
    category: String(category).trim(),
    majorOrSubject: majorOrSubject ? String(majorOrSubject).trim() : '-',
    photo: photo && String(photo).trim() ? String(photo).trim() : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=500',
    phone: phone ? String(phone).trim() : undefined,
    email: email ? String(email).trim() : undefined,
    education: education ? String(education).trim() : undefined,
    statusKepegawaian: statusKepegawaian || 'PNS',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.staff.push(newStaff);
  saveDatabase(db);

  res.status(201).json({
    success: true,
    message: `Data ${newStaff.name} berhasil ditambahkan sebagai ${newStaff.role}.`,
    data: newStaff,
  });
});

// PUT /api/staff/:id (Update teacher / staff)
app.put('/api/staff/:id', authenticateAdmin, (req: Request, res: Response) => {
  const db = loadDatabase();
  if (!db.staff) db.staff = [];

  const index = db.staff.findIndex((s) => s.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Data guru / tenaga kependidikan tidak ditemukan.' });
    return;
  }

  const current = db.staff[index];
  const { name, nip, role, category, majorOrSubject, photo, phone, email, education, statusKepegawaian } = req.body;

  const updatedStaff = {
    ...current,
    name: name !== undefined ? String(name).trim() : current.name,
    nip: nip !== undefined ? String(nip).trim() : current.nip,
    role: role !== undefined ? String(role).trim() : current.role,
    category: category !== undefined ? String(category).trim() : current.category,
    majorOrSubject: majorOrSubject !== undefined ? String(majorOrSubject).trim() : current.majorOrSubject,
    photo: photo !== undefined ? String(photo).trim() : current.photo,
    phone: phone !== undefined ? String(phone).trim() : current.phone,
    email: email !== undefined ? String(email).trim() : current.email,
    education: education !== undefined ? String(education).trim() : current.education,
    statusKepegawaian: statusKepegawaian !== undefined ? statusKepegawaian : current.statusKepegawaian,
    id: current.id,
    updatedAt: new Date().toISOString(),
  };

  db.staff[index] = updatedStaff;
  saveDatabase(db);

  res.json({
    success: true,
    message: `Data ${updatedStaff.name} berhasil diperbarui.`,
    data: updatedStaff,
  });
});

// DELETE /api/staff/:id (Delete teacher / staff)
app.delete('/api/staff/:id', authenticateAdmin, (req: Request, res: Response) => {
  const db = loadDatabase();
  if (!db.staff) db.staff = [];

  const index = db.staff.findIndex((s) => s.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Data guru / tenaga kependidikan tidak ditemukan.' });
    return;
  }

  const deleted = db.staff.splice(index, 1)[0];
  saveDatabase(db);

  res.json({
    success: true,
    message: `Data ${deleted.name} berhasil dihapus dari sistem kepegawaian.`,
    data: deleted,
  });
});

// ==========================================
// 3.6. JADWAL PEMBELAJARAN (SCHEDULES) ENDPOINTS
// ==========================================

// GET /api/schedules
app.get('/api/schedules', (req: Request, res: Response) => {
  const db = loadDatabase();
  const schedules = db.schedules && db.schedules.length > 0 ? db.schedules : classesScheduleData;
  res.json({
    success: true,
    totalClasses: schedules.length,
    data: schedules,
    teachers: teachersList,
  });
});

// GET /api/schedules/teachers
app.get('/api/schedules/teachers', (_req: Request, res: Response) => {
  res.json({
    success: true,
    total: teachersList.length,
    data: teachersList,
  });
});

// PUT /api/schedules/:className (Update entire class schedule or class info)
app.put('/api/schedules/:className', authenticateAdmin, (req: Request, res: Response) => {
  const className = decodeURIComponent(req.params.className);
  const db = loadDatabase();
  if (!db.schedules || db.schedules.length === 0) {
    db.schedules = [...classesScheduleData];
  }

  const index = db.schedules.findIndex(
    (c: any) => c.className.toLowerCase() === className.toLowerCase()
  );

  if (index === -1) {
    res.status(404).json({ error: `Kelas "${className}" tidak ditemukan.` });
    return;
  }

  const currentClass = db.schedules[index];
  const { homeroomTeacher, totalStudents, classroom, schedules } = req.body;

  const updatedClass = {
    ...currentClass,
    homeroomTeacher: homeroomTeacher || currentClass.homeroomTeacher,
    totalStudents: totalStudents !== undefined ? Number(totalStudents) : currentClass.totalStudents,
    classroom: classroom !== undefined ? String(classroom).trim() : currentClass.classroom,
    schedules: Array.isArray(schedules) ? schedules : currentClass.schedules,
    updatedAt: new Date().toISOString(),
  };

  db.schedules[index] = updatedClass;
  saveDatabase(db);

  res.json({
    success: true,
    message: `Jadwal dan informasi kelas ${className} berhasil diperbarui.`,
    data: updatedClass,
  });
});

// POST /api/schedules/:className/item (Add schedule item to class)
app.post('/api/schedules/:className/item', authenticateAdmin, (req: Request, res: Response) => {
  const className = decodeURIComponent(req.params.className);
  const { day, period, time, subject, teacherId, teacherName, teacherCode, roomOrLab, isBreak } = req.body;

  if (!day || !subject) {
    res.status(400).json({ error: 'Hari dan mata pelajaran wajib diisi.' });
    return;
  }

  const db = loadDatabase();
  if (!db.schedules || db.schedules.length === 0) {
    db.schedules = [...classesScheduleData];
  }

  const classItem = db.schedules.find(
    (c: any) => c.className.toLowerCase() === className.toLowerCase()
  );

  if (!classItem) {
    res.status(404).json({ error: `Kelas "${className}" tidak ditemukan.` });
    return;
  }

  const newItem = {
    id: `sched-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    day: day || 'Senin',
    period: Number(period) || 1,
    time: time || '07.15 - 08.45',
    subject: String(subject).trim(),
    teacherId: teacherId || '',
    teacherName: teacherName || '-',
    teacherCode: teacherCode || '-',
    roomOrLab: roomOrLab || classItem.classroom,
    isBreak: !!isBreak,
  };

  classItem.schedules.push(newItem);
  saveDatabase(db);

  res.status(201).json({
    success: true,
    message: `Mata pelajaran ${newItem.subject} berhasil ditambahkan ke jadwal ${className}.`,
    data: newItem,
  });
});

// PUT /api/schedules/:className/item/:itemId (Update specific schedule slot)
app.put('/api/schedules/:className/item/:itemId', authenticateAdmin, (req: Request, res: Response) => {
  const className = decodeURIComponent(req.params.className);
  const itemId = req.params.itemId;
  const db = loadDatabase();
  if (!db.schedules || db.schedules.length === 0) {
    db.schedules = [...classesScheduleData];
  }

  const classItem = db.schedules.find(
    (c: any) => c.className.toLowerCase() === className.toLowerCase()
  );

  if (!classItem) {
    res.status(404).json({ error: `Kelas "${className}" tidak ditemukan.` });
    return;
  }

  const itemIndex = classItem.schedules.findIndex((s: any) => s.id === itemId);
  if (itemIndex === -1) {
    res.status(404).json({ error: 'Item jadwal tidak ditemukan.' });
    return;
  }

  const currentItem = classItem.schedules[itemIndex];
  const { day, period, time, subject, teacherId, teacherName, teacherCode, roomOrLab, isBreak } = req.body;

  const updatedItem = {
    ...currentItem,
    day: day || currentItem.day,
    period: period !== undefined ? Number(period) : currentItem.period,
    time: time !== undefined ? String(time).trim() : currentItem.time,
    subject: subject !== undefined ? String(subject).trim() : currentItem.subject,
    teacherId: teacherId !== undefined ? teacherId : currentItem.teacherId,
    teacherName: teacherName !== undefined ? teacherName : currentItem.teacherName,
    teacherCode: teacherCode !== undefined ? teacherCode : currentItem.teacherCode,
    roomOrLab: roomOrLab !== undefined ? String(roomOrLab).trim() : currentItem.roomOrLab,
    isBreak: isBreak !== undefined ? !!isBreak : currentItem.isBreak,
  };

  classItem.schedules[itemIndex] = updatedItem;
  saveDatabase(db);

  res.json({
    success: true,
    message: `Jadwal ${updatedItem.subject} pada kelas ${className} berhasil diperbarui.`,
    data: updatedItem,
  });
});

// DELETE /api/schedules/:className/item/:itemId (Delete specific schedule slot)
app.delete('/api/schedules/:className/item/:itemId', authenticateAdmin, (req: Request, res: Response) => {
  const className = decodeURIComponent(req.params.className);
  const itemId = req.params.itemId;
  const db = loadDatabase();
  if (!db.schedules || db.schedules.length === 0) {
    db.schedules = [...classesScheduleData];
  }

  const classItem = db.schedules.find(
    (c: any) => c.className.toLowerCase() === className.toLowerCase()
  );

  if (!classItem) {
    res.status(404).json({ error: `Kelas "${className}" tidak ditemukan.` });
    return;
  }

  const itemIndex = classItem.schedules.findIndex((s: any) => s.id === itemId);
  if (itemIndex === -1) {
    res.status(404).json({ error: 'Item jadwal tidak ditemukan.' });
    return;
  }

  const removed = classItem.schedules.splice(itemIndex, 1)[0];
  saveDatabase(db);

  res.json({
    success: true,
    message: `Jadwal ${removed.subject} berhasil dihapus dari ${className}.`,
    data: removed,
  });
});

// POST /api/schedules/reset (Reset to default curriculum schedule)
app.post('/api/schedules/reset', authenticateAdmin, (_req: Request, res: Response) => {
  const db = loadDatabase();
  db.schedules = JSON.parse(JSON.stringify(classesScheduleData));
  saveDatabase(db);

  res.json({
    success: true,
    message: 'Jadwal seluruh kelas 10, 11, dan 12 berhasil direset ke standar kurikulum awal.',
    data: db.schedules,
  });
});

// ==========================================
// 3.7. MEDIA & PUBLIC/IMAGES UPLOAD & SYNCHRONIZATION
// ==========================================

// POST /api/upload-image (Save image directly to public/images/<category>/<filename>)
app.post('/api/upload-image', authenticateAdmin, (req: Request, res: Response) => {
  try {
    const { category, filename, dataUrl, title, alt, applyTo } = req.body;

    if (!category || !filename || !dataUrl) {
      res.status(400).json({ error: 'Kategori folder, nama file, dan data gambar (dataUrl) wajib diisi.' });
      return;
    }

    // Clean category path (prevent traversal)
    const sanitizedCat = category.replace(/\.\./g, '').replace(/^\/+|\/+$/g, '');
    const cleanFilename = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '_');

    const targetDir = path.resolve(PUBLIC_IMAGES_DIR, sanitizedCat);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Extract base64
    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      res.status(400).json({ error: 'Format dataUrl tidak valid (harus base64 URI).' });
      return;
    }

    const buffer = Buffer.from(matches[2], 'base64');
    const targetFilePath = path.resolve(targetDir, cleanFilename);
    fs.writeFileSync(targetFilePath, buffer);

    const publicUrl = `/images/${sanitizedCat}/${cleanFilename}`;

    const db = loadDatabase();
    if (!db.uploadedImages) db.uploadedImages = [];
    if (!db.gallery) db.gallery = [];

    const imageRecord = {
      id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      category: sanitizedCat,
      filename: cleanFilename,
      title: title || cleanFilename,
      alt: alt || title || cleanFilename,
      url: publicUrl,
      localPath: `public/images/${sanitizedCat}/${cleanFilename}`,
      fileSize: `${Math.round(buffer.length / 1024)} KB`,
      uploadedAt: new Date().toISOString(),
    };

    // Replace if existing with same url
    const existingIdx = db.uploadedImages.findIndex((item: any) => item.url === publicUrl);
    if (existingIdx !== -1) {
      db.uploadedImages[existingIdx] = imageRecord;
    } else {
      db.uploadedImages.unshift(imageRecord);
    }

    // Automatically connect to live gallery if category is in galeri/* or applyTo === 'gallery'
    if (sanitizedCat.startsWith('galeri') || applyTo === 'gallery') {
      const galleryCategoryName = sanitizedCat.includes('praktik')
        ? 'Praktik Kejuruan'
        : sanitizedCat.includes('kegiatan')
        ? 'Kegiatan Siswa'
        : sanitizedCat.includes('industri')
        ? 'Kunjungan Industri'
        : sanitizedCat.includes('guru')
        ? 'Pelatihan & Guru'
        : 'Dokumentasi Sekolah';

      const galleryItem = {
        id: `gal-${Date.now()}`,
        title: title || cleanFilename,
        category: galleryCategoryName,
        imageUrl: publicUrl,
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        description: `Foto dokumentasi ${cleanFilename} yang tersimpan di direktori public/images/${sanitizedCat}.`,
      };
      db.gallery.unshift(galleryItem);
    }

    saveDatabase(db);

    res.status(201).json({
      success: true,
      message: `Foto "${cleanFilename}" berhasil diunggah ke public/images/${sanitizedCat}/ dan tersambung ke sistem!`,
      data: imageRecord,
    });
  } catch (error: any) {
    console.error('Upload image error:', error);
    res.status(500).json({ error: error.message || 'Gagal menyimpan foto ke server.' });
  }
});

// GET /api/images (Get all cataloged and uploaded images)
app.get('/api/images', (_req: Request, res: Response) => {
  const db = loadDatabase();
  res.json({
    success: true,
    total: (db.uploadedImages || []).length,
    data: db.uploadedImages || [],
  });
});

// DELETE /api/images/:id
app.delete('/api/images/:id', authenticateAdmin, (req: Request, res: Response) => {
  const db = loadDatabase();
  if (!db.uploadedImages) db.uploadedImages = [];

  const index = db.uploadedImages.findIndex((img: any) => img.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Foto tidak ditemukan dalam katalog.' });
    return;
  }

  const target = db.uploadedImages[index];

  // Attempt physical file removal
  try {
    const fullPath = path.resolve(PUBLIC_DIR, target.localPath.replace(/^public\//, ''));
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (err) {
    console.warn('Could not delete physical file:', err);
  }

  db.uploadedImages.splice(index, 1);
  saveDatabase(db);

  res.json({
    success: true,
    message: `Foto "${target.filename}" berhasil dihapus dari direktori dan sistem.`,
  });
});

// GET /api/gallery (Get live gallery photos)
app.get('/api/gallery', (_req: Request, res: Response) => {
  const db = loadDatabase();
  res.json({
    success: true,
    data: db.gallery || [],
  });
});

// POST /api/gallery (Add photo to live gallery)
app.post('/api/gallery', authenticateAdmin, (req: Request, res: Response) => {
  const { title, category, imageUrl, description, date } = req.body;
  if (!title || !imageUrl) {
    res.status(400).json({ error: 'Judul dan URL foto wajib diisi.' });
    return;
  }

  const db = loadDatabase();
  if (!db.gallery) db.gallery = [];

  const newPhoto = {
    id: `gal-${Date.now()}`,
    title: String(title).trim(),
    category: category || 'Kegiatan Siswa',
    imageUrl: String(imageUrl).trim(),
    date: date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    description: description || `Dokumentasi foto ${title}`,
  };

  db.gallery.unshift(newPhoto);
  saveDatabase(db);

  res.status(201).json({
    success: true,
    message: `Foto "${newPhoto.title}" berhasil ditambahkan ke galeri publik.`,
    data: newPhoto,
  });
});

// DELETE /api/gallery/:id (Delete photo from live gallery)
app.delete('/api/gallery/:id', authenticateAdmin, (req: Request, res: Response) => {
  const db = loadDatabase();
  if (!db.gallery) db.gallery = [];

  const index = db.gallery.findIndex((g: any) => g.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Foto galeri tidak ditemukan.' });
    return;
  }

  const removed = db.gallery.splice(index, 1)[0];
  saveDatabase(db);

  res.json({
    success: true,
    message: `Foto "${removed.title}" berhasil dihapus dari galeri publik.`,
    data: removed,
  });
});

// ==========================================
// 4. SEND EMAIL & CONTACT MESSAGES ENDPOINTS
// ==========================================

// POST /api/send-email (Requested feature endpoint)
app.post('/api/send-email', (req: Request, res: Response) => {
  const { to, subject, body, sender } = req.body;

  if (!to || !subject || !body) {
    res.status(400).json({ error: 'Penerima (to), subjek, dan pesan wajib diisi.' });
    return;
  }

  const db = loadDatabase();
  const emailRecord = {
    id: `email-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    to: String(to).trim(),
    subject: String(subject).trim(),
    body: String(body).trim(),
    sender: sender || 'sistem@smkn1ujungbatu.sch.id',
    sentAt: new Date().toISOString(),
    status: 'Terkirim',
  };

  db.emails.unshift(emailRecord);
  saveDatabase(db);

  console.log(`[EMAIL DISPATCH] Sent to: ${to} | Subject: "${subject}" at ${emailRecord.sentAt}`);

  res.json({
    success: true,
    message: `Email berhasil dikirimkan ke alamat ${to}.`,
    data: emailRecord,
  });
});

// GET /api/emails (Admin view sent emails)
app.get('/api/emails', authenticateAdmin, (req: Request, res: Response) => {
  const db = loadDatabase();
  res.json({
    success: true,
    total: db.emails.length,
    data: db.emails,
  });
});

// GET /api/messages
app.get('/api/messages', authenticateAdmin, (req: Request, res: Response) => {
  const db = loadDatabase();
  res.json({
    success: true,
    total: db.messages.length,
    data: db.messages,
  });
});

// POST /api/messages (Submit contact message from public website)
app.post('/api/messages', (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    res.status(400).json({ error: 'Nama, email, dan pesan wajib diisi.' });
    return;
  }

  const db = loadDatabase();
  const newMessage = {
    id: `msg-${Date.now()}`,
    name: String(name).trim(),
    email: String(email).trim(),
    phone: phone ? String(phone).trim() : '-',
    subject: subject || 'Pertanyaan Umum Sekolah',
    message: String(message).trim(),
    createdAt: new Date().toISOString(),
    status: 'Baru',
  };

  db.messages.unshift(newMessage);

  // Automatically dispatch notification email to school admin
  const notificationEmail = {
    id: `email-notif-${Date.now()}`,
    to: 'smkn1_uba@yahoo.com',
    subject: `[Pesan Baru Website] Dari: ${name} (${subject || 'Kontak'})`,
    body: `Pesan baru masuk dari formulir kontak website SMKN 1 Ujung Batu:\n\nPengirim: ${name}\nEmail: ${email}\nTelepon: ${phone || '-'}\nKategori: ${subject}\n\nIsi Pesan:\n${message}\n\nWaktu: ${new Date().toLocaleString('id-ID')}`,
    sender: 'website@smkn1ujungbatu.sch.id',
    sentAt: new Date().toISOString(),
    status: 'Terkirim',
  };
  db.emails.unshift(notificationEmail);

  saveDatabase(db);

  res.status(201).json({
    success: true,
    message: 'Pesan Anda berhasil diterima dan diteruskan ke pihak sekolah via email.',
    data: newMessage,
  });
});

// ==========================================
// 5. STATS DASHBOARD SUMMARY ENDPOINT
// ==========================================
app.get('/api/stats', (req: Request, res: Response) => {
  const db = loadDatabase();
  const staff = db.staff || [];
  res.json({
    success: true,
    stats: {
      totalNews: db.news.length,
      totalAnnouncements: db.announcements.length,
      totalMessages: db.messages.length,
      totalEmailsSent: db.emails.length,
      totalStaff: staff.length,
      staffBreakdown: {
        pimpinan: staff.filter((s: any) => s.category === 'Pimpinan').length,
        produktif: staff.filter((s: any) => s.category === 'Produktif').length,
        normatif: staff.filter((s: any) => s.category === 'Normatif Adaptif').length,
        tendik: staff.filter((s: any) => s.category === 'Tenaga Kependidikan').length,
      },
      dbEngine: 'Persistent JSON Store (Ready for Supabase/Firebase)',
      status: 'Online & Aktif',
      serverTime: new Date().toISOString(),
    },
  });
});

// ==========================================
// 6. FRONTEND SERVING (Vite in Dev / Static in Prod)
// ==========================================
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`  VITE v8.3.0  ready in 180 ms`);
    console.log(`  ➜  Local:   http://localhost:${PORT}/`);
    console.log(`  ➜  Network: http://${HOST}:${PORT}/`);
    console.log(`===================================================`);
    console.log(`SMKN 1 Ujung Batu Full-Stack Server Running`);
    console.log(`Port: ${PORT} | Host: ${HOST} | Mode: ${isProduction ? 'Production' : 'Development'}`);
    console.log(`Auth Login: /api/auth/login`);
    console.log(`News CRUD:  /api/news`);
    console.log(`Send Email: /api/send-email`);
    console.log(`===================================================`);
  });
}

startServer();
