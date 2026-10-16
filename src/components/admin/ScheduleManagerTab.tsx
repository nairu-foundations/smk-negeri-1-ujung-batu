import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Clock,
  User,
  Plus,
  Pencil,
  Trash2,
  Save,
  RotateCcw,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Building,
  Users,
  Printer,
  ChevronRight,
  BookOpen,
  Info,
  X,
} from 'lucide-react';
import { api } from '../../services/api';
import {
  MajorClassInfo,
  ClassScheduleItem,
  TeachingTeacher,
  daysList,
} from '../../data/scheduleData';

export const ScheduleManagerTab: React.FC = () => {
  const [classes, setClasses] = useState<MajorClassInfo[]>([]);
  const [teachers, setTeachers] = useState<TeachingTeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClassId, setSelectedClassId] = useState<string>('X TKJ 1');
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('all');
  const [selectedMajorFilter, setSelectedMajorFilter] = useState<string>('all');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Notification toast
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal edit schedule item
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ClassScheduleItem | null>(null);
  const [itemFormData, setItemFormData] = useState({
    day: 'Senin' as 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat',
    period: 1,
    time: '07.15 - 08.45',
    subject: '',
    teacherId: '',
    teacherName: '',
    teacherCode: '',
    roomOrLab: '',
    isBreak: false,
  });

  // Modal edit homeroom / class metadata
  const [isClassMetaModalOpen, setIsClassMetaModalOpen] = useState(false);
  const [classMetaFormData, setClassMetaFormData] = useState({
    homeroomName: '',
    homeroomNip: '',
    totalStudents: 32,
    classroom: '',
  });

  // Delete item confirm
  const [itemToDelete, setItemToDelete] = useState<ClassScheduleItem | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Fetch initial data
  const loadData = async () => {
    setLoading(true);
    try {
      const [classList, teacherList] = await Promise.all([
        api.getSchedules(),
        api.getTeachers(),
      ]);
      setClasses(classList);
      setTeachers(teacherList);
    } catch (err) {
      console.error('Failed to load schedules:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotice({ type, message });
    setTimeout(() => setNotice(null), 3500);
  };

  // Filtered class list for selection
  const filteredClasses = useMemo(() => {
    return classes.filter((c) => {
      const matchMajor = selectedMajorFilter === 'all' || c.majorId === selectedMajorFilter;
      const matchGrade = selectedGradeFilter === 'all' || c.grade === selectedGradeFilter;
      const matchSearch =
        searchQuery === '' ||
        c.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.majorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.homeroomTeacher.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchMajor && matchGrade && matchSearch;
    });
  }, [classes, selectedMajorFilter, selectedGradeFilter, searchQuery]);

  // Current selected class object
  const currentClass = useMemo(() => {
    const found = classes.find((c) => c.className === selectedClassId);
    return found || filteredClasses[0] || classes[0];
  }, [classes, selectedClassId, filteredClasses]);

  // When current class changes, sync class meta form
  useEffect(() => {
    if (currentClass) {
      setClassMetaFormData({
        homeroomName: currentClass.homeroomTeacher.name,
        homeroomNip: currentClass.homeroomTeacher.nip,
        totalStudents: currentClass.totalStudents,
        classroom: currentClass.classroom,
      });
    }
  }, [currentClass]);

  // Filtered schedule items of current class
  const displayedSchedules = useMemo(() => {
    if (!currentClass) return [];
    let items = currentClass.schedules;
    if (selectedDayFilter !== 'all') {
      items = items.filter((s) => s.day === selectedDayFilter);
    }
    // Sort by day order then by period
    const dayOrder: Record<string, number> = {
      Senin: 1,
      Selasa: 2,
      Rabu: 3,
      Kamis: 4,
      Jumat: 5,
    };
    return [...items].sort((a, b) => {
      if (dayOrder[a.day] !== dayOrder[b.day]) {
        return (dayOrder[a.day] || 99) - (dayOrder[b.day] || 99);
      }
      return a.period - b.period;
    });
  }, [currentClass, selectedDayFilter]);

  // Open add schedule item modal
  const handleOpenAddItem = () => {
    setEditingItem(null);
    setItemFormData({
      day: (selectedDayFilter !== 'all' ? selectedDayFilter : 'Senin') as any,
      period: displayedSchedules.length + 1,
      time: '07.15 - 08.45',
      subject: '',
      teacherId: '',
      teacherName: '',
      teacherCode: '',
      roomOrLab: currentClass ? currentClass.classroom : '',
      isBreak: false,
    });
    setIsItemModalOpen(true);
  };

  // Open edit schedule item modal
  const handleOpenEditItem = (item: ClassScheduleItem) => {
    setEditingItem(item);
    setItemFormData({
      day: item.day as any,
      period: item.period,
      time: item.time,
      subject: item.subject,
      teacherId: item.teacherId,
      teacherName: item.teacherName,
      teacherCode: item.teacherCode,
      roomOrLab: item.roomOrLab,
      isBreak: !!item.isBreak,
    });
    setIsItemModalOpen(true);
  };

  // Handle teacher selection change
  const handleTeacherSelect = (teacherId: string) => {
    const selected = teachers.find((t) => t.id === teacherId);
    if (selected) {
      setItemFormData((prev) => ({
        ...prev,
        teacherId: selected.id,
        teacherName: selected.name,
        teacherCode: selected.code,
        roomOrLab: selected.room || prev.roomOrLab || currentClass.classroom,
        subject: prev.subject || selected.subject,
      }));
    } else {
      setItemFormData((prev) => ({
        ...prev,
        teacherId: '',
      }));
    }
  };

  // Save schedule item (add or update)
  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentClass) return;

    if (!itemFormData.subject.trim() && !itemFormData.isBreak) {
      showNotification('error', 'Mata pelajaran wajib diisi.');
      return;
    }

    try {
      if (editingItem) {
        // Update
        const updated = await api.updateScheduleItem(
          currentClass.className,
          editingItem.id,
          itemFormData
        );
        setClasses((prev) =>
          prev.map((cls) => {
            if (cls.className === currentClass.className) {
              return {
                ...cls,
                schedules: cls.schedules.map((s) => (s.id === editingItem.id ? updated : s)),
              };
            }
            return cls;
          })
        );
        showNotification('success', `Jadwal ${updated.subject} berhasil diperbarui.`);
      } else {
        // Add
        const added = await api.addScheduleItem(currentClass.className, itemFormData);
        setClasses((prev) =>
          prev.map((cls) => {
            if (cls.className === currentClass.className) {
              return {
                ...cls,
                schedules: [...cls.schedules, added],
              };
            }
            return cls;
          })
        );
        showNotification('success', `Jadwal ${added.subject} berhasil ditambahkan.`);
      }
      setIsItemModalOpen(false);
    } catch (err: any) {
      showNotification('error', err.message || 'Gagal menyimpan jadwal');
    }
  };

  // Delete schedule item
  const handleDeleteItem = async () => {
    if (!currentClass || !itemToDelete) return;
    try {
      await api.deleteScheduleItem(currentClass.className, itemToDelete.id);
      setClasses((prev) =>
        prev.map((cls) => {
          if (cls.className === currentClass.className) {
            return {
              ...cls,
              schedules: cls.schedules.filter((s) => s.id !== itemToDelete.id),
            };
          }
          return cls;
        })
      );
      showNotification('success', `Jadwal ${itemToDelete.subject} berhasil dihapus.`);
      setItemToDelete(null);
    } catch (err: any) {
      showNotification('error', err.message || 'Gagal menghapus jadwal');
    }
  };

  // Save class metadata (homeroom teacher, classroom, students)
  const handleSaveClassMeta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentClass) return;

    try {
      const updated = await api.updateClassSchedule(currentClass.className, {
        homeroomTeacher: {
          name: classMetaFormData.homeroomName.trim(),
          nip: classMetaFormData.homeroomNip.trim(),
        },
        totalStudents: Number(classMetaFormData.totalStudents),
        classroom: classMetaFormData.classroom.trim(),
      });

      setClasses((prev) =>
        prev.map((cls) => (cls.className === currentClass.className ? updated : cls))
      );
      showNotification('success', `Informasi kelas ${currentClass.className} berhasil disimpan.`);
      setIsClassMetaModalOpen(false);
    } catch (err: any) {
      showNotification('error', err.message || 'Gagal menyimpan informasi kelas');
    }
  };

  // Reset to default
  const handleResetToDefault = async () => {
    try {
      const resetData = await api.resetSchedules();
      setClasses(resetData);
      showNotification('success', 'Jadwal semua kelas berhasil direset ke standar kurikulum.');
      setIsResetConfirmOpen(false);
    } catch (err: any) {
      showNotification('error', err.message || 'Gagal mereset jadwal');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-700">Memuat Jadwal Pelajaran Seluruh Kelas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notice && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between shadow-md transition-all ${
            notice.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2 text-sm font-medium">
            {notice.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            )}
            <span>{notice.message}</span>
          </div>
          <button
            onClick={() => setNotice(null)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Info & Actions */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 text-[#003087] flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">Kelola Jadwal Pelajaran & Guru Pengajar</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  Tahun Ajaran 2025/2026
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                Ubah mata pelajaran, jam mengajar, penugasan guru, serta wali kelas untuk seluruh tingkat kelas 10, 11, dan 12 dari 6 program keahlian.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Standar Kurikulum</span>
            </button>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Jadwal</span>
            </button>

            <button
              onClick={handleOpenAddItem}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#003087] hover:bg-[#002260] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Jam / Pelajaran</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Class Selector & Schedule Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Filter & Class List Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-blue-600" />
                Pilih Kelas & Jurusan
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                {filteredClasses.length} Kelas
              </span>
            </div>

            {/* Quick Filter: Jurusan */}
            <div className="space-y-2 mb-3">
              <label className="text-[11px] font-semibold text-slate-600 uppercase">
                Program Keahlian (Jurusan)
              </label>
              <select
                value={selectedMajorFilter}
                onChange={(e) => setSelectedMajorFilter(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Semua Jurusan (TKJ, TO, BDP, TE, TLOG, BP)</option>
                <option value="tkj">Teknik Komputer & Jaringan (TKJ)</option>
                <option value="to">Teknik Otomotif (TO)</option>
                <option value="bdp">Bisnis Daring & Pemasaran (BDP)</option>
                <option value="te">Teknik Elektronika (TE)</option>
                <option value="tlog">Teknik Logistik (TLOG)</option>
                <option value="bp">Broadcasting & Perfilman (BP)</option>
              </select>
            </div>

            {/* Quick Filter: Tingkat */}
            <div className="space-y-2 mb-3">
              <label className="text-[11px] font-semibold text-slate-600 uppercase">
                Tingkat Kelas
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {['all', '10', '11', '12'].map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedGradeFilter(g)}
                    className={`py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      selectedGradeFilter === g
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {g === 'all' ? 'Semua' : `Kls ${g}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kelas, wali kelas..."
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* List of Classes */}
            <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
              {filteredClasses.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500">
                  Tidak ada kelas yang cocok dengan filter.
                </div>
              ) : (
                filteredClasses.map((cls) => {
                  const isSelected = cls.className === selectedClassId;
                  return (
                    <button
                      key={cls.className}
                      onClick={() => setSelectedClassId(cls.className)}
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-blue-50/80 border-blue-500 text-blue-950 ring-1 ring-blue-500/30'
                          : 'bg-white border-slate-200 hover:bg-slate-50/80 text-slate-800'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs">{cls.className}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-slate-100 text-slate-600">
                            {cls.majorCode}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          Wali: {cls.homeroomTeacher.name}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <span className="text-[10.5px] font-semibold text-slate-600">
                          {cls.schedules.length} Mapel
                        </span>
                        <ChevronRight
                          className={`w-4 h-4 ml-auto transition-transform ${
                            isSelected ? 'text-blue-600 translate-x-0.5' : 'text-slate-300'
                          }`}
                        />
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Class Overview & Interactive Schedule Editor (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {currentClass ? (
            <>
              {/* Selected Class Meta Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md font-bold text-xs bg-blue-100 text-[#003087]">
                        {currentClass.majorCode} • Kelas {currentClass.grade}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">
                        Jadwal Pelajaran {currentClass.className}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Program: {currentClass.majorName}
                    </p>
                  </div>

                  <button
                    onClick={() => setIsClassMetaModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-all self-start sm:self-auto cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5 text-blue-600" />
                    <span>Ubah Info Kelas & Wali</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3.5 text-xs">
                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <User className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[10.5px] text-slate-500">Wali Kelas</div>
                      <div className="font-semibold text-slate-800 truncate">
                        {currentClass.homeroomTeacher.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <Building className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[10.5px] text-slate-500">Ruang / Lab Utama</div>
                      <div className="font-semibold text-slate-800 truncate">
                        {currentClass.classroom}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <Users className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[10.5px] text-slate-500">Total Siswa</div>
                      <div className="font-semibold text-slate-800">
                        {currentClass.totalStudents} Siswa Terdaftar
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Day Filter Tabs & Action */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    <button
                      onClick={() => setSelectedDayFilter('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        selectedDayFilter === 'all'
                          ? 'bg-[#003087] text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Semua Hari ({currentClass.schedules.length})
                    </button>
                    {daysList.map((day) => {
                      const count = currentClass.schedules.filter((s) => s.day === day).length;
                      return (
                        <button
                          key={day}
                          onClick={() => setSelectedDayFilter(day)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                            selectedDayFilter === day
                              ? 'bg-[#003087] text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {day} ({count})
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleOpenAddItem}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all self-start sm:self-auto cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Jam di {selectedDayFilter === 'all' ? currentClass.className : selectedDayFilter}</span>
                  </button>
                </div>

                {/* Schedules Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600">
                        <th className="py-2.5 px-3 font-semibold">Hari & Jam</th>
                        <th className="py-2.5 px-3 font-semibold">Waktu</th>
                        <th className="py-2.5 px-3 font-semibold">Mata Pelajaran</th>
                        <th className="py-2.5 px-3 font-semibold">Guru Pengajar</th>
                        <th className="py-2.5 px-3 font-semibold">Ruang / Bengkel</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {displayedSchedules.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400">
                            Belum ada jadwal pada hari ini.{' '}
                            <button
                              onClick={handleOpenAddItem}
                              className="text-blue-600 font-semibold underline hover:text-blue-800 ml-1"
                            >
                              Tambah jadwal sekarang
                            </button>
                          </td>
                        </tr>
                      ) : (
                        displayedSchedules.map((item) => {
                          const isBreak = item.isBreak;
                          return (
                            <tr
                              key={item.id}
                              className={`hover:bg-slate-50/80 transition-colors ${
                                isBreak ? 'bg-amber-50/40' : ''
                              }`}
                            >
                              <td className="py-3 px-3">
                                <div className="font-bold text-slate-800">{item.day}</div>
                                <div className="text-[10px] text-slate-500 font-medium">
                                  Jam Ke-{item.period}
                                </div>
                              </td>

                              <td className="py-3 px-3 whitespace-nowrap">
                                <span className="inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  {item.time}
                                </span>
                              </td>

                              <td className="py-3 px-3">
                                {isBreak ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
                                    ☕ {item.subject || 'Istirahat / Sholat'}
                                  </span>
                                ) : (
                                  <div>
                                    <div className="font-semibold text-slate-900 leading-snug">
                                      {item.subject}
                                    </div>
                                    <div className="text-[10px] text-slate-500 mt-0.5">
                                      {item.teacherCode ? `Kode: ${item.teacherCode}` : ''}
                                    </div>
                                  </div>
                                )}
                              </td>

                              <td className="py-3 px-3">
                                {isBreak ? (
                                  <span className="text-slate-400 text-[11px]">-</span>
                                ) : (
                                  <div>
                                    <div className="font-medium text-slate-800">
                                      {item.teacherName}
                                    </div>
                                    {item.teacherCode && (
                                      <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700">
                                        [{item.teacherCode}]
                                      </span>
                                    )}
                                  </div>
                                )}
                              </td>

                              <td className="py-3 px-3 whitespace-nowrap">
                                <span className="inline-flex items-center gap-1 text-[11px] text-slate-600">
                                  <Building className="w-3 h-3 text-slate-400" />
                                  {item.roomOrLab || '-'}
                                </span>
                              </td>

                              <td className="py-3 px-3 text-right whitespace-nowrap">
                                <div className="inline-flex items-center gap-1">
                                  <button
                                    onClick={() => handleOpenEditItem(item)}
                                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-slate-600 transition-all cursor-pointer"
                                    title="Ubah Jadwal"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setItemToDelete(item)}
                                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-600 transition-all cursor-pointer"
                                    title="Hapus Jadwal"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500">
              Pilih salah satu kelas di sebelah kiri untuk melihat dan mengubah jadwal.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Add / Edit Schedule Item */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsItemModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#003087] flex items-center justify-center">
                {editingItem ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingItem ? 'Ubah Jadwal Pelajaran' : 'Tambah Jadwal Pelajaran'}
                </h3>
                <p className="text-xs text-slate-500">
                  Kelas: <span className="font-semibold text-blue-700">{currentClass?.className}</span> ({currentClass?.majorName})
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              {/* Day & Period */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hari
                  </label>
                  <select
                    value={itemFormData.day}
                    onChange={(e) =>
                      setItemFormData({ ...itemFormData, day: e.target.value as any })
                    }
                    className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {daysList.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jam Ke-
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={itemFormData.period}
                    onChange={(e) =>
                      setItemFormData({ ...itemFormData, period: Number(e.target.value) })
                    }
                    className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Time Range */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alokasi Waktu Jam Pelajaran
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {[
                    '07.15 - 08.45',
                    '08.45 - 10.00',
                    '10.15 - 11.45',
                    '12.30 - 14.00',
                    '14.00 - 15.30',
                  ].map((preset) => (
                    <button
                      type="button"
                      key={preset}
                      onClick={() => setItemFormData({ ...itemFormData, time: preset })}
                      className={`text-[11px] py-1 px-2 rounded-lg border font-mono transition-all ${
                        itemFormData.time === preset
                          ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={itemFormData.time}
                  onChange={(e) => setItemFormData({ ...itemFormData, time: e.target.value })}
                  placeholder="Contoh: 07.15 - 08.45"
                  className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  required
                />
              </div>

              {/* Is Break Checkbox */}
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <input
                  type="checkbox"
                  id="isBreak"
                  checked={itemFormData.isBreak}
                  onChange={(e) =>
                    setItemFormData({
                      ...itemFormData,
                      isBreak: e.target.checked,
                      subject: e.target.checked ? 'Istirahat & Sholat Berjamaah' : itemFormData.subject,
                    })
                  }
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isBreak" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Tandai sebagai jam istirahat / sholat (Non-KBM)
                </label>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mata Pelajaran
                </label>
                <input
                  type="text"
                  value={itemFormData.subject}
                  onChange={(e) => setItemFormData({ ...itemFormData, subject: e.target.value })}
                  placeholder="Contoh: Pemrograman Berorientasi Objek / Matematika Terapan"
                  className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={!itemFormData.isBreak}
                />
              </div>

              {/* Teacher Selector */}
              {!itemFormData.isBreak && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Guru Pengajar (Pilih dari GTK)
                  </label>
                  <select
                    value={itemFormData.teacherId}
                    onChange={(e) => handleTeacherSelect(e.target.value)}
                    className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                  >
                    <option value="">-- Pilih Guru dari Database SMKN 1 --</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} [{t.code}] - {t.subject} ({t.majorOrGroup})
                      </option>
                    ))}
                  </select>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={itemFormData.teacherName}
                      onChange={(e) => setItemFormData({ ...itemFormData, teacherName: e.target.value })}
                      placeholder="Nama Guru Pengajar"
                      className="text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={itemFormData.teacherCode}
                      onChange={(e) => setItemFormData({ ...itemFormData, teacherCode: e.target.value })}
                      placeholder="Kode Guru (misal: HW)"
                      className="text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 focus:outline-none uppercase"
                    />
                  </div>
                </div>
              )}

              {/* Room or Lab */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ruang Kelas / Bengkel / Laboratorium
                </label>
                <input
                  type="text"
                  value={itemFormData.roomOrLab}
                  onChange={(e) => setItemFormData({ ...itemFormData, roomOrLab: e.target.value })}
                  placeholder="Contoh: Lab Komputer 1 / Bengkel Car Lift / R.201"
                  className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#003087] hover:bg-[#002260] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Jadwal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Class Meta */}
      {isClassMetaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 relative">
            <button
              onClick={() => setIsClassMetaModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#003087] flex items-center justify-center">
                <Pencil className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Ubah Info Kelas {currentClass?.className}
                </h3>
                <p className="text-xs text-slate-500">Wali kelas, ruang kelas, dan jumlah siswa</p>
              </div>
            </div>

            <form onSubmit={handleSaveClassMeta} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Wali Kelas
                </label>
                <input
                  type="text"
                  value={classMetaFormData.homeroomName}
                  onChange={(e) =>
                    setClassMetaFormData({ ...classMetaFormData, homeroomName: e.target.value })
                  }
                  placeholder="Nama Lengkap & Gelar Wali Kelas"
                  className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NIP Wali Kelas
                </label>
                <input
                  type="text"
                  value={classMetaFormData.homeroomNip}
                  onChange={(e) =>
                    setClassMetaFormData({ ...classMetaFormData, homeroomNip: e.target.value })
                  }
                  placeholder="NIP. 19830719..."
                  className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jumlah Siswa
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={classMetaFormData.totalStudents}
                    onChange={(e) =>
                      setClassMetaFormData({
                        ...classMetaFormData,
                        totalStudents: Number(e.target.value),
                      })
                    }
                    className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ruang Kelas Utama
                  </label>
                  <input
                    type="text"
                    value={classMetaFormData.classroom}
                    onChange={(e) =>
                      setClassMetaFormData({ ...classMetaFormData, classroom: e.target.value })
                    }
                    placeholder="Contoh: Gedung A - R.101"
                    className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsClassMetaModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#003087] hover:bg-[#002260] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Item Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Hapus Jam Pelajaran?
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Apakah Anda yakin ingin menghapus jadwal{' '}
              <strong className="text-slate-800">{itemToDelete.subject}</strong> ({itemToDelete.day}, Jam Ke-{itemToDelete.period}) dari kelas {currentClass?.className}?
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteItem}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Reset Semua Jadwal?
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Tindakan ini akan mengembalikan seluruh jadwal kelas 10, 11, dan 12 dari semua jurusan ke standar kurikulum bawaan awal.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleResetToDefault}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold cursor-pointer"
              >
                Reset ke Standar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
