import React, { useState, useEffect } from 'react';
import {
  Award,
  BookOpen,
  Target,
  History,
  Users,
  Building,
  CheckCircle2,
  ShieldCheck,
  Search,
  Layers,
} from 'lucide-react';
import { schoolIdentity, staffMembers, schoolFacilities, schoolStats } from '../data/schoolData';
import { PageHeader } from './PageHeader';
import { api } from '../services/api';
import { StaffMember } from '../types';
import { SchoolImage } from './common/SchoolImage';
import { SchoolLogo } from './common/SchoolLogo';
import { PosterHeroSection } from './PosterHeroSection';

interface SchoolProfileProps {
  initialTab?: string;
  onNavigate: (page: string) => void;
}

export const SchoolProfile: React.FC<SchoolProfileProps> = ({ initialTab, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'sambutan' | 'visi-misi' | 'sejarah' | 'struktur' | 'guru' | 'sarpras'>('sambutan');
  const [staffCategory, setStaffCategory] = useState<string>('Semua');
  const [staffSearch, setStaffSearch] = useState<string>('');
  const [staffList, setStaffList] = useState<StaffMember[]>(staffMembers);

  useEffect(() => {
    if (initialTab && ['sambutan', 'visi-misi', 'sejarah', 'struktur', 'guru', 'sarpras'].includes(initialTab)) {
      setActiveTab(initialTab as any);
    }
  }, [initialTab]);

  useEffect(() => {
    api.getStaff().then((data) => {
      if (data && data.length > 0) {
        setStaffList(data);
      }
    }).catch((err) => {
      console.warn('Gagal memuat staff live:', err);
    });
  }, []);

  const filteredStaff = staffList.filter((staff) => {
    const matchesCategory = staffCategory === 'Semua' || staff.category === staffCategory;
    const matchesSearch =
      staff.name.toLowerCase().includes(staffSearch.toLowerCase()) ||
      staff.role.toLowerCase().includes(staffSearch.toLowerCase()) ||
      (staff.nip && staff.nip.toLowerCase().includes(staffSearch.toLowerCase())) ||
      staff.majorOrSubject.toLowerCase().includes(staffSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="profil" className="min-h-screen bg-white">
      {/* Page Header */}
      <PageHeader
        title="Profil SMK Negeri 1 Ujung Batu"
        subtitle="Mengenal kepemimpinan sekolah, visi misi kejuruan, tenaga pendidik bersertifikasi BNSP, struktur organisasi, dan sarana prasarana bengkel standar industri."
        badge="Identitas & Keunggulan Sekolah"
        breadcrumbs={[{ label: 'Profil Sekolah' }]}
        onNavigate={onNavigate}
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 bg-slate-100 rounded-2xl border border-slate-200 gap-1 flex-wrap justify-center">
            {[
              { id: 'sambutan', label: 'Sambutan Kepala Sekolah' },
              { id: 'visi-misi', label: 'Visi, Misi & Tujuan' },
              { id: 'sejarah', label: 'Sejarah & Akreditasi' },
              { id: 'struktur', label: 'Struktur Organisasi' },
              { id: 'guru', label: 'Guru & Tenaga Kependidikan' },
              { id: 'sarpras', label: 'Sarana & Fasilitas' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer font-heading ${
                    isActive
                      ? 'bg-[#003087] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#003087] hover:bg-white/60'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 1. SAMBUTAN KEPALA SEKOLAH */}
        {activeTab === 'sambutan' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-4 flex justify-center">
                <div className="relative w-64 max-w-full">
                  <div className="absolute -inset-2 rounded-xl border-4 border-[#FFB800] -z-10 translate-x-3 translate-y-3" />
                  <div className="rounded-xl overflow-hidden aspect-[4/5] bg-slate-100 shadow-md">
                    <SchoolImage
                      src="/images/profil/kepala-sekolah.jpg"
                      fallback={schoolIdentity.principal.photo}
                      alt={schoolIdentity.principal.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8">
                <h4 className="text-[#003087] text-xs font-bold uppercase tracking-wider mb-2 font-heading">
                  KATA SAMBUTAN KEPALA SEKOLAH
                </h4>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#003087] mb-6 font-heading leading-snug">
                  Mencetak Generasi Vokasi Terampil, Mandiri, dan Berakhlak Mulia
                </h3>
                <blockquote className="border-l-4 border-[#FFB800] pl-5 italic text-slate-600 mb-6 text-sm sm:text-base leading-relaxed">
                  "Pendidikan kejuruan adalah jembatan nyata menuju kemandirian ekonomi. Di SMK Negeri 1 Ujung Batu, kami tidak hanya membekali peserta didik dengan teori, namun melatih mentalitas kerja, keahlian praktis berstandar industri, serta integritas moral."
                </blockquote>
                <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed mb-6">
                  <p>{schoolIdentity.principal.welcomeMessage}</p>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <h5 className="text-lg font-bold text-[#003087] font-heading">
                    {schoolIdentity.principal.name}
                  </h5>
                  <p className="text-sm text-slate-500">{schoolIdentity.principal.nip}</p>
                  <p className="text-xs text-[#003087] font-semibold mt-0.5">
                    Kepala SMK Negeri 1 Ujung Batu
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. VISI & MISI */}
        {activeTab === 'visi-misi' && (
          <div className="space-y-8 mb-16">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8">
              <h3 className="text-xl font-bold text-[#003087] mb-4 font-heading flex items-center gap-2">
                <Target className="w-5 h-5 text-[#FFB800]" />
                Visi Sekolah
              </h3>
              <p className="text-lg text-slate-800 font-medium italic border-l-4 border-[#FFB800] pl-4 py-1">
                "Menjadi Lembaga Pendidikan Kejuruan Unggulan yang Menghasilkan Tamatan Beriman, Bertaqwa, Terampil, Kompeten, Mandiri, dan Berdaya Saing Global."
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
                <h3 className="text-lg font-bold text-[#003087] mb-4 font-heading flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#003087]" />
                  Misi Vokasi
                </h3>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#FFB800] flex-shrink-0 mt-0.5" />
                    <span>Meningkatkan penghayatan dan pengamalan nilai-nilai keagamaan dalam kehidupan sekolah.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#FFB800] flex-shrink-0 mt-0.5" />
                    <span>Menyelenggarakan pembelajaran berbasis kompetensi yang selaras dengan kebutuhan Dunia Usaha dan Industri (DU/DI).</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#FFB800] flex-shrink-0 mt-0.5" />
                    <span>Mengembangkan program Teaching Factory (TEFA) dan Technopreneurship untuk menumbuhkan jiwa wirausaha.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#FFB800] flex-shrink-0 mt-0.5" />
                    <span>Memfasilitasi sertifikasi kompetensi keahlian berstandar nasional (LSP-P1 / BNSP).</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
                <h3 className="text-lg font-bold text-[#003087] mb-4 font-heading flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#003087]" />
                  Tujuan Pendidikan Vokasi
                </h3>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#003087] flex-shrink-0 mt-0.5" />
                    <span>Mempersiapkan tamatan yang langsung terserap di pasar kerja industri formal maupun swasta.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#003087] flex-shrink-0 mt-0.5" />
                    <span>Membentuk wirausahawan mandiri di bidang teknologi, otomotif, ritel digital, dan elektronika.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#003087] flex-shrink-0 mt-0.5" />
                    <span>Menyediakan sarana bengkel praktik yang setara dengan standar operasional pabrik/industri.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#003087] flex-shrink-0 mt-0.5" />
                    <span>Membangun jejaring kemitraan magang dan rekrutmen alumni secara berkesinambungan.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 3. SEJARAH & AKREDITASI */}
        {activeTab === 'sejarah' && (
          <div className="space-y-8 mb-16">
            {/* Kartu Lambang Resmi Sekolah */}
            <div className="bg-gradient-to-r from-blue-900 via-[#002b66] to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center gap-6 border border-blue-800">
              <SchoolLogo className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-xl flex-shrink-0" />
              <div>
                <span className="inline-block px-2.5 py-1 rounded bg-[#FFB800]/20 text-[#FFB800] text-xs font-bold uppercase tracking-wider mb-2 border border-[#FFB800]/30">
                  Lambang & Identitas Resmi Sekolah
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
                  {schoolIdentity.name}
                </h3>
                <p className="text-xs sm:text-sm text-blue-100/90 mt-1 leading-relaxed">
                  Perisai segilima berbingkai emas melambangkan ketahanan moral berlandaskan Pancasila; Bintang emas sebagai petunjuk Ketuhanan Yang Maha Esa; Roda gigi melambangkan teknologi kejuruan; Obor menyala sebagai lentera ilmu; Untaian padi dan kapas melambangkan kemakmuran; serta Pita bertuliskan Ujung Batu sebagai kebanggaan almamater vokasi Rokan Hulu, Riau.
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
              <h3 className="text-xl font-bold text-[#003087] mb-4 font-heading flex items-center gap-2">
                <History className="w-5 h-5 text-[#FFB800]" />
                Sejarah Singkat Sekolah
              </h3>
              <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
                <p>
                  SMK Negeri 1 Ujung Batu didirikan untuk menjawab kebutuhan mendesak masyarakat Kabupaten Rokan Hulu dan Provinsi Riau akan tenaga kerja terampil tingkat menengah yang siap terjun ke sektor industri pengolahan, perkebunan terpadu, manufaktur otomotif, jaringan komputer, serta manajemen ritel modern.
                </p>
                <p>
                  Dengan luas lahan representatif dan gedung bengkel kejuruan terintegrasi, sekolah terus berkembang menjadi salah satu SMK rujukan vokasi di Rokan Hulu, didukung oleh instruktur bersertifikasi BNSP, fasilitas mesin canggih, serta sarana belajar yang nyaman.
                </p>
              </div>
            </div>

            {/* Institutional Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <div className="bg-[#003087] text-white px-6 py-4 font-heading font-bold text-base">
                Identitas Resmi & Dokumen Akreditasi
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <tbody>
                    <tr className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3.5 px-6 font-bold text-[#003087] w-1/3 bg-slate-50">Nama Resmi Sekolah</td>
                      <td className="py-3.5 px-6 text-slate-700">{schoolIdentity.name}</td>
                    </tr>
                    <tr className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3.5 px-6 font-bold text-[#003087] bg-slate-50">NPSN</td>
                      <td className="py-3.5 px-6 text-slate-700">{schoolIdentity.npsn}</td>
                    </tr>
                    <tr className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3.5 px-6 font-bold text-[#003087] bg-slate-50">Status Akreditasi</td>
                      <td className="py-3.5 px-6 text-slate-700">
                        <span className="inline-block px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded">
                          {schoolIdentity.accreditation} (Sangat Baik)
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3.5 px-6 font-bold text-[#003087] bg-slate-50">Surat Keputusan Akreditasi</td>
                      <td className="py-3.5 px-6 text-slate-700">{schoolIdentity.accreditationNo}</td>
                    </tr>
                    <tr className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3.5 px-6 font-bold text-[#003087] bg-slate-50">Tahun Berdiri</td>
                      <td className="py-3.5 px-6 text-slate-700">{schoolIdentity.establishedYear}</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-3.5 px-6 font-bold text-[#003087] bg-slate-50">Lembaga Uji Sertifikasi</td>
                      <td className="py-3.5 px-6 text-slate-700">Tempat Uji Kompetensi (TUK) Berlisensi BNSP</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. STRUKTUR ORGANISASI */}
        {activeTab === 'struktur' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs mb-16">
            <h3 className="text-xl font-bold text-[#003087] mb-6 font-heading flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#FFB800]" />
              Struktur Kepemimpinan & Manajemen Sekolah
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { role: 'Kepala Sekolah', name: schoolIdentity.principal.name, desc: 'Penanggung Jawab Utama Seluruh Mutu & Program Sekolah' },
                { role: 'Wakil Kepala Bid. Kurikulum', name: 'Dra. Hj. Nuraini, M.Pd.', desc: 'Pengembangan Kurikulum Merdeka & Vokasi Industri' },
                { role: 'Wakil Kepala Bid. Kesiswaan', name: 'Bambang Irawan, S.Pd.', desc: 'Pembinaan Karakter, Kedisiplinan & Ekstrakurikuler' },
                { role: 'Wakil Kepala Bid. Hubin & BKK', name: 'Ir. Hendra Wijaya, S.T., M.Kom.', desc: 'Kerjasama DU/DI, PKL Siswa & Penyaluran Alumni' },
                { role: 'Kepala Program Teknik Otomotif', name: 'Supriyadi, S.T.', desc: 'Ketua Bengkel & Konsentrasi Kejuruan Otomotif' },
                { role: 'Kepala Program BDP', name: 'Rina Kartika, S.Pd.', desc: 'Ketua Ritel Modern & Digital Marketing' },
              ].map((pos, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl p-5 bg-slate-50/70 hover:bg-white hover:border-[#003087] transition-all">
                  <span className="text-[11px] font-bold text-[#FFB800] uppercase tracking-wider block mb-1">
                    {pos.role}
                  </span>
                  <h4 className="text-base font-bold text-[#003087] mb-1 font-heading">
                    {pos.name}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {pos.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. GURU & TENAGA PENDIDIK */}
        {activeTab === 'guru' && (
          <div className="space-y-6 mb-16">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex flex-wrap items-center gap-2">
                {['Semua', 'Pimpinan', 'Produktif', 'Normatif Adaptif', 'Tenaga Kependidikan'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setStaffCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      staffCategory === cat
                        ? 'bg-[#003087] text-white'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari guru / tendik..."
                  value={staffSearch}
                  onChange={(e) => setStaffSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-[#003087] bg-white"
                />
              </div>
            </div>

            {filteredStaff.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 p-6">
                <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">Tidak ada guru atau tendik ditemukan</p>
                <p className="text-xs text-slate-500 mt-1">Coba sesuaikan kata kunci pencarian atau kategori filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredStaff.map((staff) => (
                  <div
                    key={staff.id}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:-translate-y-1 hover:shadow-md transition-all text-center flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-52 bg-slate-100 overflow-hidden relative">
                        <SchoolImage
                          src={staff.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=500'}
                          alt={staff.name}
                          fallback="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=500"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#003087]/80 text-white backdrop-blur-xs">
                          {staff.category}
                        </span>
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-[#003087] text-sm mb-1 font-heading leading-tight">
                          {staff.name}
                        </h4>
                        <p className="text-xs text-amber-600 font-semibold mb-1">
                          {staff.role}
                        </p>
                        <p className="text-[11px] text-slate-600 mb-1.5">
                          {staff.majorOrSubject}
                        </p>
                        {staff.nip && staff.nip !== '-' && (
                          <div className="text-[10px] text-slate-400 font-mono bg-slate-50 py-0.5 px-2 rounded-md border border-slate-100 inline-block">
                            {staff.nip}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 6. SARANA & FASILITAS */}
        {activeTab === 'sarpras' && (
          <div className="space-y-6 mb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {schoolFacilities.map((fac) => (
                <div
                  key={fac.id}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all"
                >
                  <div className="h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={fac.image}
                      alt={fac.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <span className="inline-block text-[11px] font-bold text-[#FFB800] uppercase tracking-wider mb-1">
                      {fac.category}
                    </span>
                    <h4 className="text-base font-bold text-[#003087] mb-2 font-heading">
                      {fac.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      {fac.description}
                    </p>
                    <div className="text-xs text-slate-500 font-medium">
                      Spesifikasi: <span className="text-slate-800 font-semibold">{fac.specs}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HERO SECTION POSTER SEKOLAH & PPDB */}
        <div className="mb-12">
          <PosterHeroSection onNavigate={onNavigate} className="rounded-3xl shadow-xl border border-slate-200" />
        </div>

        {/* STATS SECTION */}
        <div className="bg-gradient-to-r from-[#003087] to-[#002260] text-white rounded-2xl p-8 sm:p-12 shadow-md">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {schoolStats.map((st) => (
              <div key={st.id} className="p-2">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#FFB800] mb-2 font-heading">
                  {st.value}
                </div>
                <div className="text-sm sm:text-base font-semibold text-white mb-1">
                  {st.label}
                </div>
                <p className="text-xs text-white/70">
                  {st.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
