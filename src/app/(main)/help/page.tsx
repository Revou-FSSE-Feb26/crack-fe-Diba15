import type { Metadata } from "next";
import {
  CircleHelp,
  Search,
  UserPlus,
  PenTool,
  CreditCard,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Mail,
  Clock,
  BookOpen,
  DollarSign,
  Lock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Pusat Bantuan",
  description:
    "Temukan jawaban atas pertanyaan seputar TruBrush — platform seni anti-AI dengan sistem komisi & escrow yang aman untuk artis dan klien.",
  keywords: [
    "bantuan TruBrush",
    "FAQ komisi ilustrasi",
    "cara daftar artis",
    "sistem escrow seni",
    "verifikasi artis TruBrush",
  ],
};

/* ─── Data ──────────────────────────────────────────────────────────────── */

const quickLinks = [
  {
    icon: UserPlus,
    title: "Mulai Bergabung",
    description: "Cara daftar, verifikasi artis, dan setup profil pertamamu",
    href: "#memulai",
  },
  {
    icon: PenTool,
    title: "Proses Komisi",
    description: "Cara memesan, membayar, dan menyelesaikan komisi artwork",
    href: "#komisi-escrow",
  },
  {
    icon: CreditCard,
    title: "Akun & Billing",
    description: "Kelola saldo escrow, pencairan dana, dan riwayat transaksi",
    href: "#akun-keamanan",
  },
  {
    icon: ShieldCheck,
    title: "Keamanan",
    description: "Privasi data, deteksi AI, pelaporan, dan perlindungan akun",
    href: "#akun-keamanan",
  },
];

interface FAQ {
  q: string;
  a: string;
}

interface FAQCategory {
  id: string;
  icon: React.ElementType;
  title: string;
  faqs: FAQ[];
}

