import type { Metadata } from "next";
import {
  Briefcase,
  Wifi,
  Target,
  Palette,
  Code2,
  BrainCircuit,
  LayoutDashboard,
  PenTool,
  BadgeCheck,
  MessageCircle,
  Home,
  TrendingUp,
  HeartPulse,
  BookOpen,
  Brush,
  Clock,
  Mail,
  MapPin,
  ArrowRight,
  Users,
  Sparkles,
} from "lucide-react";

/* ─── SEO Metadata ───────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Karier",
  description:
    "Bergabunglah dengan tim TruBrush dan bangun bersama platform seni manusia terbaik di Asia Tenggara. Lihat posisi terbuka kami di bidang Engineering, Product, dan Community.",
  keywords: [
    "karier TruBrush",
    "lowongan kerja startup seni",
    "remote work Indonesia",
    "full-stack engineer Jakarta",
    "product manager startup",
    "community manager seni",
    "pekerjaan anti-AI",
    "startup ilustrasi Indonesia",
  ],
};

/* ─── Data: Culture Values ───────────────────────────────────────────────── */

const cultureValues = [
  {
    icon: Wifi,
    title: "Remote-First",
    description:
      "Kami percaya hasil kerja yang luar biasa tidak bergantung pada lokasi. Tim TruBrush tersebar di seluruh Indonesia — bekerjalah dari mana pun Anda paling produktif.",
  },
  {
    icon: Target,
    title: "Mission-Driven",
    description:
      "Setiap baris kode, setiap keputusan produk, dan setiap interaksi komunitas punya tujuan yang sama: melindungi seni manusia dan memastikan artis mendapat penghargaan yang layak.",
  },
  {
    icon: Palette,
    title: "Artist-Centered",
    description:
      "Artis adalah pengguna pertama kami. Kami membuat keputusan dengan mempertimbangkan dampaknya pada komunitas ilustrator — bukan sekadar metrik pertumbuhan.",
  },
];

/* ─── Data: Open Positions ───────────────────────────────────────────────── */

interface Position {
  id: string;
  title: string;
  department: string;
  type: "Full-time" | "Contract";
  location: string;
  description: string;
  icon: React.ElementType;
}

const positions: Position[] = [
  // Engineering
  {
    id: "eng-fullstack",
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    type: "Full-time",
    location: "Remote / Jakarta",
    description:
      "Membangun fitur inti platform — dari sistem komisi berbasis escrow hingga feed karya terverifikasi. Stack utama: Next.js, NestJS, PostgreSQL, dan Redis.",
    icon: Code2,
  },
  {
    id: "eng-ml",
    title: "ML Engineer — AI Detection",
    department: "Engineering",
    type: "Full-time",
    location: "Remote / Jakarta",
    description:
      "Ironis tapi krusial: membangun model deteksi karya AI untuk menjaga integritas platform. Anda akan berperang melawan AI demi melindungi seni manusia.",
    icon: BrainCircuit,
  },
  // Product & Design
  {
    id: "pm-commission",
    title: "Product Manager — Commission Flow",
    department: "Product & Design",
    type: "Full-time",
    location: "Remote / Jakarta",
    description:
      "Memimpin roadmap fitur alur komisi end-to-end: negosiasi, milestone, escrow, dan pengiriman karya. Pengalaman di marketplace atau fintech sangat dihargai.",
    icon: LayoutDashboard,
  },
  {
    id: "ux-artist-tools",
    title: "UI/UX Designer — Artist Tools",
    department: "Product & Design",
    type: "Full-time",
    location: "Remote",
    description:
      "Merancang pengalaman unggah karya, pengelolaan portofolio, dan dashboard komisi yang intuitif untuk artis. Anda akan bekerja langsung dengan komunitas ilustrator.",
    icon: PenTool,
  },
  // Community & Trust
  {
    id: "trust-verification",
    title: "Artist Verification Specialist",
    department: "Community & Trust",
    type: "Full-time",
    location: "Jakarta",
    description:
      "Meninjau dan memverifikasi portofolio artis yang mendaftar, memastikan setiap karya benar-benar buatan manusia. Pengalaman di kurasi seni digital sangat diutamakan.",
    icon: BadgeCheck,
  },
  {
    id: "cm-indo",
    title: "Community Manager (Bahasa Indonesia)",
    department: "Community & Trust",
    type: "Full-time",
    location: "Remote / Jakarta",
    description:
      "Membangun, mengelola, dan menumbuhkan komunitas artis TruBrush di media sosial, Discord, dan forum lokal. Fasih Bahasa Indonesia dan paham ekosistem ilustrator lokal adalah keharusan.",
    icon: MessageCircle,
  },
];

