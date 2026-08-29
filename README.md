[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/wEWvHaXF)

# 🎨 TruBrush — Frontend Web Application
> **Platform Sosial Media Portofolio Seni Digital Otentik & Pasar Komisi Aman Berbasis Escrow (Anti-AI Human Art)**

---

## 🌟 1. Gambaran Umum (*Overview*)

**TruBrush Frontend** adalah aplikasi antarmuka web modern berbasis **Next.js (App Router)** dan **React**. Aplikasi ini dirancang khusus untuk memfasilitasi seniman digital dan klien/kolektor dalam berinteraksi, memamerkan karya seni otentik manusia (*Proof of Work*), melakukan pemesanan komisi berbasis *escrow*, serta menyediakan panel administrasi eksekutif dan kurasi moderasi yang komprehensif.

---

## 🚀 2. Fitur Utama Frontend (*Key Features*)

### 🛡️ Proteksi Karya & Kurasi Anti-AI
- **Form Unggah Karya Multimoda (`/post-art`):** Mendukung unggah gambar karya resolusi tinggi beserta bukti alur kerja (*WIP / Work In Progress* sketsa, video timelapse, layer).
- **Infinite Feed & Galeri Penjelajah (`/`):** Feed publik karya seni dengan *infinite scroll batch loading* dan penyaringan kategori tag instan.
- **Client-Side Anti-Scraping Defense:** Dilengkapi pelindung browser cerdas:
  - *Window Blur Shield:* Memburamkan kanvas saat pengguna beralih tab atau membuka Snipping Tool.
  - *DevTools & Shortcut Blocker:* Memblokir tombol inspeksi browser (`F12`, `Ctrl+Shift+I`, `Ctrl+U`).
  - *Context Menu Shield:* Mencegah klik kanan simpan gambar liar (*Save Image As...*).

### 🔒 Siklus Pasar Komisi & Escrow
- **Form Pemesanan Komisi Interaktif:** Klien dapat memesan karya kustom langsung dari profil seniman terverifikasi.
- **Halaman Pembayaran Mandiri (`/commissions/:id/payment`):** Pembayaran terisolasi yang mengunci dana ke rekening bersama (*Escrow*) platform.
- **Pelacak Progres Milestone & Revisi:** Pratinjau sketsa, persetujuan bertahap, dan pengiriman deliverable karya akhir.

### 💳 Dompet Digital & Penarikan Dana
- **Top Up Saldo Instan (`/topup`):** Pengisian saldo dompet digital untuk pembayaran komisi.
- **Pencairan Dana Seniman (`/withdraw`):** Penarikan pendapatan komisi artis dengan batas minimal Rp 100.000.

### 📊 Panel Dashboard Moderasi & Eksekutif
- **Dashboard Ringkasan (`/dashboard`):** Metrik ringkas transaksi aktif dan status akun.
- **Kurasi Karya Seni (`/dashboard/review-artworks`):** Antrean verifikasi bukti sketsa karya anti-AI.
- **Penanganan Laporan Aduan (`/dashboard/review-reports`):** Penindakan karya terindikasi plagiat/AI.
- **Mediasi Sengketa Komisi (`/dashboard/review-disputes`):** Panel mediasi admin untuk klaim *refund* komisi.
- **Kelola Pengguna & Banding Akun (`/dashboard/manage-users`):** Manajemen pengguna, role switcher, dan peninjauan formulir banding (*Appeals*).
- **Manajemen Tag & Katalog Global (`/dashboard/manage-tags`):** CRUD master tag dan moderasi *takedown* karya global.
- **Laporan Finansial & Buku Kas (`/dashboard/financial-reports`):** Audit perputaran GMV, saldo escrow, fee platform 5%, ekspor CSV, dan print report.
- **Laporan Kinerja & SLA Kurator (`/dashboard/curator-performance`):** Evaluasi kecepatan SLA respons kurator, rasio kelolosan anti-AI, kartu Top Moderator, dan ekspor CSV.
- **Log Audit Kronologis (`/dashboard/audit-logs`):** Transparansi seluruh rekam jejak keputusan staf kurator/admin.

---

## 🛠️ 3. Tumpukan Teknologi (*Tech Stack*)