const faqCategories: FAQCategory[] = [
  /* ── Kategori 1 ─────────────────────────────────────────────────────── */
  {
    id: "memulai",
    icon: BookOpen,
    title: "Memulai di TruBrush",
    faqs: [
      {
        q: "Bagaimana cara mendaftar di TruBrush?",
        a: "Daftar gratis melalui halaman Sign Up menggunakan email aktif Anda. Setelah verifikasi email, Anda langsung bisa menjelajahi karya dan mengikuti artis favorit. Jika ingin membuka slot komisi sebagai artis, lanjutkan ke proses Verifikasi Artis melalui menu Pengaturan Profil.",
      },
      {
        q: "Apa perbedaan akun Viewer dan akun Artis di TruBrush?",
        a: "Akun Viewer (default saat daftar) dapat melihat karya, memberikan like, mengikuti artis, dan memesan komisi. Akun Artis memiliki semua fitur Viewer ditambah kemampuan mengunggah karya ke galeri publik, membuka slot komisi, menetapkan harga, dan menerima pembayaran melalui sistem escrow TruBrush.",
      },
      {
        q: "Bagaimana proses verifikasi artis di TruBrush?",
        a: "Ajukan verifikasi melalui Pengaturan → Verifikasi Artis. Anda perlu mengunggah minimal 3 karya original dalam format digital, bukti proses kreatif seperti foto atau video WIP (work-in-progress), dan menyetujui kebijakan anti-AI kami secara tertulis. Tim kurasi TruBrush akan meninjau pengajuan Anda dalam 3–7 hari kerja.",
      },
      {
        q: "Apa yang dimaksud dengan badge 'Human-Verified Artist'?",
        a: "Badge Human-Verified Artist adalah tanda kurasi resmi TruBrush yang membuktikan bahwa seluruh karya artis dibuat 100% oleh manusia tanpa bantuan generator AI. Badge ini meningkatkan kepercayaan klien, meningkatkan visibilitas profil di hasil pencarian, dan membuka akses ke fitur prioritas seperti slot komisi tambahan.",
      },
      {
        q: "Apakah ada biaya untuk bergabung dan menggunakan TruBrush?",
        a: "Mendaftar, menjelajahi karya, dan mengikuti artis di TruBrush sepenuhnya gratis. TruBrush mengambil komisi platform sebesar 10% dari nilai komisi yang berhasil diselesaikan — hanya dibayar saat transaksi sukses. Tidak ada biaya langganan, biaya listing karya, atau biaya tersembunyi lainnya.",
      },
    ],
  },

  /* ── Kategori 2 ─────────────────────────────────────────────────────── */
  {
    id: "komisi-escrow",
    icon: DollarSign,
    title: "Sistem Komisi & Escrow",
    faqs: [
      {
        q: "Bagaimana cara memesan komisi artwork di TruBrush?",
        a: "Kunjungi profil artis pilihan Anda dan klik tombol 'Pesan Komisi'. Isi formulir brief yang mencakup deskripsi karya, referensi visual, deadline, dan budget. Setelah artis menyetujui syarat, lakukan pembayaran ke rekening escrow TruBrush. Artis akan mendapat notifikasi dan mulai mengerjakan setelah dana terkonfirmasi.",
      },
      {
        q: "Apa itu sistem Escrow dan mengapa TruBrush menggunakannya?",
        a: "Escrow adalah mekanisme penyimpanan dana oleh pihak netral (TruBrush) hingga kondisi komisi terpenuhi. Dana Anda tersimpan aman di rekening escrow kami — artis hanya menerima pembayaran setelah Anda menyetujui hasil karya akhir. Sistem ini melindungi klien dari artis yang tidak menyelesaikan pekerjaan, sekaligus menjamin artis mendapat bayaran yang adil setelah karya selesai dikerjakan.",
      },
      {
        q: "Berapa lama proses komisi berlangsung?",
        a: "Durasi komisi sepenuhnya disepakati antara klien dan artis di awal pemesanan. Umumnya berkisar 3–30 hari tergantung kompleksitas karya. Artis wajib memberikan update progress minimal setiap 7 hari. Jumlah revisi yang tersedia ditentukan dalam paket komisi yang dipilih.",
      },
      {
        q: "Apa yang terjadi jika terjadi sengketa (dispute) antara klien dan artis?",
        a: "Ajukan Dispute melalui halaman detail komisi dalam 72 jam setelah tenggat waktu atau jika hasil tidak sesuai brief awal. Tim mediasi TruBrush akan meninjau seluruh bukti dari kedua pihak — termasuk percakapan, file WIP, dan brief yang disepakati — lalu memberikan keputusan dalam 5–10 hari kerja. Dana escrow tetap dibekukan selama proses mediasi berlangsung untuk melindungi kedua pihak.",
      },
      {
        q: "Bagaimana dan kapan artis dapat menarik dana dari escrow?",
        a: "Dana dilepaskan ke saldo artis secara otomatis 48 jam setelah klien menyetujui hasil akhir, atau setelah 7 hari tanpa penolakan maupun dispute dari klien. Artis dapat menarik saldo ke rekening bank Indonesia kapan saja dengan minimum penarikan Rp 50.000. Proses transfer membutuhkan 1–3 hari kerja.",
      },
    ],
  },

  /* ── Kategori 3 ─────────────────────────────────────────────────────── */
  {
    id: "akun-keamanan",
    icon: Lock,
    title: "Akun & Keamanan",
    faqs: [
      {
        q: "Bagaimana cara mereset kata sandi saya?",
        a: "Di halaman login, klik 'Lupa Kata Sandi?', masukkan alamat email terdaftar Anda, dan cek kotak masuk untuk tautan reset. Tautan berlaku selama 30 menit. Jika email tidak muncul dalam 5 menit, periksa folder spam atau klik 'Kirim Ulang' di halaman yang sama.",
      },
      {
        q: "Bagaimana cara mengubah email atau informasi profil saya?",
        a: "Buka Pengaturan → Profil untuk mengubah nama tampilan, bio, dan tautan sosial media. Untuk mengubah alamat email, buka Pengaturan → Keamanan Akun dan ikuti langkah verifikasi. Perubahan email memerlukan konfirmasi ke alamat email lama dan verifikasi ke alamat email baru Anda.",
      },
      {
        q: "Apakah TruBrush menggunakan karya seni saya untuk melatih model AI?",
        a: "Tidak, sama sekali tidak. Ini adalah komitmen inti dan tidak dapat diganggu gugat dari TruBrush. Setiap karya yang Anda unggah tidak pernah dan tidak akan pernah digunakan untuk melatih, menyempurnakan, atau mengembangkan model kecerdasan buatan manapun — baik oleh TruBrush maupun pihak ketiga yang bermitra dengan kami. Anda mempertahankan hak cipta penuh atas semua karya yang diunggah.",
      },
      {
        q: "Bagaimana cara melaporkan karya yang dicurigai dibuat oleh AI?",
        a: "Klik ikon flag (🚩) di sudut kartu karya yang dicurigai, pilih alasan 'Konten Buatan AI', dan tambahkan keterangan pendukung jika memungkinkan (misalnya detail visual yang mencurigakan). Tim kurasi kami akan meninjau laporan dalam 48 jam. Karya yang terbukti dibuat oleh AI akan dihapus dan akun artis terkait dikenakan sanksi sesuai Kebijakan Platform.",
      },
      {
        q: "Bagaimana cara menghapus akun TruBrush saya secara permanen?",
        a: "Buka Pengaturan → Keamanan Akun → Hapus Akun Permanen. Penghapusan akun akan menghilangkan semua data profil, galeri karya publik, dan riwayat aktivitas. Jika Anda memiliki komisi aktif atau saldo escrow yang belum dicairkan, selesaikan atau cairkan terlebih dahulu sebelum melanjutkan. Proses penghapusan memerlukan konfirmasi ulang melalui email terdaftar dan tidak dapat dibatalkan.",
      },
    ],
  },
];

