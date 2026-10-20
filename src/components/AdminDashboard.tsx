import React, { useState, useEffect } from 'react';
import {
  Newspaper,
  Bell,
  Mail,
  MessageSquare,
  Plus,
  Edit2,
  Trash2,
  Search,
  ExternalLink,
  LogOut,
  Send,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  User,
  Layers,
  Image as ImageIcon,
  Check,
  X,
  RefreshCw,
  ChevronDown,
  Eye,
  SlidersHorizontal,
  ShieldCheck,
  Info,
  GraduationCap,
  Briefcase,
  Phone,
  Table as TableIcon,
  LayoutGrid,
  Users,
  FolderTree,
  Camera,
  Save,
  Maximize2,
} from 'lucide-react';
import { api } from '../services/api';
import { SchoolLogo } from './common/SchoolLogo';
import { NewsArticle, Announcement, AdminUser, ContactMessage, EmailLog, StaffMember, GalleryPhoto } from '../types';
import { PhotoManagerTab } from './admin/PhotoManagerTab';
import { ScheduleManagerTab } from './admin/ScheduleManagerTab';
import { AdminImagePicker } from './admin/AdminImagePicker';

export type AdminTab =
  | 'overview'
  | 'news'
  | 'announcements'
  | 'staff'
  | 'gallery'
  | 'email'
  | 'messages'
  | 'photos'
  | 'schedule';

