import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  GraduationCap,
  Search,
  BookOpen,
  MapPin,
  Filter,
  Users,
  Award,
  Download,
  Info,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';
import {
  classesScheduleData,
  teachersList,
  daysList,
  MajorClassInfo,
  TeachingTeacher,
  ClassScheduleItem,
} from '../data/scheduleData';
import { vocationalMajors } from '../data/schoolData';
import { api } from '../services/api';

interface JadwalPembelajaranPageProps {
  onNavigate?: (page: string, subTarget?: string) => void;
}

export const JadwalPembelajaranPage: React.FC<JadwalPembelajaranPageProps> = ({
  onNavigate,
}) => {
  // Navigation & View Mode: 'jadwal' (Per Kelas) vs 'guru' (Daftar Guru Pengajar)
  const [activeTab, setActiveTab] = useState<'jadwal' | 'guru'>('jadwal');

  // Live data connected to Admin updates
  const [liveClasses, setLiveClasses] = useState<MajorClassInfo[]>(classesScheduleData);
  const [liveTeachers, setLiveTeachers] = useState<TeachingTeacher[]>(teachersList);

  useEffect(() => {
    api.getSchedules().then((data) => {
      if (data && data.length > 0) setLiveClasses(data);
    });
    api.getTeachers().then((data) => {
      if (data && data.length > 0) setLiveTeachers(data);
    });
  }, []);

  // Filters for Jadwal
  const [selectedMajor, setSelectedMajor] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<'all' | '10' | '11' | '12'>('all');
  const [selectedClassId, setSelectedClassId] = useState<string>('X TKJ 1');
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filters for Guru
  const [teacherGroupFilter, setTeacherGroupFilter] = useState<string>('all');
  const [teacherSearch, setTeacherSearch] = useState<string>('');

  // Filtered classes list
  const filteredClasses = useMemo(() => {
    return liveClasses.filter((item) => {
      const matchMajor = selectedMajor === 'all' || item.majorId === selectedMajor;
      const matchGrade = selectedGrade === 'all' || item.grade === selectedGrade;
      const matchSearch =
        searchQuery === '' ||
        item.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.majorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.homeroomTeacher.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchMajor && matchGrade && matchSearch;
    });
  }, [liveClasses, selectedMajor, selectedGrade, searchQuery]);

  // Current selected class info
  const currentClass: MajorClassInfo = useMemo(() => {
    const found = liveClasses.find((c) => c.className === selectedClassId);
    return found || filteredClasses[0] || liveClasses[0];
  }, [selectedClassId, filteredClasses, liveClasses]);

  // Filtered schedules for current class
  const classSchedules = useMemo(() => {
    if (!currentClass) return [];
    if (selectedDay === 'all') return currentClass.schedules;
    return currentClass.schedules.filter((s) => s.day === selectedDay);
  }, [currentClass, selectedDay]);

  // Filtered teachers list
  const filteredTeachers = useMemo(() => {
    return liveTeachers.filter((t) => {
      const matchGroup =
        teacherGroupFilter === 'all' ||
        (teacherGroupFilter === 'Umum' && t.majorOrGroup === 'Umum') ||
        t.majorOrGroup === teacherGroupFilter;
      const matchSearch =
        teacherSearch === '' ||
        t.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
        t.subject.toLowerCase().includes(teacherSearch.toLowerCase()) ||
        t.code.toLowerCase().includes(teacherSearch.toLowerCase()) ||
        t.nip.includes(teacherSearch);
      return matchGroup && matchSearch;
    });
  }, [liveTeachers, teacherGroupFilter, teacherSearch]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-[#001740] via-[#002260] to-[#003087] text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,184,0,0.12),transparent_50%)] pointer-events-none" />
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#FFB800] text-xs font-semibold uppercase tracking-wider mb-3 backdrop-blur-sm border border-white/10">
                <Calendar className="w-3.5 h-3.5" />
                <span>Tahun Ajaran 2026/2027 • Semester Genap</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
                Jadwal Pembelajaran & Guru Pengajar
              </h1>
              <p className="text-sm sm:text-base text-white/80 max-w-2xl mt-2 leading-relaxed">
                Informasi jadwal tatap muka, alokasi jam praktikum bengkel/lab, dan daftar bapak/ibu guru pengajar untuk seluruh kelas 10, 11, dan 12 dari 6 program keahlian.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  if (window.history.length > 1) {
                    window.history.back();
                  } else if (onNavigate) {
                    onNavigate('beranda');
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 backdrop-blur-sm transition cursor-pointer"
                title="Kembali ke halaman sebelumnya"
              >
                <ArrowLeft className="w-4 h-4 text-[#FFB800]" />
                <span>Kembali</span>
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 backdrop-blur-sm transition cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#FFB800]" />
                <span>Cetak / PDF Jadwal</span>
              </button>
            </div>
          </div>

          {/* Navigation Pill Switcher */}
          <div className="flex items-center gap-2 mt-8 border-b border-white/15 pb-px">
            <button
              onClick={() => setActiveTab('jadwal')}
              className={`pb-3 px-4 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                activeTab === 'jadwal'
                  ? 'border-[#FFB800] text-[#FFB800]'
                  : 'border-transparent text-white/70 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Jadwal Pelajaran Per Kelas</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 ml-1">
                {classesScheduleData.length} Kelas
              </span>
            </button>

            <button
              onClick={() => setActiveTab('guru')}
              className={`pb-3 px-4 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                activeTab === 'guru'
                  ? 'border-[#FFB800] text-[#FFB800]'
                  : 'border-transparent text-white/70 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Daftar Guru Pengajar</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 ml-1">
                {teachersList.length} Guru
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'jadwal' ? (
          <div>
            {/* Filter Bar */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Pilih Jurusan */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Program Keahlian (Jurusan)
                  </label>
                  <select
                    value={selectedMajor}
                    onChange={(e) => {
                      setSelectedMajor(e.target.value);
                      const matchingClass = classesScheduleData.find(
                        (c) =>
                          (e.target.value === 'all' || c.majorId === e.target.value) &&
                          (selectedGrade === 'all' || c.grade === selectedGrade)
                      );
                      if (matchingClass) setSelectedClassId(matchingClass.className);
                    }}
                    className="w-full text-xs rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  >
                    <option value="all">Semua Jurusan (6 Program)</option>
                    {vocationalMajors.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.code} - {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Pilih Tingkat Kelas (10 - 12) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tingkat Kelas
                  </label>
                  <select
                    value={selectedGrade}
                    onChange={(e) => {
                      const grade = e.target.value as 'all' | '10' | '11' | '12';
                      setSelectedGrade(grade);
                      const matchingClass = classesScheduleData.find(
                        (c) =>
                          (selectedMajor === 'all' || c.majorId === selectedMajor) &&
                          (grade === 'all' || c.grade === grade)
                      );
                      if (matchingClass) setSelectedClassId(matchingClass.className);
                    }}
                    className="w-full text-xs rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  >
                    <option value="all">Semua Tingkat (Kelas 10, 11, 12)</option>
                    <option value="10">Kelas 10 (Fase E - Dasar Kejuruan)</option>
                    <option value="11">Kelas 11 (Fase F - Praktik Inti & PKL)</option>
                    <option value="12">Kelas 12 (Fase F - UKK & Kewirausahaan)</option>
                  </select>
                </div>

                {/* 3. Pilih Hari */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Filter Hari
                  </label>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  >
                    <option value="all">Semua Hari (Senin - Jumat)</option>
                    {daysList.map((d) => (
                      <option key={d} value={d}>
                        Hari {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. Pencarian Cepat */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Cari Kelas / Wali Kelas
                  </label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Contoh: TKJ, Rina, X TO..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Class Chips selector */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Pilih Rombongan Belajar (Rombel):
                </span>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
                  {filteredClasses.length === 0 ? (
                    <span className="text-xs text-slate-500 italic">
                      Tidak ada kelas yang cocok dengan filter yang dipilih.
                    </span>
                  ) : (
                    filteredClasses.map((item) => {
                      const isActive = item.className === currentClass?.className;
                      return (
                        <button
                          key={item.className}
                          onClick={() => setSelectedClassId(item.className)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                            isActive
                              ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          <span>{item.className}</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded ${
                              isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {item.majorCode}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Current Class Overview Card */}
            {currentClass && (
              <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-6 shadow-md mb-6 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#FFB800] text-slate-950 font-bold text-xs uppercase tracking-wider">
                        Kelas {currentClass.grade} • {currentClass.majorCode}
                      </span>
                      <span className="text-xs text-blue-200 font-medium">
                        Kurikulum Merdeka SMK PK
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                      Rombel {currentClass.className}
                    </h2>
                    <p className="text-xs sm:text-sm text-blue-100 mt-1">
                      {currentClass.majorName}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-white/10 backdrop-blur-sm p-3.5 rounded-xl border border-white/10 text-xs">
                    <div>
                      <span className="text-[10px] text-blue-200 block uppercase">Wali Kelas</span>
                      <span className="font-bold text-white block mt-0.5">
                        {currentClass.homeroomTeacher.name}
                      </span>
                      <span className="text-[10px] text-blue-300">
                        NIP. {currentClass.homeroomTeacher.nip}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-blue-200 block uppercase">Ruang Belajar</span>
                      <span className="font-bold text-white block mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#FFB800]" />
                        {currentClass.classroom}
                      </span>
                      <span className="text-[10px] text-blue-300">Gedung Teori & Praktik</span>
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-blue-200 block uppercase">Jumlah Siswa</span>
                      <span className="font-bold text-white block mt-0.5 flex items-center gap-1">
                        <Users className="w-3 h-3 text-[#FFB800]" />
                        {currentClass.totalStudents} Siswa
                      </span>
                      <span className="text-[10px] text-blue-300">100% Aktif Terdaftar</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Schedule Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-slate-800 text-sm">
                    Tabel Jadwal Mata Pelajaran & Jam Tatap Muka
                  </h3>
                </div>
                <span className="text-xs text-slate-500">
                  {classSchedules.length} Sesi Terjadwal • Efektif Senin – Jumat
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100/70 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                      <th className="py-3.5 px-4 w-28">Hari</th>
                      <th className="py-3.5 px-4 w-20">Jam Ke</th>
                      <th className="py-3.5 px-4 w-32">Waktu (WIB)</th>
                      <th className="py-3.5 px-4">Mata Pelajaran & Kompetensi</th>
                      <th className="py-3.5 px-4">Guru Pengajar</th>
                      <th className="py-3.5 px-4">Ruang / Bengkel / Lab</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {classSchedules.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                          Tidak ada jadwal untuk kriteria hari yang dipilih.
                        </td>
                      </tr>
                    ) : (
                      classSchedules.map((item, idx) => {
                        const isMondayFlag = item.subject.includes('Upacara');
                        const isPractice =
                          item.subject.toLowerCase().includes('praktik') ||
                          item.subject.toLowerCase().includes('lab') ||
                          item.subject.toLowerCase().includes('bengkel');

                        return (
                          <tr
                            key={item.id}
                            className={`hover:bg-blue-50/40 transition-colors ${
                              idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                            }`}
                          >
                            {/* Hari */}
                            <td className="py-3.5 px-4 font-bold text-slate-800">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                                  item.day === 'Senin'
                                    ? 'bg-blue-100 text-blue-700'
                                    : item.day === 'Selasa'
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : item.day === 'Rabu'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : item.day === 'Kamis'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-purple-100 text-purple-700'
                                }`}
                              >
                                {item.day}
                              </span>
                            </td>

                            {/* Jam ke */}
                            <td className="py-3.5 px-4 font-semibold text-slate-600">
                              Jam {item.period}
                            </td>

                            {/* Waktu */}
                            <td className="py-3.5 px-4 font-mono text-slate-600">
                              {item.time}
                            </td>

                            {/* Mapel */}
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-slate-800">
                                {item.subject}
                              </div>
                              {isPractice && (
                                <span className="inline-block mt-0.5 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                  Praktikum Terpadu / Teaching Factory
                                </span>
                              )}
                              {isMondayFlag && (
                                <span className="inline-block mt-0.5 text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                                  Pendidikan Karakter & Kedisiplinan
                                </span>
                              )}
                            </td>

                            {/* Guru Pengajar */}
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-blue-900 flex items-center gap-1.5">
                                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                                  {item.teacherCode}
                                </span>
                                <span>{item.teacherName}</span>
                              </div>
                            </td>

                            {/* Lokasi Ruangan */}
                            <td className="py-3.5 px-4">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium text-[11px] border border-slate-200/60">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                {item.roomOrLab}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer Notes */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>
                    Istirahat I: 09.30 – 09.45 WIB • Istirahat II (Sholat Dzuhur Berjamaah): 11.45 – 12.30 WIB.
                  </span>
                </div>
                <span>Disahkan oleh Waka Bidang Kurikulum SMKN 1 Ujung Batu</span>
              </div>
            </div>
          </div>
        ) : (
          /* TAB 2: DAFTAR GURU PENGAJAR */
          <div>
            {/* Filter Bar Guru */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm mb-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Filter Rumpun Keahlian */}
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider mr-2">
                    Rumpun:
                  </span>
                  {[
                    { id: 'all', label: 'Semua Rumpun' },
                    { id: 'TKJ', label: 'Produktif TKJ' },
                    { id: 'TO', label: 'Produktif TO' },
                    { id: 'BDP', label: 'Produktif BDP' },
                    { id: 'TE', label: 'Produktif TE' },
                    { id: 'TLOG', label: 'Produktif TLOG' },
                    { id: 'BP', label: 'Produktif BP' },
                    { id: 'Umum', label: 'Normatif & Adaptif' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setTeacherGroupFilter(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        teacherGroupFilter === cat.id
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Search Box Guru */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari nama guru, NIP, atau mapel..."
                    value={teacherSearch}
                    onChange={(e) => setTeacherSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Grid Kartu Guru */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTeachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                        {teacher.code}
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                          teacher.majorOrGroup === 'Umum'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {teacher.majorOrGroup === 'Umum'
                          ? 'Muatan Umum'
                          : `Produktif ${teacher.majorOrGroup}`}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-blue-600 transition-colors">
                      {teacher.name}
                    </h4>
                    <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                      NIP. {teacher.nip}
                    </p>

                    <div className="mt-3.5 pt-3.5 border-t border-slate-100 space-y-1.5 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase block font-semibold">
                          Mata Pelajaran Diampu:
                        </span>
                        <span className="font-medium text-slate-700 block mt-0.5">
                          {teacher.subject}
                        </span>
                      </div>

                      {teacher.room && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{teacher.room}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                      <CheckCircle className="w-3 h-3" />
                      Aktif Mengajar Semester Ini
                    </span>
                    <button
                      onClick={() => {
                        setActiveTab('jadwal');
                        if (teacher.majorOrGroup !== 'Umum') {
                          setSelectedMajor(teacher.majorOrGroup.toLowerCase());
                        }
                      }}
                      className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Lihat Jadwal</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Informasi Tambahan & Callout */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 text-[#003087]">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">
                  Pedoman Pelaksanaan Kurikulum Merdeka & Standar Industri
                </h4>
                <p className="text-xs text-slate-600 mt-0.5 max-w-2xl leading-relaxed">
                  Jadwal pembelajaran dirancang dengan perbandingan teori dan praktik 30:70 untuk mata pelajaran kejuruan. Kelas XI mengikuti sinkronisasi jadwal Praktik Kerja Lapangan (PKL) industri selama 6 bulan.
                </p>
              </div>
            </div>

            {onNavigate && (
              <button
                onClick={() => onNavigate('program-keahlian')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-sm shrink-0 cursor-pointer"
              >
                Eksplorasi Semua Jurusan
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