/* ─── Page Component ─────────────────────────────────────────────────────── */

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-3 py-1.5 rounded-full mb-4">
          <CircleHelp className="w-4 h-4" />
          Pusat Bantuan
        </div>

        <h1 className="font-display text-4xl font-bold text-content mb-4 leading-tight">
          Ada yang bisa kami bantu?
        </h1>

        <p className="text-lg text-content-muted max-w-2xl leading-relaxed">
          Temukan jawaban atas pertanyaan seputar TruBrush — mulai dari cara bergabung,
          proses komisi, sistem escrow, hingga keamanan akun Anda.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-xl mt-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-content-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Cari pertanyaan, topik, atau panduan..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-surface text-content placeholder:text-content-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
          />
        </div>
      </div>

      {/* ── Quick Links ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
        {quickLinks.map(({ icon: Icon, title, description, href }) => (
          <a
            key={title}
            href={href}
            className="group flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-surface p-5 hover:border-primary/40 hover:shadow-sm transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 shrink-0">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <p className="font-heading font-semibold text-content text-sm mb-1">{title}</p>
            <p className="text-xs text-content-muted leading-relaxed flex-1">{description}</p>
            <div className="flex items-center gap-0.5 mt-3 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Lihat panduan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </a>
        ))}
      </div>

      {/* ── FAQ Accordion ───────────────────────────────────────────────── */}
      <div className="space-y-10">
        {faqCategories.map((category) => {
          const Icon = category.icon;
          return (
            <section key={category.id} id={category.id} className="scroll-mt-24">

              {/* Category header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 shrink-0">
                  <Icon className="w-4.5 h-4.5 text-primary" />
                </div>
                <h2 className="font-heading text-xl font-semibold text-content">
                  {category.title}
                </h2>
              </div>

              {/* FAQ items */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-surface divide-y divide-slate-200 dark:divide-slate-700 overflow-hidden">
                {category.faqs.map((faq, idx) => (
                  <details key={idx} className="group px-5">
                    <summary className="flex items-center justify-between gap-4 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden font-medium text-content hover:text-primary transition-colors">
                      <span className="text-sm">{faq.q}</span>
                      <ChevronDown className="w-4 h-4 shrink-0 text-content-muted transition-transform duration-200 group-open:rotate-180" />
                    </summary>
                    <div className="pb-5 pr-8 text-sm text-content-muted leading-relaxed">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* ── Contact Support Banner ──────────────────────────────────────── */}
      <div className="mt-14 rounded-2xl bg-primary/10 border border-primary/20 p-6 md:p-8">

        <div className="flex flex-col md:flex-row gap-5 items-start md:items-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/20 shrink-0">
            <Mail className="w-6 h-6 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="font-heading text-xl font-semibold text-content mb-1">
              Masih belum menemukan jawaban?
            </h2>
            <p className="text-sm text-content-muted leading-relaxed">
              Tim support kami siap membantu Anda. Kirim email ke{" "}
              <a
                href="mailto:support@trubrush.id"
                className="text-primary font-medium hover:underline underline-offset-2"
              >
                support@trubrush.id
              </a>{" "}
              dengan deskripsi masalah Anda, dan kami akan merespons secepatnya.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-content-muted bg-surface rounded-xl px-4 py-2.5 border border-slate-200 dark:border-slate-700 shrink-0">
            <Clock className="w-4 h-4 text-accent" />
            <span>
              Respons{" "}
              <strong className="text-content">1–2 hari kerja</strong>
            </span>
          </div>
        </div>

        <hr className="my-5 border-primary/15" />

        {/* Contact info row */}
        <div className="flex flex-col sm:flex-row gap-y-4 gap-x-6 text-sm text-content-muted">
          <div>
            <p className="font-medium text-content mb-0.5">Jam Operasional</p>
            <p>Senin – Jumat, 09.00 – 17.00 WIB</p>
          </div>

          <div className="hidden sm:block w-px bg-primary/15" />

          <div>
            <p className="font-medium text-content mb-0.5">Email Support</p>
            <a
              href="mailto:support@trubrush.id"
              className="text-primary hover:underline underline-offset-2"
            >
              support@trubrush.id
            </a>
          </div>

          <div className="hidden sm:block w-px bg-primary/15" />

          <div>
            <p className="font-medium text-content mb-0.5">Dispute & Mediasi</p>
            <a
              href="mailto:dispute@trubrush.id"
              className="text-primary hover:underline underline-offset-2"
            >
              dispute@trubrush.id
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
