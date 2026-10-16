# Panduan Struktur Folder Penyimpanan Foto SMKN 1 Ujung Batu

Folder `public/images` ini adalah direktori penyimpanan aset foto statis untuk website. 
Setiap file yang diletakkan di dalam folder ini dapat langsung dipanggil di dalam kode React/TypeScript menggunakan path absolut: `"/images/<subfolder>/<nama-file.jpg>"`.

---

## Struktur Folder:

```text
public/
└── images/
    ├── logo/                  <- Logo sekolah, lambang dinas pendidikan, favicon, logo provinsi
    │   ├── logo-smkn1.png
    │   └── tut-wuri.png
    │
    ├── hero/                  <- Foto banner utama / slider beranda (resolusi rekomendasi: 1920x1080)
    │   ├── banner-utama.jpg
    │   ├── banner-lab-tkj.jpg
    │   └── banner-bengkel-otomotif.jpg
    │
    ├── profil/                <- Foto kepala sekolah, dewan komite, sarana prasarana sekolah
    │   ├── kepala-sekolah.jpg
    │   ├── gedung-utama.jpg
    │   └── gerbang-kampus.jpg
    │
    ├── jurusan/               <- Banner & foto kegiatan untuk 6 Program Keahlian
    │   ├── tkj.jpg            (Teknik Komputer & Jaringan)
    │   ├── to.jpg             (Teknik Otomotif)
    │   ├── bdp.jpg            (Bisnis Daring & Pemasaran)
    │   ├── te.jpg             (Teknik Elektronika)
    │   ├── tlog.jpg           (Teknik Logistik)
    │   └── bp.jpg             (Broadcasting & Perfilman)
    │
    ├── galeri/                <- Dokumentasi foto kegiatan sekolah per kategori
    │   ├── praktik/           <- Dokumentasi praktik siswa di bengkel & lab komputer
    │   │   ├── praktik-tkj-1.jpg
    │   │   └── praktik-mesin-1.jpg
    │   ├── kegiatan/          <- Upacara, perpisahan, classmeeting, pramuka, lomba
    │   │   └── upacara-hardiknas.jpg
    │   ├── industri/          <- Kunjungan industri, sinkronisasi kurikulum, PKL
    │   │   └── kunjungan-industri-pekanbaru.jpg
    │   └── guru/              <- Pelatihan guru kejuruan, rapat pleno, sertifikasi
    │       └── pelatihan-guru.jpg
    │
    ├── guru/                  <- Foto pas foto / potret guru & staf tenaga kependidikan
    │   ├── sabarudin.jpg
    │   ├── hendra-wijaya.jpg
    │   └── supriyadi.jpg
    │
    ├── berita/                <- Foto artikel pengumuman & berita kegiatan sekolah
    │   ├── sas-ganjil.jpg
    │   └── pelepasan-pkl.jpg
    │
    ├── poster/                <- Poster digital PPDB, lomba LKS, agenda & publikasi resmi
    │   ├── poster-ppdb-2026.jpg
    │   └── poster-prestasi-lks.jpg
    │
    └── ekskul/                <- Foto aktivitas ekstrakurikuler siswa
        ├── robotik.jpg
        ├── otomotif-club.jpg
        └── broadcast-club.jpg
```

---

## Cara Memanggil Foto di Dalam Kode:

### Cara 1: Menggunakan Helper `getPhotoUrl` (Direkomendasikan)
Gunakan helper dari `src/utils/photoManager.ts`. Helper ini memiliki fitur otomatis fallback ke foto cadangan online berkualitas tinggi jika file lokal belum dimasukkan.

```tsx
import { getPhotoUrl } from '../utils/photoManager';

// Contoh memanggil foto kepala sekolah:
<img 
  src={getPhotoUrl('profil', 'kepala-sekolah.jpg')} 
  alt="Kepala Sekolah SMKN 1 Ujung Batu" 
  className="w-48 h-48 rounded-xl object-cover"
/>

// Contoh memanggil foto jurusan:
<img 
  src={getPhotoUrl('jurusan', 'tkj.jpg')} 
  alt="Laboratorium Komputer Jaringan" 
/>
```

### Cara 2: Memanggil Langsung Lewat Path Statis
```tsx
<img 
  src="/images/profil/kepala-sekolah.jpg" 
  alt="Kepala Sekolah" 
  onError={(e) => {
    // Penanganan jika file belum ada
    e.currentTarget.src = "https://images.unsplash.com/...";
  }}
/>
```

### Cara 3: Menggunakan Komponen `<SchoolImage />`
Komponen ini telah dilengkapi transisi loading halus, error fallback, dan lazy loading bawaan:

```tsx
import { SchoolImage } from '../components/common/SchoolImage';

<SchoolImage
  category="jurusan"
  filename="tkj.jpg"
  alt="Teknik Komputer & Jaringan"
  className="w-full h-64 object-cover rounded-2xl"
/>
```