/* ─── Data: Benefits ─────────────────────────────────────────────────────── */

const benefits = [
  {
    icon: Home,
    title: "Remote Work Penuh",
    description: "Bekerja dari rumah, kafe, atau co-working space favorit Anda. Tidak ada kewajiban hadir ke kantor kecuali untuk acara tim.",
  },
  {
    icon: TrendingUp,
    title: "Equity / ESOP",
    description: "Semua karyawan tetap mendapatkan opsi saham (ESOP). Anda turut memiliki perusahaan yang Anda bangun.",
  },
  {
    icon: HeartPulse,
    title: "Asuransi Kesehatan",
    description: "Cakupan BPJS Kesehatan kelas 1 ditambah asuransi swasta untuk rawat inap, rawat jalan, dan gigi.",
  },
  {
    icon: BookOpen,
    title: "Learning Budget",
    description: "Rp 5 juta/tahun untuk kursus, buku, konferensi, atau sertifikasi profesional pilihan Anda.",
  },
  {
    icon: Brush,
    title: "Artist Commission Allowance",
    description: "Kredit komisi tahunan untuk memesan karya dari artis TruBrush — supaya Anda memahami langsung pengalaman pengguna.",
  },
  {
    icon: Clock,
    title: "Jam Kerja Fleksibel",
    description: "Tidak ada jam kerja kaku. Kami mengukur kinerja dari hasil, bukan dari jam yang Anda duduk di depan layar.",
  },
];

/* ─── Helpers ────────────────────────────────────────────────────────────── */

const departmentColor: Record<string, string> = {
  Engineering: "bg-primary/10 text-primary",
  "Product & Design": "bg-accent/10 text-accent",
  "Community & Trust": "bg-verified/10 text-verified",
};

const departments = ["Engineering", "Product & Design", "Community & Trust"];

/* ─── Page Component ─────────────────────────────────────────────────────── */

