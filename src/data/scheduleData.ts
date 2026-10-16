export interface TeachingTeacher {
  id: string;
  name: string;
  nip: string;
  code: string;
  subject: string;
  majorOrGroup: 'Umum' | 'TKJ' | 'TO' | 'BDP' | 'TE' | 'TLOG' | 'BP';
  phone?: string;
  room?: string;
}

export interface ClassScheduleItem {
  id: string;
  day: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  period: number; // Jam ke-1, Jam ke-2 dst
  time: string; // "07.15 - 08.45"
  subject: string;
  teacherId: string;
  teacherName: string;
  teacherCode: string;
  roomOrLab: string;
  isBreak?: boolean;
}

export interface MajorClassInfo {
  majorId: string;
  majorCode: string;
  majorName: string;
  grade: '10' | '11' | '12';
  className: string; // e.g. "X TKJ 1", "XI TO 2", etc.
  homeroomTeacher: {
    name: string;
    nip: string;
  };
  totalStudents: number;
  classroom: string;
  schedules: ClassScheduleItem[];
}

export const daysList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'] as const;

export const teachersList: TeachingTeacher[] = [
  // Guru Produktif TKJ
  {
    id: 't-tkj-1',
    name: 'Hendra Wijaya, S.Kom., M.T.',
    nip: '19830719 200902 1 004',
    code: 'HW',
    subject: 'Administrasi Infrastruktur Jaringan & Keamanan Siber',
    majorOrGroup: 'TKJ',
    room: 'Lab Komputer & Jaringan 1',
  },
  {
    id: 't-tkj-2',
    name: 'Ahmad Fauzan, S.T.',
    nip: '19880412 201402 1 003',
    code: 'AF',
    subject: 'Teknologi Jaringan Berbasis Luas (WAN) & Fiber Optik',
    majorOrGroup: 'TKJ',
    room: 'Lab Fiber Optic Splicing',
  },
  {
    id: 't-tkj-3',
    name: 'Dini Fitriani, S.Kom.',
    nip: '19920120 201903 2 005',
    code: 'DF',
    subject: 'Dasar-Dasar TKJ & Pemrograman Perangkat Keras',
    majorOrGroup: 'TKJ',
    room: 'Lab Komputer 2',
  },

  // Guru Produktif TO (Teknik Otomotif)
  {
    id: 't-to-1',
    name: 'Supriyadi, S.T.',
    nip: '19840618 200902 1 005',
    code: 'SP',
    subject: 'Pemeliharaan Mesin Kendaraan Ringan & Sistem EFI',
    majorOrGroup: 'TO',
    room: 'Bengkel Otomotif Utama',
  },
  {
    id: 't-to-2',
    name: 'Rudi Hartono, S.Pd.',
    nip: '19870511 201101 1 006',
    code: 'RH',
    subject: 'Pemeliharaan Kelistrikan Kendaraan & Sistem AC',
    majorOrGroup: 'TO',
    room: 'Lab Kelistrikan Mobil',
  },
  {
    id: 't-to-3',
    name: 'Eko Wahyudi, S.T.',
    nip: '19900914 201602 1 008',
    code: 'EW',
    subject: 'Pemeliharaan Sasis & Pemindah Tenaga (Chassis & Power Train)',
    majorOrGroup: 'TO',
    room: 'Bengkel Car Lift & Spooring',
  },

  // Guru Produktif BDP (Bisnis Daring & Pemasaran)
  {
    id: 't-bdp-1',
    name: 'Rina Kartika, S.Pd.',
    nip: '19910415 201701 2 006',
    code: 'RK',
    subject: 'Digital Marketing & Content Creator E-Commerce',
    majorOrGroup: 'BDP',
    room: 'Studio Live Streaming & BDP',
  },
  {
    id: 't-bdp-2',
    name: 'Maya Sartika, S.E.',
    nip: '19890218 201503 2 007',
    code: 'MS',
    subject: 'Pengelolaan Bisnis Ritel & Sistem Kasir POS',
    majorOrGroup: 'BDP',
    room: 'Edumart SMKN 1',
  },

  // Guru Produktif TE (Teknik Elektronika)
  {
    id: 't-te-1',
    name: 'Ir. Ahmad Syafi’i, S.T.',
    nip: '19810312 200604 1 002',
    code: 'AS',
    subject: 'Teknik Mekatronika, PLC & Mikrokontroler IoT',
    majorOrGroup: 'TE',
    room: 'Lab Otomasi Industri & PLC',
  },
  {
    id: 't-te-2',
    name: 'Zulfikar, S.T.',
    nip: '19891108 201402 1 005',
    code: 'ZF',
    subject: 'Penerapan Rangkaian Elektronika & Soldering Presisi',
    majorOrGroup: 'TE',
    room: 'Lab Elektronika Dasar',
  },

  // Guru Produktif TLOG (Teknik Logistik)
  {
    id: 't-tlog-1',
    name: 'Dewi Anggraini, S.E.',
    nip: '19860822 201001 2 004',
    code: 'DA',
    subject: 'Manajemen Pergudangan (WMS) & Pengendalian Stok',
    majorOrGroup: 'TLOG',
    room: 'Ruang Praktik Pergudangan',
  },
  {
    id: 't-tlog-2',
    name: 'Faisal Akbar, S.T.',
    nip: '19930514 201903 1 004',
    code: 'FA',
    subject: 'Dokumentasi Ekspedisi Kargo & Material Handling',
    majorOrGroup: 'TLOG',
    room: 'Hub Logistik Sekolah',
  },

  // Guru Produktif BP (Broadcasting & Perfilman)
  {
    id: 't-bp-1',
    name: 'Bagus Pradana, S.Sn.',
    nip: '19930829 201903 1 007',
    code: 'BP',
    subject: 'Sinematografi Multi-Kamera & Penulisan Naskah TV',
    majorOrGroup: 'BP',
    room: 'Studio Green Screen TV',
  },
  {
    id: 't-bp-2',
    name: 'Nurul Hidayah, S.I.Kom.',
    nip: '19940716 202012 2 008',
    code: 'NH',
    subject: 'Penyuntingan Audio Video & Tata Suara (Audio Mixing)',
    majorOrGroup: 'BP',
    room: 'Lab Editing Premiere & DaVinci',
  },

  // Guru Muatan Umum / Normatif-Adaptif
  {
    id: 't-umum-1',
    name: 'Dra. Hj. Nuraini, M.Pd.',
    nip: '19750214 200212 2 003',
    code: 'NR',
    subject: 'Bahasa Indonesia & Komunikasi Ilmiah',
    majorOrGroup: 'Umum',
    room: 'Ruang Teori A-1',
  },
  {
    id: 't-umum-2',
    name: 'Bambang Irawan, S.Pd.',
    nip: '19780905 200501 1 008',
    code: 'BI',
    subject: 'Pendidikan Jasmani, Olahraga & Kesehatan (PJOK)',
    majorOrGroup: 'Umum',
    room: 'Lapangan Olahraga',
  },
  {
    id: 't-umum-3',
    name: 'Sri Wahyuni, M.Pd.',
    nip: '19821109 200801 2 011',
    code: 'SW',
    subject: 'Matematika Terapan Vokasi',
    majorOrGroup: 'Umum',
    room: 'Ruang Teori B-2',
  },
  {
    id: 't-umum-4',
    name: 'David Sihombing, S.Pd., M.Hum.',
    nip: '19850325 201001 1 015',
    code: 'DS',
    subject: 'Bahasa Inggris Vokasi & Technical English',
    majorOrGroup: 'Umum',
    room: 'Lab Bahasa',
  },
  {
    id: 't-umum-5',
    name: 'Ust. Ridwan Lubis, S.Pd.I.',
    nip: '19830419 200902 1 009',
    code: 'RL',
    subject: 'Pendidikan Agama Islam & Budi Pekerti',
    majorOrGroup: 'Umum',
    room: 'Musholla As-Salam / Ruang Teori',
  },
  {
    id: 't-umum-6',
    name: 'Yuli Hastuti, S.Pd.',
    nip: '19870814 201101 2 012',
    code: 'YH',
    subject: 'Pendidikan Pancasila & Kewarganegaraan (PPKn)',
    majorOrGroup: 'Umum',
    room: 'Ruang Teori C-3',
  },
  {
    id: 't-umum-7',
    name: 'Siti Aminah, S.Pd., Kons.',
    nip: '19861104 201101 2 018',
    code: 'SA',
    subject: 'Bimbingan Konseling & Kesiapan Karir Kerja',
    majorOrGroup: 'Umum',
    room: 'Ruang Layanan BK',
  },
];

