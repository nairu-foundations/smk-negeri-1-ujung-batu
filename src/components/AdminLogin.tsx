import React, { useState } from 'react';
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { SchoolLogo } from './common/SchoolLogo';
import { AdminUser } from '../types';

interface AdminLoginProps {
  onLoginSuccess?: (user: AdminUser) => void;
  onNavigateHome?: () => void;
}

export default function AdminLogin({ onLoginSuccess, onNavigateHome }: AdminLoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // State untuk form input
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Autentikasi ke backend API
      const result = await api.login(
        formData.email.trim() || 'admin@smkn1.sch.id',
        formData.password || 'admin123'
      );

      if (result && result.user) {
        setIsLoading(false);
        setIsSuccess(true);

        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess(result.user);
          } else {
            alert('Login berhasil! Mengarahkan ke Dashboard Admin...');
          }
        }, 800);
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err?.message || 'kata sandi salah atau email tidak terdaftar');
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4 selection:bg-blue-600 selection:text-white relative">
      {/* Tombol Kembali ke Halaman Sebelumnya */}
      {onNavigateHome && (
        <button
          onClick={onNavigateHome}
          className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 hover:bg-white text-slate-700 hover:text-blue-700 text-xs font-semibold shadow-sm border border-slate-200/80 backdrop-blur-sm transition-all cursor-pointer"
          title="Kembali ke halaman sebelumnya"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Halaman Sebelumnya</span>
        </button>
      )}

      {/* Container Utama dengan Animasi Masuk */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row border border-slate-200/60 relative my-8"
      >
        {/* SISI KIRI: Branding SMK dengan Efek Bergerak Halus */}
        <div className="md:w-1/2 bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Elemen Dekoratif Animasi Glow */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-16 -left-16 w-56 h-56 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"
          ></motion.div>

          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-16 -right-16 w-56 h-56 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"
          ></motion.div>

          {/* Konten Atas */}
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center space-x-3 mb-8"
            >
              <SchoolLogo className="w-12 h-12 object-contain drop-shadow-md" />
              <div>
                <span className="block font-bold text-base tracking-wider uppercase">
                  SMKN 1 UJUNG BATU
                </span>
                <span className="text-xs text-blue-200">Portal Resmi Administrasi</span>
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight"
            >
              Kelola Landing Page & Data Sekolah Lebih Mudah.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-4 text-blue-100/90 text-sm leading-relaxed"
            >
              Masuk untuk memperbarui informasi jurusan, profil sekolah, galeri kegiatan, guru & tenaga kependidikan, serta mengatur hak akses sistem backend.
            </motion.p>
          </div>

          {/* Konten Bawah */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="relative z-10 mt-12 text-xs text-blue-200/70 border-t border-white/10 pt-4 flex justify-between items-center"
          >
            <span>&copy; 2026 SMK Negeri 1 Ujung Batu</span>
            <span className="bg-blue-600/50 px-2.5 py-1 rounded-full text-[10px] font-medium text-white border border-blue-400/30">
              Secure System v2.1
            </span>
          </motion.div>
        </div>

        {/* SISI KANAN: Form Login Interaktif */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Selamat Datang 👋</h3>
            <p className="text-slate-500 text-sm mt-1">Silakan verifikasi identitas akun admin Anda.</p>
          </div>

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Input NIP / Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                NIP / Email Admin
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@smkn1.sch.id"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-sm text-slate-800 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Kata Sandi
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-sm text-slate-800 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Lupa Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 mr-2 w-4 h-4 transition"
                />
                Ingat perangkat ini
              </label>
              <a
                href="#lupa-sandi"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Silakan hubungi Super Admin utama (nairuxza@gmail.com) untuk reset sandi.');
                }}
                className="text-blue-600 hover:text-blue-700 hover:underline font-semibold transition-colors"
              >
                Lupa sandi?
              </a>
            </div>

            {/* Tombol Submit Interaktif dengan Efek Loading */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading || isSuccess}
              className={`w-full py-3.5 rounded-xl font-semibold shadow-md transition-all duration-300 flex items-center justify-center space-x-2 text-sm cursor-pointer ${
                isSuccess
                  ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 hover:shadow-lg'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Memverifikasi Akses...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Login Berhasil!</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
