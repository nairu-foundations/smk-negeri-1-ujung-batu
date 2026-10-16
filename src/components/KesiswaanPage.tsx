import React, { useState, useEffect } from 'react';
import {
  Users,
  Award,
  Calendar,
  Compass,
  Target,
  GraduationCap,
  HeartHandshake,
  CheckCircle2,
  ShieldCheck,
  Filter,
} from 'lucide-react';
import { PageHeader } from './PageHeader';
import { extracurriculars, bkServices } from '../data/schoolData';

interface KesiswaanPageProps {
  initialTab?: string;
  onNavigate: (page: string) => void;
}

export const KesiswaanPage: React.FC<KesiswaanPageProps> = ({ initialTab, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'osis' | 'ekskul' | 'bk'>('osis');
  const [selectedEkskulCategory, setSelectedEkskulCategory] = useState<string>('Semua');

  useEffect(() => {
    if (initialTab && ['osis', 'ekskul', 'bk'].includes(initialTab)) {
      setActiveTab(initialTab as any);
    }
  }, [initialTab]);

  const filteredEkskul = extracurriculars.filter((item) => {
    if (selectedEkskulCategory === 'Semua') return true;
    return item.category === selectedEkskulCategory;
  });

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass':
        return <Compass className="w-6 h-6 text-[#FFB800]" />;
      case 'Target':
        return <Target className="w-6 h-6 text-[#003087]" />;
      case 'GraduationCap':
        return <GraduationCap className="w-6 h-6 text-emerald-600" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-6 h-6 text-rose-600" />;
      default:
        return <Compass className="w-6 h-6 text-[#FFB800]" />;
    }
  };

  return (
    <div id="kesiswaan" className="min-h-screen bg-[#F8F9FA]">
      {/* Page Header */}
      <PageHeader
        title="Kesiswaan, Ekstrakurikuler & Layanan BK"
        subtitle="Membentuk kepribadian siswa berkarakter Profil Pelajar Pancasila, berjiwa kepemimpinan, berdisiplin industri, serta siap melangkah ke dunia kerja atau perguruan tinggi."
        badge="Pengembangan Karakter & Bakat"
        breadcrumbs={[{ label: 'Kesiswaan & BK' }]}
        onNavigate={onNavigate}
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {[
            { id: 'osis', label: 'OSIS & MPK' },
            { id: 'ekskul', label: 'Ekstrakurikuler' },
            { id: 'bk', label: 'Layanan Bimbingan Konseling & Karir' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold border-2 transition-all cursor-pointer font-heading ${
                  isActive
                    ? 'bg-[#003087] text-white border-[#003087] shadow-sm'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-[#003087] hover:text-[#003087]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OSIS & MPK */}
        {activeTab === 'osis' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-[#003087] text-xs font-bold rounded-full border border-blue-100">
                    <Award className="w-3.5 h-3.5 text-[#FFB800]" />
                    <span>ORGANISASI RESMI SISWA</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#003087] font-heading">
                    OSIS & Majelis Perwakilan Kelas (MPK)
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    OSIS dan MPK SMK Negeri 1 Ujung Batu merupakan wadah utama pembinaan kepemimpinan demokratis, kreativitas, rasa solidaritas, dan kedisiplinan kerja industri. Melalui organisasi ini, siswa diajarkan berkolaborasi memanajemeni kegiatan sekolah seperti Bulan Bahasa, unjuk inovasi teknologi vokasi, bakti sosial, dan kepanitiaan hari besar nasional.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] font-bold text-[#003087] block uppercase font-heading">Ketua OSIS</span>
                      <span className="text-xs font-semibold text-slate-800">M. Fajar Ramadhan (XII TKJ)</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">Periode 2024/2025</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] font-bold text-[#003087] block uppercase font-heading">Ketua MPK</span>
                      <span className="text-xs font-semibold text-slate-800">Siti Nurhaliza (XII BDP)</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">Musyawarah Perwakilan Kelas</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] font-bold text-[#003087] block uppercase font-heading">Pembina Kesiswaan</span>
                      <span className="text-xs font-semibold text-slate-800">Bambang Irawan, S.Pd.</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">Waka Kesiswaan</p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 bg-gradient-to-br from-[#003087] to-[#001740] text-white p-6 rounded-2xl space-y-4">
                  <h4 className="text-base font-bold font-heading text-[#FFB800] flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5" />
                    <span>Budaya Kerja 5R Siswa</span>
                  </h4>
                  <ul className="text-xs text-white/90 space-y-2.5 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#FFB800] flex-shrink-0 mt-0.5" />
                      <span><strong>Ringkas & Rapi:</strong> Menata alat kerja di bengkel secara disiplin.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#FFB800] flex-shrink-0 mt-0.5" />
                      <span><strong>Resik & Rawat:</strong> Memastikan lingkungan praktik selalu bersih.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#FFB800] flex-shrink-0 mt-0.5" />
                      <span><strong>Rajin & Integritas:</strong> Menjunjung tinggi kejujuran dan etos profesional.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EKSTRAKURIKULER */}
        {activeTab === 'ekskul' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 font-heading">
                <Filter className="w-4 h-4 text-[#003087]" />
                <span>Kategori Ekstrakurikuler:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['Semua', 'Kejuruan & Teknologi', 'Wajib & Kepanduan', 'Olahraga & Seni', 'Keagamaan'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedEkskulCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      selectedEkskulCategory === cat
                        ? 'bg-[#003087] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEkskul.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
                >
                  <div className="h-44 bg-slate-100 overflow-hidden relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-[#003087] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-base font-bold text-[#003087] mb-2 font-heading group-hover:text-blue-700 transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-4">
                        {item.description}
                      </p>
                    </div>
                    <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#FFB800] flex-shrink-0" />
                        <span>{item.schedule}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-[#003087] flex-shrink-0" />
                        <span>Pembina: <strong className="text-slate-700">{item.coach}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: LAYANAN BK */}
        {activeTab === 'bk' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
              <div className="max-w-2xl">
                <span className="text-xs font-bold text-[#FFB800] uppercase tracking-wider block font-heading">
                  PENDAMPINGAN SISWA
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#003087] font-heading mt-1">
                  4 Pilar Layanan Bimbingan & Konseling
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Guru Bimbingan Konseling (BK) SMKN 1 Ujung Batu hadir sebagai mitra terpercaya siswa dalam menavigasi minat bakat kejuruan, kesiapan mental PKL industri, serta pemetaan karir BMW (Bekerja, Melanjutkan, Wirausaha).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                {bkServices.map((service, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-6 hover:border-[#003087] transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-4 shadow-2xs">
                      {getServiceIcon(service.icon)}
                    </div>
                    <h4 className="text-base font-bold text-[#003087] font-heading mb-2">
                      {service.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {service.description}
                    </p>
                    <div className="space-y-1.5 pt-3 border-t border-slate-200">
                      <div className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>Layanan Konsultasi Terbuka & Ramah Siswa</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>Kerahasiaan konseling terjamin profesional</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
