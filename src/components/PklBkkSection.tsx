import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  MapPin,
  PhoneCall,
} from 'lucide-react';
import { pklPartners, bkkVacancies, schoolIdentity } from '../data/schoolData';
import { BkkJobVacancy, PklPartner } from '../types';
import { PageHeader } from './PageHeader';

interface PklBkkSectionProps {
  initialTab?: string;
  onNavigate: (page: string) => void;
}

export const PklBkkSection: React.FC<PklBkkSectionProps> = ({ initialTab, onNavigate }) => {
  const [activeSubTab, setActiveSubTab] = useState<'pkl' | 'bkk' | 'sertifikasi'>('pkl');
  const [selectedMajorFilter, setSelectedMajorFilter] = useState<string>('Semua');

  useEffect(() => {
    if (initialTab && ['pkl', 'bkk', 'sertifikasi'].includes(initialTab)) {
      setActiveSubTab(initialTab as any);
    }
  }, [initialTab]);

  const filteredPartners = pklPartners.filter((p) => {
    if (selectedMajorFilter === 'Semua') return true;
    return p.relevantMajors.includes(selectedMajorFilter);
  });

  const filteredVacancies = bkkVacancies.filter((v) => {
    if (selectedMajorFilter === 'Semua') return true;
    return v.majorsNeeded.includes(selectedMajorFilter);
  });

  const pklScheduleSteps = [
    { step: 1, title: 'Sosialisasi & Pemilihan DU/DI', time: 'Bulan 1 Ganjil', desc: 'Siswa bersama Pokja PKL memilih industri sesuai minat kompetensi.' },
    { step: 2, title: 'Pembekalan Karakter & K3', time: 'Bulan 2 Ganjil', desc: 'Pelatihan budaya kerja 5S, keselamatan kerja, dan etos disiplin.' },
    { step: 3, title: 'Pelaksanaan PKL (6 Bulan)', time: 'Semester Genap', desc: 'Siswa bekerja nyata di industri di bawah bimbingan mentor pabrikan.' },
    { step: 4, title: 'Laporan & Sidang PKL', time: 'Akhir PKL', desc: 'Presentasi hasil karya dan portofolio kerja di hadapan penguji industri.' },
    { step: 5, title: 'Sertifikasi BNSP', time: 'Menjelang Lulus', desc: 'Uji sertifikasi keahlian berstandar Badan Nasional Sertifikasi Profesi.' },
  ];

  return (
    <div id="pkl-bkk" className="min-h-screen bg-white">
      {/* Page Header */}
      <PageHeader
        title="Kemitraan Industri, PKL & Bursa Kerja (BKK)"
        subtitle="Mewujudkan keterhubungan nyata (Link & Match) vokasi dengan 45+ mitra industri terkemuka, program magang 6 bulan, sertifikasi profesi BNSP, dan bursa kerja khusus."
        badge="Link & Match Dunia Kerja"
        breadcrumbs={[{ label: 'Kemitraan & BKK' }]}
        onNavigate={onNavigate}
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
        {/* Tab Switcher */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 bg-slate-100 rounded-2xl border border-slate-200 gap-1 flex-wrap justify-center">
            {[
              { id: 'pkl', label: 'Praktik Kerja Lapangan (PKL) & Mitra' },
              { id: 'bkk', label: 'Bursa Kerja Khusus (BKK) & Lowongan' },
              { id: 'sertifikasi', label: 'Sertifikasi BNSP / LSP' },
            ].map((tab) => {
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id as any)}
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

        {/* TAB 1: PKL & MITRA */}
        {activeSubTab === 'pkl' && (
          <div className="space-y-12">
            {/* Steps */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8">
              <h3 className="text-xl font-bold text-[#003087] mb-2 font-heading">
                Tahapan & Alur Pelaksanaan PKL Siswa
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mb-8">
                Proses sistematis penempatan siswa kelas XI pada perusahaan mitra industri selama 6 bulan.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                {pklScheduleSteps.map((s) => (
                  <div
                    key={s.step}
                    className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-9 h-9 rounded-full bg-[#003087] text-white font-bold text-xs flex items-center justify-center mb-3 font-heading">
                        {s.step}
                      </div>
                      <span className="text-[10px] font-bold text-[#FFB800] uppercase tracking-wider block mb-1">
                        {s.time}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-[#003087] mb-1.5 font-heading">
                        {s.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Industrial Partners */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-[#003087] font-heading">
                    Daftar Mitra DU/DI & Penempatan Magang
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Perusahaan rekanan yang telah menandatangani Nota Kesepahaman (MoU) vokasi.
                  </p>
                </div>
                {/* Filter */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {['Semua', 'TKJ', 'TO', 'BDP', 'TE', 'TLOG', 'BP'].map((code) => (
                    <button
                      key={code}
                      onClick={() => setSelectedMajorFilter(code)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                        selectedMajorFilter === code
                          ? 'bg-[#003087] text-white border-[#003087]'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPartners.map((partner: PklPartner) => (
                  <div
                    key={partner.id}
                    className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-[#003087] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-[#003087] text-[#FFB800] flex items-center justify-center font-bold text-xs mb-3">
                        {partner.logoPlaceholder}
                      </div>
                      <h4 className="text-sm font-bold text-[#003087] leading-snug font-heading">
                        {partner.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#FFB800]" />
                        <span>{partner.location}</span>
                      </p>
                      <p className="text-xs text-slate-600 mt-2">
                        Sektor: <span className="font-semibold text-slate-800">{partner.sector}</span>
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-1 flex-wrap">
                      <span className="text-[10px] text-slate-400 mr-1">Jurusan:</span>
                      {partner.relevantMajors.map((m) => (
                        <span
                          key={m}
                          className="px-2 py-0.5 rounded bg-blue-50 text-[#003087] font-semibold text-[10px] border border-blue-100"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BKK */}
        {activeSubTab === 'bkk' && (
          <div className="space-y-10">
            {/* Header Banner */}
            <div className="bg-[#002260] text-white rounded-2xl p-6 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-8">
                  <span className="inline-block px-2.5 py-1 bg-[#FFB800] text-[#002260] text-xs font-bold rounded mb-2">
                    PENYALURAN KERJA ALUMNI
                  </span>
                  <h3 className="text-2xl font-bold font-heading mb-2">
                    Bursa Kerja Khusus (BKK) SMK Negeri 1 Ujung Batu
                  </h3>
                  <p className="text-sm text-white/85 leading-relaxed">
                    Unit pelaksana resmi terdaftar di Dinas Tenaga Kerja yang menjembatani alumni dengan lowongan kerja industri, pembekalan tes seleksi, serta rekrutmen kampus (Campus Hiring).
                  </p>
                  <div className="mt-5 flex flex-wrap gap-4 text-xs">
                    <a
                      href={`https://wa.me/${schoolIdentity.contact.whatsappBkk.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#FFB800] hover:bg-[#e0a200] text-[#002260] text-xs py-2.5 px-4 font-bold rounded-lg transition-all"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>WhatsApp Hotline BKK</span>
                    </a>
                    <span className="self-center text-white/80">
                      Email BKK: {schoolIdentity.contact.bkkEmail}
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-4 bg-white/10 border border-white/20 p-6 rounded-2xl text-center backdrop-blur-sm">
                  <div className="text-4xl font-extrabold text-[#FFB800] font-heading">
                    88.4%
                  </div>
                  <div className="text-sm font-semibold text-white mt-1">
                    Serapan Kerja & Wirausaha
                  </div>
                  <p className="text-xs text-white/70 mt-1">
                    Terserap di industri dan mandiri berwirausaha dalam 6 bulan pasca lulus.
                  </p>
                </div>
              </div>
            </div>

            {/* Vacancies */}
            <div>
              <h3 className="text-xl font-bold text-[#003087] mb-4 font-heading">
                Informasi Lowongan Karir BKK Terkini
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVacancies.map((vacancy) => (
                  <div
                    key={vacancy.id}
                    className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-[#FFB800] hover:shadow-sm transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-amber-50 text-[#003087] text-[11px] font-bold rounded border border-amber-200">
                          {vacancy.companyName}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Batas: {vacancy.deadline}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-[#003087] mb-1 font-heading">
                        {vacancy.position}
                      </h4>

                      <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
                        <MapPin className="w-3 h-3 text-[#FFB800]" />
                        <span>{vacancy.location} • {vacancy.type}</span>
                      </p>

                      <div className="space-y-1 mb-4">
                        <span className="text-[11px] font-bold text-slate-600 block">Jurusan Diutamakan:</span>
                        <div className="flex flex-wrap gap-1">
                          {vacancy.majorsNeeded.map((mj, i) => (
                            <span key={i} className="px-2 py-0.5 bg-blue-50 text-[#003087] text-[10px] font-semibold rounded border border-blue-100">
                              {mj}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <a
                      href={`https://wa.me/${schoolIdentity.contact.whatsappBkk.replace(/[^0-9]/g, '')}?text=Halo%20BKK,%20saya%20alumni%20SMKN%201%20ingin%20melamar%20posisi%20${encodeURIComponent(vacancy.position)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-[#003087] hover:bg-[#002260] text-white text-xs py-2 px-4 font-bold rounded-lg transition-colors"
                    >
                      <span>Lamar via Hotline BKK</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SERTIFIKASI BNSP */}
        {activeSubTab === 'sertifikasi' && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-[#003087] font-heading">
                Tempat Uji Kompetensi (TUK) Berlisensi BNSP
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                SMK Negeri 1 Ujung Batu memiliki lisensi resmi sebagai Tempat Uji Kompetensi (TUK) di bawah naungan Badan Nasional Sertifikasi Profesi (BNSP).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  code: 'SKKNI-TKJ-01',
                  name: 'Skema Sertifikasi Network Administrator & Fiber Optik',
                  major: 'Teknik Komputer & Jaringan',
                  units: '12 Unit Kompetensi Standar BNSP',
                  assessor: 'Assessor Berlisensi LSP Telekomunikasi',
                },
                {
                  code: 'SKKNI-TO-02',
                  name: 'Skema Pemeliharaan & Servis Sistem Mesin & EFI Otomotif',
                  major: 'Teknik Otomotif',
                  units: '14 Unit Kompetensi Standar BNSP',
                  assessor: 'Assessor Berlisensi LSP Otomotif Indonesia',
                },
                {
                  code: 'SKKNI-BDP-03',
                  name: 'Skema Tenaga Pemasar Operasional & Ritel Modern',
                  major: 'Bisnis Daring dan Pemasaran',
                  units: '11 Unit Kompetensi Standar BNSP',
                  assessor: 'Assessor Berlisensi LSP Ritel Nusantara',
                },
              ].map((scheme, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-[#FFB800] uppercase">
                      {scheme.code}
                    </span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h4 className="text-sm font-bold text-[#003087] mb-2 font-heading">
                    {scheme.name}
                  </h4>
                  <p className="text-xs text-slate-500 mb-2">
                    Jurusan: <span className="font-semibold text-slate-700">{scheme.major}</span>
                  </p>
                  <div className="text-xs text-slate-600 space-y-1 pt-3 border-t border-slate-100">
                    <p>• {scheme.units}</p>
                    <p>• {scheme.assessor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
