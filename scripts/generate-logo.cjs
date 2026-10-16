const fs = require('fs');
const { execSync } = require('child_process');

// Buat SVG Lambang Resmi SMKN 1 Ujung Batu dengan detail vektor presisi tinggi
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 560" width="500" height="560">
  <defs>
    <!-- Filter bayangan & efek 3D -->
    <filter id="dropShadow" x="-10%" y="-10%" width="125%" height="125%">
      <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#000000" flood-opacity="0.35" />
    </filter>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>

    <!-- Gradasi Warna -->
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE066" />
      <stop offset="45%" stop-color="#FFB800" />
      <stop offset="80%" stop-color="#D97706" />
      <stop offset="100%" stop-color="#92400E" />
    </linearGradient>

    <linearGradient id="shieldBlueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0b3b8c" />
      <stop offset="50%" stop-color="#002b66" />
      <stop offset="100%" stop-color="#001438" />
    </linearGradient>

    <linearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#DC2626" />
      <stop offset="40%" stop-color="#EA580C" />
      <stop offset="75%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#FEF08A" />
    </linearGradient>

    <linearGradient id="gearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC" />
      <stop offset="50%" stop-color="#CBD5E1" />
      <stop offset="100%" stop-color="#64748B" />
    </linearGradient>

    <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="70%" stop-color="#F1F5F9" />
      <stop offset="100%" stop-color="#CBD5E1" />
    </linearGradient>
  </defs>

  <!-- PERISAI UTAMA (Shield Segilima Khas Vokasi Indonesia) -->
  <g filter="url(#dropShadow)">
    <!-- Bingkai Luar Emas -->
    <path d="M 250,20 
             C 340,20 440,32 455,48 
             C 465,160 455,295 435,360 
             C 390,440 295,505 250,535 
             C 205,505 110,440 65,360 
             C 45,295 35,160 45,48 
             C 60,32 160,20 250,20 Z" 
          fill="url(#goldGrad)" 
          stroke="#78350F" 
          stroke-width="3" />

    <!-- Bingkai Garis Putih Pemisah -->
    <path d="M 250,28 
             C 336,28 430,40 443,54 
             C 453,160 443,290 425,352 
             C 382,430 292,492 250,520 
             C 208,492 118,430 75,352 
             C 57,290 47,160 57,54 
             C 70,40 164,28 250,28 Z" 
          fill="none" 
          stroke="#FFFFFF" 
          stroke-width="3.5" />

    <!-- Badan Perisai Biru Dalam -->
    <path d="M 250,34 
             C 332,34 424,45 436,58 
             C 445,160 436,285 418,346 
             C 376,422 288,482 250,510 
             C 212,482 124,422 82,346 
             C 64,285 55,160 64,58 
             C 76,45 168,34 250,34 Z" 
          fill="url(#shieldBlueGrad)" 
          stroke="#001438" 
          stroke-width="2" />
  </g>

  <!-- TULISAN LENGKUNG ATAS: SMK NEGERI 1 -->
  <path id="textArc" d="M 75,108 C 145,55 355,55 425,108" fill="none" stroke="none" />
  <text font-family="'Arial Black', Impact, sans-serif" font-size="28" font-weight="900" fill="#FFE066" stroke="#451A03" stroke-width="1.5" letter-spacing="2">
    <textPath href="#textArc" startOffset="50%" text-anchor="middle">
      SMK NEGERI 1
    </textPath>
  </text>

  <!-- BINTANG EMAS DI ATAS (Ketuhanan & Cita-Cita Luhur) -->
  <g transform="translate(250, 118)">
    <polygon points="0,-18 5.5,-5.5 19,-4.5 9,5.5 12,19 0,11.5 -12,19 -9,5.5 -19,-4.5 -5.5,-5.5" 
             fill="url(#goldGrad)" 
             stroke="#B45309" 
             stroke-width="1.2" 
             filter="url(#softGlow)" />
  </g>

  <!-- RODA BERGERIGI / GEAR TEKNOLOGI VOKASI -->
  <g transform="translate(250, 260)">
    <!-- Roda Gigi Siluet Emas / Baja -->
    <circle r="92" fill="#0A2540" stroke="url(#goldGrad)" stroke-width="5" />
    
    <!-- Gigi Roda (16 Gigi) -->
    <g fill="url(#goldGrad)" stroke="#78350F" stroke-width="1">
      <!-- 16 gigi diputar keliling -->
      <path d="M -12,-96 L 12,-96 L 9,-84 L -9,-84 Z" />
      <path d="M -12,-96 L 12,-96 L 9,-84 L -9,-84 Z" transform="rotate(22.5)" />
      <path d="M -12,-96 L 12,-96 L 9,-84 L -9,-84 Z" transform="rotate(45)" />
      <path d="M -12,-96 L 12,-96 L 9,-84 L -9,-84 Z" transform="rotate(67.5)" />
      <path d="M -12,-96 L 12,-96 L 9,-84 L -9,-84 Z" transform="rotate(90)" />
      <path d="M -12,-96 L 12,-96 L 9,-84 L -9,-84 Z" transform="rotate(112.5)" />
      <path d="M -12,-96 L 12,-96 L 9,-84 L -9,-84 Z" transform="rotate(135)" />
      <path d="M -12,-96 L 12,-96 L 9,-84 L -9,-84 Z" transform="rotate(157.5)" />
      <path d="M -12,-96 L 12,-96 L 9,-84 L -9,-84 Z" transform="rotate(180)" />
      <path d="M -12,-96 L 12,-96 L 9,-84 L -9,-84 Z" transform="rotate(202.5)" />
      <path d="M -12,-96 L 12,-96 L 9,-84 L -9,-84 Z" transform="rotate(225)" />
      <path d="M -12,-96 L 12,-96 L 9,-84 L -9,-84 Z" transform="rotate(247.5)" />
      <path d="M -12,-96 L 12,-96 L 9,-84 L -9,-84 Z" transform="rotate(270)" />
      <path d="M -12,-96 L 12,-96 L 9,-84 L -9,-84 Z" transform="rotate(292.5)" />
      <path d="M -12,-96 L 12,-96 L 9,-84 L -9,-84 Z" transform="rotate(315)" />
      <path d="M -12,-96 L 12,-96 L 9,-84 L -9,-84 Z" transform="rotate(337.5)" />
    </g>

    <!-- Lingkaran dalam gear -->
    <circle r="76" fill="#021C42" stroke="#FFFFFF" stroke-width="2.5" />
    <circle r="56" fill="#001433" stroke="url(#goldGrad)" stroke-width="2" />
  </g>

  <!-- SAYAP PADI (KIRI) & KAPAS (KANAN) -->
  <!-- Padi Kiri (Kesejahteraan dan Kemakmuran) -->
  <g fill="url(#goldGrad)" stroke="#78350F" stroke-width="0.8">
    <!-- Tangkai melengkung kiri -->
    <path d="M 230,420 C 145,410 100,320 105,185" fill="none" stroke="#D97706" stroke-width="3" />
    <!-- Butir Padi Kiri -->
    <ellipse cx="106" cy="185" rx="6" ry="12" transform="rotate(-15 106 185)" />
    <ellipse cx="103" cy="205" rx="6" ry="12" transform="rotate(-10 103 205)" />
    <ellipse cx="102" cy="225" rx="6" ry="12" transform="rotate(-5 102 225)" />
    <ellipse cx="104" cy="245" rx="6" ry="12" transform="rotate(0 104 245)" />
    <ellipse cx="108" cy="265" rx="6.5" ry="12" transform="rotate(10 108 265)" />
    <ellipse cx="114" cy="285" rx="6.5" ry="12" transform="rotate(20 114 285)" />
    <ellipse cx="122" cy="305" rx="7" ry="12" transform="rotate(30 122 305)" />
    <ellipse cx="132" cy="325" rx="7" ry="12" transform="rotate(40 132 325)" />
    <ellipse cx="145" cy="345" rx="7.5" ry="12" transform="rotate(50 145 345)" />
    <ellipse cx="160" cy="365" rx="7.5" ry="12" transform="rotate(60 160 365)" />
    <ellipse cx="178" cy="382" rx="8" ry="12" transform="rotate(70 178 382)" />
    <ellipse cx="200" cy="397" rx="8" ry="12" transform="rotate(80 200 397)" />
  </g>

  <!-- Kapas Kanan (Sandang & Ketenteraman) -->
  <g>
    <!-- Tangkai melengkung kanan -->
    <path d="M 270,420 C 355,410 400,320 395,185" fill="none" stroke="#15803D" stroke-width="3" />
    <!-- Bunga Kapas Kanan -->
    <!-- Kuntum 1 -->
    <circle cx="395" cy="188" r="9" fill="#FFFFFF" stroke="#15803D" stroke-width="1.5" />
    <path d="M 390,196 C 395,193 400,193 405,196 C 400,188 395,188 390,196 Z" fill="#15803D" />
    <!-- Kuntum 2 -->
    <circle cx="397" cy="225" r="9.5" fill="#FFFFFF" stroke="#15803D" stroke-width="1.5" />
    <path d="M 392,233 C 397,230 402,230 407,233 C 402,225 397,225 392,233 Z" fill="#15803D" />
    <!-- Kuntum 3 -->
    <circle cx="393" cy="262" r="10" fill="#FFFFFF" stroke="#15803D" stroke-width="1.5" />
    <path d="M 388,270 C 393,267 398,267 403,270 C 398,262 393,262 388,270 Z" fill="#15803D" />
    <!-- Kuntum 4 -->
    <circle cx="382" cy="298" r="10.5" fill="#FFFFFF" stroke="#15803D" stroke-width="1.5" />
    <path d="M 377,306 C 382,303 387,303 392,306 C 387,298 382,298 377,306 Z" fill="#15803D" />
    <!-- Kuntum 5 -->
    <circle cx="363" cy="334" r="11" fill="#FFFFFF" stroke="#15803D" stroke-width="1.5" />
    <path d="M 358,342 C 363,339 368,339 373,342 C 368,334 363,334 358,342 Z" fill="#15803D" />
    <!-- Kuntum 6 -->
    <circle cx="334" cy="368" r="11" fill="#FFFFFF" stroke="#15803D" stroke-width="1.5" />
    <path d="M 329,376 C 334,373 339,373 344,376 C 339,368 334,368 329,376 Z" fill="#15803D" />
    <!-- Kuntum 7 -->
    <circle cx="298" cy="396" r="11.5" fill="#FFFFFF" stroke="#15803D" stroke-width="1.5" />
    <path d="M 293,404 C 298,401 303,401 308,404 C 303,396 298,396 293,404 Z" fill="#15803D" />
  </g>

  <!-- OBOR PENDIDIKAN & ILMU PENGETAHUAN (Tengah) -->
  <g transform="translate(250, 245)">
    <!-- Gagang Obor Emas -->
    <path d="M -10,38 L 10,38 L 7,65 L -7,65 Z" fill="url(#goldGrad)" stroke="#78350F" stroke-width="1.5" />
    <ellipse cx="0" cy="38" rx="14" ry="5" fill="url(#goldGrad)" stroke="#78350F" stroke-width="1.5" />
    <path d="M -14,38 C -14,24 14,24 14,38 Z" fill="#B45309" stroke="#78350F" stroke-width="1.2" />

    <!-- Lidah Api Obor Berkobar Merah-Kuning -->
    <path d="M 0,-78 
             C 18,-45 28,-25 20,0 
             C 15,18 0,25 0,25 
             C 0,25 -15,18 -20,0 
             C -28,-25 -18,-45 0,-78 Z" 
          fill="url(#flameGrad)" 
          stroke="#991B1B" 
          stroke-width="1.5" 
          filter="url(#softGlow)" />
    
    <!-- Lidah Api Bagian Tengah Kuning Terang -->
    <path d="M 0,-62 
             C 10,-38 16,-20 10,-4 
             C 6,10 0,16 0,16 
             C 0,16 -6,10 -10,-4 
             C -16,-20 -10,-38 0,-62 Z" 
          fill="#FEF08A" />
  </g>

  <!-- BUKU TERBUKA (Dasar Ilmu Vokasi) -->
  <g transform="translate(250, 318)">
    <!-- Halaman Kiri -->
    <path d="M 0,16 C -30,6 -60,8 -82,22 L -82,-6 C -60,-20 -30,-18 0,-8 Z" 
          fill="#FFFFFF" 
          stroke="#002b66" 
          stroke-width="2" />
    <!-- Garis Teks Halaman Kiri -->
    <path d="M -70,-2 C -52,-12 -28,-11 -8,-4" fill="none" stroke="#94A3B8" stroke-width="1.5" />
    <path d="M -70,5 C -52,-5 -28,-4 -8,3" fill="none" stroke="#94A3B8" stroke-width="1.5" />
    <path d="M -70,12 C -52,2 -28,3 -8,10" fill="none" stroke="#94A3B8" stroke-width="1.5" />

    <!-- Halaman Kanan -->
    <path d="M 0,16 C 30,6 60,8 82,22 L 82,-6 C 60,-20 30,-18 0,-8 Z" 
          fill="#FFFFFF" 
          stroke="#002b66" 
          stroke-width="2" />
    <!-- Garis Teks Halaman Kanan -->
    <path d="M 8,-4 C 28,-11 52,-12 70,-2" fill="none" stroke="#94A3B8" stroke-width="1.5" />
    <path d="M 8,3 C 28,-4 52,-5 70,5" fill="none" stroke="#94A3B8" stroke-width="1.5" />
    <path d="M 8,10 C 28,3 52,2 70,12" fill="none" stroke="#94A3B8" stroke-width="1.5" />

    <!-- Tulang Buku Tengah -->
    <line x1="0" y1="-8" x2="0" y2="16" stroke="#002b66" stroke-width="3" />
  </g>

  <!-- PITA BAWAH (UJUNG BATU) -->
  <g transform="translate(250, 436)" filter="url(#dropShadow)">
    <!-- Lipatan Pita Belakang -->
    <path d="M -160,18 L -190,-5 L -190,26 L -160,35 Z" fill="#94A3B8" stroke="#475569" stroke-width="1.5" />
    <path d="M 160,18 L 190,-5 L 190,26 L 160,35 Z" fill="#94A3B8" stroke="#475569" stroke-width="1.5" />

    <!-- Ujung Ekor Pita Kiri & Kanan (Ekor Burung Walet) -->
    <path d="M -190,-5 L -220,12 L -205,24 L -220,38 L -190,26 Z" fill="url(#ribbonGrad)" stroke="#334155" stroke-width="1.5" />
    <path d="M 190,-5 L 220,12 L 205,24 L 220,38 L 190,26 Z" fill="url(#ribbonGrad)" stroke="#334155" stroke-width="1.5" />

    <!-- Pita Utama Depan Melengkung -->
    <path d="M -165,16 
             C -90,-8 90,-8 165,16 
             C 145,46 -145,46 -165,16 Z" 
          fill="url(#ribbonGrad)" 
          stroke="url(#goldGrad)" 
          stroke-width="3" />
    
    <!-- Garis Lis Emas di Pinggir Pita -->
    <path d="M -155,20 C -85,0 85,0 155,20" fill="none" stroke="#D97706" stroke-width="1.5" />
    <path d="M -152,38 C -85,22 85,22 152,38" fill="none" stroke="#D97706" stroke-width="1.5" />

    <!-- Teks Pita: UJUNG BATU -->
    <text x="0" y="27" 
          font-family="'Arial Black', Impact, sans-serif" 
          font-size="20" 
          font-weight="900" 
          fill="#002260" 
          text-anchor="middle" 
          letter-spacing="3">
      UJUNG BATU
    </text>
  </text>
</svg>`;

// Tulis file SVG ke public/images/logo/logo-smkn1.svg
fs.writeFileSync('public/images/logo/logo-smkn1.svg', svgContent, 'utf8');
console.log('✅ Berhasil membuat public/images/logo/logo-smkn1.svg');

// Render PNG resolusi tinggi 512x512 menggunakan ImageMagick
try {
  execSync('convert -background transparent -density 300 public/images/logo/logo-smkn1.svg -resize 512x512 public/images/logo/logo-smkn1.png');
  console.log('✅ Berhasil mengkonversi ke public/images/logo/logo-smkn1.png (512x512)');
  
  // Buat juga favicon.ico / favicon.png
  execSync('convert -background transparent -density 300 public/images/logo/logo-smkn1.svg -resize 64x64 public/favicon.png');
  execSync('convert -background transparent -density 300 public/images/logo/logo-smkn1.svg -resize 32x32 public/favicon.ico');
  console.log('✅ Berhasil membuat favicon.ico dan favicon.png');
} catch (err) {
  console.error('Gagal convert PNG:', err.message);
}
