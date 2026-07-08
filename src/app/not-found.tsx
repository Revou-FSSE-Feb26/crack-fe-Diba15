import Link from "next/link";
import { Home, Search, HelpCircle, MoveLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">

        {/* Ilustrasi 404 */}
        <div className="relative mb-8 select-none">
          {/* Lingkaran dekoratif latar */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 rounded-full bg-primary/5 dark:bg-primary/10" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-44 h-44 rounded-full bg-accent/10" />
          </div>

          {/* Angka 404 */}
          <p className="relative font-display text-[9rem] leading-none font-bold text-primary/20 dark:text-primary/30 tracking-tighter">
            404
          </p>
        </div>

        {/* Teks utama */}
        <h1 className="font-display text-3xl font-bold text-content mb-3">
          Kanvas Ini Kosong
        </h1>
        <p className="text-content-muted text-base mb-2">
          Halaman yang kamu cari tidak ditemukan — mungkin sudah dipindahkan, dihapus, atau memang tidak pernah ada.
        </p>

        {/* Navigasi */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-colors hover:bg-primary-hover"
          >
            <Home className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
          <Link
            href="/help"
            className="inline-flex items-center justify-center gap-2 bg-surface border border-slate-200 dark:border-slate-700 text-content px-5 py-2.5 rounded-xl font-medium text-sm transition-colors hover:border-primary hover:text-primary"
          >
            <HelpCircle className="w-4 h-4" />
            Pusat Bantuan
          </Link>
        </div>

        {/* Link sekunder */}
        <div className="flex items-center justify-center gap-6 text-sm text-content-muted">
          <Link href="/" className="inline-flex items-center gap-1.5 hover:text-primary transition-colors">
            <MoveLeft className="w-3.5 h-3.5" />
            Halaman Sebelumnya
          </Link>
          <span className="text-slate-300 dark:text-slate-600">·</span>
          <Link href="/" className="inline-flex items-center gap-1.5 hover:text-primary transition-colors">
            <Search className="w-3.5 h-3.5" />
            Jelajahi Karya
          </Link>
        </div>

        {/* Footer kecil */}
        <p className="mt-12 text-xs text-content-muted">
          © TruBrush — Platform Seni Manusia Autentik
        </p>
      </div>
    </div>
  );
}
