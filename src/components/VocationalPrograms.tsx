import React, { useState, useEffect } from 'react';
import {
  Network,
  Wrench,
  ShoppingBag,
  Zap,
  Package,
  Radio,
  CheckCircle2,
  Briefcase,
  Layers,
  ArrowRight,
  Factory,
  MessageCircle,
} from 'lucide-react';
import { vocationalMajors, teachingFactoryList, schoolIdentity } from '../data/schoolData';
import { PageHeader } from './PageHeader';

interface VocationalProgramsProps {
  initialMajorId?: string;
  onNavigate: (page: string, subTarget?: string) => void;
}

export const VocationalPrograms: React.FC<VocationalProgramsProps> = ({
  initialMajorId,
  onNavigate,
}) => {
  const [selectedMajorId, setSelectedMajorId] = useState<string>('tkj');

  useEffect(() => {
    if (initialMajorId) {
      if (initialMajorId === 'tefa') {
        const el = document.getElementById('tefa-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else if (vocationalMajors.some((m) => m.id === initialMajorId)) {
        setSelectedMajorId(initialMajorId);
      }
    }
  }, [initialMajorId]);

  const selectedMajor = vocationalMajors.find((m) => m.id === selectedMajorId) || vocationalMajors[0];

  const getMajorIcon = (iconName: string) => {
    switch (iconName) {
      case 'Network':
        return <Network className="w-5 h-5" />;
      case 'Wrench':
        return <Wrench className="w-5 h-5" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-5 h-5" />;
      case 'Zap':
        return <Zap className="w-5 h-5" />;
      case 'Package':
        return <Package className="w-5 h-5" />;
      case 'Radio':
        return <Radio className="w-5 h-5" />;
      default:
        return <Network className="w-5 h-5" />;
    }
  };

  return (
    <div id="program-keahlian" className="min-h-screen bg-[#F8F9FA]">
      {/* Page Header */}
      <PageHeader
        title="Program Keahlian & Teaching Factory"
        subtitle="Mempersiapkan tenaga teknisi madya profesional berstandar industri melalui 6 konsentrasi keahlian dan unit produksi nyata."
        badge="6 Pilihan Jurusan Vokasi"
        breadcrumbs={[{ label: 'Program Keahlian' }]}
        onNavigate={onNavigate}
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
        {/* Section Navigation Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <span className="text-[11px] font-bold text-[#FFB800] uppercase tracking-wider block font-heading">
              Konsentrasi Keahlian
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#003087] font-heading">
              6 Program Kejuruan Berstandar Industri
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Pilih jurusan untuk melihat rincian kurikulum & prospek karir
          </span>
        </div>

        {/* Major Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {vocationalMajors.map((major) => {
            const isSelected = major.id === selectedMajorId;
            return (
              <button
                key={major.id}
                onClick={() => setSelectedMajorId(major.id)}
                className={`p-3.5 rounded-xl text-left transition-all border cursor-pointer font-heading ${
                  isSelected
                    ? 'bg-[#003087] text-white border-[#003087] shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-[#003087] hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-white/20 text-[#FFB800]' : 'bg-slate-100 text-[#003087]'
                    }`}
                  >
                    {getMajorIcon(major.icon)}
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      isSelected ? 'bg-[#FFB800] text-[#002260]' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {major.code}
                  </span>
                </div>
                <div className="font-bold text-xs sm:text-sm leading-snug line-clamp-2">
                  {major.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Major Detailed Showcase Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Photo & Facilities */}
            <div className="lg:col-span-5 space-y-5">
              <div className="rounded-xl overflow-hidden relative aspect-[16/10] bg-slate-100 shadow-sm">
                <img
                  src={selectedMajor.bannerImage}
                  alt={selectedMajor.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 bg-[#FFB800] text-[#002260] text-xs font-bold rounded mb-1">
                      {selectedMajor.code} • {selectedMajor.badge}
                    </span>
                    <h3 className="text-lg font-bold text-white font-heading">
                      {selectedMajor.name}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Workshops & Lab Info */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-bold text-[#003087] uppercase tracking-wider mb-2 font-heading flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-[#FFB800]" />
                  <span>Bengkel & Fasilitas Praktik</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {selectedMajor.workshops.map((ws, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800]" />
                      <span>{ws}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Head of Department */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 font-medium block">
                    Ketua Program Keahlian
                  </span>
                  <div className="text-xs font-bold text-[#003087] font-heading">
                    {selectedMajor.headOfDepartment}
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('kontak')}
                  className="px-3 py-1.5 rounded-lg bg-[#003087] hover:bg-[#002260] text-white text-xs font-semibold cursor-pointer transition-colors"
                >
                  Tanya Jurusan
                </button>
              </div>
            </div>

            {/* Right: Description, Competencies & Careers */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h4 className="text-xs font-bold text-[#FFB800] uppercase tracking-wider mb-1 font-heading">
                  DESKRIPSI JURUSAN
                </h4>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  {selectedMajor.description}
                </p>
              </div>

              {/* Competencies */}
              <div>
                <h4 className="text-xs font-bold text-[#003087] uppercase tracking-wider mb-2.5 font-heading">
                  Kompetensi yang Dipelajari & Dilatih
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedMajor.competencies.map((comp, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <CheckCircle2 className="w-4 h-4 text-[#FFB800] flex-shrink-0 mt-0.5" />
                      <span>{comp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Career Prospects */}
              <div>
                <h4 className="text-xs font-bold text-[#003087] uppercase tracking-wider mb-2 font-heading">
                  Peluang Kerja & Karir Lulusan
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMajor.careerProspects.map((career, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-blue-50 text-[#003087] rounded-lg text-xs font-medium border border-blue-100"
                    >
                      {career}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TEACHING FACTORY (TEFA) SHOWCASE */}
        <div id="tefa-section" className="pt-8">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-[#FFB800] uppercase tracking-wider block font-heading">
              UNIT PRODUKSI SISWA
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#003087] font-heading mt-1">
              Teaching Factory (TEFA) & Layanan Publik
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl mx-auto">
              Pembelajaran berbasis pesanan riil di mana siswa melayani kebutuhan industri dan masyarakat umum di bawah supervisi instruktur profesional.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teachingFactoryList.map((tefa) => (
              <div
                key={tefa.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:-translate-y-1 hover:border-[#FFB800] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-[#003087] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {tefa.majorCode}
                    </span>
                    <Factory className="w-4 h-4 text-[#FFB800]" />
                  </div>
                  <h4 className="font-bold text-[#003087] text-sm mb-1.5 font-heading">
                    {tefa.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {tefa.description}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                  Kontak: <span className="font-semibold text-slate-700">{tefa.contactPerson}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