// Helper to create schedule items for a class
function generateClassSchedule(
  grade: '10' | '11' | '12',
  majorCode: string,
  prodTeacher1: TeachingTeacher,
  prodTeacher2: TeachingTeacher
): ClassScheduleItem[] {
  const isG10 = grade === '10';
  const isG11 = grade === '11';
  const isG12 = grade === '12';

  return [
    // SENIN
    {
      id: `${grade}-${majorCode}-mon-1`,
      day: 'Senin',
      period: 1,
      time: '07.15 - 08.00',
      subject: 'Upacara Bendera & Apel Kedisiplinan Taruna',
      teacherId: 't-umum-2',
      teacherName: 'Bambang Irawan, S.Pd.',
      teacherCode: 'BI',
      roomOrLab: 'Lapangan Utama',
    },
    {
      id: `${grade}-${majorCode}-mon-2`,
      day: 'Senin',
      period: 2,
      time: '08.00 - 09.30',
      subject: isG10 ? 'Pendidikan Agama & Budi Pekerti' : 'Matematika Terapan Kejuruan',
      teacherId: isG10 ? 't-umum-5' : 't-umum-3',
      teacherName: isG10 ? 'Ust. Ridwan Lubis, S.Pd.I.' : 'Sri Wahyuni, M.Pd.',
      teacherCode: isG10 ? 'RL' : 'SW',
      roomOrLab: 'Ruang Kelas Teori',
    },
    {
      id: `${grade}-${majorCode}-mon-3`,
      day: 'Senin',
      period: 3,
      time: '09.45 - 11.45',
      subject: isG10 ? 'Dasar Program Keahlian ' + majorCode : 'Praktik Kejuruan Produktif Inti',
      teacherId: prodTeacher1.id,
      teacherName: prodTeacher1.name,
      teacherCode: prodTeacher1.code,
      roomOrLab: prodTeacher1.room || 'Lab Kejuruan',
    },
    {
      id: `${grade}-${majorCode}-mon-4`,
      day: 'Senin',
      period: 4,
      time: '12.30 - 15.00',
      subject: 'Praktik Laboratorium / Bengkel Keahlian ' + majorCode,
      teacherId: prodTeacher1.id,
      teacherName: prodTeacher1.name,
      teacherCode: prodTeacher1.code,
      roomOrLab: prodTeacher1.room || 'Bengkel / Lab',
    },

    // SELASA
    {
      id: `${grade}-${majorCode}-tue-1`,
      day: 'Selasa',
      period: 1,
      time: '07.15 - 09.15',
      subject: 'Matematika Terapan Vokasi',
      teacherId: 't-umum-3',
      teacherName: 'Sri Wahyuni, M.Pd.',
      teacherCode: 'SW',
      roomOrLab: 'Ruang Kelas Teori',
    },
    {
      id: `${grade}-${majorCode}-tue-2`,
      day: 'Selasa',
      period: 2,
      time: '09.30 - 11.45',
      subject: isG12 ? 'Projek Kreatif & Kewirausahaan (PKK)' : prodTeacher2.subject,
      teacherId: prodTeacher2.id,
      teacherName: prodTeacher2.name,
      teacherCode: prodTeacher2.code,
      roomOrLab: prodTeacher2.room || 'Lab Kejuruan',
    },
    {
      id: `${grade}-${majorCode}-tue-3`,
      day: 'Selasa',
      period: 3,
      time: '12.30 - 14.30',
      subject: 'Bahasa Inggris Vokasi (Technical English)',
      teacherId: 't-umum-4',
      teacherName: 'David Sihombing, S.Pd., M.Hum.',
      teacherCode: 'DS',
      roomOrLab: 'Lab Bahasa & Multimedia',
    },

    // RABU
    {
      id: `${grade}-${majorCode}-wed-1`,
      day: 'Rabu',
      period: 1,
      time: '07.15 - 09.45',
      subject: isG10 ? 'Informatika & Literasi Digital' : prodTeacher1.subject,
      teacherId: prodTeacher1.id,
      teacherName: prodTeacher1.name,
      teacherCode: prodTeacher1.code,
      roomOrLab: prodTeacher1.room || 'Lab Komputer',
    },
    {
      id: `${grade}-${majorCode}-wed-2`,
      day: 'Rabu',
      period: 2,
      time: '10.00 - 12.00',
      subject: 'Bahasa Indonesia & Komunikasi Teknis',
      teacherId: 't-umum-1',
      teacherName: 'Dra. Hj. Nuraini, M.Pd.',
      teacherCode: 'NR',
      roomOrLab: 'Ruang Kelas Teori',
    },
    {
      id: `${grade}-${majorCode}-wed-3`,
      day: 'Rabu',
      period: 3,
      time: '12.45 - 15.00',
      subject: isG12 ? 'Uji Kompetensi Keahlian (UKK) & Standar LSP' : 'Praktik Kejuruan Lanjutan',
      teacherId: prodTeacher2.id,
      teacherName: prodTeacher2.name,
      teacherCode: prodTeacher2.code,
      roomOrLab: prodTeacher2.room || 'Bengkel Kejuruan',
    },

    // KAMIS
    {
      id: `${grade}-${majorCode}-thu-1`,
      day: 'Kamis',
      period: 1,
      time: '07.15 - 09.15',
      subject: 'Pendidikan Jasmani, Olahraga & Kesehatan (PJOK)',
      teacherId: 't-umum-2',
      teacherName: 'Bambang Irawan, S.Pd.',
      teacherCode: 'BI',
      roomOrLab: 'Lapangan Olahraga & Senam',
    },
    {
      id: `${grade}-${majorCode}-thu-2`,
      day: 'Kamis',
      period: 2,
      time: '09.30 - 11.45',
      subject: 'Pendidikan Pancasila & Kewarganegaraan (PPKn)',
      teacherId: 't-umum-6',
      teacherName: 'Yuli Hastuti, S.Pd.',
      teacherCode: 'YH',
      roomOrLab: 'Ruang Kelas Teori',
    },
    {
      id: `${grade}-${majorCode}-thu-3`,
      day: 'Kamis',
      period: 3,
      time: '12.30 - 14.30',
      subject: 'Projek Penguatan Profil Pelajar Pancasila (P5) / TEFA',
      teacherId: prodTeacher1.id,
      teacherName: prodTeacher1.name,
      teacherCode: prodTeacher1.code,
      roomOrLab: 'Workshop Teaching Factory',
    },

    // JUMAT
    {
      id: `${grade}-${majorCode}-fri-1`,
      day: 'Jumat',
      period: 1,
      time: '07.15 - 08.15',
      subject: 'Senam Pagi Kesegaran Jasmani & Rohani Islam (Imtaq)',
      teacherId: 't-umum-5',
      teacherName: 'Ust. Ridwan Lubis, S.Pd.I.',
      teacherCode: 'RL',
      roomOrLab: 'Lapangan / Masjid Sekolah',
    },
    {
      id: `${grade}-${majorCode}-fri-2`,
      day: 'Jumat',
      period: 2,
      time: '08.15 - 10.00',
      subject: 'Konseling Karir, Penelusuran Minat & Bimbingan PKL',
      teacherId: 't-umum-7',
      teacherName: 'Siti Aminah, S.Pd., Kons.',
      teacherCode: 'SA',
      roomOrLab: 'Ruang Bimbingan Konseling',
    },
    {
      id: `${grade}-${majorCode}-fri-3`,
      day: 'Jumat',
      period: 3,
      time: '10.00 - 11.30',
      subject: 'Evaluasi Pembelajaran Mingguan & Pemeliharaan Lab 5R',
      teacherId: prodTeacher2.id,
      teacherName: prodTeacher2.name,
      teacherCode: prodTeacher2.code,
      roomOrLab: prodTeacher2.room || 'Lab / Bengkel',
    },
  ];
}

