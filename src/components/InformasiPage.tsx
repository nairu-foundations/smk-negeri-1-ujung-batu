import React, { useState, useEffect } from 'react';
import {
  Bell,
  Calendar,
  User,
  ArrowRight,
  ChevronRight,
  Clock,
  X,
  Search,
  ChevronDown,
} from 'lucide-react';
import { PageHeader } from './PageHeader';
import { initialNewsArticles, initialAnnouncements, faqList } from '../data/schoolData';
import { NewsArticle, Announcement, FaqItem, AdminUser } from '../types';
import { api } from '../services/api';

interface InformasiPageProps {
  initialTab?: string;
  currentUser: AdminUser | null;
  onNavigate: (page: string) => void;
}

export const InformasiPage: React.FC<InformasiPageProps> = ({
  initialTab,
  currentUser,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'berita' | 'pengumuman' | 'faq'>('berita');
  const [newsCategory, setNewsCategory] = useState<string>('Semua');
  const [newsSearch, setNewsSearch] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  // Live state from API
  const [newsList, setNewsList] = useState<NewsArticle[]>(initialNewsArticles);
  const [announcementsList, setAnnouncementsList] = useState<Announcement[]>(initialAnnouncements);

  // FAQ state
  const [activeFaqAccordion, setActiveFaqAccordion] = useState<string | null>('faq-1');
  const [faqSearchQuery, setFaqSearchQuery] = useState<string>('');
  const [faqCategoryFilter, setFaqCategoryFilter] = useState<string>('Semua');

  useEffect(() => {
    if (initialTab && ['berita', 'pengumuman', 'faq'].includes(initialTab)) {
      setActiveTab(initialTab as any);
    }
  }, [initialTab]);

  useEffect(() => {
    api.getNews().then((data) => {
      if (data && data.length > 0) setNewsList(data);
    });
    api.getAnnouncements().then((data) => {
      if (data && data.length > 0) setAnnouncementsList(data);
    });
  }, []);

  const filteredNews = newsList.filter((item) => {
    const matchesCategory = newsCategory === 'Semua' || item.category === newsCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(newsSearch.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(newsSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredFaqs = faqList.filter((item: FaqItem) => {
    const matchesCategory = faqCategoryFilter === 'Semua' || item.category === faqCategoryFilter;
    const matchesSearch =
      item.question.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(faqSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="informasi" className="min-h-screen bg-white">
      {/* Page Header */}
      <PageHeader
        title="Pusat Informasi, Berita & Pengumuman Sekolah"
        subtitle="Rangkuman prestasi kejuaraan vokasi, publikasi kegiatan akademik, surat edaran kedinasan resmi, dan jawaban atas pertanyaan seputar SMK Negeri 1 Ujung Batu."
        badge="Portal Kabar Sekolah"
        breadcrumbs={[{ label: 'Pusat Informasi' }]}
        onNavigate={onNavigate}
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 border-b border-slate-200 pb-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {[
              { id: 'berita', label: `Berita & Prestasi (${newsList.length})` },
              { id: 'pengumuman', label: `Pengumuman Resmi (${announcementsList.length})` },
              { id: 'faq', label: 'Tanya Jawab (FAQ)' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold border-2 transition-all cursor-pointer font-heading ${
                    isActive
                      ? 'bg-[#003087] text-white border-[#003087] shadow-sm'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-[#003087] hover:text-[#003087]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: BERITA & PRESTASI */}
        {activeTab === 'berita' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            {/* Search & Category Filter */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1.5 flex-wrap">
                {['Semua', 'LKS & Prestasi', 'Kegiatan PKL', 'Kunjungan Industri', 'Kegiatan Sekolah'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setNewsCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      newsCategory === cat
                        ? 'bg-[#003087] text-white shadow-2xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari berita..."
                  value={newsSearch}
                  onChange={(e) => setNewsSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#003087] bg-white"
                />
              </div>
            </div>

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((article) => (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group cursor-pointer"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-[#003087] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                      {article.category}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{article.date}</span>
                        <span>•</span>
                        <span>{article.author}</span>
                      </div>

                      <h3 className="text-base font-bold text-slate-800 font-heading line-clamp-2 leading-snug group-hover:text-[#003087] transition-colors mb-2">
                        {article.title}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                        {article.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#003087] mt-4">
                      <span>Baca Selengkapnya</span>
                      <ChevronRight className="w-4 h-4 text-[#FFB800]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Detail Berita */}
            {selectedArticle && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-4 relative shadow-2xl animate-in fade-in">
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <span className="inline-block px-2.5 py-0.5 rounded bg-blue-50 text-[#003087] font-bold text-xs">
                    {selectedArticle.category}
                  </span>

                  <h3 className="text-xl sm:text-2xl font-bold text-[#003087] font-heading leading-snug">
                    {selectedArticle.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {selectedArticle.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {selectedArticle.author}
                    </span>
                  </div>

                  <div className="rounded-xl overflow-hidden aspect-[16/9] bg-slate-100">
                    <img
                      src={selectedArticle.image}
                      alt={selectedArticle.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="text-sm text-slate-700 leading-relaxed space-y-3 pt-2">
                    <p className="font-semibold text-slate-800">
                      {selectedArticle.excerpt}
                    </p>
                    <p>{selectedArticle.content}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => setSelectedArticle(null)}
                      className="px-5 py-2 rounded-lg bg-[#003087] text-white text-xs font-bold hover:bg-[#002260] transition-colors cursor-pointer"
                    >
                      Tutup Berita
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PENGUMUMAN */}
        {activeTab === 'pengumuman' && (
          <div className="space-y-4 max-w-4xl mx-auto animate-in fade-in duration-150">
            {announcementsList.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-[#003087] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        item.important
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-blue-100 text-[#003087]'
                      }`}
                    >
                      {item.important ? 'Penting' : 'Pengumuman'}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {item.date}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-800 font-heading">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                    {item.content}
                  </p>

                  <p className="text-[11px] text-slate-400">
                    Ditujukan untuk: <strong className="text-slate-600">{item.targetAudience}</strong>
                  </p>
                </div>

                <div className="flex-shrink-0">
                  <button
                    onClick={() => setSelectedAnnouncement(item)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-50 hover:bg-[#003087] text-[#003087] hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <span>Rincian</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#FFB800]" />
                  </button>
                </div>
              </div>
            ))}

            {/* Modal Detail Pengumuman */}
            {selectedAnnouncement && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-4 relative shadow-2xl animate-in fade-in">
                  <button
                    onClick={() => setSelectedAnnouncement(null)}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-[#003087]" />
                    <span className="text-xs font-bold text-slate-400">PENGUMUMAN RESMI</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#003087] font-heading">
                    {selectedAnnouncement.title}
                  </h3>

                  <div className="text-xs text-slate-500 space-y-1">
                    <div>Tanggal Rilis: <strong>{selectedAnnouncement.date}</strong></div>
                    <div>Penerima: <strong>{selectedAnnouncement.targetAudience}</strong></div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                    {selectedAnnouncement.content}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setSelectedAnnouncement(null)}
                      className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-300 transition-colors cursor-pointer"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FAQ */}
        {activeTab === 'faq' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1.5 flex-wrap">
                {['Semua', 'Umum SMK', 'PKL & BKK', 'Program Keahlian'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFaqCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      faqCategoryFilter === cat
                        ? 'bg-[#003087] text-white shadow-2xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-60">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari pertanyaan..."
                  value={faqSearchQuery}
                  onChange={(e) => setFaqSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#003087] bg-white"
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredFaqs.map((faq) => {
                const isOpen = activeFaqAccordion === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all shadow-xs"
                  >
                    <button
                      onClick={() => setActiveFaqAccordion(isOpen ? null : faq.id)}
                      className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-bold text-[#FFB800] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {faq.category}
                        </span>
                        <span className="text-sm font-bold text-slate-800 font-heading">
                          {faq.question}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-[#003087] flex-shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
