import React from 'react';
import {
  ExternalLink,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  Users,
  Building,
  HelpCircle,
  Phone,
  MapPin,
  ShieldCheck,
  ChevronRight,
  BookOpen,
  ArrowRight,
  MousePointerClick,
  Monitor,
} from 'lucide-react';
import { PageHeader } from './PageHeader';
import { schoolIdentity, vocationalMajors } from '../data/schoolData';

interface PpdbPageProps {
  onNavigate: (page: string, subTarget?: string) => void;
}

export const PpdbPage: React.FC<PpdbPageProps> = ({ onNavigate }) => {
  const RIAU_PPDB_URL = 'https://pmb.riau.go.id/';

  const registrationSteps = [
    {
      step: 1,
      title: 'Akses Portal Resmi PPDB Riau',
      desc: 'Buka website resmi seleksi daerah di portal PPDB Riau melalui peramban HP atau laptop.',
      time: 'Tahap Persiapan',
    },
    {
      step: 2,
      title: 'Registrasi Akun Mandiri (NISN & NIK)',
      desc: 'Buat akun calon peserta didik baru dengan memasukkan 10 digit NISN aktif, NIK KTP/KK, dan tanggal lahir.',
      time: 'Pembuatan Akun',
    },
    {
      step: 3,
      title: 'Unggah Kelengkapan Berkas (Scan/Foto)',
      desc: 'Unggah file Surat Keterangan Lulus (SKL) / Ijazah SMP, nilai rapor semester 1-5, Kartu Keluarga, dan Surat Bebas Buta Warna (khusus rumpun teknik).',
      time: 'Unggah Berkas',
    },
    {
      step: 4,
      title: 'Pilih SMKN 1 Ujung Batu & Jurusan',
      desc: 'Pilih jenjang SMK > Kabupaten Rokan Hulu > SMK Negeri 1 Ujung Batu, lalu tentukan prioritas Program Keahlian pilihan Anda (TKJ, TO, BDP, TE, TLOG, atau BP).',
      time: 'Pemilihan Satuan Pendidikan',
    },
    {
      step: 5,
      title: 'Cetak Bukti Registrasi & Verifikasi',
      desc: 'Simpan dan cetak bukti tanda pendaftaran online dari portal PPDB Riau untuk keperluan arsip verifikasi.',
      time: 'Konfirmasi Pendaftaran',
    },
    {
      step: 6,
      title: 'Pengumuman & Lapor Diri di Sekolah',
      desc: 'Cek hasil seleksi kelulusan serentak secara online, kemudian lakukan daftar ulang fisik di kampus SMKN 1 Ujung Batu.',
      time: 'Daftar Ulang',
    },
  ];

  const tracks = [
    {
      name: 'Jalur Zonasi / Jarak Domisili',
      quota: 'Prioritas Domisili',
      desc: 'Diperuntukkan bagi calon siswa yang berdomisili di dalam wilayah zonasi terdekat dengan kampus SMKN 1 Ujung Batu, Kecamatan Ujung Batu, dan sekitarnya di Kab. Rokan Hulu.',
      badge: 'Zonasi Wilayah',
    },
    {
      name: 'Jalur Afirmasi (KIP / PKH / Kurang Mampu)',
      quota: 'Bantuan Afirmasi',
      desc: 'Bagi calon siswa pemegang Kartu Indonesia Pintar (KIP), Program Keluarga Harapan (PKH), atau terdaftar pada Data Terpadu Kesejahteraan Sosial (DTKS).',
      badge: 'Afirmasi Pendidikan',
    },
    {
      name: 'Jalur Prestasi Nilai Rapor & Kejuaraan',
      quota: 'Prestasi Akademik / Non-Akademik',
      desc: 'Bagi lulusan SMP/MTs dengan rata-rata nilai rapor unggul atau memiliki sertifikat piagam juara lomba LKS, O2SN, FLS2N, Pramuka, atau Tahfidz.',
      badge: 'Prestasi Vokasi',
    },
    {
      name: 'Jalur Perpindahan Tugas Orang Tua / Wali',
      quota: 'Mutasi Instansi / Kedinasan',
      desc: 'Bagi calon peserta didik yang orang tua atau walinya dipindahtugaskan dinas kerja ke wilayah Kecamatan Ujung Batu dan Kabupaten Rokan Hulu.',
      badge: 'Perpindahan Tugas',
    },
  ];

  const requiredDocuments = [
    'Surat Keterangan Lulus (SKL) / Ijazah SMP/MTs sederajat asli atau fotokopi berlegalisir.',
    'Buku Rapor SMP/MTs Semester 1 sampai Semester 5 yang telah dilegalisir kepala sekolah.',
    'Fotokopi Kartu Keluarga (KK) yang diterbitkan minimal 1 tahun sebelum tanggal pendaftaran.',
    'Fotokopi Akta Kelahiran calon peserta didik baru.',
    'Pas foto terbaru ukuran 3x4 cm berlatar belakang merah (3 lembar).',
    'Surat Keterangan Bebas Buta Warna dari Puskesmas / Dokter (sangat diwajibkan untuk peminat jurusan Teknik Komputer & Jaringan, Teknik Otomotif, Teknik Elektronika, dan Broadcasting).',
    'Kartu KIP/PKH asli (bagi pendaftar Jalur Afirmasi).',
    'Piagam / Sertifikat Kejuaraan minimal tingkat kabupaten (bagi pendaftar Jalur Prestasi).',
  ];

  return (
    <div id="ppdb" className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <PageHeader
        title="Penerimaan Peserta Didik Baru (PPDB) TA 2025/2026"
        subtitle="Pendaftaran resmi terintegrasi dengan Portal PPDB Riau Dinas Pendidikan Pemerintah Provinsi Riau. Temukan panduan alur, syarat berkas, dan layanan pendampingan posko sekolah."
        badge="Portal Terpadu Provinsi Riau"
        breadcrumbs={[{ label: 'Informasi PPDB Riau' }]}
        onNavigate={onNavigate}
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 space-y-12">
        {/* 1. HERO OFFICIAL PORTAL REDIRECT CARD */}
        <div className="bg-gradient-to-br from-[#002260] via-[#003087] to-[#001740] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-white/15">
          {/* Decorative background glow */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#FFB800]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FFB800] text-xs font-bold tracking-wider uppercase">
                <ShieldCheck className="w-4 h-4 text-[#FFB800]" />
                <span>Pendaftaran Resmi Terpusat Provinsi Riau</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading leading-tight text-white">
                Daftar Online Melalui Portal Resmi PPDB Provinsi Riau
              </h2>

              <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-2xl font-normal">
                Sesuai regulasi Kementerian Pendidikan dan Dinas Pendidikan Provinsi Riau, seleksi dan pendaftaran calon peserta didik baru tingkat SMK Negeri di Kabupaten Rokan Hulu dilaksanakan secara daring melalui satu pintu di portal <strong>PPDB Riau</strong>.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href={RIAU_PPDB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#FFB800] hover:bg-[#ffc222] text-[#002260] font-bold text-sm sm:text-base shadow-lg transition-all hover:scale-102 cursor-pointer font-heading"
                >
                  <Monitor className="w-5 h-5 text-[#002260]" />
                  <span>Kunjungi Portal PPDB Riau</span>
                  <ExternalLink className="w-4 h-4 text-[#002260]" />
                </a>

                <a
                  href={`https://wa.me/${schoolIdentity.contact.whatsappHelpdesk.replace(/[^0-9]/g, '')}?text=Halo%20Panitia%20PPDB%20SMKN%201%20Ujung%20Batu,%20saya%20butuh%20panduan%20pendaftaran%20di%20PPDB%20Riau`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/20 transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-[#FFB800]" />
                  <span>Konsultasi Panitia Sekolah</span>
                </a>
              </div>
            </div>

            {/* Right Information Badge Box */}
            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 space-y-3.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#FFB800] uppercase tracking-wide">
                <GraduationCap className="w-4 h-4 text-[#FFB800]" />
                <span>Pilihan Satuan Pendidikan</span>
              </div>

              <div className="space-y-1">
                <div className="text-base font-bold text-white font-heading">
                  SMK Negeri 1 Ujung Batu
                </div>
                <div className="text-xs text-white/75">
                  Kabupaten Rokan Hulu • Provinsi Riau
                </div>
                <div className="text-xs text-white/75 font-mono">
                  NPSN: {schoolIdentity.npsn}
                </div>
              </div>

              <div className="pt-2 border-t border-white/15 text-xs text-white/80 space-y-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Akreditasi A BAN-S/M</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Tempat Uji Kompetensi BNSP</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Unit Teaching Factory (TEFA)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. ALUR PENDAFTARAN STEP BY STEP */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#FFB800] uppercase tracking-wider block font-heading">
              PANDUAN SISTEMATIS
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#003087] font-heading">
              6 Langkah Pendaftaran di PPDB Riau
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Ikuti tahapan berikut secara cermat saat melakukan pengisian data pada website pendaftaran resmi Provinsi Riau.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {registrationSteps.map((step) => (
              <div
                key={step.step}
                className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 hover:border-[#003087] hover:bg-white hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-[#003087] text-[#FFB800] font-bold text-sm flex items-center justify-center font-heading">
                      0{step.step}
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-200/70 px-2.5 py-0.5 rounded-full">
                      {step.time}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[#003087] font-heading mb-2 leading-snug">
                    {step.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] font-semibold text-[#003087]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tahapan Wajib</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick External Button Action */}
          <div className="text-center pt-2">
            <a
              href={RIAU_PPDB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#003087] hover:bg-[#002260] text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer font-heading"
            >
              <span>Buka Formulir Registrasi di PPDB Riau Sekarang</span>
              <ExternalLink className="w-4 h-4 text-[#FFB800]" />
            </a>
          </div>
        </div>

        {/* 3. 6 PROGRAM KEAHLIAN YANG TERSEDIA DI PORTAL RIAU */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-[#FFB800] uppercase tracking-wider block font-heading">
                PILIHAN KOMPETENSI KEJURUAN
              </span>
              <h3 className="text-2xl font-bold text-[#003087] font-heading mt-0.5">
                Pilihan Jurusan di SMKN 1 Ujung Batu
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Pilih salah satu dari 6 program keahlian berikut saat memilih konsentrasi di portal PPDB Riau.
              </p>
            </div>

            <button
              onClick={() => onNavigate('program-keahlian')}
              className="text-xs font-bold text-[#003087] hover:underline flex items-center gap-1 cursor-pointer flex-shrink-0"
            >
              <span>Pelajari Profil Detail Tiap Jurusan</span>
              <ChevronRight className="w-4 h-4 text-[#FFB800]" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {vocationalMajors.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-[#003087] transition-all flex flex-col justify-between p-5"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#003087] font-bold text-xs font-heading">
                      {m.code}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Daya Tampung Standar
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-[#003087] font-heading mb-1.5 leading-snug">
                    {m.name}
                  </h4>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {m.description}
                  </p>

                  <div className="space-y-1 text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <div className="font-semibold text-slate-700">Fokus Keahlian:</div>
                    <div className="flex flex-wrap gap-1">
                      {m.competencies.slice(0, 2).map((c, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Sertifikasi BNSP</span>
                  <button
                    onClick={() => onNavigate('program-keahlian', m.id)}
                    className="text-[#003087] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Rincian</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#FFB800]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. SYARAT BERKAS & JALUR PENDAFTARAN */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Dokumen Persyaratan */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-[#003087]">
              <FileText className="w-5 h-5 text-[#FFB800]" />
              <h4 className="text-base sm:text-lg font-bold font-heading">
                Kelengkapan Berkas Pendaftaran
              </h4>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Pastikan dokumen berikut telah dipindai (scan) dalam format PDF/JPG dengan ukuran file yang sesuai sebelum diunggah ke portal PPDB Riau:
            </p>

            <ul className="space-y-2.5 text-xs text-slate-700">
              {requiredDocuments.map((doc, idx) => (
                <li key={idx} className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Jalur Pendaftaran */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-[#003087]">
              <GraduationCap className="w-5 h-5 text-[#FFB800]" />
              <h4 className="text-base sm:text-lg font-bold font-heading">
                Jalur Seleksi Resmi PPDB Riau
              </h4>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Calon peserta didik dapat mendaftar melalui salah satu jalur seleksi yang disediakan oleh Dinas Pendidikan Provinsi Riau:
            </p>

            <div className="space-y-3">
              {tracks.map((tr, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#003087] text-xs font-heading">
                      {tr.name}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-[#003087]">
                      {tr.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {tr.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. POSKO BANTUAN & PENDAMPINGAN LURING DI SEKOLAH */}
        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-2">
              <span className="inline-block px-2.5 py-0.5 rounded bg-[#FFB800] text-[#002260] font-bold text-[11px]">
                POSKO BANTUAN DI KAMPUS SEKOLAH
              </span>
              <h3 className="text-xl font-bold text-[#003087] font-heading">
                Kesulitan Mendaftar Online di PPDB Riau?
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Bagi orang tua atau calon siswa yang mengalami kendala teknis (jaringan lambat, verifikasi NISN, atau pemindaian dokumen), silakan datang langsung ke <strong>Posko Bantuan PPDB SMKN 1 Ujung Batu</strong> di Laboratorium Komputer. Tim operator kami siap mendampingi proses pendaftaran Anda secara gratis tanpa dipungut biaya.
              </p>
              <div className="pt-2 text-xs text-slate-600 space-y-1">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#003087]" />
                  <span>Lokasi Posko: Jl. Lingkar Penghijauan Desa Ngaso, Ujung Batu (Lab Komputer 1)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#003087]" />
                  <span>Jam Layanan Posko: Senin – Jumat, Pukul 08.00 – 15.00 WIB</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col gap-2.5">
              <a
                href={RIAU_PPDB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#003087] hover:bg-[#002260] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer text-center font-heading"
              >
                <span>Buka Portal PPDB Riau</span>
                <ExternalLink className="w-4 h-4 text-[#FFB800]" />
              </a>

              <a
                href={`https://wa.me/${schoolIdentity.contact.whatsappHelpdesk.replace(/[^0-9]/g, '')}?text=Halo%20Posko%20PPDB%20SMKN%201%20Ujung%20Batu,%20saya%20ingin%20berkonsultasi%20bantuan%20pendaftaran`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer text-center font-heading"
              >
                <Phone className="w-4 h-4" />
                <span>Chat Hotline Bantuan PPDB</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