// Generate the complete classes dataset across all 6 majors and grades 10, 11, 12
export const classesScheduleData: MajorClassInfo[] = [
  // === JURUSAN 1: TKJ (Teknik Komputer & Jaringan) ===
  {
    majorId: 'tkj',
    majorCode: 'TKJ',
    majorName: 'Teknik Komputer & Jaringan',
    grade: '10',
    className: 'X TKJ 1',
    homeroomTeacher: { name: 'Dini Fitriani, S.Kom.', nip: '19920120 201903 2 005' },
    totalStudents: 36,
    classroom: 'Gedung A - R.101',
    schedules: generateClassSchedule('10', 'TKJ', teachersList[0], teachersList[2]),
  },
  {
    majorId: 'tkj',
    majorCode: 'TKJ',
    majorName: 'Teknik Komputer & Jaringan',
    grade: '11',
    className: 'XI TKJ 1',
    homeroomTeacher: { name: 'Ahmad Fauzan, S.T.', nip: '19880412 201402 1 003' },
    totalStudents: 35,
    classroom: 'Gedung A - R.201',
    schedules: generateClassSchedule('11', 'TKJ', teachersList[0], teachersList[1]),
  },
  {
    majorId: 'tkj',
    majorCode: 'TKJ',
    majorName: 'Teknik Komputer & Jaringan',
    grade: '12',
    className: 'XII TKJ 1',
    homeroomTeacher: { name: 'Hendra Wijaya, S.Kom., M.T.', nip: '19830719 200902 1 004' },
    totalStudents: 34,
    classroom: 'Gedung A - R.301',
    schedules: generateClassSchedule('12', 'TKJ', teachersList[0], teachersList[1]),
  },

  // === JURUSAN 2: TO (Teknik Otomotif) ===
  {
    majorId: 'to',
    majorCode: 'TO',
    majorName: 'Teknik Otomotif',
    grade: '10',
    className: 'X TO 1',
    homeroomTeacher: { name: 'Eko Wahyudi, S.T.', nip: '19900914 201602 1 008' },
    totalStudents: 36,
    classroom: 'Gedung B - R.102',
    schedules: generateClassSchedule('10', 'TO', teachersList[3], teachersList[5]),
  },
  {
    majorId: 'to',
    majorCode: 'TO',
    majorName: 'Teknik Otomotif',
    grade: '11',
    className: 'XI TO 1',
    homeroomTeacher: { name: 'Rudi Hartono, S.Pd.', nip: '19870511 201101 1 006' },
    totalStudents: 35,
    classroom: 'Gedung B - R.202',
    schedules: generateClassSchedule('11', 'TO', teachersList[3], teachersList[4]),
  },
  {
    majorId: 'to',
    majorCode: 'TO',
    majorName: 'Teknik Otomotif',
    grade: '12',
    className: 'XII TO 1',
    homeroomTeacher: { name: 'Supriyadi, S.T.', nip: '19840618 200902 1 005' },
    totalStudents: 34,
    classroom: 'Gedung B - R.302',
    schedules: generateClassSchedule('12', 'TO', teachersList[3], teachersList[4]),
  },

  // === JURUSAN 3: BDP (Bisnis Daring & Pemasaran) ===
  {
    majorId: 'bdp',
    majorCode: 'BDP',
    majorName: 'Bisnis Daring & Pemasaran',
    grade: '10',
    className: 'X BDP 1',
    homeroomTeacher: { name: 'Maya Sartika, S.E.', nip: '19890218 201503 2 007' },
    totalStudents: 34,
    classroom: 'Gedung C - R.103',
    schedules: generateClassSchedule('10', 'BDP', teachersList[6], teachersList[7]),
  },
  {
    majorId: 'bdp',
    majorCode: 'BDP',
    majorName: 'Bisnis Daring & Pemasaran',
    grade: '11',
    className: 'XI BDP 1',
    homeroomTeacher: { name: 'Rina Kartika, S.Pd.', nip: '19910415 201701 2 006' },
    totalStudents: 33,
    classroom: 'Gedung C - R.203',
    schedules: generateClassSchedule('11', 'BDP', teachersList[6], teachersList[7]),
  },
  {
    majorId: 'bdp',
    majorCode: 'BDP',
    majorName: 'Bisnis Daring & Pemasaran',
    grade: '12',
    className: 'XII BDP 1',
    homeroomTeacher: { name: 'David Sihombing, S.Pd., M.Hum.', nip: '19850325 201001 1 015' },
    totalStudents: 32,
    classroom: 'Gedung C - R.303',
    schedules: generateClassSchedule('12', 'BDP', teachersList[6], teachersList[7]),
  },

  // === JURUSAN 4: TE (Teknik Elektronika) ===
  {
    majorId: 'te',
    majorCode: 'TE',
    majorName: 'Teknik Elektronika',
    grade: '10',
    className: 'X TE 1',
    homeroomTeacher: { name: 'Zulfikar, S.T.', nip: '19891108 201402 1 005' },
    totalStudents: 32,
    classroom: 'Gedung D - R.104',
    schedules: generateClassSchedule('10', 'TE', teachersList[8], teachersList[9]),
  },
  {
    majorId: 'te',
    majorCode: 'TE',
    majorName: 'Teknik Elektronika',
    grade: '11',
    className: 'XI TE 1',
    homeroomTeacher: { name: 'Ir. Ahmad Syafi’i, S.T.', nip: '19810312 200604 1 002' },
    totalStudents: 30,
    classroom: 'Gedung D - R.204',
    schedules: generateClassSchedule('11', 'TE', teachersList[8], teachersList[9]),
  },
  {
    majorId: 'te',
    majorCode: 'TE',
    majorName: 'Teknik Elektronika',
    grade: '12',
    className: 'XII TE 1',
    homeroomTeacher: { name: 'Sri Wahyuni, M.Pd.', nip: '19821109 200801 2 011' },
    totalStudents: 30,
    classroom: 'Gedung D - R.304',
    schedules: generateClassSchedule('12', 'TE', teachersList[8], teachersList[9]),
  },

  // === JURUSAN 5: TLOG (Teknik Logistik) ===
  {
    majorId: 'tlog',
    majorCode: 'TLOG',
    majorName: 'Teknik Logistik',
    grade: '10',
    className: 'X TLOG 1',
    homeroomTeacher: { name: 'Faisal Akbar, S.T.', nip: '19930514 201903 1 004' },
    totalStudents: 30,
    classroom: 'Gedung E - R.105',
    schedules: generateClassSchedule('10', 'TLOG', teachersList[10], teachersList[11]),
  },
  {
    majorId: 'tlog',
    majorCode: 'TLOG',
    majorName: 'Teknik Logistik',
    grade: '11',
    className: 'XI TLOG 1',
    homeroomTeacher: { name: 'Dewi Anggraini, S.E.', nip: '19860822 201001 2 004' },
    totalStudents: 30,
    classroom: 'Gedung E - R.205',
    schedules: generateClassSchedule('11', 'TLOG', teachersList[10], teachersList[11]),
  },
  {
    majorId: 'tlog',
    majorCode: 'TLOG',
    majorName: 'Teknik Logistik',
    grade: '12',
    className: 'XII TLOG 1',
    homeroomTeacher: { name: 'Yuli Hastuti, S.Pd.', nip: '19870814 201101 2 012' },
    totalStudents: 28,
    classroom: 'Gedung E - R.305',
    schedules: generateClassSchedule('12', 'TLOG', teachersList[10], teachersList[11]),
  },

  // === JURUSAN 6: BP (Broadcasting & Perfilman) ===
  {
    majorId: 'bp',
    majorCode: 'BP',
    majorName: 'Broadcasting & Perfilman',
    grade: '10',
    className: 'X BP 1',
    homeroomTeacher: { name: 'Nurul Hidayah, S.I.Kom.', nip: '19940716 202012 2 008' },
    totalStudents: 32,
    classroom: 'Gedung F - Studio 1',
    schedules: generateClassSchedule('10', 'BP', teachersList[12], teachersList[13]),
  },
  {
    majorId: 'bp',
    majorCode: 'BP',
    majorName: 'Broadcasting & Perfilman',
    grade: '11',
    className: 'XI BP 1',
    homeroomTeacher: { name: 'Bagus Pradana, S.Sn.', nip: '19930829 201903 1 007' },
    totalStudents: 30,
    classroom: 'Gedung F - Studio 2',
    schedules: generateClassSchedule('11', 'BP', teachersList[12], teachersList[13]),
  },
  {
    majorId: 'bp',
    majorCode: 'BP',
    majorName: 'Broadcasting & Perfilman',
    grade: '12',
    className: 'XII BP 1',
    homeroomTeacher: { name: 'Dra. Hj. Nuraini, M.Pd.', nip: '19750214 200212 2 003' },
    totalStudents: 30,
    classroom: 'Gedung F - Studio 3',
    schedules: generateClassSchedule('12', 'BP', teachersList[12], teachersList[13]),
  },
];
