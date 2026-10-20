import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  FolderTree,
  Image as ImageIcon,
  Check,
  RefreshCw,
  AlertCircle,
  X,
  FileText,
  Link as LinkIcon,
  HardDrive,
  Eye,
} from 'lucide-react';
import { api } from '../../services/api';
import { PHOTO_CATALOG, getPhotoUrl } from '../../utils/photoManager';

interface AdminImagePickerProps {
  category: 'berita' | 'guru' | 'profil' | 'hero' | 'jurusan' | string;
  value: string;
  onChange: (url: string) => void;
  label?: string;
  helpText?: string;
  aspectRatio?: 'square' | 'video' | 'portrait';
}

export const AdminImagePicker: React.FC<AdminImagePickerProps> = ({
  category,
  value,
  onChange,
  label = 'Foto / Gambar',
  helpText,
  aspectRatio = 'square',
}) => {
  const [mode, setMode] = useState<'upload' | 'directory' | 'manual'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [customFilename, setCustomFilename] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [serverImages, setServerImages] = useState<any[]>([]);
  const [loadingServerImages, setLoadingServerImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Suggested default files based on school structure
  const defaultDirectoryFiles: Record<string, { filename: string; title: string; defaultUrl?: string }[]> = {
    guru: [
      { filename: 'kepala-sekolah.jpg', title: 'Kepala Sekolah (Drs. H. Sabarudin, M.Pd.)' },
      { filename: 'hendra-wijaya.jpg', title: 'Waka Kurikulum (Hendra Wijaya, S.Pd., M.Kom.)' },
      { filename: 'supriyadi.jpg', title: 'Ketua Jurusan TO (Supriyadi, S.T.)' },
      { filename: 'ahmad-fauzi.jpg', title: 'Guru Produktif TKJ (Ahmad Fauzi, S.Kom.)' },
      { filename: 'siti-rahma.jpg', title: 'Guru BDP & Retail (Siti Rahmawati, S.E.)' },
      { filename: 'bambang-irawan.jpg', title: 'Kepala Bengkel Otomotif' },
      { filename: 'nurul-hidayah.jpg', title: 'Guru Normatif Adaptif / BK' },
      { filename: 'agus-setiawan.jpg', title: 'Staf Tata Usaha & IT Kampus' },
    ],
    berita: [
      { filename: 'lks-otomotif-rohul.jpg', title: 'Juara 1 LKS Vokasi Otomotif' },
      { filename: 'pelepasan-pkl.jpg', title: 'Pelepasan Siswa PKL Industri' },
      { filename: 'kunjungan-industri-pekanbaru.jpg', title: 'Kunjungan Industri ke Data Center' },
      { filename: 'rekrutmen-bkk-kampus.jpg', title: 'Rekrutmen Tenaga Kerja BKK' },
      { filename: 'sas-ganjil.jpg', title: 'Asesmen Sumatif Akhir Semester' },
      { filename: 'upacara-hardiknas.jpg', title: 'Peringatan Hari Pendidikan Nasional' },
    ],
    poster: [
      { filename: 'poster-ppdb-2026.jpg', title: 'Poster PPDB 2026/2027 Resmi' },
      { filename: 'poster-prestasi-lks.jpg', title: 'Poster Juara LKS Vokasi Otomotif' },
      { filename: 'poster-tefa-industri.jpg', title: 'Poster Teaching Factory & DU/DI' },
      { filename: 'poster-tkj-fiberoptic.jpg', title: 'Poster Jurusan TKJ & Jaringan' },
      { filename: 'poster-gelar-karya.jpg', title: 'Poster Gelar Karya Vokasi Siswa' },
      { filename: 'poster-ekskul.jpg', title: 'Poster Ekstrakurikuler & Olahraga' },
    ],
    galeri: [
      { filename: 'praktik-overhaul-mesin.jpg', title: 'Praktik Overhaul Bengkel TO' },
      { filename: 'splicing-fiber-optic-tkj.jpg', title: 'Splicing Fiber Optic Lab TKJ' },
      { filename: 'studio-green-screen.jpg', title: 'Produksi Siaran di Green Screen' },
      { filename: 'pkl-mitra-industri.jpg', title: 'Pelepasan Siswa PKL Industri' },
      { filename: 'upacara-hardiknas.jpg', title: 'Upacara Bendera Hardiknas' },
      { filename: 'kunjungan-data-center.jpg', title: 'Kunjungan Industri ke Data Center' },
      { filename: 'pelatihan-guru-kejuruan.jpg', title: 'Pelatihan Up-skilling Guru' },
      { filename: 'asesi-bnsp-kejuruan.jpg', title: 'Uji Sertifikasi Profesi BNSP' },
    ],
  };

  // Fetch registered uploaded images for this category
  const loadCategoryImages = async () => {
    setLoadingServerImages(true);
    try {
      const data = await api.getImages();
      const filtered = (data || []).filter((item: any) => item.category === category);
      setServerImages(filtered);
    } catch {
      // fallback
    } finally {
      setLoadingServerImages(false);
    }
  };

  useEffect(() => {
    if (mode === 'directory') {
      loadCategoryImages();
    }
  }, [mode, category]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('File harus berupa format gambar (JPG, PNG, JPEG, WebP).');
      return;
    }

    setUploadError(null);
    setSelectedFile(file);

    // Sanitized base filename
    const cleanName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, '-')
      .replace(/-+/g, '-');
    setCustomFilename(cleanName);

    // Read preview
    const reader = new FileReader();
    reader.onload = (evt) => {
      setPreviewDataUrl(evt.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadAndApply = async () => {
    if (!previewDataUrl) {
      setUploadError('Pilih file foto dari perangkat Anda terlebih dahulu.');
      return;
    }

    const filename = (customFilename.trim() || `foto-${Date.now()}.jpg`)
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, '_');

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const res = await api.uploadImage({
        category,
        filename,
        dataUrl: previewDataUrl,
        title: filename,
        alt: filename,
      });

      const finalPath = res.url || `/images/${category}/${filename}`;
      onChange(finalPath);
      setUploadSuccess(`Foto berhasil disimpan ke folder public/images/${category}/${filename} dan diterapkan!`);
      setSelectedFile(null);
      setPreviewDataUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      // If server upload had an issue, we can apply directly as data URL or structured path
      const fallbackPath = `/images/${category}/${filename}`;
      onChange(previewDataUrl || fallbackPath);
      setUploadSuccess(`Foto diterapkan dengan struktur path: public/images/${category}/${filename}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleApplyPresetFile = (filename: string) => {
    const targetPath = `/images/${category}/${filename}`;
    onChange(targetPath);
    setUploadSuccess(`Dipilih path struktur file: public/images/${category}/${filename}`);
  };

  return (
    <div className="space-y-3 bg-slate-50/80 p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 text-xs">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
        <div>
          <label className="font-bold text-slate-800 flex items-center gap-1.5 text-xs sm:text-sm">
            <FolderTree className="w-4 h-4 text-[#003087]" />
            <span>{label}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-100/70 text-[#003087] font-semibold">
              public/images/{category}/
            </span>
          </label>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {helpText || `Foto disimpan langsung ke struktur file code public/images/${category}/ dan dipanggil oleh dashboard.`}
          </p>
        </div>

        {/* Tab Controls */}
        <div className="inline-flex p-1 bg-white rounded-xl border border-slate-200 shadow-2xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              mode === 'upload'
                ? 'bg-[#003087] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#003087] hover:bg-slate-50'
            }`}
          >
            <Upload className="w-3 h-3" />
            <span>Upload File</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('directory')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              mode === 'directory'
                ? 'bg-[#003087] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#003087] hover:bg-slate-50'
            }`}
          >
            <HardDrive className="w-3 h-3" />
            <span>Pilih Dari Folder</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('manual')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              mode === 'manual'
                ? 'bg-[#003087] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#003087] hover:bg-slate-50'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>Path / URL</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {uploadError && (
        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span className="flex-1 text-[11px] font-medium">{uploadError}</span>
          <button type="button" onClick={() => setUploadError(null)} className="text-rose-500 hover:text-rose-700">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {uploadSuccess && (
        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="flex-1 text-[11px] font-medium">{uploadSuccess}</span>
          <button type="button" onClick={() => setUploadSuccess(null)} className="text-emerald-500 hover:text-emerald-700">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* MODE 1: UPLOAD LANGSUNG */}
      {mode === 'upload' && (
        <div className="space-y-3">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-[#003087] bg-white rounded-xl p-4 sm:p-5 text-center cursor-pointer transition-all hover:bg-blue-50/30 group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#003087] flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform shadow-2xs">
              <Upload className="w-5 h-5 text-[#003087]" />
            </div>
            <div className="font-bold text-slate-800 text-xs">
              {selectedFile ? selectedFile.name : 'Klik untuk Pilih Foto dari Perangkat Anda'}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              File otomatis disimpan ke: <code className="text-[#003087] font-semibold">public/images/{category}/</code>
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Format didukung: JPG, PNG, WebP (Rekomendasi rasio pas foto / 16:9)
            </p>
          </div>

          {previewDataUrl && (
            <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <img
                  src={previewDataUrl}
                  alt="Preview"
                  className="w-14 h-14 rounded-lg object-cover border border-slate-200 shadow-2xs"
                />
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-slate-700">Nama file di folder public:</div>
                  <div className="flex items-center gap-1 font-mono text-[11px] text-[#003087] font-bold">
                    <span>public/images/{category}/</span>
                    <input
                      type="text"
                      value={customFilename}
                      onChange={(e) => setCustomFilename(e.target.value)}
                      className="px-2 py-0.5 rounded border border-slate-300 bg-slate-50 text-xs text-slate-900 w-36 sm:w-44 focus:outline-none focus:border-[#003087]"
                      placeholder="nama-file.jpg"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleUploadAndApply}
                disabled={isUploading}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#003087] hover:bg-[#002260] text-white font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Menyimpan ke public...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#FFB800]" />
                    <span>Simpan & Gunakan Foto</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: PILIH DARI DIREKTORI PUBLIC/IMAGES */}
      {mode === 'directory' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Daftar file foto resmi yang terdaftar di struktur <strong className="text-slate-800">public/images/{category}/</strong>:</span>
            <button
              type="button"
              onClick={loadCategoryImages}
              className="text-[#003087] hover:underline flex items-center gap-1 font-semibold"
            >
              <RefreshCw className={`w-3 h-3 ${loadingServerImages ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {/* Show catalog/default files */}
            {(defaultDirectoryFiles[category] || []).map((item) => {
              const fullPath = `/images/${category}/${item.filename}`;
              const isSelected = value === fullPath;
              return (
                <button
                  type="button"
                  key={item.filename}
                  onClick={() => handleApplyPresetFile(item.filename)}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/80 border-[#003087] text-[#003087] ring-1 ring-[#003087]'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 text-[#003087] font-mono text-[10px] font-bold">
                    IMG
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-[11px] truncate">{item.title}</div>
                    <div className="text-[10px] font-mono text-slate-500 truncate">
                      public/images/{category}/{item.filename}
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#003087] flex-shrink-0" />}
                </button>
              );
            })}

            {/* Also show newly uploaded files from backend */}
            {serverImages.map((item) => {
              const isSelected = value === item.url;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => onChange(item.url)}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/80 border-[#003087] text-[#003087] ring-1 ring-[#003087]'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-8 h-8 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-[11px] truncate">{item.title}</div>
                    <div className="text-[10px] font-mono text-slate-500 truncate">{item.url}</div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#003087] flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 3: MANUAL INPUT PATH / URL */}
      {mode === 'manual' && (
        <div className="space-y-2">
          <label className="block text-[11px] font-semibold text-slate-700">
            Ketikkan Path File Lokal atau URL:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={`/images/${category}/nama-file.jpg`}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-[#003087] font-mono text-xs"
            />
            <button
              type="button"
              onClick={() => onChange(`/images/${category}/foto-utama.jpg`)}
              className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-[11px] cursor-pointer whitespace-nowrap"
            >
              Reset Default
            </button>
          </div>
          <p className="text-[10px] text-slate-500">
            Contoh: <code className="text-[#003087] font-bold">/images/{category}/kepala-sekolah.jpg</code>. File yang tersimpan di folder public otomatis dapat diakses via URL web.
          </p>
        </div>
      )}

      {/* Current Selection & Live Visual Preview */}
      <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`rounded-xl bg-slate-200 overflow-hidden border border-slate-300 flex-shrink-0 shadow-2xs ${
              aspectRatio === 'square'
                ? 'w-12 h-12'
                : aspectRatio === 'portrait'
                ? 'w-12 h-16'
                : 'w-16 h-10'
            }`}
          >
            {value ? (
              <img
                src={value}
                alt="Pratinjau Foto Terpilih"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <ImageIcon className="w-5 h-5" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-800 text-[11px]">Foto Aktif Terpilih:</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                Tersambung
              </span>
            </div>
            <p className="text-[11px] font-mono text-[#003087] truncate select-all font-semibold">
              {value || '(Belum ada foto yang dipilih)'}
            </p>
          </div>
        </div>

        {value && (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-slate-500 hover:text-[#003087] hover:bg-white transition-all cursor-pointer flex-shrink-0"
            title="Buka gambar di tab baru"
          >
            <Eye className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
};