| Lapisan / Kategori | Teknologi yang Digunakan |
|---|---|
| **Framework Inti** | [Next.js](https://nextjs.org/) (App Router, Turbopack, Server Actions) |
| **Library UI & State** | [React](https://react.dev/), [Zustand](https://zustand-demo.pmnd.rs/) (Client Stores), [TanStack Query v5](https://tanstack.com/query) (Server State & Cache) |
| **Styling & Komponen** | [Tailwind CSS v4](https://tailwindcss.com/), [DaisyUI v5](https://daisyui.com/), [Lucide React](https://lucide.dev/) Icons |
| **Klien HTTP & Validasi** | [Axios](https://axios-http.com/), [Zod](https://zod.dev/) |
| **Linter & Formatter** | [Biome](https://biomejs.dev/) |
| **Package Manager** | [Bun](https://bun.sh/) |

---

## 📂 4. Struktur Direktori Proyek

```
crack-fe-diba15/
├── docs/                               # Dokumentasi Arsitektur & Bisnis
│   ├── ARCHITECTURE_CHECKLIST.md       # Audit Prinsip SOLID, DRY, KISS
│   ├── BUSINESS_PROCESS.md             # Alur Proses Bisnis End-to-End
│   ├── LOGIC_DOCS.md                   # Logika Bisnis & Perhitungan Inti
│   ├── TEST_SCENARIO.md                # Skenario Pengujian Fungsional
│   └── TODO.md                         # Log Progres Pengembangan (TODO 1-16)
├── src/
│   ├── app/                            # Next.js App Router Pages & BFF API Routes
│   │   ├── (auth)/                     # Halaman Login, Signup, Forgot/Reset Password
│   │   ├── api/                        # Route Handlers BFF (/api/auth, /api/artwork, dll.)
│   │   ├── commissions/                # Detail Komisi & Halaman Pembayaran
│   │   ├── dashboard/                  # 8 Sub-Halaman Panel Admin & Kurator
│   │   ├── profile/                    # Profil Seniman/Klien & Kotak Banding
│   │   └── layout.tsx                  # Layout Global & Provider Wrapper
│   ├── components/                     # Komponen UI Terisolasi & Modular
│   │   ├── dashboard/                  # Sub-Komponen Dashboard (Spotlight, Filter Toolbars, Modals)
│   │   ├── ui/                         # Komponen Presentasional Generik (DataTable, Stat, Modal)
│   │   └── ...
│   ├── hooks/                          # Kustom Hooks TanStack Query & Utility
│   ├── lib/                            # Konfigurasi Axios & Centralized Query Keys
│   ├── store/                          # Zustand Global Stores (UserStore, ToastStore, ModalStore)
│   ├── types/                          # Kontrak Tipe Data Terpusat (Shared Interfaces)
│   └── utils/                          # Helper Formatters (Price, Date, Columns)
├── biome.json                          # Konfigurasi Linter Biome
├── package.json                        # Dependencies & Script Eksekusi
└── tsconfig.json                       # Konfigurasi TypeScript
```

---

## ⚙️ 5. Panduan Instalasi & Menjalankan Aplikasi (*Getting Started*)

### 1. Prasyarat (*Prerequisites*)
Pastikan telah menginstal [Bun](https://bun.sh/) pada sistem Anda:
```bash
bun --version
```

### 2. Instalasi Dependensi
```bash
bun install
```

### 3. Konfigurasi Environment Variables (`.env.local`)
Salin atau buat berkas `.env.local` pada *root directory* frontend:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 4. Menjalankan Server Development
```bash
bun run dev
```
Aplikasi akan berjalan pada port default: [http://localhost:3000](http://localhost:3000).

---

## 🧪 6. Pengujian & Jaminan Kualitas (*Quality Gates*)

Frontend TruBrush menerapkan pengujian kualitas kode ketat sebelum rilis:

```bash
# 1. Pengecekan Linting & Formatting dengan Biome (0 Error, 0 Warning)
bun run check

# 2. Kompilasi Produksi Next.js (60/60 Rute Terkompilasi Sukses)
bun run build
```

---

## 📖 7. Referensi Dokumentasi Tambahan

Untuk pemahaman alur kerja dan formula perhitungan lebih mendalam, silakan baca dokumentasi di folder `docs/`:
- 📄 [**Alur Bisnis Lengkap (BUSINESS_PROCESS.md)**](file:///d:/Revou/Assignment/crack_project/crack-fe-diba15/docs/BUSINESS_PROCESS.md)
- 📐 [**Dokumentasi Logika & Formula Matematika (LOGIC_DOCS.md)**](file:///d:/Revou/Assignment/crack_project/crack-fe-diba15/docs/LOGIC_DOCS.md)
- 🧪 [**Matriks Skenario Pengujian (TEST_SCENARIO.md)**](file:///d:/Revou/Assignment/crack_project/crack-fe-diba15/docs/TEST_SCENARIO.md)
- ✅ [**Daftar Capaian Fitur (TODO.md)**](file:///d:/Revou/Assignment/crack_project/crack-fe-diba15/docs/TODO.md)