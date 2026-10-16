import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { schoolIdentity } from '../data/schoolData';
import { PageHeader } from './PageHeader';
import { api } from '../services/api';

interface ContactSectionProps {
  onNavigate: (page: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onNavigate }) => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Pertanyaan Umum Sekolah',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      await api.submitContactMessage(formState);
      setSubmitted(true);
      setFormState({
        name: '',
        email: '',
        phone: '',
        subject: 'Pertanyaan Umum Sekolah',
        message: '',
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mengirim pesan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="kontak" className="min-h-screen bg-[#F8F9FA]">
      {/* Page Header */}
      <PageHeader
        title="Kontak Resmi & Lokasi Kampus"
        subtitle="Layanan informasi publik, administrasi kemitraan industri DU/DI, hotline bursa kerja, dan alamat lokasi kampus SMK Negeri 1 Ujung Batu."
        badge="Hubungi Kami"
        breadcrumbs={[{ label: 'Kontak & Lokasi' }]}
        onNavigate={onNavigate}
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Cards & Map */}
          <div className="lg:col-span-5 space-y-4">
            {/* Address */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#003087] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[#FFB800]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#003087] font-heading">Alamat Kampus</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {schoolIdentity.contact.address}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {schoolIdentity.district}, {schoolIdentity.regency}, {schoolIdentity.province} 28554
                  </p>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#003087] flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-[#003087]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#003087] font-heading">Jam Pelayanan</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    {schoolIdentity.contact.operatingHours}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Sabtu, Minggu & Libur Nasional Tutup
                  </p>
                </div>
              </div>
            </div>

            {/* Phone & Email */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#003087] flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-[#003087]" />
                </div>
                <div className="space-y-1 text-xs text-slate-600">
                  <h4 className="text-sm font-bold text-[#003087] font-heading mb-1">Telepon & Email</h4>
                  <p>Telepon: <strong className="text-slate-800">{schoolIdentity.contact.phone}</strong></p>
                  <p>WhatsApp: <strong className="text-slate-800">{schoolIdentity.contact.whatsappHelpdesk}</strong></p>
                  <p>Email: <strong className="text-slate-800">{schoolIdentity.contact.email}</strong></p>
                </div>
              </div>
            </div>

            {/* Map Preview */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs h-56">
              <iframe
                title="Peta Lokasi SMK Negeri 1 Ujung Batu"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63833.04561849132!2d100.500000!3d0.710000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x302ab8f900000001%3A0x0!2sUjung%20Batu%2C%20Rokan%20Hulu%2C%20Riau!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h3 className="text-lg font-bold text-[#003087] font-heading mb-1">
              Kirim Pesan atau Pertanyaan
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Pesan akan otomatis tersimpan di database dan diteruskan ke email sekolah ({schoolIdentity.contact.email}).
            </p>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {submitted ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-[#003087] font-heading">
                  Pesan Anda Berhasil Terkirim
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Terima kasih telah menghubungi SMK Negeri 1 Ujung Batu. Salinan pesan telah dicatat di database dan diteruskan ke tata usaha sekolah.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 rounded-xl bg-[#003087] text-white text-xs font-bold hover:bg-[#002260] cursor-pointer"
                >
                  Kirim Pesan Lainnya
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nama Anda"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#003087]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nomor WhatsApp / HP
                    </label>
                    <input
                      type="tel"
                      placeholder="081234567890"
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#003087]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Alamat Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="nama@email.com"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#003087]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Kategori Pesan *
                    </label>
                    <select
                      value={formState.subject}
                      onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#003087] bg-white"
                    >
                      <option>Pertanyaan Umum Sekolah</option>
                      <option>Kerjasama Industri & PKL</option>
                      <option>Lowongan Kerja & BKK</option>
                      <option>Teaching Factory (TEFA)</option>
                      <option>Layanan Legalisir Ijazah</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Isi Pesan *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tuliskan pertanyaan atau informasi yang Anda butuhkan..."
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#003087]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-[#003087] hover:bg-[#002260] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mengirimkan Pesan...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#FFB800]" />
                      <span>Kirim Pesan Sekarang</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
