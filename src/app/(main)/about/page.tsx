import {
	AlertTriangle,
	ArrowRight,
	Award,
	BadgeCheck,
	Brush,
	CheckCircle,
	Eye,
	Lock,
	Palette,
	Scale,
	Search,
	ShieldCheck,
	TrendingUp,
	UserPlus,
	Users,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

/* ─── SEO Metadata ───────────────────────────────────────────────────────── */

export const metadata: Metadata = {
	title: "Tentang Kami",
	description:
		"Kenali TruBrush — platform media sosial dan komisi ilustrator yang 100% bebas AI. Kami hadir untuk melindungi seni manusia dan menghubungkan artis terverifikasi dengan kolektor karya autentik.",
	keywords: [
		"tentang TruBrush",
		"platform anti-AI",
		"seni manusia",
		"komisi ilustrasi",
		"artis terverifikasi Indonesia",
		"escrow komisi seni",
		"misi TruBrush",
	],
};

/* ─── Data ───────────────────────────────────────────────────────────────── */

const stats = [
	{ value: "2.400+", label: "Artis Terverifikasi" },
	{ value: "18.500+", label: "Karya Autentik" },
	{ value: "Rp 4,2M+", label: "Komisi Diselesaikan" },
];

const problems = [
	"Generator AI memproduksi jutaan gambar per hari, menenggelamkan karya artis manusia di pasar.",
	"Platform generik tidak membedakan antara seni asli dan keluaran AI — semuanya diperlakukan sama.",
	"Artis kehilangan pendapatan dan pengakuan karena pembeli tak bisa memverifikasi keaslian karya.",
	"Komisi lepas kerap berakhir dengan penipuan — dana hilang atau karya tak pernah terkirim.",
];

const steps = [
	{
		number: "01",
		icon: UserPlus,
		title: "Daftar & Verifikasi",
		description:
			"Artis mengirimkan portofolio karya terbaik mereka. Tim kurasi TruBrush meninjau setiap karya secara manual untuk memastikan tidak ada konten buatan AI sebelum profil dipublikasikan.",
	},
	{
		number: "02",
		icon: Search,
		title: "Temukan Artis",
		description:
			"Browse artis terverifikasi berdasarkan gaya visual, medium, dan kisaran harga. Filter berdasarkan ketersediaan dan spesialisasi untuk menemukan artis yang paling cocok untuk kebutuhan Anda.",
	},
	{
		number: "03",
		icon: Lock,
		title: "Komisi Aman",
		description:
			"Dana komisi ditahan dalam sistem Escrow TruBrush. Artis mulai bekerja dengan kepastian pembayaran, klien terlindungi — dana hanya cair setelah karya diterima dan disetujui.",
	},
	{
		number: "04",
		icon: Award,
		title: "Terima Karya Autentik",
		description:
			"Dapatkan karya seni asli beserta Sertifikat Human-Made eksklusif dari TruBrush — bukti nyata bahwa karya Anda dibuat dengan tangan manusia, bukan dihasilkan oleh mesin.",
	},
];

const values = [
	{
		icon: Eye,
		title: "Transparansi Penuh",
		description:
			"Setiap proses — dari kurasi hingga transaksi — terbuka dan dapat dilacak. Tidak ada biaya tersembunyi, tidak ada proses yang abu-abu.",
	},
	{
		icon: Scale,
		title: "Keadilan untuk Artis",
		description:
			"Artis mendapat imbalan yang setara atas kerja keras mereka. Kami menolak devaluasi karya seni akibat banjir konten AI di pasar digital.",
	},
	{
		icon: Users,
		title: "Komunitas Anti-AI",
		description:
			"Ruang aman bagi seniman manusia untuk berkarya, berbagi, dan tumbuh bersama — bebas dari distraksi konten generatif yang merusak ekosistem.",
	},
	{
		icon: ShieldCheck,
		title: "Keamanan Transaksi",
		description:
			"Sistem Escrow memastikan dana terlindungi untuk kedua belah pihak. Tidak ada penipuan, tidak ada pembayaran yang menguap begitu saja.",
	},
	{
		icon: BadgeCheck,
		title: "Kurasi Ketat",
		description:
			"Setiap artis dan karya melewati proses seleksi manual oleh tim kami. Kualitas dan keaslian adalah standar minimum, bukan pengecualian.",
	},
	{
		icon: TrendingUp,
		title: "Seni sebagai Investasi",
		description:
			"Karya bersertifikat human-made memiliki nilai koleksi jangka panjang. Kami membangun ekosistem di mana seni asli terus dihargai dan bertumbuh nilainya.",
	},
];

/* ─── Page Component ─────────────────────────────────────────────────────── */

export default function AboutPage() {
	return (
		<div className="max-w-4xl mx-auto px-6 py-12">
			{/* ── 1. Hero Section ─────────────────────────────────────────────── */}
			<section className="mb-16 relative">
				{/* Badge */}
				<div className="absolute -top-10 -left-10 w-72 h-72 bg-linear-to-br from-primary/10 via-warm/10 to-transparent rounded-full blur-3xl -z-10" />

				<div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-3 py-1.5 rounded-full mb-5">
					<Palette className="w-4 h-4" />
					Tentang TruBrush
				</div>

				<h1 className="font-display text-4xl md:text-5xl font-bold text-content mb-5 leading-tight max-w-3xl">
					Di Sini, Setiap Goresan{" "}
					<span className="bg-linear-to-r from-primary to-warm-hover bg-clip-text text-transparent">
						Dibuat oleh Manusia
					</span>
				</h1>

				{/* Tagline */}
				<p className="text-lg text-content-muted leading-relaxed max-w-2xl mb-10">
					TruBrush lahir dari satu keyakinan sederhana: seni sejati berasal dari
					jiwa manusia, bukan dari algoritma. Kami membangun platform tempat
					artis terverifikasi terhubung dengan kolektor yang menghargai keaslian
					— setiap karya, setiap komisi, 100% human-made.
				</p>

				{/* Stats Row */}
				<div className="grid grid-cols-3 gap-4">
					{stats.map(({ value, label }) => (
						<div
							key={label}
							className="flex flex-col items-center text-center rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-warm/40 bg-surface px-4 py-5 transition-colors"
						>
							<span className="font-display text-2xl md:text-3xl font-bold text-primary mb-1">
								{value}
							</span>
							<span className="text-xs md:text-sm text-content-muted">
								{label}
							</span>
						</div>
					))}
				</div>
			</section>

			{/* ── 2. Manifesto / Masalah yang Kami Selesaikan ─────────────────── */}
			<section className="mb-16">
				<div className="inline-flex items-center gap-2 bg-accent/10 text-accent text-sm font-medium px-3 py-1.5 rounded-full mb-5">
					<AlertTriangle className="w-4 h-4" />
					Masalah yang Kami Selesaikan
				</div>

				<div className="grid md:grid-cols-2 gap-8 items-start">
					{/* Kiri: Narasi */}
					<div>
						<h2 className="font-heading text-2xl font-semibold text-content mb-4 leading-snug">
							Krisis AI Mengancam Ekosistem Seni Manusia
						</h2>
						<p className="text-content-muted leading-relaxed mb-4">
							Dalam beberapa tahun terakhir, generator gambar AI telah
							membanjiri internet dengan jutaan citra setiap harinya. Platform
							generik tidak membedakan mana yang dibuat manusia dan mana yang
							dihasilkan mesin — semuanya dicampur aduk dalam satu feed yang
							sama.
						</p>
						<p className="text-content-muted leading-relaxed mb-4">
							Akibatnya, artis manusia terpinggirkan. Karya yang lahir dari
							jam-jam latihan, eksperimen, dan emosi nyata harus bersaing harga
							dengan output AI yang diproduksi dalam hitungan detik. Ini bukan
							persaingan yang adil — dan kami menolak membiarkannya terus
							terjadi.
						</p>
						<p className="text-content-muted leading-relaxed">
							TruBrush hadir sebagai garis pertahanan bagi komunitas artis. Kami
							membangun ruang khusus yang hanya untuk seni manusia, dengan
							sistem verifikasi yang ketat dan komunitas yang peduli pada
							keaslian karya.
						</p>
					</div>

					{/* Kanan: Highlight masalah */}
					<div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-surface p-6 space-y-1">
						{/* Pull quote */}
						<blockquote className="border-l-4 border-primary pl-4 mb-5">
							<p className="font-heading text-base font-medium text-content italic leading-relaxed">
								&ldquo;Seni bukan sekadar gambar — ia adalah keringat,
								kegelisahan, dan kejujuran seorang manusia yang dituangkan ke
								atas kanvas.&rdquo;
							</p>
							<footer className="mt-2 text-sm text-content-muted">
								— Manifesto TruBrush
							</footer>
						</blockquote>

						{/* Problem list */}
						<p className="text-xs font-semibold uppercase tracking-widest text-content-muted mb-3">
							Tantangan nyata yang kami hadapi
						</p>
						<ul className="space-y-3">
							{problems.map((item) => (
								<li key={item} className="flex items-start gap-3">
									<div className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-danger/10 flex items-center justify-center">
										<AlertTriangle className="w-3 h-3 text-danger" />
									</div>
									<p className="text-sm text-content-muted leading-relaxed">
										{item}
									</p>
								</li>
							))}
						</ul>
					</div>
				</div>
			</section>

			{/* ── 3. Cara Kerja TruBrush ──────────────────────────────────────── */}
			<section className="mb-16">
				<div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-3 py-1.5 rounded-full mb-5">
					<Brush className="w-4 h-4" />
					Cara Kerja
				</div>

				<h2 className="font-heading text-2xl font-semibold text-content mb-2">
					Cara Kerja TruBrush
				</h2>
				<p className="text-content-muted mb-8 max-w-2xl">
					Dari verifikasi artis hingga pengiriman karya — prosesnya dirancang
					untuk melindungi semua pihak dan memastikan setiap transaksi berjalan
					dengan percaya diri.
				</p>

				<div className="space-y-4">
					{steps.map(({ number, icon: Icon, title, description }) => (
						<div
							key={number}
							className="flex gap-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-surface p-5 hover:border-primary/40 hover:shadow-sm transition-all"
						>
							{/* Number + Icon stack */}
							<div className="flex flex-col items-center gap-2 shrink-0">
								<div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
									<Icon className="w-5 h-5 text-primary" />
								</div>
								<span className="font-display text-xs font-bold text-content-muted tabular-nums">
									{number}
								</span>
							</div>

							{/* Text */}
							<div className="flex-1 min-w-0">
								<h3 className="font-heading font-semibold text-content text-base mb-1">
									{title}
								</h3>
								<p className="text-sm text-content-muted leading-relaxed">
									{description}
								</p>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* ── 4. Nilai-Nilai Kami ──────────────────────────────────────────── */}
			<section className="mb-16">
				<div className="inline-flex items-center gap-2 bg-accent/10 text-accent text-sm font-medium px-3 py-1.5 rounded-full mb-5">
					<CheckCircle className="w-4 h-4" />
					Nilai-Nilai Kami
				</div>

				<h2 className="font-heading text-2xl font-semibold text-content mb-2">
					Prinsip yang Memandu Kami
				</h2>
				<p className="text-content-muted mb-8 max-w-2xl">
					Enam nilai ini bukan sekadar kata-kata — mereka tertanam dalam setiap
					keputusan produk dan kebijakan yang kami buat di TruBrush.
				</p>

				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
					{values.map(({ icon: Icon, title, description }) => (
						<div
							key={title}
							className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-surface p-5 hover:border-primary/40 hover:shadow-sm transition-all"
						>
							<div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 shrink-0">
								<Icon className="w-5 h-5 text-primary" />
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

			{/* ── 5. CTA Section ──────────────────────────────────────────────── */}
			<section>
				<h2 className="font-heading text-2xl font-semibold text-content mb-2 text-center">
					Bergabunglah dengan Gerakan Ini
				</h2>
				<p className="text-content-muted text-center mb-8 max-w-xl mx-auto">
					Apakah Anda seorang artis yang ingin karya Anda dihargai, atau
					kolektor yang ingin memiliki seni autentik — TruBrush adalah rumah
					Anda.
				</p>

				<div className="grid sm:grid-cols-2 gap-4">
					{/* Card: Artis */}
					<div className="flex flex-col rounded-2xl border border-primary/30 bg-primary/10 p-6">
						<div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mb-4 shrink-0">
							<Brush className="w-5 h-5 text-primary" />
						</div>
						<h3 className="font-heading font-semibold text-content text-base mb-2">
							Untuk Artis
						</h3>
						<p className="text-sm text-content-muted leading-relaxed mb-5 flex-1">
							Daftarkan diri sebagai artis terverifikasi, tampilkan portofolio
							Anda, dan mulai terima komisi dari klien yang menghargai seni
							buatan manusia.
						</p>
						<Link
							href="/signup"
							className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-background bg-primary hover:bg-primary-hover transition-colors shadow-sm"
						>
							Daftar sebagai Artis
							<ArrowRight className="w-4 h-4" />
						</Link>
					</div>

					{/* Card: Kolektor */}
					<div className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-surface p-6">
						<div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4 shrink-0">
							<Search className="w-5 h-5 text-accent" />
						</div>
						<h3 className="font-heading font-semibold text-content text-base mb-2">
							Untuk Kolektor
						</h3>
						<p className="text-sm text-content-muted leading-relaxed mb-5 flex-1">
							Jelajahi ribuan karya autentik dari artis terverifikasi. Pesan
							komisi dengan aman menggunakan sistem Escrow dan terima Sertifikat
							Human-Made bersama karya Anda.
						</p>
						<Link
							href="/"
							className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-primary bg-accent/20 hover:bg-accent/40 dark:text-accent transition-colors"
						>
							Temukan Karya
							<ArrowRight className="w-4 h-4" />
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
}
