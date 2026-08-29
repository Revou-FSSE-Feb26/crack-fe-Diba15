# 🧪 Skenario Pengujian Sistem TruBrush (Test Scenarios)

Dokumen ini merinci skenario pengujian fungsional dan bisnis *End-to-End (E2E)* pada platform **TruBrush**.

---

## 📋 Matriks Skenario Pengujian

### 1. Skenario Kurasi & Unggah Karya Seni (TODO 1, 5, 6, 16)
- **1.1 Unggah Karya dengan Opsi Kurasi:**
  - Artist mengunggah karya di `/post-art` dengan opsi kurasi anti-AI aktif.
  - *Hasil Diharapkan:* Karya berstatus `pending`, belum muncul di feed publik, dan masuk ke antrean `/dashboard/review-artworks`.
- **1.2 Kurasi Karya oleh Staf Kurator:**
  - Kurator membuka modal kurasi, memeriksa bukti sketsa/WIP, lalu menyetujui (*Approve*) atau menolak (*Reject*).
  - *Hasil Diharapkan:* Jika lolos, karya berstatus `approved` dengan badge `Verified` di feed publik; jika ditolak, karya berstatus `rejected` dan hanya muncul di profil seniman bersangkutan.
- **1.3 Takedown Karya oleh Admin:**
  - Admin melakukan takedown karya di `/dashboard/manage-tags` (tab Katalog Global).
  - *Hasil Diharapkan:* Karya disembunyikan dari feed publik (`isVisibleOnFeed: false`) tanpa menghapus catatan database dan dapat dipulihkan (*Restore*) kembali.

---

### 2. Skenario Siklus Komisi & Rekening Bersama Escrow (TODO 2, 7, 8)
- **2.1 Pemesanan & Pembayaran Komisi:**
  - Klien memesan komisi melalui tombol *Order Commission* di profil seniman terverifikasi.
  - Seniman menerima pesanan (`accepted`), klien diarahkan ke halaman pembayaran `/commissions/:id/payment`.
  - *Hasil Diharapkan:* Saldo klien dipotong ke escrow, status pesanan menjadi `paid`, dan tercatat mutasi `payment` di buku kas.
- **2.2 Tahap Pengerjaan & Revisi:**
  - Seniman mengunggah sketsa (`sketchUrl`), klien menyetujui sketsa atau mengajukan catatan revisi (`/commissions/:id/revisions`).
- **2.3 Penyelesaian Komisi & Payout Artis:**
  - Seniman mengunggah karya final, klien mengklik tombol *Setujui Hasil Akhir*.
  - *Hasil Diharapkan:* Escrow cair: platform mengambil **fee 5%**, seniman menerima **95% dana bersih**, status pesanan `completed`.

---

### 3. Skenario Dompet & Pencairan Dana (TODO 9, 13)
- **3.1 Top Up Saldo Dompet:**
  - Pengguna memilih nominal top up di `/topup`.
  - *Hasil Diharapkan:* Saldo bertambah instan dan tercatat di riwayat mutasi dompet.
- **3.2 Penarikan Dana Seniman (*Withdraw*):**
  - Seniman memasukkan nominal penarikan di `/withdraw` (minimal Rp 100.000).
  - *Hasil Diharapkan:* Jika saldo $\ge$ 100.000, penarikan berhasil dan saldo terpotong; jika saldo $< 100.000$ atau melebihi saldo dompet, muncul validasi error.

---

### 4. Skenario Pelaporan, Penalti Strike & Banding Akun (TODO 1, 14)
- **4.1 Pelaporan Karya Bermasalah:**
  - Pengguna melaporkan karya yang terindikasi AI atau plagiat melalui modal aduan.
  - Kurator menyetujui laporan di `/dashboard/review-reports`.
  - *Hasil Diharapkan:* Karya disembunyikan dari feed publik dan seniman pemilik karya menerima +1 Strike.
- **4.2 Pembekuan Akun & Banding Seniman (*Appeals*):**
  - Akun seniman dengan $\ge 3$ strike dibekukan.
  - Seniman mengajukan banding via formulir *ArtistAppealBox* di profilnya.
  - Admin meninjau banding di `/dashboard/manage-users` (ReviewAppealModal) $\rightarrow$ Jika disetujui, akun pulih dan strike di-reset ke 0.

---

### 5. Skenario Sengketa Komisi (*Disputes*) & Mediasi Admin (TODO 8, 14)
- **5.1 Pengajuan Sengketa:**
  - Klien mengajukan komplain sengketa komisi aktif.
  - Admin melakukan mediasi di `/dashboard/review-disputes`.
- **5.2 Resolusi Pengembalian Dana (*Refund*):**
  - Admin memilih *Refund Client*.
  - *Hasil Diharapkan:* 100% dana escrow dikembalikan ke klien, pesanan dibatalkan (`cancelled`), seniman terkena sanksi +1 strike.

---

### 6. Skenario Manajemen Master Tag (TODO 16)
- **6.1 Tambah & Edit Tag:**
  - Admin menambah tag baru dan mengubah nama tag di `/dashboard/manage-tags`.
  - *Hasil Diharapkan:* Tag berhasil diperbarui dan counter jumlah karya terkait terhitung akurat.
- **6.2 Hapus Tag:**
  - Admin menghapus tag.
  - *Hasil Diharapkan:* Relasi karya seni terlepas aman tanpa menghapus entitas karya seni.

---

### 7. Skenario Laporan Finansial, Audit Log & Kinerja Kurator (TODO 13, 14, 15)
- **7.1 Laporan Finansial & Buku Kas (`/dashboard/financial-reports`):**
  - Agregasi GMV, saldo escrow, fee platform 5%, filter periode, ekspor CSV, dan cetak PDF/Print.
- **7.2 Log Audit Kronologis (`/dashboard/audit-logs`):**
  - Merekam seluruh keputusan kurasi, aduan, sengketa, dan banding secara transparan.
- **7.3 Kinerja Kurator & Metrik SLA (`/dashboard/curator-performance`):**
  - Menghitung kecepatan SLA respons rata-rata, rasio kelolosan anti-AI, kartu Top Moderator, dan ekspor laporan kinerja CSV.