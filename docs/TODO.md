# New TODO

[x] TODO 1: Buat art yang sudah dilaporkan dan disetujui oleh kurator tidak ditampilkan di feed dan hanya dapat dilihat oleh
artist yang memiliki art itu sendiri di halaman profile. (Selesai)

[x] TODO 2: Pindahkan pembayaran ke self page jangan melalui modal (Selesai - /commissions/[id]/payment)

(Optional TODO, harusnya di backend nanti lewat email mudahnya)
TODO 3: Notification System

[x] TODO 4: Cleaning, untuk kode yang lebih bersih dan maintenance mudah. Bersihkan kode yang sudah tidak digunakan (Selesai)

[x] TODO 5: Periksa ulang UI yang masih acak-acakan dan tumpang tindih. (Selesai)

[x] TODO 6: Perubahan dari reload ke infinite scroll dengan batch 6 karya per halaman (Selesai - useInfiniteArtworks & IntersectionObserver).

[x] TODO 7: Penambahan alur bisnis baru seperti biaya admin dalam pembayaran art dengan melihat aturan di indonesia (Selesai - 5% Platform Fee & Escrow Revenue).
Optional: Penambahan fitur premium pada aplikasi untuk artist, dengan penawaran prioritas curator. 
Ditampilkan sebagai artist premium dan dipercayai oleh professional.

[x] TODO 8: Membuat alur bisnis yang lebih jelas pada aplikasi (Selesai - Escrow Guarantee, Net Artist Payout & Admin Executive Dashboard).

[x] TODO 9: Membuat halaman cairkan dana artist dengan minimal 100000 (Selesai - /withdraw)

[x] TODO 10: Periksa detail artwork ketika client, karena client masih bisa order artist yang belum terverifikasi (Selesai)

[x] TODO 11: Profile artist dan client masih ada beberapa yang belum dinamis data yang ditampilkan. (Selesai) 

[x] TODO 12: Menerapkan Prinsip SOLID, KISS, dan DRY pada BE (Selesai - Auth Isolation, Repositories Interfaces, Logger & Maintenance Middlewares, Swagger OpenAPI Docs & Unit Tests 100% Passing).
[x] TODO 12 (FE): Menerapkan Prinsip SOLID, KISS, dan DRY pada FE (Selesai - Full 117 Files Audit, Zero Hardcoded Palette, Clean Proxy Guard, & Architecture Checklist 100%).

[x] TODO 13: Integrasi Backend & Halaman Laporan Finansial Platform (`/dashboard/financial-reports` & `WalletTransaction`) (Selesai - Prisma Model, NestJS Module 100% Spec Pass, TanStack Query Hook, & Interactive Financial Reports Page with Export CSV & Print).
  - **Backend**: Buat model Prisma `WalletTransaction` (id, userId, type: topup/withdraw/payment/release/refund/fee, amount, title, status, metadata, createdAt) & repository/service/controller.
  - **Backend**: Endpoint REST API `/api/transactions` untuk mutasi user pribadi dan rekap transaksi global admin.
  - **Frontend**: Migrasi `TransactionStore` (localStorage) ke TanStack Query hook (`useTransactionQueries`).
  - **Frontend**: Tabel rekapitulasi buku kas platform (rincian ID komisi, GMV, platform fee 5%, net payout artis, dan status pembayaran).
  - **Frontend**: Monitoring perputaran saldo escrow dan riwayat penarikan dana (*withdraw*).
  - **Frontend**: Filter periode (bulan/rentang tanggal) dan fitur Export Laporan (*CSV / Print Summary*).

[ ] TODO 14: Integrasi Backend & Halaman Log Audit Moderasi / Banding Akun (`/dashboard/audit-logs` & `Appeal`)
  - **Backend**: Buat model Prisma `Appeal` (id, artistId, reason, status: pending/approved/rejected, resolvedById, resolutionNotes, createdAt, updatedAt).
  - **Backend**: Endpoint REST API `/api/appeals` (pengajuan banding artis, peninjauan & approve/reject oleh admin).
  - **Frontend**: Migrasi `AppealStore` (localStorage) ke TanStack Query hook (`useAppealQueries`).
  - **Frontend**: Rekam jejak kronologis tindakan moderasi (kurasi karya, resolusi sengketa komisi, pembekuan/pemulihan akun user).
  - **Frontend**: Transparansi dan akuntabilitas keputusan moderator/kurator.

[ ] TODO 15: Halaman Laporan Kinerja Moderasi & Metrik Kurator (`/dashboard/curator-performance`)
  - SLA & rata-rata waktu respons kurasi karya anti-AI.
  - Distribusi beban kerja antar kurator dan rasio persetujuan vs penolakan karya.

[ ] TODO 16: Halaman Manajemen Tag & Katalog Karya Global (`/dashboard/manage-tags`)
  - Master tag & pembersihan tag duplikat/spam.
  - Fitur *takedown* karya terpublikasi yang bermasalah secara sentral.

## TODO Test

1. Test Upload condition (Harusnya Sudah)
2. Test favorite (Harusnya sudah)
3. Test searching (Ini juga sudah)
4. Test top up (Ya udah sih)
5. Test Review Artwork (Harusnya sudah)