export default function CareersPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">

      {/* ── 1. Hero Section ─────────────────────────────────────────────── */}
      <section className="mb-16">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-3 py-1.5 rounded-full mb-5">
          <Briefcase className="w-4 h-4" />
          Bergabung dengan Kami
        </div>

        {/* H1 */}
        <h1 className="font-display text-4xl md:text-5xl font-bold text-content mb-5 leading-tight max-w-3xl">
          Bangun Platform Seni Manusia{" "}
          <span className="text-primary">Terbaik di Asia Tenggara</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-content-muted leading-relaxed max-w-2xl mb-8">
          Di TruBrush, kami sedang membangun masa depan di mana seni buatan tangan manusia
          tetap dihargai di tengah gempuran AI. Bergabunglah dengan tim kecil yang
          berdampak besar — dan jadilah bagian dari gerakan yang benar-benar berarti.
        </p>

        {/* Quick stats row */}
        <div className="flex flex-wrap gap-4">
          {[
            { icon: Users, label: "Tim kecil, berdampak besar" },
            { icon: MapPin, label: "Jakarta, Indonesia · Remote-friendly" },
            { icon: Sparkles, label: "6 posisi terbuka" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="inline-flex items-center gap-2 text-sm text-content-muted bg-surface border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-full"
            >
              <Icon className="w-4 h-4 text-primary shrink-0" />
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* ── 2. Culture Section ──────────────────────────────────────────── */}
      <section className="mb-16">
        <div className="inline-flex items-center gap-2 bg-accent/10 text-accent text-sm font-medium px-3 py-1.5 rounded-full mb-5">
          <Sparkles className="w-4 h-4" />
          Budaya Kerja Kami
        </div>

        <h2 className="font-heading text-2xl font-semibold text-content mb-2">
          Nilai-Nilai yang Memandu Tim Kami
        </h2>
        <p className="text-content-muted mb-8 max-w-2xl">
          Tiga prinsip ini bukan sekadar poster di dinding — mereka tercermin dalam
          setiap keputusan yang kami buat sehari-hari.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {cultureValues.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-surface p-5 hover:border-primary/40 hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-content text-base mb-2">
                {title}
              </h3>
              <p className="text-sm text-content-muted leading-relaxed flex-1">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. Open Positions ───────────────────────────────────────────── */}
      <section className="mb-16">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-3 py-1.5 rounded-full mb-5">
          <Briefcase className="w-4 h-4" />
          Posisi Terbuka
        </div>

        <h2 className="font-heading text-2xl font-semibold text-content mb-2">
          Temukan Peran yang Tepat untuk Anda
        </h2>
        <p className="text-content-muted mb-10 max-w-2xl">
          Kami mencari individu yang bersemangat, proaktif, dan percaya bahwa seni
          manusia layak untuk dilindungi dan dirayakan.
        </p>

        <div className="space-y-10">
          {departments.map((dept) => {
            const deptPositions = positions.filter((p) => p.department === dept);
            return (
              <div key={dept}>
                {/* Department heading */}
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="font-heading font-semibold text-content text-lg">
                    {dept}
                  </h3>
                  <span className="text-xs font-medium text-content-muted bg-surface border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-full">
                    {deptPositions.length} posisi
                  </span>
                </div>

                {/* Position cards */}
                <div className="space-y-3">
                  {deptPositions.map(
                    ({ id, title, department, type, location, description, icon: Icon }) => (
                      <div
                        key={id}
                        className="flex flex-col sm:flex-row sm:items-start gap-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-surface p-5 hover:border-primary/40 hover:shadow-sm transition-all"
                      >
                        {/* Icon */}
                        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <h4 className="font-heading font-semibold text-content text-base">
                              {title}
                            </h4>
                            <span
                              className={`text-xs font-medium px-2 py-0.5 rounded-full ${departmentColor[department]}`}
                            >
                              {department}
                            </span>
                          </div>

                          {/* Meta tags */}
                          <div className="flex flex-wrap gap-2 mb-2.5">
                            <span className="inline-flex items-center gap-1 text-xs text-content-muted">
                              <Briefcase className="w-3 h-3" />
                              {type}
                            </span>
                            <span className="text-xs text-content-muted">·</span>
                            <span className="inline-flex items-center gap-1 text-xs text-content-muted">
                              <MapPin className="w-3 h-3" />
                              {location}
                            </span>
                          </div>

                          <p className="text-sm text-content-muted leading-relaxed">
                            {description}
                          </p>
                        </div>

                        {/* CTA */}
                        <div className="shrink-0 self-start sm:self-center">
                          <a
                            href="#apply"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-background bg-primary hover:bg-primary-hover transition-colors shadow-sm whitespace-nowrap"
                          >
                            Lamar Sekarang
                            <ArrowRight className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 4. Benefits ─────────────────────────────────────────────────── */}
      <section className="mb-16">
        <div className="inline-flex items-center gap-2 bg-accent/10 text-accent text-sm font-medium px-3 py-1.5 rounded-full mb-5">
          <HeartPulse className="w-4 h-4" />
          Benefit & Kompensasi
        </div>

        <h2 className="font-heading text-2xl font-semibold text-content mb-2">
          Kami Jaga Tim Kami dengan Baik
        </h2>
        <p className="text-content-muted mb-8 max-w-2xl">
          Bergabung dengan TruBrush bukan sekadar soal gaji — tapi tentang tumbuh
          bersama misi yang bermakna, dengan dukungan yang Anda layak dapatkan.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {benefits.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-surface p-5 hover:border-primary/40 hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-3 shrink-0">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-heading font-semibold text-content text-sm mb-1.5">
                {title}
              </h3>
              <p className="text-xs text-content-muted leading-relaxed flex-1">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. Apply Section ────────────────────────────────────────────── */}
      <section id="apply" className="scroll-mt-24">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-3 py-1.5 rounded-full mb-5">
          <Mail className="w-4 h-4" />
          Cara Melamar
        </div>

        <h2 className="font-heading text-2xl font-semibold text-content mb-2">
          Siap Bergabung? Kirim Lamaran Anda
        </h2>
        <p className="text-content-muted mb-8 max-w-2xl">
          Kami tidak menggunakan formulir lamaran yang rumit. Cukup kirim email dengan
          informasi yang relevan — kami akan menghubungi Anda dalam 5 hari kerja.
        </p>

        {/* Steps */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-surface p-6 mb-6">
          <p className="font-heading font-semibold text-content text-base mb-5">
            Langkah-langkah Melamar
          </p>

          <ol className="space-y-5">
            {[
              {
                step: "01",
                title: "Kirim email ke careers@trubrush.id",
                detail: (
                  <>
                    Gunakan format subjek:{" "}
                    <code className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded font-mono">
                      [POSISI] Nama Lengkap — Lamar TruBrush
                    </code>
                    <br />
                    <span className="text-xs text-content-muted mt-1 block">
                      Contoh: <em>[Senior Full-Stack Engineer] Andi Saputra — Lamar TruBrush</em>
                    </span>
                  </>
                ),
              },
              {
                step: "02",
                title: "Sertakan dalam isi email",
                detail: (
                  <ul className="list-disc list-inside space-y-1 text-content-muted text-sm">
                    <li>Perkenalan singkat dan motivasi bergabung dengan TruBrush</li>
                    <li>Link portofolio atau profil GitHub/Dribbble/Behance (sesuai posisi)</li>
                    <li>Pengalaman kerja relevan dalam 2–3 paragraf</li>
                    <li>Ekspektasi gaji dan ketersediaan mulai bekerja</li>
                  </ul>
                ),
              },
              {
                step: "03",
                title: "Proses seleksi",
                detail: (
                  <p className="text-sm text-content-muted">
                    Jika profil Anda sesuai, tim kami akan mengundang untuk sesi wawancara
                    (video call, 20–30 menit) diikuti tantangan teknis/desain singkat sesuai
                    posisi. Total proses seleksi umumnya berlangsung 2–3 minggu.
                  </p>
                ),
              },
            ].map(({ step, title, detail }) => (
              <li key={step} className="flex gap-4">
                <div className="shrink-0 w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="font-display text-xs font-bold text-primary tabular-nums">
                    {step}
                  </span>
                </div>
                <div className="flex-1 pt-1.5">
                  <p className="font-heading font-semibold text-content text-sm mb-1.5">
                    {title}
                  </p>
                  <div className="text-sm leading-relaxed">{detail}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Contact card */}
        <div className="rounded-2xl border border-primary/30 bg-primary/10 p-6 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-primary" />
            </div>
            <p className="font-heading font-semibold text-content text-base">
              Tim Rekrutmen TruBrush
            </p>
          </div>
          <a
            href="mailto:careers@trubrush.id"
            className="inline-flex items-center gap-2 text-primary font-semibold text-lg hover:underline underline-offset-4 transition-colors mb-1"
          >
            careers@trubrush.id
            <ArrowRight className="w-4 h-4" />
          </a>
          <p className="text-sm text-content-muted mt-1">
            Jam respons: Senin–Jumat, 09.00–17.00 WIB · Respons rata-rata: 3–5 hari kerja
          </p>
        </div>
      </section>
    </div>
  );
}