interface AdminDashboardProps {
  currentUser: AdminUser;
  activeTabProp?: string;
  onTabChange?: (tab: string) => void;
  onLogout: () => void;
  onNavigateHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  activeTabProp,
  onTabChange,
  onLogout,
  onNavigateHome,
}) => {
  const [activeTab, setActiveTabState] = useState<AdminTab>(
    (activeTabProp as any) || 'overview'
  );
  const [tabHistory, setTabHistory] = useState<string[]>([(activeTabProp as any) || 'overview']);

  const changeTab = (
    tab: AdminTab,
    push = true
  ) => {
    setActiveTabState(tab);
    if (push) {
      setTabHistory((prev) => (prev[prev.length - 1] === tab ? prev : [...prev, tab]));
      if (onTabChange) onTabChange(tab);
    }
  };

  const setActiveTab = (tab: AdminTab) => {
    changeTab(tab, true);
  };

  useEffect(() => {
    const targetTab = (activeTabProp as any) || 'overview';
    if (targetTab !== activeTab) {
      setActiveTabState(targetTab);
    }
  }, [activeTabProp]);

  // Data states
  const [newsList, setNewsList] = useState<NewsArticle[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [galleryList, setGalleryList] = useState<GalleryPhoto[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Search & Filter
  const [newsSearch, setNewsSearch] = useState('');
  const [newsCategoryFilter, setNewsCategoryFilter] = useState('Semua');
  const [announcementFilter, setAnnouncementFilter] = useState('Semua');

  // Staff Search & Filter
  const [staffSearch, setStaffSearch] = useState('');
  const [staffCategoryFilter, setStaffCategoryFilter] = useState('Semua');
  const [staffStatusFilter, setStaffStatusFilter] = useState('Semua');
  const [staffViewMode, setStaffViewMode] = useState<'grid' | 'table'>('grid');

  // Gallery Search & Filter
  const [gallerySearch, setGallerySearch] = useState('');
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState('Semua');
  const [galleryViewMode, setGalleryViewMode] = useState<'grid' | 'table'>('grid');

  // Modals
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);

  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [editingGalleryPhoto, setEditingGalleryPhoto] = useState<GalleryPhoto | null>(null);
  const [galleryLightboxPhoto, setGalleryLightboxPhoto] = useState<GalleryPhoto | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'news' | 'announcement' | 'staff' | 'gallery';
    id: string;
    title: string;
  } | null>(null);

  // Handle device go back navigation: if any modal is open when user hits back, close the modal smoothly
  useEffect(() => {
    const handlePopStateModal = () => {
      if (isNewsModalOpen) setIsNewsModalOpen(false);
      if (isStaffModalOpen) setIsStaffModalOpen(false);
      if (isAnnouncementModalOpen) setIsAnnouncementModalOpen(false);
      if (isGalleryModalOpen) setIsGalleryModalOpen(false);
      if (galleryLightboxPhoto) setGalleryLightboxPhoto(null);
      if (deleteConfirm) setDeleteConfirm(null);
    };

    window.addEventListener('popstate', handlePopStateModal);
    return () => window.removeEventListener('popstate', handlePopStateModal);
  }, [isNewsModalOpen, isStaffModalOpen, isAnnouncementModalOpen, isGalleryModalOpen, galleryLightboxPhoto, deleteConfirm]);

  // Form states: Gallery
  const [galleryFormData, setGalleryFormData] = useState({
    title: '',
    category: 'Praktik Bengkel/Lab',
    imageUrl: '',
    caption: '',
    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
  });

  // Form states: News
  const [newsFormData, setNewsFormData] = useState({
    title: '',
    category: 'Kegiatan Sekolah',
    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    author: currentUser.name || 'Admin SMKN 1',
    excerpt: '',
    content: '',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
  });

  // Form states: Announcement
  const [announcementFormData, setAnnouncementFormData] = useState({
    title: '',
    targetAudience: 'Siswa' as 'Siswa' | 'Orang Tua' | 'Alumni & DU/DI' | 'Guru & Tendik' | 'Umum',
    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    important: true,
    content: '',
    downloadLink: '',
  });

  // Form states: Staff (Guru & Tenaga Kependidikan)
  const [staffFormData, setStaffFormData] = useState<{
    name: string;
    nip: string;
    role: string;
    category: 'Pimpinan' | 'Produktif' | 'Normatif Adaptif' | 'Tenaga Kependidikan';
    majorOrSubject: string;
    photo: string;
    phone: string;
    email: string;
    education: string;
    statusKepegawaian: 'PNS' | 'PPPK' | 'GTT' | 'PTY' | 'Honorer';
  }>({
    name: '',
    nip: '',
    role: '',
    category: 'Produktif',
    majorOrSubject: '',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=500',
    phone: '',
    email: '',
    education: 'S1 Pendidikan',
    statusKepegawaian: 'PNS',
  });

  // Form state: Email dispatch endpoint
  const [emailFormData, setEmailFormData] = useState({
    to: 'smkn1_uba@yahoo.com',
    subject: '[Edaran SMKN 1 Ujung Batu] Informasi Penting Sekolah',
    body: 'Pemberitahuan resmi kepada seluruh civitas akademika SMK Negeri 1 Ujung Batu.',
    sender: currentUser.email || 'admin@smkn1ujungbatu.sch.id',
  });
  const [sendingEmail, setSendingEmail] = useState(false);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [fetchedNews, fetchedAnnouncements, fetchedStaff, fetchedMessages, fetchedEmails, fetchedGallery] = await Promise.all([
        api.getNews(),
        api.getAnnouncements(),
        api.getStaff(),
        api.getMessages(),
        api.getEmailLogs(),
        api.getGallery(),
      ]);
      setNewsList(fetchedNews);
      setAnnouncements(fetchedAnnouncements);
      setStaffList(fetchedStaff);
      setMessages(fetchedMessages);
      setEmailLogs(fetchedEmails);
      setGalleryList(fetchedGallery);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const triggerNotice = (type: 'success' | 'error', message: string) => {
    setActionNotice({ type, message });
    setTimeout(() => setActionNotice(null), 4000);
  };

  // ==========================================
  // NEWS HANDLERS
  // ==========================================
  const handleOpenAddNews = () => {
    setEditingNews(null);
    setNewsFormData({
      title: '',
      category: 'Kegiatan Sekolah',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      author: currentUser.name || 'Admin SMKN 1',
      excerpt: '',
      content: '',
      image: '/images/berita/lks-otomotif-rohul.jpg',
    });
    setIsNewsModalOpen(true);
  };

  const handleOpenEditNews = (news: NewsArticle) => {
    setEditingNews(news);
    setNewsFormData({
      title: news.title,
      category: news.category,
      date: news.date,
      author: news.author,
      excerpt: news.excerpt,
      content: news.content,
      image: news.image,
    });
    setIsNewsModalOpen(true);
  };

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingNews) {
        await api.updateNews(editingNews.id, newsFormData);
        triggerNotice('success', `Berita "${newsFormData.title}" berhasil diperbarui!`);
      } else {
        await api.createNews(newsFormData);
        triggerNotice('success', `Berita baru "${newsFormData.title}" berhasil ditambahkan ke database!`);
      }
      setIsNewsModalOpen(false);
      loadAllData();
    } catch (err: any) {
      triggerNotice('error', err.message || 'Gagal menyimpan berita');
    }
  };

  const handleDeleteNews = async (id: string) => {
    try {
      await api.deleteNews(id);
      triggerNotice('success', 'Berita berhasil dihapus dari database.');
      setDeleteConfirm(null);
      loadAllData();
    } catch (err: any) {
      triggerNotice('error', err.message || 'Gagal menghapus berita');
    }
  };

  // ==========================================
  // ANNOUNCEMENT HANDLERS
  // ==========================================
  const handleOpenAddAnnouncement = () => {
    setEditingAnnouncement(null);
    setAnnouncementFormData({
      title: '',
      targetAudience: 'Siswa',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      important: true,
      content: '',
      downloadLink: '',
    });
    setIsAnnouncementModalOpen(true);
  };

  const handleOpenEditAnnouncement = (ann: Announcement) => {
    setEditingAnnouncement(ann);
    setAnnouncementFormData({
      title: ann.title,
      targetAudience: ann.targetAudience,
      date: ann.date,
      important: ann.important,
      content: ann.content,
      downloadLink: ann.downloadLink || '',
    });
    setIsAnnouncementModalOpen(true);
  };

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAnnouncement) {
        await api.updateAnnouncement(editingAnnouncement.id, announcementFormData);
        triggerNotice('success', `Pengumuman "${announcementFormData.title}" berhasil diperbarui!`);
      } else {
        await api.createAnnouncement(announcementFormData);
        triggerNotice('success', `Pengumuman baru berhasil diterbitkan!`);
      }
      setIsAnnouncementModalOpen(false);
      loadAllData();
    } catch (err: any) {
      triggerNotice('error', err.message || 'Gagal menyimpan pengumuman');
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      await api.deleteAnnouncement(id);
      triggerNotice('success', 'Pengumuman berhasil dihapus.');
      setDeleteConfirm(null);
      loadAllData();
    } catch (err: any) {
      triggerNotice('error', err.message || 'Gagal menghapus pengumuman');
    }
  };

  // ==========================================
  // STAFF (GURU & TENAGA KEPENDIDIKAN) HANDLERS
  // ==========================================
  const handleOpenAddStaff = () => {
    setEditingStaff(null);
    setStaffFormData({
      name: '',
      nip: '',
      role: '',
      category: 'Produktif',
      majorOrSubject: '',
      photo: '',
      phone: '',
      email: '',
      education: 'S1 Pendidikan',
      statusKepegawaian: 'PNS',
    });
    setIsStaffModalOpen(true);
  };

  const handleOpenEditStaff = (staff: StaffMember) => {
    setEditingStaff(staff);
    setStaffFormData({
      name: staff.name,
      nip: staff.nip && staff.nip !== '-' ? staff.nip : '',
      role: staff.role,
      category: staff.category,
      majorOrSubject: staff.majorOrSubject && staff.majorOrSubject !== '-' ? staff.majorOrSubject : '',
      photo: staff.photo || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=500',
      phone: staff.phone || '',
      email: staff.email || '',
      education: staff.education || '',
      statusKepegawaian: staff.statusKepegawaian || 'PNS',
    });
    setIsStaffModalOpen(true);
  };

  const handleSaveStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffFormData.name.trim() || !staffFormData.role.trim()) {
      triggerNotice('error', 'Nama lengkap dan jabatan guru/tendik wajib diisi.');
      return;
    }

    try {
      const cleanPhoto = staffFormData.photo.trim() || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=500';
      if (editingStaff) {
        await api.updateStaff(editingStaff.id, {
          name: staffFormData.name.trim(),
          nip: staffFormData.nip.trim() || '-',
          role: staffFormData.role.trim(),
          category: staffFormData.category,
          majorOrSubject: staffFormData.majorOrSubject.trim() || '-',
          photo: cleanPhoto,
          phone: staffFormData.phone.trim() || undefined,
          email: staffFormData.email.trim() || undefined,
          education: staffFormData.education.trim() || undefined,
          statusKepegawaian: staffFormData.statusKepegawaian,
        });
        triggerNotice('success', `Data GTK "${staffFormData.name}" berhasil diperbarui!`);
      } else {
        await api.createStaff({
          name: staffFormData.name.trim(),
          nip: staffFormData.nip.trim() || '-',
          role: staffFormData.role.trim(),
          category: staffFormData.category,
          majorOrSubject: staffFormData.majorOrSubject.trim() || '-',
          photo: cleanPhoto,
          phone: staffFormData.phone.trim() || undefined,
          email: staffFormData.email.trim() || undefined,
          education: staffFormData.education.trim() || undefined,
          statusKepegawaian: staffFormData.statusKepegawaian,
        });
        triggerNotice('success', `Data GTK "${staffFormData.name}" berhasil ditambahkan ke database!`);
      }
      setIsStaffModalOpen(false);
      loadAllData();
    } catch (err: any) {
      triggerNotice('error', err.message || 'Gagal menyimpan data guru/tendik');
    }
  };

  const handleDeleteStaff = async (id: string) => {
    try {
      await api.deleteStaff(id);
      triggerNotice('success', 'Data guru / tenaga kependidikan berhasil dihapus.');
      setDeleteConfirm(null);
      loadAllData();
    } catch (err: any) {
      triggerNotice('error', err.message || 'Gagal menghapus data GTK');
    }
  };

  // ==========================================
  // GALLERY (DOKUMENTASI FOTO) HANDLERS
  // ==========================================
  const handleOpenAddGallery = () => {
    setEditingGalleryPhoto(null);
    setGalleryFormData({
      title: '',
      category: 'Praktik Bengkel/Lab',
      imageUrl: '',
      caption: '',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    });
    setIsGalleryModalOpen(true);
  };

  const handleOpenEditGallery = (photo: GalleryPhoto) => {
    setEditingGalleryPhoto(photo);
    setGalleryFormData({
      title: photo.title,
      category: photo.category,
      imageUrl: photo.imageUrl,
      caption: photo.caption || (photo as any).description || '',
      date: (photo as any).date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    });
    setIsGalleryModalOpen(true);
  };

  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryFormData.title.trim()) {
      triggerNotice('error', 'Judul foto dokumentasi wajib diisi.');
      return;
    }
    if (!galleryFormData.imageUrl.trim()) {
      triggerNotice('error', 'Pilih atau unggah file foto dokumentasi terlebih dahulu.');
      return;
    }

    try {
      if (editingGalleryPhoto) {
        await api.updateGalleryPhoto(editingGalleryPhoto.id, {
          title: galleryFormData.title.trim(),
          category: galleryFormData.category,
          imageUrl: galleryFormData.imageUrl.trim(),
          caption: galleryFormData.caption.trim(),
          date: galleryFormData.date.trim(),
        });
        triggerNotice('success', `Foto dokumentasi "${galleryFormData.title}" berhasil diperbarui!`);
      } else {
        await api.createGalleryPhoto({
          title: galleryFormData.title.trim(),
          category: galleryFormData.category,
          imageUrl: galleryFormData.imageUrl.trim(),
          caption: galleryFormData.caption.trim(),
          date: galleryFormData.date.trim(),
        });
        triggerNotice('success', `Foto dokumentasi "${galleryFormData.title}" berhasil ditambahkan ke galeri!`);
      }
      setIsGalleryModalOpen(false);
      loadAllData();
    } catch (err: any) {
      triggerNotice('error', err.message || 'Gagal menyimpan foto dokumentasi');
    }
  };

  const handleDeleteGallery = async (id: string) => {
    try {
      await api.deleteGalleryPhoto(id);
      triggerNotice('success', 'Foto dokumentasi berhasil dihapus dari galeri.');
      setDeleteConfirm(null);
      loadAllData();
    } catch (err: any) {
      triggerNotice('error', err.message || 'Gagal menghapus foto dokumentasi');
    }
  };

  // ==========================================
  // SEND EMAIL HANDLER
  // ==========================================
  const handleSendEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingEmail(true);
    try {
      const res = await api.sendEmail(emailFormData);
      triggerNotice('success', res.message || `Email berhasil dikirim ke ${emailFormData.to}!`);
      loadAllData();
      setEmailFormData((prev) => ({
        ...prev,
        subject: '',
        body: '',
      }));
    } catch (err: any) {
      triggerNotice('error', err.message || 'Gagal mengirim email');
    } finally {
      setSendingEmail(false);
    }
  };

  // Filtered lists
  const filteredNews = newsList.filter((n) => {
    const matchCat = newsCategoryFilter === 'Semua' || n.category === newsCategoryFilter;
    const matchQuery =
      n.title.toLowerCase().includes(newsSearch.toLowerCase()) ||
      n.excerpt.toLowerCase().includes(newsSearch.toLowerCase());
    return matchCat && matchQuery;
  });

  const filteredAnnouncements = announcements.filter((a) => {
    if (announcementFilter === 'Semua') return true;
    return a.targetAudience === announcementFilter;
  });

  const filteredStaff = staffList.filter((staff) => {
    const matchCat = staffCategoryFilter === 'Semua' || staff.category === staffCategoryFilter;
    const matchStatus = staffStatusFilter === 'Semua' || staff.statusKepegawaian === staffStatusFilter;
    const q = staffSearch.toLowerCase();
    const matchQuery =
      !q ||
      staff.name.toLowerCase().includes(q) ||
      (staff.nip && staff.nip.toLowerCase().includes(q)) ||
      (staff.role && staff.role.toLowerCase().includes(q)) ||
      (staff.majorOrSubject && staff.majorOrSubject.toLowerCase().includes(q)) ||
      (staff.education && staff.education.toLowerCase().includes(q));
    return matchCat && matchStatus && matchQuery;
  });

  const filteredGallery = galleryList.filter((item) => {
    const matchCat =
      galleryCategoryFilter === 'Semua' || item.category === galleryCategoryFilter;
    const q = gallerySearch.toLowerCase().trim();
    const matchQuery =
      !q ||
      item.title.toLowerCase().includes(q) ||
      (item.caption || (item as any).description || '').toLowerCase().includes(q) ||
      (item.category && item.category.toLowerCase().includes(q));
    return matchCat && matchQuery;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Admin Navigation Header */}
      {/* Top Admin Navigation Header */}
      <header className="bg-[#002260] text-white border-b border-[#001740] sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1300px] mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
          {/* Brand & Admin Badge */}
          <div className="flex items-center gap-2.5 min-w-0">
            <SchoolLogo className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-sm flex-shrink-0" />
            <div className="min-w-0">
              <span className="font-bold text-xs sm:text-base font-heading text-white block truncate">
                Panel Admin SMKN 1 Ujung Batu
              </span>
              <p className="text-[10px] sm:text-[11px] text-white/60 hidden sm:block truncate">
                Pengelolaan Berita, Pengumuman & Notifikasi Email
              </p>
            </div>
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
            <div className="hidden md:flex flex-col text-right pr-1">
              <span className="text-xs font-semibold text-white">{currentUser.name}</span>
              <span className="text-[10px] text-white/60">{currentUser.email}</span>
            </div>

            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-all cursor-pointer"
              title="Lihat website sekolah"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#FFB800]" />
              <span className="hidden sm:inline">Website</span>
            </button>

            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
              title="Keluar dari panel admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Action Notice */}
      {actionNotice && (
        <div
          className={`fixed bottom-5 right-5 z-50 max-w-md p-4 rounded-xl shadow-xl flex items-start gap-3 border animate-in fade-in slide-in-from-bottom-2 duration-200 ${
            actionNotice.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          {actionNotice.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1 text-xs font-medium leading-relaxed">
            {actionNotice.message}
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Body Content */}
      <main className="max-w-[1300px] mx-auto px-3 sm:px-6 py-4 sm:py-8 flex-1 w-full space-y-4 sm:space-y-6">
        {/* Admin Navigation Breadcrumb Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500 font-medium">Halaman Aktif:</span>
            <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#003087] font-bold text-xs border border-blue-100/70">
              {activeTab === 'overview'
                ? '📊 Ringkasan & Metrik'
                : activeTab === 'news'
                ? '📰 Kelola Berita'
                : activeTab === 'announcements'
                ? '📢 Kelola Pengumuman'
                : activeTab === 'staff'
                ? '👨‍🏫 Guru & Tenaga Kependidikan'
                : activeTab === 'gallery'
                ? '📸 Galeri & Dokumentasi Foto'
                : activeTab === 'email'
                ? '✉️ Notifikasi Email'
                : activeTab === 'messages'
                ? '💬 Pesan Masuk'
                : activeTab === 'photos'
                ? '📁 Direktori Foto'
                : '📅 Jadwal Pelajaran'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span>Navigasi tersimpan ({tabHistory.length} tab)</span>
          </div>
        </div>
        {/* Navigation Tabs Bar */}
        <div className="space-y-2 border-b border-slate-200 pb-3">
          {/* Quick Select on Mobile (< sm) */}
          <div className="sm:hidden flex items-center gap-2">
            <div className="relative flex-1">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as any)}
                aria-label="Pilih Menu Admin"
                className="w-full pl-3 pr-8 py-2 rounded-xl border border-slate-300 bg-white font-bold text-xs text-[#003087] shadow-xs focus:ring-2 focus:ring-[#003087] focus:outline-none appearance-none"
              >
                <option value="overview">📊 Ringkasan & Metrik</option>
                <option value="news">📰 Kelola Berita ({newsList.length})</option>
                <option value="announcements">📢 Pengumuman ({announcements.length})</option>
                <option value="staff">👨‍🏫 Guru & Tendik ({staffList.length})</option>
                <option value="gallery">📸 Galeri Foto ({galleryList.length})</option>
                <option value="email">✉️ Notifikasi Email ({emailLogs.length})</option>
                <option value="messages">💬 Pesan Masuk ({messages.length})</option>
                <option value="photos">📁 Direktori Foto</option>
                <option value="schedule">📅 Jadwal Pelajaran</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              onClick={loadAllData}
              disabled={loading}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 transition-all cursor-pointer flex items-center justify-center shadow-xs flex-shrink-0"
              title="Refresh Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#003087]' : ''}`} />
            </button>
          </div>

          {/* Horizontal Pill Bar with Touch Scroll */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth w-full sm:w-auto -mx-3 px-3 sm:mx-0 sm:px-0 sm:flex-wrap py-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                  activeTab === 'overview'
                    ? 'bg-[#003087] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFB800]" />
                <span>Ringkasan</span>
              </button>

              <button
                onClick={() => setActiveTab('news')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                  activeTab === 'news'
                    ? 'bg-[#003087] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Newspaper className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFB800]" />
                <span>Berita</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === 'news' ? 'bg-[#FFB800] text-[#002260]' : 'bg-slate-100 text-slate-700'
                }`}>
                  {newsList.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('announcements')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                  activeTab === 'announcements'
                    ? 'bg-[#003087] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFB800]" />
                <span>Pengumuman</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === 'announcements' ? 'bg-[#FFB800] text-[#002260]' : 'bg-slate-100 text-slate-700'
                }`}>
                  {announcements.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('staff')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                  activeTab === 'staff'
                    ? 'bg-[#003087] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFB800]" />
                <span>Guru & GTK</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === 'staff' ? 'bg-[#FFB800] text-[#002260]' : 'bg-slate-100 text-slate-700'
                }`}>
                  {staffList.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('gallery')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                  activeTab === 'gallery'
                    ? 'bg-[#003087] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFB800]" />
                <span>Galeri Foto</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === 'gallery' ? 'bg-[#FFB800] text-[#002260]' : 'bg-slate-100 text-slate-700'
                }`}>
                  {galleryList.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('email')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                  activeTab === 'email'
                    ? 'bg-[#003087] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFB800]" />
                <span>Email</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === 'email' ? 'bg-[#FFB800] text-[#002260]' : 'bg-slate-100 text-slate-700'
                }`}>
                  {emailLogs.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('messages')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                  activeTab === 'messages'
                    ? 'bg-[#003087] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFB800]" />
                <span>Pesan</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === 'messages' ? 'bg-[#FFB800] text-[#002260]' : 'bg-slate-100 text-slate-700'
                }`}>
                  {messages.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('photos')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                  activeTab === 'photos'
                    ? 'bg-[#003087] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <FolderTree className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFB800]" />
                <span>Foto</span>
              </button>

              <button
                onClick={() => setActiveTab('schedule')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                  activeTab === 'schedule'
                    ? 'bg-[#003087] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFB800]" />
                <span>Jadwal</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
              <button
                onClick={loadAllData}
                disabled={loading}
                className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 transition-all cursor-pointer flex items-center gap-1.5 text-xs shadow-xs"
                title="Perbarui data"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#003087]' : ''}`} />
                <span className="hidden md:inline">Refresh Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TAB 0: OVERVIEW & STATS */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Quick Metrics 6 Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4">
              {/* Card 1: News */}
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[11px] sm:text-xs text-slate-500 font-medium block truncate">Berita</span>
                  <div className="text-lg sm:text-2xl font-extrabold text-[#003087] font-heading mt-0.5">
                    {newsList.length}
                  </div>
                  <button
                    onClick={() => setActiveTab('news')}
                    className="text-[10px] sm:text-[11px] text-[#003087] font-semibold hover:underline mt-0.5 block truncate cursor-pointer"
                  >
                    Kelola &rarr;
                  </button>
                </div>
                <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-blue-50 text-[#003087] flex items-center justify-center flex-shrink-0">
                  <Newspaper className="w-4 h-4 sm:w-5 sm:h-5 text-[#003087]" />
                </div>
              </div>

              {/* Card 2: Announcements */}
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[11px] sm:text-xs text-slate-500 font-medium block truncate">Pengumuman</span>
                  <div className="text-lg sm:text-2xl font-extrabold text-[#003087] font-heading mt-0.5">
                    {announcements.length}
                  </div>
                  <button
                    onClick={() => setActiveTab('announcements')}
                    className="text-[10px] sm:text-[11px] text-[#003087] font-semibold hover:underline mt-0.5 block truncate cursor-pointer"
                  >
                    Kelola &rarr;
                  </button>
                </div>
                <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                </div>
              </div>

              {/* Card 3: Guru & Tenaga Kependidikan */}
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[11px] sm:text-xs text-slate-500 font-medium block truncate">Guru & GTK</span>
                  <div className="text-lg sm:text-2xl font-extrabold text-[#003087] font-heading mt-0.5">
                    {staffList.length}
                  </div>
                  <button
                    onClick={() => setActiveTab('staff')}
                    className="text-[10px] sm:text-[11px] text-[#003087] font-semibold hover:underline mt-0.5 block truncate cursor-pointer"
                  >
                    Atur &rarr;
                  </button>
                </div>
                <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                </div>
              </div>

              {/* Card 4: Galeri Foto */}
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[11px] sm:text-xs text-slate-500 font-medium block truncate">Galeri Foto</span>
                  <div className="text-lg sm:text-2xl font-extrabold text-[#003087] font-heading mt-0.5">
                    {galleryList.length}
                  </div>
                  <button
                    onClick={() => setActiveTab('gallery')}
                    className="text-[10px] sm:text-[11px] text-[#003087] font-semibold hover:underline mt-0.5 block truncate cursor-pointer"
                  >
                    Kelola &rarr;
                  </button>
                </div>
                <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                </div>
              </div>

              {/* Card 5: Email Endpoint Logs */}
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[11px] sm:text-xs text-slate-500 font-medium block truncate">Logs Email</span>
                  <div className="text-lg sm:text-2xl font-extrabold text-[#003087] font-heading mt-0.5">
                    {emailLogs.length}
                  </div>
                  <button
                    onClick={() => setActiveTab('email')}
                    className="text-[10px] sm:text-[11px] text-[#003087] font-semibold hover:underline mt-0.5 block truncate cursor-pointer"
                  >
                    Riwayat &rarr;
                  </button>
                </div>
                <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
              </div>

              {/* Card 6: Visitor Messages */}
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[11px] sm:text-xs text-slate-500 font-medium block truncate">Pesan Masuk</span>
                  <div className="text-lg sm:text-2xl font-extrabold text-[#003087] font-heading mt-0.5">
                    {messages.length}
                  </div>
                  <button
                    onClick={() => setActiveTab('messages')}
                    className="text-[10px] sm:text-[11px] text-[#003087] font-semibold hover:underline mt-0.5 block truncate cursor-pointer"
                  >
                    Kotak masuk &rarr;
                  </button>
                </div>
                <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
                </div>
              </div>
            </div>

            {/* Quick Actions & System Info Banner */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Quick Actions */}
              <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#003087] font-heading">
                    Aksi Cepat Pengelolaan
                  </h3>
                  <span className="text-xs text-slate-400">Pintasan tugas administrator</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <button
                    onClick={handleOpenAddNews}
                    className="p-3 rounded-xl border border-blue-100 bg-blue-50/60 hover:bg-blue-50 text-left transition-all cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#003087] text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                      <Plus className="w-4 h-4 text-[#FFB800]" />
                    </div>
                    <div className="font-bold text-xs text-[#003087] font-heading">Tambah Berita</div>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">Rilis kabar prestasi</p>
                  </button>

                  <button
                    onClick={handleOpenAddAnnouncement}
                    className="p-3 rounded-xl border border-amber-100 bg-amber-50/60 hover:bg-amber-50 text-left transition-all cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                      <Plus className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-xs text-amber-900 font-heading">Pengumuman</div>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">Edaran sekolah</p>
                  </button>

                  <button
                    onClick={handleOpenAddStaff}
                    className="p-3 rounded-xl border border-indigo-100 bg-indigo-50/60 hover:bg-indigo-50 text-left transition-all cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                      <Plus className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-xs text-indigo-900 font-heading">Guru & Tendik</div>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">Input profil GTK</p>
                  </button>

                  <button
                    onClick={handleOpenAddGallery}
                    className="p-3 rounded-xl border border-emerald-100 bg-emerald-50/60 hover:bg-emerald-50 text-left transition-all cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                    <div className="font-bold text-xs text-emerald-900 font-heading">Foto Galeri</div>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">Dokumentasi publik</p>
                  </button>

                  <button
                    onClick={() => setActiveTab('schedule')}
                    className="p-3 rounded-xl border border-blue-100 bg-sky-50/70 hover:bg-sky-100/70 text-left transition-all cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                      <Calendar className="w-4 h-4 text-[#FFB800]" />
                    </div>
                    <div className="font-bold text-xs text-blue-900 font-heading">Jadwal Kelas</div>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">Ubah jam & guru</p>
                  </button>

                  <button
                    onClick={() => setActiveTab('photos')}
                    className="p-3 rounded-xl border border-teal-100 bg-teal-50/60 hover:bg-teal-50 text-left transition-all cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                      <FolderTree className="w-4 h-4 text-[#FFB800]" />
                    </div>
                    <div className="font-bold text-xs text-teal-900 font-heading">Struktur Foto</div>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">Unggah & salin path</p>
                  </button>

                  <button
                    onClick={() => setActiveTab('email')}
                    className="p-3 rounded-xl border border-purple-100 bg-purple-50/60 hover:bg-purple-50 text-left transition-all cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-700 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                      <Send className="w-4 h-4 text-white" />
                    </div>
                    <div className="font-bold text-xs text-purple-900 font-heading">Notifikasi Email</div>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">Tes endpoint email</p>
                  </button>
                </div>

                {/* Recent News Preview List */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-heading">
                      Berita Terbaru Terpublikasi
                    </h4>
                    <button
                      onClick={() => setActiveTab('news')}
                      className="text-xs text-[#003087] font-semibold hover:underline"
                    >
                      Lihat Semua &rarr;
                    </button>
                  </div>

                  <div className="space-y-2">
                    {newsList.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0 pr-3">
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-[#003087] font-bold text-[10px] flex-shrink-0">
                            {item.category}
                          </span>
                          <span className="font-medium text-slate-800 truncate">{item.title}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[11px] text-slate-400 hidden sm:inline">{item.date}</span>
                          <button
                            onClick={() => handleOpenEditNews(item)}
                            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                            title="Edit Berita"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pengumuman Terbaru Box */}
              <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-[#003087]" />
                    <h3 className="text-base font-bold text-[#003087] font-heading">
                      Pengumuman Terbaru
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('announcements')}
                    className="text-xs text-[#003087] font-semibold hover:underline cursor-pointer"
                  >
                    Lihat Semua &rarr;
                  </button>
                </div>

                <div className="space-y-2.5">
                  {announcements.length === 0 ? (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-500">
                      Belum ada pengumuman tersimpan.
                    </div>
                  ) : (
                    announcements.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs hover:border-slate-200 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                            {item.targetAudience}
                          </span>
                          <span className="text-[10.5px] text-slate-400">{item.date}</span>
                        </div>
                        <p className="font-semibold text-slate-800 line-clamp-1">{item.title}</p>
                      </div>
                    ))
                  )}
                </div>

                <button
                  onClick={handleOpenAddAnnouncement}
                  className="w-full py-2.5 px-3 rounded-xl border border-dashed border-[#003087]/30 hover:border-[#003087] hover:bg-blue-50/50 text-[#003087] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Pengumuman Baru</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1: KELOLA BERITA */}
        {/* ========================================================= */}
        {activeTab === 'news' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Header & Controls */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
                {/* Search */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari berita sekolah..."
                    value={newsSearch}
                    onChange={(e) => setNewsSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#003087] bg-white"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={newsCategoryFilter}
                  onChange={(e) => setNewsCategoryFilter(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#003087] bg-white font-medium"
                >
                  <option value="Semua">Semua Kategori</option>
                  <option value="LKS & Prestasi">LKS & Prestasi</option>
                  <option value="Kegiatan PKL">Kegiatan PKL</option>
                  <option value="Kunjungan Industri">Kunjungan Industri</option>
                  <option value="Kegiatan Sekolah">Kegiatan Sekolah</option>
                </select>
              </div>

              {/* Add News Button */}
              <button
                onClick={handleOpenAddNews}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#003087] hover:bg-[#002260] text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer w-full sm:w-auto flex-shrink-0"
              >
                <Plus className="w-4 h-4 text-[#FFB800]" />
                <span>Tambah Berita Baru</span>
              </button>
            </div>

            {/* News List Table / Grid */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] font-heading">
                    <tr>
                      <th className="py-3 px-4">Cover</th>
                      <th className="py-3 px-4">Judul Berita</th>
                      <th className="py-3 px-4">Kategori</th>
                      <th className="py-3 px-4">Penulis & Tanggal</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredNews.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-10 text-center text-slate-400">
                          Tidak ada berita yang ditemukan.
                        </td>
                      </tr>
                    ) : (
                      filteredNews.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 w-20">
                            <div className="w-14 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </td>
                          <td className="py-3 px-4 max-w-md">
                            <div className="font-bold text-slate-900 line-clamp-1">{item.title}</div>
                            <p className="text-slate-500 line-clamp-1 text-[11px] mt-0.5">
                              {item.excerpt}
                            </p>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-[#003087] border border-blue-100">
                              {item.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                            <div className="font-medium text-slate-700">{item.author}</div>
                            <div className="text-[11px] text-slate-400">{item.date}</div>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap text-right space-x-1">
                            <button
                              onClick={() => handleOpenEditNews(item)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#003087] hover:text-white text-slate-700 transition-colors cursor-pointer inline-flex"
                              title="Edit berita"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() =>
                                setDeleteConfirm({
                                  type: 'news',
                                  id: item.id,
                                  title: item.title,
                                })
                              }
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 transition-colors cursor-pointer inline-flex"
                              title="Hapus berita"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: KELOLA PENGUMUMAN */}
        {/* ========================================================= */}
        {activeTab === 'announcements' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Header & Controls */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-600">Sasaran Penerima:</span>
                <div className="flex flex-wrap gap-1.5">
                  {['Semua', 'Siswa', 'Orang Tua', 'Alumni & DU/DI', 'Guru & Tendik'].map((aud) => (
                    <button
                      key={aud}
                      onClick={() => setAnnouncementFilter(aud)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        announcementFilter === aud
                          ? 'bg-[#003087] text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {aud}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleOpenAddAnnouncement}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer w-full sm:w-auto flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Pengumuman Baru</span>
              </button>
            </div>

            {/* Announcements List */}
            <div className="space-y-3">
              {filteredAnnouncements.map((ann) => (
                <div
                  key={ann.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#003087]/50 transition-all"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          ann.important
                            ? 'bg-rose-100 text-rose-700 border border-rose-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {ann.important ? 'Penting' : 'Informasi'}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-[#003087]">
                        Untuk: {ann.targetAudience}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {ann.date}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-slate-900 font-heading">
                      {ann.title}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {ann.content}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => handleOpenEditAnnouncement(ann)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-[#003087] hover:text-white text-slate-700 transition-colors cursor-pointer"
                      title="Edit pengumuman"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        setDeleteConfirm({
                          type: 'announcement',
                          id: ann.id,
                          title: ann.title,
                        })
                      }
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 transition-colors cursor-pointer"
                      title="Hapus pengumuman"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2.5: GURU & TENAGA KEPENDIDIKAN (GTK) */}
        {/* ========================================================= */}
        {activeTab === 'staff' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Header Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Pangkalan Data Kepegawaian
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Total: {staffList.length} Personel
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#003087] font-heading">
                  Kelola Guru & Tenaga Kependidikan (GTK)
                </h3>
                <p className="text-xs text-slate-500">
                  Atur daftar profil guru pengampu, ketua program keahlian, guru normatif/adaptif, serta staf administrasi dan teknisi sekolah.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleOpenAddStaff}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#003087] hover:bg-[#002266] text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#FFB800]" />
                  <span>Tambah Guru / Tendik</span>
                </button>
              </div>
            </div>

            {/* Quick GTK Statistics Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
              <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Total GTK</span>
                <span className="text-xl font-bold text-[#003087] font-heading">{staffList.length}</span>
                <span className="text-[10px] text-slate-500 block">Personel terdaftar</span>
              </div>
              <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Pimpinan</span>
                <span className="text-xl font-bold text-amber-600 font-heading">
                  {staffList.filter((s) => s.category === 'Pimpinan').length}
                </span>
                <span className="text-[10px] text-slate-500 block">Kepsek & Wakil</span>
              </div>
              <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Guru Produktif</span>
                <span className="text-xl font-bold text-emerald-600 font-heading">
                  {staffList.filter((s) => s.category === 'Produktif').length}
                </span>
                <span className="text-[10px] text-slate-500 block">6 Kompetensi Keahlian</span>
              </div>
              <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Normatif Adaptif</span>
                <span className="text-xl font-bold text-blue-600 font-heading">
                  {staffList.filter((s) => s.category === 'Normatif Adaptif').length}
                </span>
                <span className="text-[10px] text-slate-500 block">Mapel Umum & BK</span>
              </div>
              <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs col-span-2 sm:col-span-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Tendik & TU</span>
                <span className="text-xl font-bold text-purple-600 font-heading">
                  {staffList.filter((s) => s.category === 'Tenaga Kependidikan').length}
                </span>
                <span className="text-[10px] text-slate-500 block">Administrasi & Lab</span>
              </div>
            </div>

            {/* Filter Bar & View Switcher */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari nama, NIP, mapel, jabatan..."
                    value={staffSearch}
                    onChange={(e) => setStaffSearch(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#003087]"
                  />
                  {staffSearch && (
                    <button
                      onClick={() => setStaffSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      &times;
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-1">
                  {['Semua', 'Pimpinan', 'Produktif', 'Normatif Adaptif', 'Tenaga Kependidikan'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setStaffCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        staffCategoryFilter === cat
                          ? 'bg-[#003087] text-white'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                <select
                  value={staffStatusFilter}
                  onChange={(e) => setStaffStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-[#003087]"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="PNS">PNS</option>
                  <option value="PPPK">PPPK</option>
                  <option value="GTT">GTT / Honorer</option>
                  <option value="PTY">PTY</option>
                </select>

                <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
                  <button
                    onClick={() => setStaffViewMode('grid')}
                    className={`p-1.5 rounded-md text-xs cursor-pointer ${
                      staffViewMode === 'grid'
                        ? 'bg-white shadow-2xs text-[#003087] font-semibold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Tampilan Grid Kartu"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setStaffViewMode('table')}
                    className={`p-1.5 rounded-md text-xs cursor-pointer ${
                      staffViewMode === 'table'
                        ? 'bg-white shadow-2xs text-[#003087] font-semibold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Tampilan Tabel Data"
                  >
                    <TableIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* List / Table Render */}
            {filteredStaff.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-base font-bold text-slate-800 font-heading">
                  Tidak Ada Data GTK yang Sesuai
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                  Kriteria pencarian atau filter kategori yang dipilih belum memiliki data yang cocok.
                </p>
                <button
                  onClick={handleOpenAddStaff}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#003087] text-white text-xs font-semibold hover:bg-[#002266] cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#FFB800]" />
                  <span>Tambah Guru / Tendik Baru</span>
                </button>
              </div>
            ) : staffViewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredStaff.map((staff) => (
                  <div
                    key={staff.id}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:border-[#003087]/50 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-52 bg-slate-100 overflow-hidden relative">
                        <img
                          src={staff.photo || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=500'}
                          alt={staff.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=500';
                          }}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#003087]/90 text-white backdrop-blur-xs">
                            {staff.category}
                          </span>
                        </div>
                        {staff.statusKepegawaian && (
                          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/90 text-white backdrop-blur-xs">
                            {staff.statusKepegawaian}
                          </span>
                        )}
                      </div>

                      <div className="p-4 space-y-2">
                        <div>
                          <h4 className="font-bold text-[#003087] text-sm font-heading leading-tight line-clamp-2">
                            {staff.name}
                          </h4>
                          <p className="text-xs text-amber-600 font-semibold mt-0.5">
                            {staff.role}
                          </p>
                        </div>

                        <div className="space-y-1 text-[11px] text-slate-600 border-t border-slate-100 pt-2">
                          <div className="flex items-center gap-1.5 text-slate-700">
                            <Briefcase className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <span className="line-clamp-1">{staff.majorOrSubject}</span>
                          </div>

                          {staff.nip && staff.nip !== '-' && (
                            <div className="font-mono text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                              {staff.nip}
                            </div>
                          )}

                          {staff.education && (
                            <div className="text-[10px] text-slate-500">
                              Pendidikan: {staff.education}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleOpenEditStaff(staff)}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-white border border-slate-200 hover:bg-[#003087] hover:text-white text-[#003087] text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Data</span>
                      </button>
                      <button
                        onClick={() =>
                          setDeleteConfirm({
                            type: 'staff',
                            id: staff.id,
                            title: staff.name,
                          })
                        }
                        className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 hover:bg-rose-600 hover:text-white text-rose-600 transition-all cursor-pointer"
                        title="Hapus data GTK"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Nama Lengkap & NIP</th>
                        <th className="py-3 px-4">Jabatan / Tugas</th>
                        <th className="py-3 px-4">Kategori</th>
                        <th className="py-3 px-4">Bidang Studi / Unit</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredStaff.map((staff) => (
                        <tr key={staff.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={staff.photo || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=500'}
                                alt={staff.name}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=500';
                                }}
                                className="w-10 h-10 rounded-full object-cover border border-slate-200 flex-shrink-0"
                              />
                              <div>
                                <span className="font-bold text-[#003087] font-heading block">
                                  {staff.name}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {staff.nip && staff.nip !== '-' ? staff.nip : 'NIP / NUPTK belum diisi'}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-slate-800">{staff.role}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                staff.category === 'Pimpinan'
                                  ? 'bg-amber-100 text-amber-800'
                                  : staff.category === 'Produktif'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : staff.category === 'Tenaga Kependidikan'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {staff.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            {staff.majorOrSubject}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                              {staff.statusKepegawaian || 'PNS'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditStaff(staff)}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#003087] hover:text-white text-slate-700 transition-colors cursor-pointer"
                                title="Edit profil"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() =>
                                  setDeleteConfirm({
                                    type: 'staff',
                                    id: staff.id,
                                    title: staff.name,
                                  })
                                }
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 transition-colors cursor-pointer"
                                title="Hapus GTK"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: KELOLA GALERI DOKUMENTASI FOTO SEKOLAH */}
        {/* ========================================================= */}
        {activeTab === 'gallery' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Top Action Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider mb-1">
                  <Camera className="w-3 h-3 text-emerald-600" />
                  <span>Galeri Publik Website</span>
                </div>
                <h3 className="text-lg font-bold text-[#003087] font-heading">
                  Kelola Galeri & Dokumentasi Foto
                </h3>
                <p className="text-xs text-slate-500">
                  Atur foto dokumentasi praktik bengkel/lab, kegiatan kesiswaan, kunjungan industri, dan kegiatan guru yang tampil di menu Galeri.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleOpenAddGallery}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#003087] hover:bg-[#002266] text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4 text-[#FFB800]" />
                  <span>Tambah Foto Dokumentasi</span>
                </button>
              </div>
            </div>

            {/* Quick Gallery Statistics Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Total Dokumentasi</div>
                <div className="text-xl font-bold text-[#003087] font-heading mt-0.5">{galleryList.length}</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Praktik Lab/Bengkel</div>
                <div className="text-xl font-bold text-blue-600 font-heading mt-0.5">
                  {galleryList.filter((g) => g.category === 'Praktik Bengkel/Lab').length}
                </div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Kegiatan Siswa</div>
                <div className="text-xl font-bold text-amber-600 font-heading mt-0.5">
                  {galleryList.filter((g) => g.category === 'Kegiatan Siswa').length}
                </div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Kunjungan Industri</div>
                <div className="text-xl font-bold text-indigo-600 font-heading mt-0.5">
                  {galleryList.filter((g) => g.category === 'Kunjungan Industri').length}
                </div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Guru & Tendik</div>
                <div className="text-xl font-bold text-emerald-600 font-heading mt-0.5">
                  {galleryList.filter((g) => g.category === 'Guru & Tendik').length}
                </div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Kategori Lainnya</div>
                <div className="text-xl font-bold text-purple-600 font-heading mt-0.5">
                  {galleryList.filter((g) => !['Praktik Bengkel/Lab', 'Kegiatan Siswa', 'Kunjungan Industri', 'Guru & Tendik'].includes(g.category)).length}
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari judul / keterangan foto..."
                    value={gallerySearch}
                    onChange={(e) => setGallerySearch(e.target.value)}
                    className="w-full pl-8 pr-7 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#003087]"
                  />
                  {gallerySearch && (
                    <button
                      onClick={() => setGallerySearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      &times;
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-1">
                  {['Semua', 'Praktik Bengkel/Lab', 'Kegiatan Siswa', 'Kunjungan Industri', 'Guru & Tendik', 'Teaching Factory (TEFA)', 'Prestasi & Lomba'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setGalleryCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        galleryCategoryFilter === cat
                          ? 'bg-[#003087] text-white'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
                  <button
                    onClick={() => setGalleryViewMode('grid')}
                    className={`p-1.5 rounded-md text-xs cursor-pointer ${
                      galleryViewMode === 'grid'
                        ? 'bg-white shadow-2xs text-[#003087] font-semibold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Tampilan Grid Kartu"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setGalleryViewMode('table')}
                    className={`p-1.5 rounded-md text-xs cursor-pointer ${
                      galleryViewMode === 'table'
                        ? 'bg-white shadow-2xs text-[#003087] font-semibold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Tampilan Tabel Data"
                  >
                    <TableIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* List / Table Render */}
            {filteredGallery.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
                <Camera className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-base font-bold text-slate-800 font-heading">
                  Tidak Ada Foto Galeri yang Sesuai
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                  Kriteria pencarian atau filter kategori yang dipilih belum memiliki data yang cocok.
                </p>
                <button
                  onClick={handleOpenAddGallery}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#003087] text-white text-xs font-semibold hover:bg-[#002266] cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#FFB800]" />
                  <span>Tambah Foto Dokumentasi Baru</span>
                </button>
              </div>
            ) : galleryViewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredGallery.map((photo) => (
                  <div
                    key={photo.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                      <img
                        src={photo.imageUrl}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800';
                        }}
                      />
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#003087]/90 text-white backdrop-blur-xs shadow-2xs">
                        {photo.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => setGalleryLightboxPhoto(photo)}
                        className="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg bg-black/50 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                        title="Lihat ukuran penuh"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{photo.date || 'Dokumentasi Sekolah'}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm line-clamp-2 font-heading group-hover:text-[#003087] transition-colors">
                          {photo.title}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {photo.caption || (photo as any).description || 'Dokumentasi kegiatan SMK Negeri 1 Ujung Batu.'}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => setGalleryLightboxPhoto(photo)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-[#003087] cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Pratinjau</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditGallery(photo)}
                            className="p-1.5 rounded-lg bg-blue-50 hover:bg-[#003087] hover:text-white text-[#003087] transition-colors cursor-pointer"
                            title="Edit foto"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirm({
                                type: 'gallery',
                                id: photo.id,
                                title: photo.title,
                              })
                            }
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 transition-colors cursor-pointer"
                            title="Hapus foto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-3.5 sm:p-4">Foto</th>
                        <th className="p-3.5 sm:p-4">Judul & Keterangan</th>
                        <th className="p-3.5 sm:p-4">Kategori</th>
                        <th className="p-3.5 sm:p-4">Tanggal</th>
                        <th className="p-3.5 sm:p-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredGallery.map((photo) => (
                        <tr key={photo.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 sm:p-4 w-20">
                            <div
                              onClick={() => setGalleryLightboxPhoto(photo)}
                              className="w-16 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 cursor-pointer hover:opacity-90 transition-opacity"
                            >
                              <img
                                src={photo.imageUrl}
                                alt={photo.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=400';
                                }}
                              />
                            </div>
                          </td>
                          <td className="p-3 sm:p-4 max-w-sm">
                            <div className="font-bold text-slate-800 text-xs sm:text-sm font-heading">
                              {photo.title}
                            </div>
                            <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {photo.caption || (photo as any).description}
                            </div>
                          </td>
                          <td className="p-3 sm:p-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#003087]/10 text-[#003087]">
                              {photo.category}
                            </span>
                          </td>
                          <td className="p-3 sm:p-4 text-slate-500 text-[11px] whitespace-nowrap">
                            {photo.date || '-'}
                          </td>
                          <td className="p-3 sm:p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditGallery(photo)}
                                className="p-1.5 rounded-lg bg-blue-50 hover:bg-[#003087] hover:text-white text-[#003087] transition-colors cursor-pointer"
                                title="Edit foto"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() =>
                                  setDeleteConfirm({
                                    type: 'gallery',
                                    id: photo.id,
                                    title: photo.title,
                                  })
                                }
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 transition-colors cursor-pointer"
                                title="Hapus foto"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: KIRIM EMAIL ENDPOINT */}
        {/* ========================================================= */}
        {activeTab === 'email' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-150">
            {/* Form Send Email */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
              <div>
                <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider block font-heading">
                  ENDPOINT POST /api/send-email
                </span>
                <h3 className="text-lg font-bold text-[#003087] font-heading mt-0.5">
                  Formulir Dispatch Email Notifikasi
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Kirim email edaran atau notifikasi resmi melalui backend Express sekolah.
                </p>
              </div>

              <form onSubmit={handleSendEmailSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Alamat Email Penerima *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      required
                      placeholder="tujuan@email.com"
                      value={emailFormData.to}
                      onChange={(e) => setEmailFormData({ ...emailFormData, to: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-600"
                    />
                    <button
                      type="button"
                      onClick={() => setEmailFormData({ ...emailFormData, to: 'smkn1_uba@yahoo.com' })}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold whitespace-nowrap cursor-pointer"
                    >
                      Set Email Sekolah
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Subjek Email *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: [Pemberitahuan] Jadwal Pertemuan Industri"
                    value={emailFormData.subject}
                    onChange={(e) => setEmailFormData({ ...emailFormData, subject: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Pengirim (Sender Header)
                  </label>
                  <input
                    type="text"
                    value={emailFormData.sender}
                    onChange={(e) => setEmailFormData({ ...emailFormData, sender: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-600 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Isi Konten Pesan Email *
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Tuliskan isi pesan pengumuman..."
                    value={emailFormData.body}
                    onChange={(e) => setEmailFormData({ ...emailFormData, body: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-600 leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sendingEmail}
                  className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  <span>{sendingEmail ? 'Memproses Dispatch Email...' : 'Kirim Email via Endpoint'}</span>
                </button>
              </form>
            </div>

            {/* Email Outgoing Logs */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-800 font-heading">
                  Riwayat Email Terkirim (Logs)
                </h4>
                <span className="text-[11px] text-slate-400">{emailLogs.length} Terkirim</span>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {emailLogs.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">Belum ada riwayat email.</p>
                ) : (
                  emailLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 truncate">{log.to}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {log.status}
                        </span>
                      </div>
                      <div className="font-medium text-[#003087] text-[11px] truncate">
                        {log.subject}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2">
                        {log.body}
                      </p>
                      <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                        {new Date(log.sentAt).toLocaleString('id-ID')}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: PESAN MASUK PENGUNJUNG */}
        {/* ========================================================= */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#003087] font-heading">
                  Pesan Masuk dari Pengunjung Website
                </h3>
                <p className="text-xs text-slate-500">
                  Formulir kontak yang dikirim oleh masyarakat, calon mitra DU/DI, dan orang tua siswa.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-[#003087] rounded-full">
                {messages.length} Pesan
              </span>
            </div>

            <div className="space-y-3">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Belum ada pesan masuk saat ini.
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 hover:border-[#003087] transition-all text-xs"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{msg.name}</div>
                        <div className="text-slate-500 text-[11px]">
                          Email: <strong className="text-slate-700">{msg.email}</strong> | Telp:{' '}
                          <strong className="text-slate-700">{msg.phone}</strong>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        {msg.subject}
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-100 text-slate-700 leading-relaxed">
                      {msg.message}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>Diterima: {new Date(msg.createdAt).toLocaleString('id-ID')}</span>
                      <a
                        href={`mailto:${msg.email}?subject=Balasan: ${encodeURIComponent(msg.subject)}`}
                        className="inline-flex items-center gap-1 text-[#003087] font-semibold hover:underline"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Balas via Email</span>
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: STRUKTUR & DATA FOTO */}
        {/* ========================================================= */}
        {activeTab === 'photos' && (
          <div className="animate-in fade-in duration-150">
            <PhotoManagerTab />
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: KELOLA JADWAL PELAJARAN */}
        {/* ========================================================= */}
        {activeTab === 'schedule' && (
          <div className="animate-in fade-in duration-150">
            <ScheduleManagerTab />
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* MODAL: TAMBAH / EDIT BERITA */}
      {/* ========================================================= */}
      {isNewsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setIsNewsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-[#003087]" />
              <h3 className="text-lg font-bold text-[#003087] font-heading">
                {editingNews ? 'Edit Berita Sekolah' : 'Tambah Berita Sekolah Baru'}
              </h3>
            </div>

            <form onSubmit={handleSaveNews} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Judul Berita *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Siswa SMKN 1 Ujung Batu Juara LKS Vokasi"
                  value={newsFormData.title}
                  onChange={(e) => setNewsFormData({ ...newsFormData, title: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#003087]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori Berita</label>
                  <select
                    value={newsFormData.category}
                    onChange={(e) => setNewsFormData({ ...newsFormData, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#003087] bg-white"
                  >
                    <option value="LKS & Prestasi">LKS & Prestasi</option>
                    <option value="Kegiatan PKL">Kegiatan PKL</option>
                    <option value="Kunjungan Industri">Kunjungan Industri</option>
                    <option value="Kegiatan Sekolah">Kegiatan Sekolah</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Penulis / Sumber</label>
                  <input
                    type="text"
                    value={newsFormData.author}
                    onChange={(e) => setNewsFormData({ ...newsFormData, author: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#003087]"
                  />
                </div>
              </div>

              {/* Cover Image Uploader & Directory Picker */}
              <div>
                <AdminImagePicker
                  category="berita"
                  value={newsFormData.image}
                  onChange={(url) => setNewsFormData({ ...newsFormData, image: url })}
                  label="Gambar Cover Berita"
                  helpText="Upload file gambar dari perangkat langsung ke public/images/berita/ atau pilih dari struktur direktori."
                  aspectRatio="video"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Ringkasan Singkat (Excerpt)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ringkasan 1-2 kalimat untuk kartu berita..."
                  value={newsFormData.excerpt}
                  onChange={(e) => setNewsFormData({ ...newsFormData, excerpt: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#003087]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Isi Lengkap Berita *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Tuliskan isi berita secara lengkap..."
                  value={newsFormData.content}
                  onChange={(e) => setNewsFormData({ ...newsFormData, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#003087] leading-relaxed"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#003087] hover:bg-[#002260] text-white font-bold cursor-pointer"
                >
                  {editingNews ? 'Simpan Perubahan' : 'Terbitkan Berita'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: TAMBAH / EDIT PENGUMUMAN */}
      {/* ========================================================= */}
      {isAnnouncementModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setIsAnnouncementModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-bold text-[#003087] font-heading">
                {editingAnnouncement ? 'Edit Pengumuman Sekolah' : 'Buat Pengumuman Baru'}
              </h3>
            </div>

            <form onSubmit={handleSaveAnnouncement} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Judul Pengumuman *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Jadwal Ujian Akhir Semester Ganjil"
                  value={announcementFormData.title}
                  onChange={(e) =>
                    setAnnouncementFormData({ ...announcementFormData, title: e.target.value })
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#003087]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Sasaran Penerima *
                  </label>
                  <select
                    value={announcementFormData.targetAudience}
                    onChange={(e) =>
                      setAnnouncementFormData({
                        ...announcementFormData,
                        targetAudience: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#003087] bg-white font-medium"
                  >
                    <option value="Siswa">Siswa</option>
                    <option value="Orang Tua">Orang Tua</option>
                    <option value="Guru & Tendik">Guru & Tendik</option>
                    <option value="Alumni & DU/DI">Alumni & DU/DI</option>
                    <option value="Umum">Masyarakat Umum</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tanggal Rilis
                  </label>
                  <input
                    type="text"
                    value={announcementFormData.date}
                    onChange={(e) =>
                      setAnnouncementFormData({ ...announcementFormData, date: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#003087]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200">
                <input
                  type="checkbox"
                  id="important-check"
                  checked={announcementFormData.important}
                  onChange={(e) =>
                    setAnnouncementFormData({
                      ...announcementFormData,
                      important: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-amber-600 rounded cursor-pointer"
                />
                <label htmlFor="important-check" className="font-semibold text-amber-900 cursor-pointer">
                  Tandai sebagai Pengumuman Penting / Prioritas
                </label>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Isi Surat Edaran / Pengumuman *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Jelaskan rincian pengumuman..."
                  value={announcementFormData.content}
                  onChange={(e) =>
                    setAnnouncementFormData({ ...announcementFormData, content: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#003087] leading-relaxed"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAnnouncementModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer"
                >
                  {editingAnnouncement ? 'Simpan Perubahan' : 'Terbitkan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT GURU & TENAGA KEPENDIDIKAN (GTK) */}
      {/* ========================================================= */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-150 overflow-hidden">
            {/* PINNED HEADER */}
            <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold shrink-0">
                  <GraduationCap className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#003087] font-heading">
                    {editingStaff ? 'Edit Data Guru / Tendik' : 'Tambah Guru & Tendik Baru'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Lengkapi identitas resmi, penugasan kejuruan, status kepegawaian, kontak, dan foto profil.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsStaffModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 cursor-pointer transition-all"
                title="Tutup formulir"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SCROLLABLE BODY */}
            <form id="staff-modal-form" onSubmit={handleSaveStaff} className="p-5 sm:p-6 space-y-5 text-xs overflow-y-auto flex-1 overscroll-contain">
              {/* SECTION 1: IDENTITAS PENDIDIK & KEPEGAWAIAN */}
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/90 space-y-3">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider pb-1 border-b border-slate-200">
                  <User className="w-3.5 h-3.5 text-[#003087]" />
                  <span>1. Identitas Lengkap & Kepegawaian</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Nama Lengkap & Gelar Pendidik *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Drs. H. Sabaruddin, M.M."
                      value={staffFormData.name}
                      onChange={(e) =>
                        setStaffFormData({ ...staffFormData, name: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#003087] focus:ring-1 focus:ring-[#003087]/20 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      NIP / NUPTK / NIK
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 19690815 199501 1 002 (atau -)"
                      value={staffFormData.nip}
                      onChange={(e) =>
                        setStaffFormData({ ...staffFormData, nip: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#003087] focus:ring-1 focus:ring-[#003087]/20 bg-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Kategori GTK *
                    </label>
                    <select
                      value={staffFormData.category}
                      onChange={(e) =>
                        setStaffFormData({
                          ...staffFormData,
                          category: e.target.value as any,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#003087] bg-white font-medium"
                    >
                      <option value="Produktif">Guru Produktif (Kejuruan)</option>
                      <option value="Pimpinan">Pimpinan Sekolah (Kepsek / Waka)</option>
                      <option value="Normatif Adaptif">Guru Normatif & Adaptif (Umum / BK)</option>
                      <option value="Tenaga Kependidikan">Tenaga Kependidikan (TU / Lab / Teknisi)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Status Kepegawaian *
                    </label>
                    <select
                      value={staffFormData.statusKepegawaian}
                      onChange={(e) =>
                        setStaffFormData({
                          ...staffFormData,
                          statusKepegawaian: e.target.value as any,
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#003087] bg-white font-medium"
                    >
                      <option value="PNS">Pegawai Negeri Sipil (PNS)</option>
                      <option value="PPPK">PPPK (P3K)</option>
                      <option value="GTT">GTT (Guru Tidak Tetap)</option>
                      <option value="Honorer">Honorer / Tenaga Kontrak</option>
                      <option value="PTY">Pegawai Tetap Yayasan (PTY)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 2: PENUGASAN & MAPEL */}
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/90 space-y-3">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider pb-1 border-b border-slate-200">
                  <Briefcase className="w-3.5 h-3.5 text-[#003087]" />
                  <span>2. Jabatan & Mata Pelajaran Diampu</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Jabatan / Tugas Utama *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Ketua Program Keahlian Teknik Otomotif"
                      value={staffFormData.role}
                      onChange={(e) =>
                        setStaffFormData({ ...staffFormData, role: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#003087] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Bidang Keahlian / Mata Pelajaran / Unit Kerja
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Pemeliharaan Mesin Kendaraan Ringan"
                      value={staffFormData.majorOrSubject}
                      onChange={(e) =>
                        setStaffFormData({ ...staffFormData, majorOrSubject: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#003087] bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: KUALIFIKASI PENDIDIKAN & KONTAK */}
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/90 space-y-3">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider pb-1 border-b border-slate-200">
                  <Phone className="w-3.5 h-3.5 text-[#003087]" />
                  <span>3. Kualifikasi Pendidikan & Kontak Resmi</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Pendidikan Terakhir
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: S1 Pend. Teknik Otomotif"
                      value={staffFormData.education}
                      onChange={(e) =>
                        setStaffFormData({ ...staffFormData, education: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#003087] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      No. WhatsApp / Telepon
                    </label>
                    <input
                      type="text"
                      placeholder="081234567890"
                      value={staffFormData.phone}
                      onChange={(e) =>
                        setStaffFormData({ ...staffFormData, phone: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#003087] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Email Resmi / Dinas
                    </label>
                    <input
                      type="email"
                      placeholder="guru@smkn1ujungbatu.sch.id"
                      value={staffFormData.email}
                      onChange={(e) =>
                        setStaffFormData({ ...staffFormData, email: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#003087] bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: FOTO RESMI GTK */}
              <div>
                <AdminImagePicker
                  category="guru"
                  value={staffFormData.photo}
                  onChange={(url) => setStaffFormData({ ...staffFormData, photo: url })}
                  label="Foto Profil Guru / Tendik"
                  helpText="Upload file pas foto dari perangkat langsung ke public/images/guru/ atau pilih dari katalog folder sekolah."
                  aspectRatio="portrait"
                />
              </div>

              {/* SECTION 5: LIVE PREVIEW KARTU PROFIL GTK */}
              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#003087] font-bold">
                  <span>Pratinjau Tampilan Kartu di Website:</span>
                  <span className="text-[10px] font-normal text-slate-500">Live Preview</span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3.5">
                  <div className="w-16 h-20 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0 shadow-2xs flex items-center justify-center">
                    {staffFormData.photo ? (
                      <img
                        src={staffFormData.photo}
                        alt={staffFormData.name || 'Guru'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=500';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center text-slate-300">
                        <User className="w-7 h-7 text-slate-300" />
                        <span className="text-[9px] text-slate-400 mt-0.5">Pas Foto</span>
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#003087] text-white">
                        {staffFormData.category}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        {staffFormData.statusKepegawaian}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm truncate font-heading">
                      {staffFormData.name || 'Nama Guru / Tendik'}
                    </h4>

                    <p className="text-[11px] text-amber-600 font-semibold truncate">
                      {staffFormData.role || 'Jabatan / Tugas Utama'}
                    </p>

                    <p className="text-[10px] text-slate-500 truncate">
                      {staffFormData.majorOrSubject || 'Mata Pelajaran'} • {staffFormData.education || 'Pendidikan'}
                    </p>

                    {staffFormData.nip && staffFormData.nip !== '-' && (
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 inline-block">
                        {staffFormData.nip}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </form>

            {/* PINNED FOOTER */}
            <div className="px-5 py-3.5 sm:px-6 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 shrink-0 bg-slate-50">
              <button
                type="button"
                onClick={() => setIsStaffModalOpen(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <X className="w-4 h-4" />
                <span>Batal</span>
              </button>
              <button
                type="submit"
                form="staff-modal-form"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#003087] hover:bg-[#002266] text-white font-extrabold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 font-heading active:scale-[0.98]"
              >
                <Check className="w-4 h-4 text-[#FFB800]" />
                <span>{editingStaff ? 'Simpan Perubahan GTK' : 'Simpan & Daftarkan GTK'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: TAMBAH / EDIT FOTO DOKUMENTASI GALERI */}
      {/* ========================================================= */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-150 overflow-hidden">
            {/* PINNED HEADER */}
            <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                  <Camera className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#003087] font-heading">
                    {editingGalleryPhoto ? 'Edit Foto Dokumentasi Galeri' : 'Tambah Foto Dokumentasi Galeri'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Foto akan otomatis tampil di menu Galeri publik dan halaman dokumentasi sekolah.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsGalleryModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 cursor-pointer transition-all"
                title="Tutup formulir"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SCROLLABLE FORM BODY */}
            <form id="gallery-modal-form" onSubmit={handleSaveGallery} className="p-5 sm:p-6 space-y-5 text-xs overflow-y-auto flex-1 overscroll-contain">
              {/* FIELD 1: JUDUL DOKUMENTASI */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Judul Foto Dokumentasi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Praktik Pengelasan SMAW di Bengkel Teknik Otomotif"
                  value={galleryFormData.title}
                  onChange={(e) =>
                    setGalleryFormData({ ...galleryFormData, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#003087] focus:ring-1 focus:ring-[#003087]/20 bg-white font-medium"
                />
              </div>

              {/* FIELD 2 & 3: KATEGORI & TANGGAL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kategori Galeri *
                  </label>
                  <select
                    value={galleryFormData.category}
                    onChange={(e) =>
                      setGalleryFormData({ ...galleryFormData, category: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#003087] bg-white font-medium"
                  >
                    <option value="Praktik Bengkel/Lab">Praktik Bengkel/Lab</option>
                    <option value="Kegiatan Siswa">Kegiatan Siswa</option>
                    <option value="Kunjungan Industri">Kunjungan Industri</option>
                    <option value="Guru & Tendik">Guru & Tendik</option>
                    <option value="Teaching Factory (TEFA)">Teaching Factory (TEFA)</option>
                    <option value="Prestasi & Lomba">Prestasi & Lomba</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tanggal Kegiatan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 15 Maret 2026"
                    value={galleryFormData.date}
                    onChange={(e) =>
                      setGalleryFormData({ ...galleryFormData, date: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#003087] bg-white"
                  />
                </div>
              </div>

              {/* FIELD 4: DESKRIPSI / CAPTION */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Keterangan Singkat / Caption Dokumentasi
                </label>
                <textarea
                  rows={3}
                  placeholder="Ceritakan ringkasan aktivitas, fasilitas yang digunakan, atau konteks foto..."
                  value={galleryFormData.caption}
                  onChange={(e) =>
                    setGalleryFormData({ ...galleryFormData, caption: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#003087] bg-white leading-relaxed"
                />
              </div>

              {/* FIELD 5: FOTO IMAGE PICKER */}
              <div>
                <AdminImagePicker
                  category="galeri"
                  value={galleryFormData.imageUrl}
                  onChange={(url) => setGalleryFormData({ ...galleryFormData, imageUrl: url })}
                  label="Pilih / Unggah Foto Dokumentasi"
                  helpText="Unggah file foto langsung ke struktur public/images/galeri/ atau pilih dari katalog folder sekolah."
                  aspectRatio="video"
                />
              </div>

              {/* FIELD 6: LIVE PREVIEW KARTU GALERI */}
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-emerald-800 font-bold">
                  <span>Pratinjau Tampilan di Menu Galeri:</span>
                  <span className="text-[10px] font-normal text-slate-500">Live Preview</span>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs max-w-sm">
                  <div className="relative h-40 bg-slate-100 overflow-hidden">
                    {galleryFormData.imageUrl ? (
                      <img
                        src={galleryFormData.imageUrl}
                        alt={galleryFormData.title || 'Galeri'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-50">
                        <Camera className="w-8 h-8 text-slate-300" />
                        <span className="text-[10px] text-slate-400 mt-1">Belum Memilih Foto</span>
                      </div>
                    )}
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-[#003087]/90 text-white">
                      {galleryFormData.category}
                    </span>
                  </div>

                  <div className="p-3 space-y-1">
                    <h5 className="font-bold text-slate-900 text-xs truncate font-heading">
                      {galleryFormData.title || 'Judul Foto Dokumentasi'}
                    </h5>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {galleryFormData.caption || 'Keterangan dokumentasi kegiatan SMKN 1 Ujung Batu...'}
                    </p>
                  </div>
                </div>
              </div>
            </form>

            {/* PINNED FOOTER */}
            <div className="px-5 py-3.5 sm:px-6 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 shrink-0 bg-slate-50">
              <button
                type="button"
                onClick={() => setIsGalleryModalOpen(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <X className="w-4 h-4" />
                <span>Batal</span>
              </button>
              <button
                type="submit"
                form="gallery-modal-form"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#003087] hover:bg-[#002266] text-white font-extrabold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 font-heading active:scale-[0.98]"
              >
                <Save className="w-4 h-4 text-[#FFB800]" />
                <span>{editingGalleryPhoto ? 'Simpan Perubahan' : 'Terbitkan ke Galeri'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: LIGHTBOX ZOOM GALERI */}
      {/* ========================================================= */}
      {galleryLightboxPhoto && (
        <div
          onClick={() => setGalleryLightboxPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-slate-900 text-white rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          >
            <button
              onClick={() => setGalleryLightboxPhoto(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center cursor-pointer transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={galleryLightboxPhoto.imageUrl}
                alt={galleryLightboxPhoto.title}
                className="w-full h-full max-h-[70vh] object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200';
                }}
              />
            </div>

            <div className="p-5 sm:p-6 bg-slate-900 border-t border-white/10 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FFB800] text-[#002260]">
                  {galleryLightboxPhoto.category}
                </span>
                {galleryLightboxPhoto.date && (
                  <span className="text-xs text-slate-400">
                    {galleryLightboxPhoto.date}
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white font-heading">
                {galleryLightboxPhoto.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {galleryLightboxPhoto.caption || (galleryLightboxPhoto as any).description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DELETE CONFIRMATION DIALOG */}
      {/* ========================================================= */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-center animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 font-heading">
              Konfirmasi Hapus Data
            </h4>
            <p className="text-xs text-slate-600">
              Apakah Anda yakin ingin menghapus{' '}
              {deleteConfirm.type === 'news'
                ? 'berita'
                : deleteConfirm.type === 'announcement'
                ? 'pengumuman'
                : deleteConfirm.type === 'staff'
                ? 'data guru / tendik'
                : 'foto dokumentasi galeri'}{' '}
              <strong className="text-slate-800">"{deleteConfirm.title}"</strong>? Data akan dihapus secara permanen dari sistem.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (deleteConfirm.type === 'news') {
                    handleDeleteNews(deleteConfirm.id);
                  } else if (deleteConfirm.type === 'announcement') {
                    handleDeleteAnnouncement(deleteConfirm.id);
                  } else if (deleteConfirm.type === 'staff') {
                    handleDeleteStaff(deleteConfirm.id);
                  } else if (deleteConfirm.type === 'gallery') {
                    handleDeleteGallery(deleteConfirm.id);
                  }
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
