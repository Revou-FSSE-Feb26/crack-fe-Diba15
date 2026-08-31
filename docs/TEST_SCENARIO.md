# 🧪 Naskah Skenario Pengujian Manual (Step-by-Step Test Script) TruBrush

Dokumen ini merupakan panduan skenario pengujian manual langkah demi langkah (*Step-by-Step Manual Test Script*) untuk memvalidasi seluruh fitur, alur bisnis, hak akses (*RBAC*), dan antarmuka pada platform **TruBrush**.

> [!WARNING]
> **Peringatan Status Data (*Data State*) Sebelum Pengujian Berulang / Test Automation:**
> Jika Anda menjalankan pengujian manual secara berulang atau menggunakan otomasi (*Postman Collection Runner*), pastikan database berada dalam kondisi data awal (*fresh state*).
> Menguji alur bisnis transaksional (seperti sengketa komisi, penerimaan pesanan, atau pembekuan akun) pada data yang sudah termutasi dapat memicu penolakan validasi (*conflict / already responded*).
>
> 💡 **Solusi / Rekomendasi:**
> Jalankan perintah *seeding* database di terminal backend sebelum memulai sesi pengujian baru:
> ```bash
> pnpm prisma db seed
> ```

---

## 🔑 Kredensial Akun Pengujian (Seed Accounts)

| Role | Nama Pengguna | Email Akun | Kata Sandi | Saldo Awal |
|---|---|---|---|---|
| **Admin** | Admin TruBrush (`u-007`) | `admin@trubrush.com` | `admin123` | Rp 0 |
| **Curator** | Hendra Kurniawan (`u-008`) | `hendra@trubrush.com` | `curator123` | Rp 0 |
| **Artist (Verified)** | Nadia Suryani (`u-002`) | `nadia@example.com` | `artist123` | Rp 0 |
| **Artist (Verified)** | Ari Ramadan (`u-001`) | `ari@example.com` | `artist123` | Rp 0 |
| **Artist (Unverified)** | Rina Pertiwi (`u-004`) | `rina@example.com` | `artist123` | Rp 0 |
| **Artist (Banned / 5 Strikes)** | Fajar Nugroho (`u-009`) | `fajar@example.com` | `artist123` | Rp 0 |
| **Client** | Dimas Prasetyo (`u-005`) | `dimas@example.com` | `client123` | Rp 2.000.000 |

---

## 📑 Daftar Modul Pengujian

