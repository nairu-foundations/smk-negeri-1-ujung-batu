import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  FolderTree,
  Code,
  Copy,
  Check,
  Image as ImageIcon,
  Search,
  ExternalLink,
  Info,
  CheckCircle2,
  FileCode,
  Layers,
  Upload,
  ArrowUpRight,
  Trash2,
  Plus,
  RefreshCw,
  Eye,
  Send,
  AlertCircle,
  X,
} from 'lucide-react';
import { PHOTO_CATALOG, PhotoAsset, getPhotoUrl, PhotoCategory } from '../../utils/photoManager';
import { SchoolImage } from '../common/SchoolImage';
import { api } from '../../services/api';

export const PhotoManagerTab: React.FC = () => {
  // Navigation inside tab: 'catalog' | 'upload' | 'connections'
  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'upload' | 'connections'>('catalog');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  // Upload Form State
  const [uploadCategory, setUploadCategory] = useState<string>('galeri/praktik');
  const [uploadFilename, setUploadFilename] = useState<string>('');
  const [uploadTitle, setUploadTitle] = useState<string>('');
  const [uploadAlt, setUploadAlt] = useState<string>('');
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadFileSize, setUploadFileSize] = useState<string>('');
  const [uploadConnectToGallery, setUploadConnectToGallery] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Dynamic uploaded images from backend
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const [loadingImages, setLoadingImages] = useState<boolean>(false);

  // Notification Toast
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Playground Generator State
  const [testCategory, setTestCategory] = useState<PhotoCategory>('jurusan');
  const [testFilename, setTestFilename] = useState('tkj.jpg');
  const [testAlt, setTestAlt] = useState('Teknik Komputer & Jaringan');

  const showNotice = (type: 'success' | 'error', message: string) => {
    setNotice({ type, message });
    setTimeout(() => setNotice(null), 3800);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(text);
    showNotice('success', `Berhasil disalin: ${text}`);
    setTimeout(() => setCopiedSnippet(null), 2200);
  };

  // Fetch uploaded images list from backend
  const fetchUploadedImages = async () => {
    setLoadingImages(true);
    try {
      const data = await api.getImages();
      setUploadedImages(data);
    } catch (err) {
      console.warn('Failed to fetch images from backend', err);
    } finally {
      setLoadingImages(false);
    }
  };

  useEffect(() => {
    fetchUploadedImages();
  }, []);

  // Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showNotice('error', 'File yang dipilih harus berupa file gambar (JPG, PNG, WebP).');
      return;
    }

    const cleanName = file.name.toLowerCase().replace(/[^a-z0-9._-]/g, '-');
    setUploadFilename(cleanName);
    setUploadTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    setUploadAlt(file.name.replace(/\.[^/.]+$/, ''));
    setUploadFileSize(`${Math.round(file.size / 1024)} KB`);

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Submit Upload
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadPreview || !uploadFilename.trim()) {
      showNotice('error', 'Silakan pilih file gambar dan tentukan nama file terlebih dahulu.');
      return;
    }

    setIsUploading(true);
    try {
      const result = await api.uploadImage({
        category: uploadCategory,
        filename: uploadFilename.trim(),
        dataUrl: uploadPreview,
        title: uploadTitle.trim() || uploadFilename.trim(),
        alt: uploadAlt.trim() || uploadFilename.trim(),
        applyTo: uploadConnectToGallery ? 'gallery' : undefined,
      });

      showNotice(
        'success',
        `Foto "${uploadFilename}" berhasil diunggah ke public/images/${uploadCategory}/ dan tersambung ke website!`
      );

      // Reset form
      setUploadPreview(null);
      setUploadFilename('');
      setUploadTitle('');
      setUploadAlt('');
      setUploadFileSize('');
      if (fileInputRef.current) fileInputRef.current.value = '';

      // Refresh list
      fetchUploadedImages();
      setActiveSubTab('catalog');
    } catch (err: any) {
      showNotice('error', err.message || 'Gagal mengunggah foto');
    } finally {
      setIsUploading(false);
    }
  };

  // Connect to live gallery
  const handleConnectToGallery = async (photo: {
    title: string;
    category: string;
    url: string;
    description?: string;
  }) => {
    try {
      let galCategory = 'Dokumentasi Sekolah';
      if (photo.category.includes('praktik')) galCategory = 'Praktik Kejuruan';
      else if (photo.category.includes('kegiatan')) galCategory = 'Kegiatan Siswa';
      else if (photo.category.includes('industri')) galCategory = 'Kunjungan Industri';
      else if (photo.category.includes('guru')) galCategory = 'Pelatihan & Guru';

      await api.addGalleryPhoto({
        title: photo.title,
        category: galCategory,
        imageUrl: photo.url,
        description: photo.description || `Foto dokumentasi yang tersimpan di direktori public/images/${photo.category}.`,
      });
      showNotice(
        'success',
        `Foto "${photo.title}" berhasil disambungkan ke Galeri Publik website!`
      );
    } catch (err: any) {
      showNotice('error', err.message || 'Gagal menyambungkan ke Galeri');
    }
  };

  // Delete uploaded image
  const handleDeleteUploadedImage = async (id: string, filename: string) => {
    if (!confirm(`Hapus foto "${filename}" dari folder public/images/ dan sistem?`)) return;
    try {
      await api.deleteImage(id);
      showNotice('success', `Foto "${filename}" berhasil dihapus.`);
      fetchUploadedImages();
    } catch (err: any) {
      showNotice('error', err.message || 'Gagal menghapus foto');
    }
  };

  // Combined Catalog (Default Catalog + User Uploaded Images)
  const combinedCatalog = useMemo(() => {
    const formattedUploads: PhotoAsset[] = uploadedImages.map((up) => ({
      id: up.id,
      category: up.category as any,
      filename: up.filename,
      localPath: up.url,
      fallbackUrl: up.url,
      title: up.title || up.filename,
      description: `Diunggah oleh admin (${up.fileSize || 'Local'}) ke public/images/${up.category}/`,
      tags: ['uploaded', up.category],
    }));

    // Avoid duplicates if same localPath
    const existingPaths = new Set(formattedUploads.map((u) => u.localPath));
    const defaults = PHOTO_CATALOG.filter((p) => !existingPaths.has(p.localPath));

    return [...formattedUploads, ...defaults];
  }, [uploadedImages]);

  const filteredCatalog = useMemo(() => {
    return combinedCatalog.filter((item) => {
      const matchCat = selectedCategory === 'Semua' || item.category === selectedCategory;
      const matchSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.localPath.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.tags && item.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())));
      return matchCat && matchSearch;
    });
  }, [combinedCatalog, selectedCategory, searchTerm]);

  const categoriesList: { id: string; label: string; count: number }[] = [
    { id: 'Semua', label: 'Semua Kategori', count: combinedCatalog.length },
    { id: 'profil', label: 'Profil & Pimpinan', count: combinedCatalog.filter((p) => p.category === 'profil').length },
    { id: 'hero', label: 'Hero Banners', count: combinedCatalog.filter((p) => p.category === 'hero').length },
    { id: 'jurusan', label: 'Program Keahlian', count: combinedCatalog.filter((p) => p.category === 'jurusan').length },
    { id: 'galeri/praktik', label: 'Praktik Bengkel/Lab', count: combinedCatalog.filter((p) => p.category === 'galeri/praktik').length },
    { id: 'galeri/kegiatan', label: 'Kegiatan Siswa', count: combinedCatalog.filter((p) => p.category === 'galeri/kegiatan').length },
    { id: 'galeri/industri', label: 'Kunjungan Industri & PKL', count: combinedCatalog.filter((p) => p.category === 'galeri/industri').length },
    { id: 'galeri/guru', label: 'Pelatihan Guru', count: combinedCatalog.filter((p) => p.category === 'galeri/guru').length },
    { id: 'guru', label: 'Pas Foto GTK', count: combinedCatalog.filter((p) => p.category === 'guru').length },
    { id: 'berita', label: 'Foto Berita', count: combinedCatalog.filter((p) => p.category === 'berita').length },
    { id: 'ekskul', label: 'Ekstrakurikuler', count: combinedCatalog.filter((p) => p.category === 'ekskul').length },
  ];

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

      {/* Header Info */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#003087] flex items-center justify-center flex-shrink-0">
              <FolderTree className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  Struktur Folder & Manajemen Foto Terhubung
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  Live Sync Active
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                Struktur folder <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono text-[11px]">public/images/</code> kini terhubung langsung dengan panel admin. Unggah foto baru untuk langsung tersimpan di direktori fisik server dan tampil seketika di website.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveSubTab('upload')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#003087] hover:bg-[#002260] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Unggah Foto ke Folder</span>
            </button>

            <button
              onClick={() => copyToClipboard('public/images/')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Salin Root Path</span>
            </button>
          </div>
        </div>

        {/* Sub-Tabs Navigation */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-100 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('catalog')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'catalog'
                ? 'bg-[#003087] text-white shadow-2xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Katalog Foto ({combinedCatalog.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('upload')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'upload'
                ? 'bg-[#003087] text-white shadow-2xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Form Unggah ke public/images/</span>
          </button>

          <button
            onClick={() => setActiveSubTab('connections')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'connections'
                ? 'bg-[#003087] text-white shadow-2xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Panduan & Integrasi Kode</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: UPLOAD FOTO KE FOLDER PUBLIC/IMAGES/ */}
      {activeSubTab === 'upload' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-600" />
                <span>Unggah Foto Langsung ke Struktur Direktori public/images/</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Foto yang diunggah akan otomatis disimpan di folder tujuan di server dan dapat dipanggil langsung via URL <code className="text-blue-700 font-mono">/images/...</code>
              </p>
            </div>
            <button
              onClick={() => setActiveSubTab('catalog')}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Lihat Katalog
            </button>
          </div>

          <form onSubmit={handleUploadSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left Column: Target Folder & Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pilih Subfolder Tujuan di public/images/
                  </label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/60"
                  >
                    <option value="galeri/praktik">📁 public/images/galeri/praktik/ (Praktik Bengkel/Lab)</option>
                    <option value="galeri/kegiatan">📁 public/images/galeri/kegiatan/ (Kegiatan Siswa)</option>
                    <option value="galeri/industri">📁 public/images/galeri/industri/ (Kunjungan Industri & PKL)</option>
                    <option value="galeri/guru">📁 public/images/galeri/guru/ (Pelatihan & Guru)</option>
                    <option value="hero">📁 public/images/hero/ (Banner Hero Beranda)</option>
                    <option value="profil">📁 public/images/profil/ (Foto Kepala Sekolah & Fasilitas)</option>
                    <option value="jurusan">📁 public/images/jurusan/ (6 Program Keahlian)</option>
                    <option value="guru">📁 public/images/guru/ (Pas Foto Dewan Guru & Tendik)</option>
                    <option value="berita">📁 public/images/berita/ (Foto Berita & Agenda)</option>
                    <option value="ekskul">📁 public/images/ekskul/ (Ekstrakurikuler Siswa)</option>
                    <option value="logo">📁 public/images/logo/ (Logo & Favicon)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama File (Filename)
                  </label>
                  <input
                    type="text"
                    value={uploadFilename}
                    onChange={(e) => setUploadFilename(e.target.value)}
                    placeholder="Contoh: bengkel-mesin-cnc.jpg"
                    className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    required
                  />
                  <p className="text-[10.5px] text-slate-500 mt-1">
                    Path tersimpan: <code className="text-blue-700 font-bold font-mono">public/images/{uploadCategory}/{uploadFilename || 'nama-file.jpg'}</code>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Judul Foto / Label Deskripsi
                  </label>
                  <input
                    type="text"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="Contoh: Praktik Pemrograman PLC di Lab Otomasi"
                    className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Teks Alternatif (Alt Text)
                  </label>
                  <input
                    type="text"
                    value={uploadAlt}
                    onChange={(e) => setUploadAlt(e.target.value)}
                    placeholder="Deskripsi singkat gambar untuk aksesibilitas"
                    className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Auto Connect to Live Gallery Checkbox */}
                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="connectToGallery"
                    checked={uploadConnectToGallery}
                    onChange={(e) => setUploadConnectToGallery(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 mt-0.5"
                  />
                  <div>
                    <label htmlFor="connectToGallery" className="text-xs font-bold text-blue-950 cursor-pointer">
                      Otomatis Sambungkan ke Halaman Galeri Publik
                    </label>
                    <p className="text-[11px] text-blue-800/80 leading-relaxed mt-0.5">
                      Jika dicentang, pengunjung website dapat langsung melihat foto ini pada halaman Galeri & Dokumentasi Sekolah secara real-time.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: File Dropzone & Preview */}
              <div className="flex flex-col justify-between">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pilih File Foto
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 text-center cursor-pointer transition-all bg-slate-50/50 hover:bg-blue-50/20"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {uploadPreview ? (
                      <div className="space-y-3">
                        <div className="relative h-48 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                          <img
                            src={uploadPreview}
                            alt="Pratinjau"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900/80 text-white">
                            {uploadFileSize}
                          </div>
                        </div>
                        <p className="text-xs text-blue-600 font-semibold">
                          Klik untuk mengganti file foto
                        </p>
                      </div>
                    ) : (
                      <div className="py-8 space-y-2">
                        <div className="w-12 h-12 rounded-full bg-blue-100 text-[#003087] flex items-center justify-center mx-auto mb-2">
                          <Upload className="w-6 h-6" />
                        </div>
                        <p className="text-xs font-bold text-slate-800">
                          Klik untuk memilih foto dari komputer
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Mendukung file JPG, PNG, WebP (Rekomendasi rasio 16:9 atau 4:3)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setUploadPreview(null);
                      setUploadFilename('');
                    }}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading || !uploadPreview}
                    className="px-6 py-2.5 rounded-xl bg-[#003087] hover:bg-[#002260] disabled:bg-slate-300 text-white text-xs font-semibold shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    {isUploading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Menyimpan ke Server...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Unggah & Simpan ke public/images/</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* SUB-TAB 2: CATALOG & FILTER */}
      {activeSubTab === 'catalog' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                <span>Katalog Foto Terdaftar & Terunggah ({filteredCatalog.length} item)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Foto di folder <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">public/images/</code> yang aktif dan tersambung ke komponen website.
              </p>
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari foto, folder, nama file..."
                className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {categoriesList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                  selectedCategory === cat.id
                    ? 'bg-[#003087] border-[#003087] text-white shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>

          {/* Grid Kartu Foto */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
            {filteredCatalog.map((photo: PhotoAsset) => {
              const isUserUploaded = photo.tags?.includes('uploaded');
              const rootUrl = `/images/${photo.category}/${photo.filename}`;

              return (
                <div
                  key={photo.id}
                  className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Thumbnail dengan SchoolImage Fallback */}
                    <div className="relative h-40 bg-slate-100 overflow-hidden">
                      <SchoolImage
                        src={photo.localPath}
                        fallback={photo.fallbackUrl}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 flex items-center gap-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                          {photo.category}
                        </span>
                        {isUserUploaded && (
                          <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-emerald-600 text-white shadow-2xs">
                            Unggahan
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-3">
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-1 mb-1">
                        {photo.title}
                      </h4>
                      <div className="font-mono text-[10.5px] text-blue-700 bg-blue-50/80 px-1.5 py-0.5 rounded truncate border border-blue-100 mb-1.5 flex items-center justify-between">
                        <span className="truncate">{rootUrl}</span>
                        <button
                          onClick={() => copyToClipboard(rootUrl)}
                          className="hover:text-blue-900 ml-1 p-0.5 flex-shrink-0"
                          title="Salin path URL"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      {photo.description && (
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {photo.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-3 pt-0 space-y-2 border-t border-slate-100 mt-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() =>
                          handleConnectToGallery({
                            title: photo.title,
                            category: photo.category,
                            url: photo.localPath || rootUrl,
                            description: photo.description,
                          })
                        }
                        className="flex-1 text-[10.5px] font-semibold py-1 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        title="Tambahkan foto ini ke halaman galeri publik"
                      >
                        <Plus className="w-3 h-3 text-emerald-600" />
                        <span>Pasang di Galeri</span>
                      </button>

                      <button
                        onClick={() =>
                          copyToClipboard(
                            `<SchoolImage category="${photo.category}" filename="${photo.filename}" alt="${photo.title}" className="w-full h-64 object-cover rounded-xl" />`
                          )
                        }
                        className="text-[10.5px] font-semibold py-1 px-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Salin tag SchoolImage"
                      >
                        <Code className="w-3 h-3" />
                        <span>Tag</span>
                      </button>

                      {isUserUploaded && (
                        <button
                          onClick={() => handleDeleteUploadedImage(photo.id, photo.filename)}
                          className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Hapus foto dari server"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: INTEGRATION & VISUAL DIRECTORY TREE */}
      {activeSubTab === 'connections' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Kolom Kiri: Visual Tree Struktur Folder (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-900 text-slate-200 rounded-2xl p-5 shadow-sm font-mono text-xs overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <FolderTree className="w-4 h-4" />
                  <span>Pohon Direktori (public/images/)</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-sans font-semibold">Tersambung ke Server</span>
              </div>

              <div className="space-y-1.5 leading-relaxed text-[11.5px] max-h-[380px] overflow-y-auto pr-1">
                <div className="text-emerald-400 font-semibold">📁 public/</div>
                <div className="pl-3 text-sky-300 font-semibold">└── 📁 images/</div>
                
                <div className="pl-7 space-y-1 text-slate-300">
                  <div>├── 📁 <span className="text-amber-300 font-semibold">logo/</span> <span className="text-slate-500 text-[10.5px]">→ logo smkn1.png, logo-smkn1.png</span></div>
                  <div>├── 📁 <span className="text-amber-300 font-semibold">hero/</span> <span className="text-slate-500 text-[10.5px]">→ banner-utama.jpg, banner-lab.jpg</span></div>
                  <div>├── 📁 <span className="text-amber-300 font-semibold">profil/</span> <span className="text-slate-500 text-[10.5px]">→ kepala-sekolah.jpg, sarpras.jpg</span></div>
                  <div>├── 📁 <span className="text-amber-300 font-semibold">jurusan/</span> <span className="text-slate-500 text-[10.5px]">→ tkj.jpg, to.jpg, bdp.jpg, te.jpg, bp.jpg</span></div>
                  <div>├── 📁 <span className="text-emerald-300 font-semibold">galeri/</span></div>
                  <div className="pl-6 space-y-0.5 text-slate-400 text-[11px]">
                    <div>├── 📁 <span className="text-teal-300">praktik/</span> <span className="text-slate-500">→ bengkel-to.jpg, lab-tkj.jpg</span></div>
                    <div>├── 📁 <span className="text-teal-300">kegiatan/</span> <span className="text-slate-500">→ upacara.jpg, classmeeting.jpg</span></div>
                    <div>├── 📁 <span className="text-teal-300">industri/</span> <span className="text-slate-500">→ ki-pekanbaru.jpg, pkl.jpg</span></div>
                    <div>└── 📁 <span className="text-teal-300">guru/</span> <span className="text-slate-500">→ pelatihan.jpg, rapat.jpg</span></div>
                  </div>
                  <div>├── 📁 <span className="text-amber-300 font-semibold">guru/</span> <span className="text-slate-500 text-[10.5px]">→ pas foto pimpinan, dewan guru, tendik</span></div>
                  <div>├── 📁 <span className="text-amber-300 font-semibold">berita/</span> <span className="text-slate-500 text-[10.5px]">→ artikel kegiatan & agenda</span></div>
                  <div>└── 📁 <span className="text-amber-300 font-semibold">ekskul/</span> <span className="text-slate-500 text-[10.5px]">→ robotik.jpg, paskibra.jpg</span></div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-sans text-slate-400 flex items-center justify-between">
              <span>Path URL publik: <code className="text-sky-300">/images/[kategori]/[file]</code></span>
            </div>
          </div>

          {/* Kolom Kanan: Generator Snippet Kode Interaktif (7 Cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-800">Generator Kode Pemanggilan Foto</h3>
                </div>
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Type-Safe
                </span>
              </div>

              {/* Input Form Generator */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                    Kategori Folder
                  </label>
                  <select
                    value={testCategory}
                    onChange={(e) => setTestCategory(e.target.value as PhotoCategory)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white"
                  >
                    <option value="profil">profil</option>
                    <option value="hero">hero</option>
                    <option value="jurusan">jurusan</option>
                    <option value="galeri/praktik">galeri/praktik</option>
                    <option value="galeri/kegiatan">galeri/kegiatan</option>
                    <option value="galeri/industri">galeri/industri</option>
                    <option value="galeri/guru">galeri/guru</option>
                    <option value="guru">guru</option>
                    <option value="berita">berita</option>
                    <option value="ekskul">ekskul</option>
                    <option value="logo">logo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                    Nama File
                  </label>
                  <input
                    type="text"
                    value={testFilename}
                    onChange={(e) => setTestFilename(e.target.value)}
                    placeholder="misal: tkj.jpg"
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                    Alt Text
                  </label>
                  <input
                    type="text"
                    value={testAlt}
                    onChange={(e) => setTestAlt(e.target.value)}
                    placeholder="Deskripsi foto"
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              {/* Generated Snippets */}
              <div className="space-y-3">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-slate-700">
                      1. Helper Fungsi Terpusat (getPhotoUrl)
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(`getPhotoUrl('${testCategory}', '${testFilename}')`)
                      }
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Salin</span>
                    </button>
                  </div>
                  <pre className="font-mono text-[11.5px] text-[#003087] bg-white p-2 rounded border border-slate-200/70 overflow-x-auto">
                    {`getPhotoUrl('${testCategory}', '${testFilename}')`}
                  </pre>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-slate-700">
                      2. Komponen Gambar Aman (&lt;SchoolImage /&gt;)
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `<SchoolImage category="${testCategory}" filename="${testFilename}" alt="${testAlt}" className="w-full h-56 object-cover rounded-xl" />`
                        )
                      }
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Salin Komponen</span>
                    </button>
                  </div>
                  <pre className="font-mono text-[11px] text-slate-800 bg-white p-2 rounded border border-slate-200/70 overflow-x-auto">
{`<SchoolImage
  category="${testCategory}"
  filename="${testFilename}"
  alt="${testAlt}"
  className="w-full h-56 object-cover rounded-xl"
/>`}
                  </pre>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Resolusi rekomendasi: Banner 1920x1080 | Jurusan/Galeri 1200x800 | Guru 600x800</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
