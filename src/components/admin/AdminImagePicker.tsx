import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Check,
  RefreshCw,
  AlertCircle,
  X,
  Link as LinkIcon,
  Eye,
} from 'lucide-react';
import { api } from '../../services/api';

interface AdminImagePickerProps {
  category: 'berita' | 'guru' | 'profil' | 'hero' | 'jurusan' | 'galeri' | string;
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
  const [mode, setMode] = useState<'upload' | 'manual'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [customFilename, setCustomFilename] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

    // Read preview and immediately apply so the image change is captured by the parent form
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      setPreviewDataUrl(dataUrl);
      if (dataUrl) {
        onChange(dataUrl);
      }
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
      setUploadSuccess(`Foto berhasil disimpan dan diterapkan!`);
      setSelectedFile(null);
      setPreviewDataUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch {
      // Fallback: apply as previewDataUrl or direct path
      const fallbackPath = `/images/${category}/${filename}`;
      onChange(previewDataUrl || fallbackPath);
      setUploadSuccess(`Foto berhasil diterapkan.`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
        <div>
          <label className="font-semibold text-slate-800 flex items-center gap-1.5 text-xs">
            <ImageIcon className="w-3.5 h-3.5 text-[#003087]" />
            <span>{label}</span>
          </label>
          {helpText && <p className="text-[11px] text-slate-500 mt-0.5">{helpText}</p>}
        </div>

        {/* Tab Controls: Upload vs URL */}
        <div className="inline-flex p-0.5 bg-slate-100 rounded-lg self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
              mode === 'upload'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3 h-3 text-[#003087]" />
            <span>Upload File</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('manual')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
              mode === 'manual'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LinkIcon className="w-3 h-3 text-[#003087]" />
            <span>Link / URL</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {uploadError && (
        <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
          <span className="flex-1 text-[11px] font-medium">{uploadError}</span>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="text-rose-500 hover:text-rose-700 cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {uploadSuccess && (
        <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
          <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span className="flex-1 text-[11px] font-medium">{uploadSuccess}</span>
          <button
            type="button"
            onClick={() => setUploadSuccess(null)}
            className="text-emerald-500 hover:text-emerald-700 cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* MODE 1: UPLOAD LANGSUNG DARI PERANGKAT */}
      {mode === 'upload' && (
        <div className="space-y-2.5">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border border-dashed border-slate-300 hover:border-[#003087] bg-slate-50/60 hover:bg-blue-50/30 rounded-xl p-3 sm:p-4 text-center cursor-pointer transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Upload className="w-5 h-5 text-[#003087] mx-auto mb-1.5" />
            <div className="font-semibold text-slate-800 text-xs">
              {selectedFile ? selectedFile.name : 'Klik untuk Pilih Foto dari Perangkat Anda'}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Format: JPG, PNG, WebP (Maks. 5MB)
            </p>
          </div>

          {previewDataUrl && (
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <img
                  src={previewDataUrl}
                  alt="Preview"
                  className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[10.5px] font-medium text-slate-600">Simpan sebagai nama:</div>
                  <input
                    type="text"
                    value={customFilename}
                    onChange={(e) => setCustomFilename(e.target.value)}
                    className="mt-0.5 px-2 py-1 rounded-md border border-slate-300 bg-white text-xs text-slate-900 w-full sm:w-44 focus:outline-none focus:border-[#003087]"
                    placeholder="nama-file.jpg"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleUploadAndApply}
                disabled={isUploading}
                className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-[#003087] hover:bg-[#002260] text-white font-semibold transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3 h-3 text-[#FFB800]" />
                    <span>Simpan & Gunakan</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: MANUAL INPUT LINK / URL */}
      {mode === 'manual' && (
        <div className="space-y-1.5">
          <label className="block text-[11px] font-medium text-slate-700">
            Ketik atau tempel URL / path foto:
          </label>
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://... atau /images/guru/nama.jpg"
              className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#003087] text-xs font-mono"
            />
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs cursor-pointer"
                title="Hapus pilihan"
              >
                Hapus
              </button>
            )}
          </div>
          <p className="text-[10px] text-slate-400">
            Mendukung tautan foto online (Unsplash/CDN) atau path lokal di <code className="text-slate-600">/images/{category}/</code>
          </p>
        </div>
      )}

      {/* Selected Photo Thumbnail & Status */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`rounded-lg bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0 flex items-center justify-center ${
              aspectRatio === 'square'
                ? 'w-10 h-10'
                : aspectRatio === 'portrait'
                ? 'w-9 h-12'
                : 'w-14 h-9'
            }`}
          >
            {value ? (
              <img
                src={value}
                alt="Pratinjau Foto"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400';
                }}
              />
            ) : (
              <ImageIcon className="w-4 h-4 text-slate-400" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] text-slate-500 font-medium">Foto Terpilih:</div>
            <p className="text-[11px] font-mono text-slate-800 truncate">
              {value || '(Belum ada foto)'}
            </p>
          </div>
        </div>

        {value && (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded-md text-slate-400 hover:text-[#003087] hover:bg-slate-100 transition-colors flex-shrink-0"
            title="Buka gambar di tab baru"
          >
            <Eye className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};
