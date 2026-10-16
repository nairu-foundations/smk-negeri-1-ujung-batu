# Direktori Poster SMKN 1 Ujung Batu

Folder `public/images/poster` digunakan khusus untuk menyimpan file poster digital sekolah, brosur PPDB, pamflet kegiatan, dan publikasi visual kejuruan.

## Struktur & Rekomendasi Penamaan File:
- `poster-ppdb-2026.jpg` : Poster resmi Penerimaan Peserta Didik Baru (PPDB)
- `poster-prestasi-lks.jpg` : Poster pengumuman juara LKS & kompetisi vokasi
- `poster-tefa-industri.jpg` : Poster program Teaching Factory & bengkel DU/DI
- `poster-tkj-fiberoptic.jpg` : Poster kejuruan & laboratorium teknologi
- `poster-gelar-karya.jpg` : Poster pameran produk kreatif kewirausahaan (PKK)
- `poster-ekskul.jpg` : Poster kegiatan ekstrakurikuler & karakter vokasi

## Pemanggilan Langsung di Kode:
File di folder ini dapat langsung dipanggil di kode aplikasi dengan path:
```tsx
<img src="/images/poster/poster-ppdb-2026.jpg" alt="Poster PPDB SMKN 1 Ujung Batu" />
```
Atau menggunakan `getPhotoUrl('poster', 'poster-ppdb-2026.jpg')`.