1. [Modul 01: Autentikasi & Manajemen Sesi](#modul-01-autentikasi--manajemen-sesi)
2. [Modul 02: Manajemen Profil & Pengaturan Seniman](#modul-02-manajemen-profil--pengaturan-seniman)
3. [Modul 03: Feed Publik, Eksplorasi, Pencarian & Infinite Scroll](#modul-03-feed-publik-eksplorasi-pencarian--infinite-scroll)
4. [Modul 04: Unggah Karya Seni & Kurasi Anti-AI](#modul-04-unggah-karya-seni--kurasi-anti-ai)
5. [Modul 05: Siklus Penuh Komisi & Rekening Bersama Escrow](#modul-05-siklus-penuh-komisi--rekening-bersama-escrow)
6. [Modul 06: Dompet Digital, Top Up & Pencairan Dana (Withdraw)](#modul-06-dompet-digital-top-up--pencairan-dana-withdraw)
7. [Modul 07: Sengketa Komisi & Mediasi Admin](#modul-07-sengketa-komisi--mediasi-admin)
8. [Modul 08: Pelaporan Karya, Penalti Strike & Banding Akun](#modul-08-pelaporan-karya-penalti-strike--banding-akun)
9. [Modul 09: Interaksi Sosial (Follow & Favorite)](#modul-09-interaksi-sosial-follow--favorite)
10. [Modul 10: Dashboard Eksekutif & Manajemen Admin](#modul-10-dashboard-eksekutif--manajemen-admin)

---

## Modul 01: Autentikasi & Manajemen Sesi

### TC-AUTH-01: Registrasi Akun Seniman Baru (Artist Registration)
* **Aktor / Role:** Tamu (*Guest / Unauthenticated User*)
* **Prasyarat:** Pengguna belum login dan berada pada halaman awal `http://localhost:3000`.
* **Data Uji:**
  - Nama Lengkap: `Budi Hartono Artist`
  - Email: `budi.tester@example.com`
  - Kata Sandi: `secret123`
  - Peran (*Role*): `artist`
* **Langkah-Langkah Pengujian:**
  1. Buka browser dan akses URL `http://localhost:3000/register`.
  2. Isi formulir pendaftaran:
     - Masukkan Nama Lengkap: `Budi Hartono Artist`.
     - Masukkan Email: `budi.tester@example.com`.
     - Masukkan Password: `secret123`.
     - Pilih Role: **Artist (Seniman)**.
  3. Klik tombol **Daftar Sekarang**.
* **Hasil yang Diharapkan:**
  - Muncul notifikasi toast sukses pendaftaran.
  - Pengguna langsung login secara otomatis atau diarahkan ke halaman login `/login`.
  - Navbar menampilkan nama pengguna dan menu khusus seniman (misal tombol *Post Art*).
* **Kriteria Sukses:** Pengguna terdaftar di database dengan `role: "artist"`.

---

### TC-AUTH-02: Registrasi Akun Klien Baru (Client Registration)
* **Aktor / Role:** Tamu (*Guest*)
* **Prasyarat:** Pengguna belum login.
* **Data Uji:**
  - Nama Lengkap: `Siti Kolektor`
  - Email: `siti.client@example.com`
  - Kata Sandi: `secret123`
  - Peran (*Role*): `client`
* **Langkah-Langkah Pengujian:**
  1. Buka halaman `http://localhost:3000/register`.
  2. Isi formulir dengan data uji di atas dan pilih role **Client (Klien/Kolektor)**.
  3. Klik tombol **Daftar Sekarang**.
* **Hasil yang Diharapkan:**
  - Pendaftaran berhasil dan pengguna dialihkan ke halaman utama feed `/`.
  - Navbar menampilkan informasi saldo dompet awal (Rp 0) dan menu pesanan komisi.
* **Kriteria Sukses:** Akun tersimpan dengan `role: "client"`.

---

### TC-AUTH-03: Login Multi-Role (Artist, Client, Curator, Admin)
* **Aktor / Role:** Seluruh Role Pengguna
* **Prasyarat:** Server backend berjalan pada port 3001 dan frontend pada port 3000.
* **Langkah-Langkah Pengujian:**
  1. Akses `http://localhost:3000/login`.
  2. Uji login secara bergantian menggunakan 4 kredensial berikut:
     - **Artist:** `ari@example.com` / `artist123` $\rightarrow$ Akses fitur posting karya & komisi.
     - **Client:** `dimas@example.com` / `client123` $\rightarrow$ Akses dompet & pesanan komisi.
     - **Curator:** `hendra@trubrush.com` / `curator123` $\rightarrow$ Akses dashboard antrean kurasi.
     - **Admin:** `admin@trubrush.com` / `admin123` $\rightarrow$ Akses dashboard kontrol penuh.
  3. Klik tombol **Masuk**.
* **Hasil yang Diharapkan:**
  - Token otentikasi JWT tersimpan di browser (state/cookies).
  - Tampilan navigasi dan menu dashboard menyesuaikan hak akses (*RBAC*) masing-masing role secara presisi.
* **Kriteria Sukses:** Login berhasil tanpa error 401 dan diarahkan ke rute yang sesuai.

---

### TC-AUTH-04: Login dengan Kredensial Tidak Valid (Negative Test)
* **Aktor / Role:** Tamu (*Guest*)
* **Data Uji:** Email: `invalid@example.com`, Password: `wrongpassword`.
* **Langkah-Langkah Pengujian:**
  1. Buka `http://localhost:3000/login`.
  2. Masukkan email dan password salah.
  3. Klik **Masuk**.
* **Hasil yang Diharapkan:**
  - Form tidak berpindah halaman.
  - Muncul pesan peringatan error: *"Email atau password salah"*.
* **Kriteria Sukses:** Sistem menolak otentikasi (HTTP 401) dan UI menampilkan pesan kesalahan yang ramah pengguna.

---

### TC-AUTH-05: Logout Sesi Pengguna
* **Aktor / Role:** Pengguna yang sedang login
* **Langkah-Langkah Pengujian:**
  1. Pada pojok kanan atas Navbar, klik menu avatar/profil pengguna.
  2. Klik tombol **Keluar / Logout**.
* **Hasil yang Diharapkan:**
  - Sesi JWT dan cookies dihapus.
  - Navbar kembali ke kondisi publik (*Tamu*) dengan tombol *Masuk* dan *Daftar*.
  - Pengguna dialihkan ke halaman utama feed.
* **Kriteria Sukses:** Mencoba mengakses halaman terproteksi (seperti `/post-art` atau `/dashboard`) akan otomatis diredirect ke `/login`.

---

## Modul 02: Manajemen Profil & Pengaturan Seniman

### TC-PROF-01: Memperbarui Profil Pribadi & Bio
* **Aktor / Role:** Artist (`ari@example.com`)
* **Langkah-Langkah Pengujian:**
  1. Login sebagai `ari@example.com`.
  2. Akses halaman profil pribadi melalui tombol avatar di navbar $\rightarrow$ **Profil Saya** (`/profile`).
  3. Klik tombol **Edit Profil**.
  4. Perbarui data:
     - Bio: `Illustrator digital spesialis cat air, lanskap nusantara, dan konsep fantasi.`
     - URL Instagram / Twitter: `https://instagram.com/ariramadan.art`
  5. Klik tombol **Simpan Perubahan**.
* **Hasil yang Diharapkan:**
  - Muncul notifikasi toast *"Profil berhasil diperbarui"*.
  - Data bio dan tautan sosial media langsung ter-update seketika (*reactive UI*).
* **Kriteria Sukses:** Perubahan tersimpan di database pada tabel `profiles`.

---

### TC-PROF-02: Memeriksa Lencana Terverifikasi (Verified Badge)
* **Aktor / Role:** Client (`dimas@example.com`) atau Tamu
* **Langkah-Langkah Pengujian:**
  1. Buka halaman detail artis terverifikasi: `http://localhost:3000/artist/u-001`.
  2. Perhatikan bagian header profil seniman Ari Ramadan.
  3. Buka halaman artis yang belum terverifikasi: `http://localhost:3000/artist/u-004` (Rina Pertiwi).
* **Hasil yang Diharapkan:**
  - Pada `u-001`: Terlihat lencana centang biru/emas **"Verified Human Artist"** beserta jumlah portofolio yang disetujui kurator.
  - Pada `u-004`: Tidak terdapat lencana verified.
* **Kriteria Sukses:** Indikator visual verifikasi kurator tampil akurat sesuai data relasi `profile.isVerified`.

---

## Modul 03: Feed Publik, Eksplorasi, Pencarian & Infinite Scroll

### TC-FEED-01: Eksplorasi Feed dengan Infinite Scroll (Batch 6 Karya)
* **Aktor / Role:** Tamu / Seluruh Pengguna
* **Prasyarat:** Database memiliki lebih dari 6 karya seni terpublikasi.
* **Langkah-Langkah Pengujian:**
  1. Akses halaman beranda utama `http://localhost:3000/`.
  2. Perhatikan 6 karya seni awal yang termuat pada grid feed.
  3. Gulir (*scroll down*) halaman ke bawah hingga mendekati footer.
* **Hasil yang Diharapkan:**
  - Muncul indikator *loading spinner / skeleton*.
  - Sistem otomatis memuat 6 karya seni berikutnya secara *seamless* tanpa perlu me-reload seluruh halaman (*Infinite Scroll* aktif).
* **Kriteria Sukses:** Data bertambah secara berurutan sesuai pagination batch 6 item.

---

### TC-FEED-02: Pencarian Karya Seni (Search by Title)
* **Aktor / Role:** Seluruh Pengguna
* **Langkah-Langkah Pengujian:**
  1. Pada bilah pencarian (*search bar*) beranda utama, ketik kata kunci: `Merapi`.
  2. Tekan Enter atau tunggu *debounced search* berjalan.
* **Hasil yang Diharapkan:**
  - Grid karya seni memfilter hasil secara instan.
  - Menampilkan karya dengan judul *"Lembah Merapi di Pagi Hari"* dan menyembunyikan karya yang tidak relevan.
* **Kriteria Sukses:** Query API `GET /api/artworks?search=Merapi` terpanggil dan menampilkan hasil yang cocok.

---

### TC-FEED-03: Filter Berdasarkan Tag / Kategori
* **Aktor / Role:** Seluruh Pengguna
* **Langkah-Langkah Pengujian:**
  1. Klik salah satu pill tag populer di bawah search bar, misalnya tag **`cat air`** atau **`cyberpunk`**.
* **Hasil yang Diharapkan:**
  - Pill tag yang dipilih berubah status menjadi aktif (*highlighted*).
  - Feed hanya menampilkan karya-karya yang memiliki relasi dengan tag tersebut.
* **Kriteria Sukses:** URL query atau state filter terbarui (`?tag=cat+air`) dan data feed tersaring benar.

---

### TC-FEED-04: Membuka Halaman Detail Karya Seni
* **Aktor / Role:** Seluruh Pengguna
* **Langkah-Langkah Pengujian:**
  1. Klik pada salah satu kartu karya seni di feed (misal karya ID `a-001`).
* **Hasil yang Diharapkan:**
  - Halaman berpindah ke `/artworks/a-001`.
  - Menampilkan gambar resolusi tinggi, nama artis pembuat, deskripsi, daftar tag, lencana status kurasi anti-AI, tombol suka (*Favorite*), dan tombol aksi pemesanan komisi.
* **Kriteria Sukses:** Halaman detail karya seni termuat lengkap (HTTP 200).

---

## Modul 04: Unggah Karya Seni & Kurasi Anti-AI

### TC-ART-01: Seniman Mengunggah Karya Seni Original dengan Bukti WIP
* **Aktor / Role:** Artist (`ari@example.com`)
* **Langkah-Langkah Pengujian:**
  1. Login sebagai artist `ari@example.com`.
  2. Klik tombol **Post Art** di Navbar atau akses `http://localhost:3000/post-art`.
  3. Isi formulir upload artwork:
     - Judul Karya: `Pahlawan Senja Digital Manual`
     - Deskripsi: `Ilustrasi digital karakter pendekar nusantara dengan pencahayaan senja.`
     - URL Gambar Utama: `https://picsum.photos/seed/pahlawansenja/800/600`
     - Tipe Upload: Pilih **Original Artwork**
     - Opsi Kurasi: **Centang / Aktifkan "Minta Kurasi Anti-AI"**
     - URL Bukti Sketsa / Layer WIP: `https://picsum.photos/seed/pahlawansenja-wip/800/600`
     - Tag: `digital_art`, `nusantara`
  4. Klik tombol **Unggah Karya**.
* **Hasil yang Diharapkan:**
  - Muncul toast notifikasi sukses: *"Karya berhasil diunggah dan sedang menunggu peninjauan kurator"*.
  - Karya berstatus `pending` dan **BELUM muncul di feed publik**.
  - Karya dapat dilihat oleh seniman yang bersangkutan di halaman profil pribadinya dengan badge `Menunggu Kurasi`.
* **Kriteria Sukses:** Karya tercatat di database dengan `curationStatus: "pending"` dan `isVisibleOnFeed: false`.

---

### TC-ART-02: Seniman Mengunggah Fanart Tanpa Kurasi
* **Aktor / Role:** Artist (`ari@example.com`)
* **Langkah-Langkah Pengujian:**
  1. Buka halaman `/post-art`.
  2. Masukkan Judul: `Fanart Karakter Anime`, pilih tipe **Fanart**, dan jangan centang kurasi.
  3. Klik **Unggah Karya**.
* **Hasil yang Diharapkan:**
  - Karya langsung terbit dan **seketika muncul di feed publik** tanpa melalui antrean moderasi kurator.
* **Kriteria Sukses:** Karya tercatat dengan `isVisibleOnFeed: true` dan `curationStatus: "approved"` / default.

---

### TC-ART-03: Kurator Memeriksa Antrean Pending Kurasi
* **Aktor / Role:** Curator (`hendra@trubrush.com`)
* **Langkah-Langkah Pengujian:**
  1. Login sebagai kurator `hendra@trubrush.com`.
  2. Buka menu dashboard kurator: `http://localhost:3000/dashboard/review-artworks`.
* **Hasil yang Diharapkan:**
  - Tabel memuat daftar seluruh karya dengan status `pending` yang membutuhkan peninjauan.
  - Setiap baris menampilkan pratinjau gambar karya, bukti WIP (sketsa/layer), nama seniman, dan tombol aksi **Review / Tindak Lanjuti**.
* **Kriteria Sukses:** Query `GET /api/artworks/pending` berhasil memuat antrean kurasi.

---

### TC-ART-04: Kurator Menyetujui Karya (Approve)
* **Aktor / Role:** Curator (`hendra@trubrush.com`)
* **Langkah-Langkah Pengujian:**
  1. Pada baris karya yang pending di `/dashboard/review-artworks`, klik tombol **Review**.
  2. Modal kurasi terbuka menampilkan gambar karya utama berdampingan dengan gambar bukti sketsa WIP.
  3. Masukkan feedback/catatan kurasi (opsional).
  4. Klik tombol hijau **Setujui (Approve & Verifikasi Human-Made)**.
* **Hasil yang Diharapkan:**
  - Notifikasi sukses: *"Karya berhasil diverifikasi dan diterbitkan ke feed publik"*.
  - Karya hilang dari antrean pending dan kini **muncul di feed publik** dengan lencana verified.
  - Jumlah portofolio terverifikasi seniman (`approvedPortfolioCount`) bertambah +1.
* **Kriteria Sukses:** Status karya di DB berubah menjadi `curationStatus: "approved"` dan `isVisibleOnFeed: true`.

---

### TC-ART-05: Kurator Menolak Karya (Reject)
* **Aktor / Role:** Curator (`hendra@trubrush.com`)
* **Langkah-Langkah Pengujian:**
  1. Pada karya pending di modal kurasi, klik tombol merah **Tolak (Reject)**.
  2. Masukkan alasan penolakan: `Bukti proses pengerjaan terindikasi artefak AI dan tidak memiliki layer sketsa mentah.`
  3. Klik konfirmasi **Tolak Karya**.
* **Hasil yang Diharapkan:**
  - Notifikasi sukses: *"Karya ditolak"*.
  - Karya tetap tidak tampil di feed publik dan hanya dapat dilihat oleh pemiliknya di halaman profil dengan status `Ditolak`.
* **Kriteria Sukses:** Status karya di DB berubah menjadi `curationStatus: "rejected"` dan `isVisibleOnFeed: false`.

---

## Modul 05: Siklus Penuh Komisi & Rekening Bersama Escrow

### TC-COM-01: Klien Memesan Komisi ke Seniman Terverifikasi
* **Aktor / Role:** Client (`dimas@example.com`)
* **Prasyarat:** Seniman Ari Ramadan (`u-001`) berstatus *Verified* dan *Open for Commission*.
* **Langkah-Langkah Pengujian:**
  1. Login sebagai `dimas@example.com`.
  2. Kunjungi profil artis `http://localhost:3000/artist/u-001`.
  3. Klik tombol **Pesan Komisi (Order Commission)**.
  4. Isi formulir modal pesanan komisi:
     - Judul Komisi: `Desain Maskot Game Nusantara`
     - Deskripsi Brief: `Karakter kancil berpakaian adat jawa dengan gaya modern cyberpunk.`
     - Harga Kesepakatan: `Rp 500.000`
  5. Klik tombol **Kirim Pesanan Komisi**.
* **Hasil yang Diharapkan:**
  - Toast sukses: *"Pesanan komisi berhasil diajukan"*.
  - Pesanan berstatus `pending` dan muncul di daftar komisi klien (`/commissions`).
* **Kriteria Sukses:** Record komisi terbentuk dengan `status: "pending"` dan `paymentStatus: "unpaid"`.

---

### TC-COM-02: Seniman Menerima Pesanan Komisi
* **Aktor / Role:** Artist (`nadia@example.com`)
* **Langkah-Langkah Pengujian:**
  1. Login sebagai `nadia@example.com`.
  2. Buka menu **Komisi Saya** (`/commissions`).
  3. Temukan pesanan komisi baru yang berstatus `Menunggu Respon Artis`.
  4. Klik tombol **Terima Komisi (Accept)**.
* **Hasil yang Diharapkan:**
  - Status pesanan komisi berubah menjadi `in_progress` (Menunggu Pembayaran Klien ke Escrow).
* **Kriteria Sukses:** Endpoint `PATCH /api/commissions/:id/respond` sukses dengan `{ status: "in_progress" }`.

---

### TC-COM-03: Klien Membayar Dana Komisi ke Rekening Bersama Escrow
* **Aktor / Role:** Client (`dimas@example.com`, Saldo Dompet Rp 2.000.000)
* **Langkah-Langkah Pengujian:**
  1. Login sebagai `dimas@example.com`.
  2. Buka halaman pesanan komisi yang baru diterima seniman.
  3. Klik tombol **Lanjut ke Pembayaran Escrow**.
  4. Halaman pembayaran khusus terbuka: `http://localhost:3000/commissions/:id/payment`.
  5. Periksa rincian:
     - Harga Komisi: `Rp 500.000`
     - Jaminan Escrow Platform: Terproteksi 100%
  6. Pilih metode pembayaran: **Saldo Dompet TruBrush**.
  7. Klik tombol **Bayar Sekarang (Kunci Dana di Rekening Bersama Escrow)**.
* **Hasil yang Diharapkan:**
  - Muncul modal konfirmasi pembayaran sukses.
  - Saldo dompet klien terpotong otomatis dari Rp 2.000.000 menjadi **Rp 1.500.000**.
  - Status pembayaran komisi berubah menjadi **`paid` (Dana Aman di Escrow)**.
  - Tercatat mutasi pembayaran di buku kas transaksi.
* **Kriteria Sukses:** Dana tersimpan di status escrow, artis dapat mulai mengunggah sketsa.

---

### TC-COM-04: Seniman Mengunggah Sketsa Awal (Sketch Progress)
* **Aktor / Role:** Artist (`nadia@example.com`)
* **Langkah-Langkah Pengujian:**
  1. Login sebagai artist `nadia@example.com` dan buka detail komisi terkait.
  2. Pada tahapan *Progress Komisi*, klik **Unggah Sketsa Awal**.
  3. Masukkan URL sketsa: `https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80`.
  4. Klik **Simpan & Kirim ke Klien**.
* **Hasil yang Diharapkan:**
  - Pratinjau gambar sketsa muncul pada linimasa komisi.
  - Klien menerima pemberitahuan untuk meninjau sketsa.
* **Kriteria Sukses:** Field `progress.sketchUrl` terisi dan `sketchApproved: false`.

---

### TC-COM-05: Klien Mengajukan Catatan Revisi Sketsa
* **Aktor / Role:** Client (`dimas@example.com`)
* **Langkah-Langkah Pengujian:**
  1. Login sebagai klien dan buka halaman detail komisi.
  2. Periksa sketsa yang diunggah artis.
  3. Pada bagian feedback, klik **Minta Revisi**.
  4. Masukkan komentar: `Mohon buat proporsi kepala karakter sedikit lebih ramping.`
  5. Klik **Kirim Revisi**.
* **Hasil yang Diharapkan:**
  - Catatan revisi tersimpan pada riwayat percakapan revisi.
  - Status komisi berlabel `Dalam Revisi`.
* **Kriteria Sukses:** Record revisi terbentuk di tabel `revisions`.

---

### TC-COM-06: Klien Menyetujui Sketsa & Seniman Mengunggah Hasil Akhir
* **Aktor / Role:** Client & Artist bergantian
* **Langkah-Langkah Pengujian:**
  1. Klien mengklik **Setujui Sketsa (Approve Sketch)** $\rightarrow$ Status sketsa menjadi terverifikasi hijau.
  2. Artist login dan mengunggah berkas final:
     - URL Preview Hasil Akhir: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80`
     - URL Master File (PSD/ZIP): `https://example.com/storage/final-master.zip`
  3. Klik **Kirim Hasil Akhir**.
* **Hasil yang Diharapkan:**
  - Preview karya final dan link download berkas resolusi penuh muncul untuk ditinjau klien.
* **Kriteria Sukses:** `progress.finalArtworkUrl` dan `progress.finalFileUrl` tersimpan.

---

### TC-COM-07: Klien Menyetujui Hasil Akhir & Pelepasan Dana Escrow (95/5%)
* **Aktor / Role:** Client (`dimas@example.com`) & Artist (`nadia@example.com`)
* **Langkah-Langkah Pengujian:**
  1. Klien membuka halaman komisi dan mengklik tombol hijau **Setujui & Selesaikan Komisi**.
  2. Artis login dan mengklik **Klaim Penyelesaian & Rilis Escrow** (`/complete`).
* **Hasil yang Diharapkan:**
  - Status komisi berubah menjadi **`completed`** dan status pembayaran menjadi **`released`**.
  - **Kalkulasi Finansial Escrow Cair:**
    - Platform Fee 5%: $500.000 \times 5\% =$ **Rp 25.000** (masuk ke pendapatan platform).
    - Net Payout Seniman 95%: $500.000 - 25.000 =$ **Rp 475.000** (otomatis bertambah ke saldo dompet seniman `nadia@example.com`).
  - Saldo dompet seniman `nadia@example.com` bertambah dari Rp 0 menjadi **Rp 475.000**.
* **Kriteria Sukses:** Dana escrow terdistribusi 95% ke artis dan 5% ke platform secara akurat.

---

## Modul 06: Dompet Digital, Top Up & Pencairan Dana (Withdraw)

### TC-WAL-01: Top Up Saldo Dompet Klien
* **Aktor / Role:** Client (`dimas@example.com`)
* **Langkah-Langkah Pengujian:**
  1. Akses menu saldo dompet di navbar $\rightarrow$ Klik **Top Up Saldo** (`/topup`).
  2. Pilih nominal cepat: **Rp 500.000**.
  3. Pilih metode: **Transfer Bank Virtual Account (Simulasi)**.
  4. Klik **Konfirmasi Top Up**.
* **Hasil yang Diharapkan:**
  - Muncul toast notifikasi sukses: *"Top up saldo sebesar Rp 500.000 berhasil"*.
  - Saldo dompet pengguna langsung bertambah secara instan.
* **Kriteria Sukses:** Mutasi tipe `topup` berstatus `success` tercatat di riwayat transaksi.

---

### TC-WAL-02: Seniman Menarik Dana Penghasilan (Withdraw $\ge$ Rp 100.000)
* **Aktor / Role:** Artist (`nadia@example.com`, Saldo Dompet Rp 475.000)
* **Langkah-Langkah Pengujian:**
  1. Login sebagai `nadia@example.com`.
  2. Akses halaman pencairan dana: `http://localhost:3000/withdraw`.
  3. Masukkan rincian penarikan:
     - Nominal Penarikan: `Rp 200.000` (memenuhi minimal Rp 100.000)
     - Bank Tujuan: `BCA`
     - Nomor Rekening: `1234567890`
     - Nama Pemilik Rekening: `Ari Ramadan`
  4. Klik tombol **Ajukan Pencairan Dana**.
* **Hasil yang Diharapkan:**
  - Toast sukses: *"Permohonan penarikan dana sebesar Rp 200.000 berhasil diproses"*.
  - Saldo dompet seniman terpotong dari Rp 475.000 menjadi **Rp 275.000**.
* **Kriteria Sukses:** Record mutasi tipe `withdrawal` tercatat di buku kas.

---

### TC-WAL-03: Validasi Error Penarikan Dana (Negative Test)
* **Aktor / Role:** Artist (`ari@example.com`, Saldo Rp 275.000)
* **Langkah-Langkah Pengujian:**
  1. Buka `/withdraw`.
  2. Uji Kasus A: Masukkan nominal `Rp 50.000` (kurang dari syarat batas minimal Rp 100.000) $\rightarrow$ Klik Ajukan.
  3. Uji Kasus B: Masukkan nominal `Rp 500.000` (melebihi saldo dompet yang tersedia) $\rightarrow$ Klik Ajukan.
* **Hasil yang Diharapkan:**
  - Kasus A: Muncul pesan validasi error: *"Minimal penarikan dana adalah Rp 100.000"*.
  - Kasus B: Muncul pesan error: *"Saldo dompet tidak mencukupi"*.
  - Saldo dompet tidak berubah.
* **Kriteria Sukses:** Sistem menolak penarikan yang tidak memenuhi syarat (HTTP 400).

---

## Modul 07: Sengketa Komisi & Mediasi Admin

### TC-DISP-01: Klien Mengajukan Sengketa Komisi Aktif
* **Aktor / Role:** Client (`dimas@example.com`)
* **Prasyarat:** Memiliki pesanan komisi aktif (`c-002` berstatus `in_progress` & `paid`).
* **Langkah-Langkah Pengujian:**
  1. Login sebagai `dimas@example.com`.
  2. Buka halaman detail komisi `c-002`.
  3. Klik tombol **Ajukan Sengketa (File Dispute)**.
  4. Masukkan alasan sengketa: `Seniman tidak merespons dan melewati batas waktu kesepakatan lebih dari 7 hari.`
  5. Klik **Kirim Laporan Sengketa**.
* **Hasil yang Diharapkan:**
  - Notifikasi sukses: *"Sengketa komisi berhasil diajukan ke tim mediator"*.
  - Status komisi berlabel `Dalam Sengketa / Mediasi`.
* **Kriteria Sukses:** Record sengketa terbentuk di tabel `dispute_logs` dengan status `pending`.

---

### TC-DISP-02: Admin Melakukan Mediasi & Refund Dana Escrow
* **Aktor / Role:** Admin (`admin@trubrush.com`)
* **Langkah-Langkah Pengujian:**
  1. Login sebagai admin `admin@trubrush.com`.
  2. Akses menu **Tinjau Sengketa**: `http://localhost:3000/dashboard/review-disputes`.
  3. Klik tombol **Mediasi / Tindak Lanjuti** pada sengketa komisi terkait.
  4. Periksa bukti percakapan dan batas waktu.
  5. Pilih keputusan: **Menangkan Klien (Refund Dana 100% & Berikan Sanksi Strike ke Artis)**.
  6. Masukkan catatan resolusi: `Terbukti seniman melanggar batas waktu SLA pengerjaan.`
  7. Klik **Putuskan Sengketa**.
* **Hasil yang Diharapkan:**
  - Dana escrow senilai harga komisi dikembalikan penuh (100%) ke saldo dompet klien.
  - Artis yang melanggar menerima akumulasi **+1 Strike penalti**.
  - Status komisi berubah menjadi `cancelled` dan status sengketa `approved`.
* **Kriteria Sukses:** Saldo klien bertambah kembali dan strike count artis meningkat.

---

## Modul 08: Pelaporan Karya, Penalti Strike & Banding Akun

### TC-REP-01: Pengguna Melaporkan Karya Terindikasi AI
* **Aktor / Role:** Client (`dimas@example.com`)
* **Langkah-Langkah Pengujian:**
  1. Buka salah satu halaman karya seni di `/artworks/:id`.
  2. Klik tombol **Laporkan Karya (Report Artwork)**.
  3. Pilih alasan: **Terindikasi Hasil Generasi AI Tanpa Deklarasi**.
  4. Masukkan detail laporan tambahan.
  5. Klik **Kirim Laporan**.
* **Hasil yang Diharapkan:**
  - Toast sukses: *"Laporan Anda telah dikirim ke kurator untuk ditinjau"*.
* **Kriteria Sukses:** Record laporan terbentuk di tabel `reports` dengan `status: "pending"`.

---

### TC-REP-02: Kurator Menyetujui Laporan Pelanggaran (Takedown & Strike)
* **Aktor / Role:** Curator (`hendra@trubrush.com`)
* **Langkah-Langkah Pengujian:**
  1. Buka dashboard kurator: `http://localhost:3000/dashboard/review-reports`.
  2. Klik **Tinjau Laporan**.
  3. Klik tombol merah **Setujui Laporan (Take Down Karya & Tambah 1 Strike)**.
* **Hasil yang Diharapkan:**
  - Karya seni bersangkutan otomatis disembunyikan dari feed publik (`isVisibleOnFeed: false`).
  - Seniman pemilik karya menerima **+1 Strike Pelanggaran**.
* **Kriteria Sukses:** Akun artis terakumulasi strike-nya. Jika mencapai $\ge 3$ strike, akun otomatis berstatus *Banned / Suspended*.

---

### TC-APP-01: Seniman Mengajukan Banding Pemblokiran Akun
* **Aktor / Role:** Artist dengan akun terblokir (`fajar@example.com` / `artist123`, `strikeCount: 5`)
* **Langkah-Langkah Pengujian:**
  1. Login sebagai artis terblokir `fajar@example.com` (`artist123`).
  2. Buka halaman profil `/profile`.
  3. Pada kotak peringatan *Artist Appeal Box*, masukkan alasan banding: `Saya melampirkan rekaman video pembuatan karya dari kanvas kosong dan file PSD 20 layer asli.`
  4. Klik **Ajukan Permohonan Banding**.
* **Hasil yang Diharapkan:**
  - Toast sukses: *"Permohonan banding Anda telah dikirim ke Admin"*.
* **Kriteria Sukses:** Record banding tersimpan di tabel `appeals` dengan status `pending`.

---

### TC-APP-02: Admin Meninjau & Menyetujui Banding (Reset Strike ke 0)
* **Aktor / Role:** Admin (`admin@trubrush.com`)
* **Langkah-Langkah Pengujian:**
  1. Login sebagai admin dan buka `http://localhost:3000/dashboard/manage-users`.
  2. Buka tab atau klik tombol **Tinjau Banding (Review Appeal)** pada user yang mengajukan banding.
  3. Periksa bukti berkas yang dilampirkan artis.
  4. Klik tombol **Setujui Banding (Pulihkan Akun & Reset Strike ke 0)**.
* **Hasil yang Diharapkan:**
  - Notifikasi sukses: *"Banding disetujui. Akun seniman telah dipulihkan"*.
  - Jumlah strike seniman kembali menjadi **0**, status pemblokiran dicabut, dan seniman dapat kembali menerima komisi.
* **Kriteria Sukses:** `strikeCount` seniman di-reset menjadi 0 di database.

---

## Modul 09: Interaksi Sosial (Follow & Favorite)

### TC-SOC-01: Mengikuti & Berhenti Mengikuti Seniman (Follow / Unfollow)
* **Aktor / Role:** Client (`dimas@example.com`)
* **Langkah-Langkah Pengujian:**
  1. Buka profil artis `http://localhost:3000/artist/u-001`.
  2. Klik tombol **Ikuti (Follow)** $\rightarrow$ Tombol berubah menjadi warna abu-abu bertuliskan **Mengikuti (Following)**.
  3. Klik sekali lagi tombol tersebut $\rightarrow$ Tombol kembali bertuliskan **Ikuti (Follow)** (*Toggle Unfollow*).
* **Hasil yang Diharapkan:**
  - Status follow langsung berubah responsif tanpa reload halaman.
* **Kriteria Sukses:** Relasi follow ditambahkan/dihapus pada tabel `follows`.

---

### TC-SOC-02: Menyukai & Membatalkan Suka Karya Seni (Favorite Toggle)
* **Aktor / Role:** Client (`dimas@example.com`)
* **Langkah-Langkah Pengujian:**
  1. Pada kartu karya seni di feed atau halaman detail `/artworks/a-001`, klik ikon hati (**Love / Favorite**).
  2. Ikon hati berubah menjadi merah menyala dan jumlah favorit bertambah +1.
  3. Klik ikon hati sekali lagi $\rightarrow$ Ikon kembali kosong dan jumlah berkurang -1.
* **Hasil yang Diharapkan:**
  - Interaksi *like/favorite* tersimpan dan dapat dilihat pada halaman daftar karya yang disukai pengguna.
* **Kriteria Sukses:** Relasi favorite tercatat di tabel `favorites`.

---

## Modul 10: Dashboard Eksekutif & Manajemen Admin

### TC-ADM-01: Analisis Ringkasan Finansial Platform
* **Aktor / Role:** Admin (`admin@trubrush.com`)
* **Langkah-Langkah Pengujian:**
  1. Akses halaman laporan finansial eksekutif: `http://localhost:3000/dashboard/financial-reports`.
* **Hasil yang Diharapkan:**
  - Kartu metrik KPI menampilkan 4 indikator utama secara akurat:
    1. **Total GMV Transaksi Platform** (IDR)
    2. **Dana Aktif Tertahan di Escrow** (IDR)
    3. **Total Pendapatan Fee Platform 5%** (IDR)
    4. **Total Pencairan Dana ke Seniman (*Withdrawals*)** (IDR)
* **Kriteria Sukses:** Nilai kalkulasi matematis sinkron 100% dengan data agregasi tabel transaksi.

---

### TC-ADM-02: Audit Buku Kas Global & Filter Rentang Tanggal
* **Aktor / Role:** Admin (`admin@trubrush.com`)
* **Langkah-Langkah Pengujian:**
  1. Pada halaman `/dashboard/financial-reports`, gunakan toolbar filter:
     - Pilih Preset Rentang Tanggal: **Bulan Ini (This Month)** atau **Semua Waktu (All Time)**.
     - Pilih Filter Tipe Transaksi: **Platform Fee** / **Escrow Release**.
  2. Periksa tabel mutasi buku kas global.
* **Hasil yang Diharapkan:**
  - Baris tabel terfilter dinamis menampilkan ID transaksi, nama pengguna, tipe mutasi, nominal IDR, dan tanggal transaksi.
* **Kriteria Sukses:** Data buku kas memuat catatan audit keuangan lengkap.

---

### TC-ADM-03: Manajemen Pengguna & Pembuatan Akun Kurator
* **Aktor / Role:** Admin (`admin@trubrush.com`)
* **Langkah-Langkah Pengujian:**
  1. Akses menu kelola pengguna: `http://localhost:3000/dashboard/manage-users`.
  2. Klik tombol **Tambah Akun Kurator**.
  3. Masukkan Nama: `Staf Kurator Baru`, Email: `kurator.baru@trubrush.com`, Password: `curator123`.
  4. Klik **Simpan**.
* **Hasil yang Diharapkan:**
  - Akun kurator baru berhasil dibuat dan langsung muncul pada tabel tab *Curator*.
  - Akun tersebut dapat langsung digunakan untuk login ke portal kurasi.
* **Kriteria Sukses:** Pengguna baru tersimpan dengan role `curator`.

---

### TC-ADM-04: Manajemen Master Tag & Takedown Katalog Karya
* **Aktor / Role:** Admin (`admin@trubrush.com`)
* **Langkah-Langkah Pengujian:**
  1. Akses menu katalog tag: `http://localhost:3000/dashboard/manage-tags`.
  2. **Buat Tag Baru:** Masukkan nama tag `digital_oil_painting` $\rightarrow$ Klik Tambah Tag $\rightarrow$ Tag baru muncul di daftar katalog.
  3. **Takedown Karya:** Pada tab *Semua Karya*, temukan salah satu karya seni dan klik tombol **Sembunyikan dari Feed (Take Down)**.
  4. Buka feed publik beranda $\rightarrow$ Karya tersebut sudah tidak muncul.
  5. Kembali ke dashboard dan klik **Pulihkan Karya (Restore)** $\rightarrow$ Karya kembali muncul di feed publik.
* **Hasil yang Diharapkan:**
  - Operasi master tag (CRUD) dan visibilitas karya berfungsi presisi.
* **Kriteria Sukses:** Field `isVisibleOnFeed` berganti status `true/false` tanpa menghapus data karya.

---

### TC-ADM-05: Pemantauan Metrik Performa Kurator & Waktu Respons SLA
* **Aktor / Role:** Admin Only (`admin@trubrush.com`)
* **Langkah-Langkah Pengujian:**
  1. Buka dashboard performa kurator: `http://localhost:3000/dashboard/curator-performance`.
* **Hasil yang Diharapkan:**
  - Banner *Top Moderator Spotlight* menampilkan kurator dengan efisiensi tertinggi.
  - Tabel memuat metrik:
    - **Total Aksi Kurasi** (Jumlah karya yang diperiksa)
    - **Approval Rate (%)** (Rasio kelulusan karya)
    - **Rata-Rata Waktu Respons SLA** (Diformat rapi dalam format jam/menit).
* **Kriteria Sukses:** Indikator performa terhitung dinamis dari log riwayat tindakan kurator.

---

### TC-ADM-06: Pemantauan Rekam Jejak Audit Log Kronologis
* **Aktor / Role:** Admin (`admin@trubrush.com`)
* **Langkah-Langkah Pengujian:**
  1. Akses menu log audit: `http://localhost:3000/dashboard/audit-logs`.
  2. Gunakan filter kategori: `Curation`, `Dispute`, `Report`, `Appeal`.
* **Hasil yang Diharapkan:**
  - Menampilkan linimasa rekam jejak kronologis dari seluruh aktivitas sensitif yang dilakukan oleh Kurator dan Admin (waktu tindakan, ID aktor, deskripsi tindakan, dan target objek).
* **Kriteria Sukses:** Log audit menjamin transparansi operasional sistem.