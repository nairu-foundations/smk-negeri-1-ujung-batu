export interface SchoolStat {
  id: string;
  label: string;
  value: string;
  description: string;
  iconName: string;
}

export interface VocationalMajor {
  id: string;
  code: string;
  name: string;
  badge: string;
  icon: string;
  description: string;
  bannerImage: string;
  competencies: string[];
  careerProspects: string[];
  workshops: string[];
  headOfDepartment: string;
}

export interface TeachingFactoryItem {
  id: string;
  title: string;
  majorCode: string;
  description: string;
  servicesOrProducts: string[];
  contactPerson: string;
  image: string;
}

export interface PklPartner {
  id: string;
  name: string;
  sector: string;
  location: string;
  relevantMajors: string[];
  logoPlaceholder: string;
}

export interface BkkJobVacancy {
  id: string;
  companyName: string;
  position: string;
  location: string;
  majorsNeeded: string[];
  deadline: string;
  type: string;
  status: 'Buka' | 'Segera Ditutup';
}

export interface StaffMember {
  id: string;
  name: string;
  nip: string;
  role: string;
  category: 'Pimpinan' | 'Produktif' | 'Normatif Adaptif' | 'Tenaga Kependidikan';
  majorOrSubject: string;
  photo: string;
  phone?: string;
  email?: string;
  education?: string;
  statusKepegawaian?: 'PNS' | 'PPPK' | 'GTT' | 'PTY' | 'Honorer';
  createdAt?: string;
  updatedAt?: string;
}

export interface Facility {
  id: string;
  title: string;
  category: 'Bengkel / Lab Kejuruan' | 'Fasilitas Umum' | 'Sarana Olahraga & Ibadah';
  description: string;
  specs: string;
  image: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  category: 'LKS & Prestasi' | 'Kegiatan PKL' | 'Kunjungan Industri' | 'Kegiatan Sekolah' | string;
  date: string;
  author: string;
  excerpt: string;
  content: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Announcement {
  id: string;
  title: string;
  targetAudience: 'Siswa' | 'Orang Tua' | 'Alumni & DU/DI' | 'Guru & Tendik' | 'Umum';
  date: string;
  important: boolean;
  content: string;
  downloadLink?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Extracurricular {
  id: string;
  name: string;
  category: 'Kejuruan & Teknologi' | 'Wajib & Kepanduan' | 'Olahraga & Seni' | 'Keagamaan' | string;
  description: string;
  coach: string;
  schedule: string;
  image: string;
  achievements?: string[];
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: 'Praktik Bengkel/Lab' | 'Kegiatan Siswa' | 'Kunjungan Industri' | 'Guru & Tendik';
  caption: string;
  imageUrl: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'Umum SMK' | 'PKL & BKK' | 'Program Keahlian' | 'Akademik';
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor';
  avatar?: string;
  lastLogin?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'Baru' | 'Dibaca' | 'Dibalas';
}

export interface EmailLog {
  id: string;
  to: string;
  subject: string;
  body: string;
  sender: string;
  sentAt: string;
  status: 'Terkirim' | 'Gagal';
}
