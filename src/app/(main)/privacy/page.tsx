import type { Metadata } from "next";
import { Shield, Eye, Lock, Users, Bell, Trash2, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Kebijakan privasi TruBrush — bagaimana kami mengumpulkan, menggunakan, dan melindungi data Anda.",
};

interface Section {
  id: string;
  icon: React.ElementType;
  title: string;
  content: React.ReactNode;
}

const sections: Section[] = [
  {
    id: "informasi-yang-dikumpulkan",
    icon: Eye,
    title: "Informasi yang Kami Kumpulkan",
    content: (
      <div className="space-y-3">
        <p>Kami mengumpulkan informasi yang Anda berikan secara langsung, antara lain:</p>
        <ul className="list-disc list-inside space-y-1.5 pl-2 text-content-muted">
          <li><strong className="text-content">Data Akun</strong> — nama, alamat email, dan kata sandi terenkripsi saat Anda mendaftar.</li>
          <li><strong className="text-content">Profil Artis</strong> — bio, portofolio, tautan sosial media, dan preferensi komisi yang Anda isi secara sukarela.</li>
          <li><strong className="text-content">Karya & Konten</strong> — gambar, deskripsi, dan metadata karya seni yang Anda unggah ke platform.</li>
          <li><strong className="text-content">Data Transaksi</strong> — informasi komisi, history pembayaran, dan status escrow (tidak termasuk detail kartu kredit penuh).</li>
          <li><strong className="text-content">Komunikasi</strong> — pesan yang dikirim antar pengguna melalui fitur Messages.</li>
        </ul>
        <p className="text-content-muted">
          Kami juga mengumpulkan data teknis secara otomatis seperti alamat IP, jenis browser, dan halaman yang dikunjungi untuk keperluan keamanan dan peningkatan layanan.
        </p>
      </div>
    ),
  },
  {
    id: "penggunaan-informasi",
    icon: Shield,
    title: "Cara Kami Menggunakan Informasi",
    content: (
      <div className="space-y-3">
        <p>Informasi Anda digunakan semata-mata untuk menjalankan dan meningkatkan layanan TruBrush:</p>
        <ul className="list-disc list-inside space-y-1.5 pl-2 text-content-muted">
          <li>Memverifikasi identitas dan mengelola akun pengguna.</li>
          <li>Memproses komisi dan pembayaran melalui sistem Escrow yang aman.</li>
          <li>Mendeteksi dan mencegah konten buatan AI (<em>AI-generated content</em>) yang melanggar ketentuan platform.</li>
          <li>Mengirimkan notifikasi terkait aktivitas akun, komisi, dan pembaruan platform.</li>
          <li>Menganalisis tren penggunaan secara agregat (tanpa identitas personal) untuk meningkatkan fitur.</li>
        </ul>
        <p className="text-content-muted">
          <strong className="text-content">Kami tidak menggunakan karya seni Anda untuk melatih model AI apapun.</strong> Ini adalah komitmen inti TruBrush sebagai platform seni manusia yang autentik.
        </p>
      </div>
    ),
  },
  {
    id: "berbagi-data",
    icon: Users,
    title: "Berbagi Data dengan Pihak Ketiga",
    content: (
      <div className="space-y-3">
        <p>TruBrush tidak menjual data pribadi Anda. Kami hanya berbagi data dalam kondisi terbatas berikut:</p>
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <p className="font-semibold text-content mb-1">Penyedia Layanan Pembayaran</p>
            <p className="text-sm text-content-muted">Data transaksi diteruskan ke payment gateway untuk memproses pembayaran escrow. Mereka tunduk pada standar keamanan PCI-DSS.</p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <p className="font-semibold text-content mb-1">Kewajiban Hukum</p>
            <p className="text-sm text-content-muted">Kami dapat mengungkapkan data jika diwajibkan oleh hukum, perintah pengadilan, atau otoritas berwenang di Indonesia.</p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <p className="font-semibold text-content mb-1">Profil Publik Artis</p>
            <p className="text-sm text-content-muted">Informasi yang Anda tandai sebagai publik (nama tampilan, portofolio, bio) dapat diakses oleh seluruh pengguna platform.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "keamanan-data",
    icon: Lock,
    title: "Keamanan Data",
    content: (
      <div className="space-y-3">
        <p>Kami menerapkan langkah-langkah teknis dan organisasi untuk melindungi data Anda:</p>
        <ul className="list-disc list-inside space-y-1.5 pl-2 text-content-muted">
          <li>Enkripsi data saat transit menggunakan HTTPS/TLS.</li>
          <li>Kata sandi di-hash menggunakan algoritma bcrypt — bahkan tim kami tidak dapat membaca kata sandi Anda.</li>
          <li>Autentikasi berbasis token (JWT) dengan masa berlaku terbatas.</li>
          <li>Sistem escrow yang memisahkan dana dari pihak platform hingga komisi selesai dan disetujui kedua belah pihak.</li>
          <li>Audit log untuk aktivitas sensitif seperti perubahan kata sandi dan penarikan dana.</li>
        </ul>
        <p className="text-content-muted">
          Meski demikian, tidak ada sistem yang 100% aman. Harap segera hubungi kami jika Anda mencurigai adanya akses tidak sah ke akun Anda.
        </p>
      </div>
    ),
  },
  {
    id: "cookies",
    icon: Bell,
    title: "Cookie & Penyimpanan Lokal",
    content: (
      <div className="space-y-3">
        <p>TruBrush menggunakan cookie dan penyimpanan lokal browser untuk:</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-2 pr-4 font-semibold text-content">Jenis</th>
                <th className="text-left py-2 pr-4 font-semibold text-content">Tujuan</th>
                <th className="text-left py-2 font-semibold text-content">Durasi</th>
              </tr>
            </thead>
            <tbody className="text-content-muted">
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-2.5 pr-4">Access Token</td>
                <td className="py-2.5 pr-4">Autentikasi sesi login</td>
                <td className="py-2.5">1 jam</td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-2.5 pr-4">Refresh Token</td>
                <td className="py-2.5 pr-4">Memperbarui sesi secara otomatis</td>
                <td className="py-2.5">7 hari</td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-2.5 pr-4">Preferensi Tema</td>
                <td className="py-2.5 pr-4">Menyimpan pilihan dark/light mode</td>
                <td className="py-2.5">Permanen</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4">Status Login</td>
                <td className="py-2.5 pr-4">Indikator sesi aktif (localStorage)</td>
                <td className="py-2.5">Hingga logout</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-content-muted">Kami tidak menggunakan cookie pelacak pihak ketiga atau cookie iklan.</p>
      </div>
    ),
  },
  {
    id: "hak-pengguna",
    icon: Trash2,
    title: "Hak-Hak Anda",
    content: (
      <div className="space-y-3">
        <p>Sesuai prinsip privasi yang kami anut, Anda memiliki hak penuh atas data Anda:</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { hak: "Akses", deskripsi: "Minta salinan data pribadi yang kami simpan tentang Anda." },
            { hak: "Koreksi", deskripsi: "Perbarui data yang tidak akurat melalui halaman pengaturan profil." },
            { hak: "Penghapusan", deskripsi: "Minta penghapusan akun dan semua data terkait." },
            { hak: "Portabilitas", deskripsi: "Ekspor karya dan data profil Anda dalam format yang dapat dibaca." },
            { hak: "Keberatan", deskripsi: "Tolak pemrosesan data untuk tujuan analitik non-esensial." },
            { hak: "Pembatasan", deskripsi: "Minta kami membatasi pemrosesan data Anda dalam situasi tertentu." },
          ].map(({ hak, deskripsi }) => (
            <div key={hak} className="rounded-xl bg-primary/5 border border-primary/10 p-3.5">
              <p className="font-semibold text-primary text-sm mb-1">{hak}</p>
              <p className="text-sm text-content-muted">{deskripsi}</p>
            </div>
          ))}
        </div>
        <p className="text-content-muted">
          Untuk mengajukan permintaan terkait hak-hak di atas, hubungi kami di alamat yang tertera di bawah. Kami akan merespons dalam 14 hari kerja.
        </p>
      </div>
    ),
  },
  {
    id: "kontak",
    icon: Mail,
    title: "Hubungi Kami",
    content: (
      <div className="space-y-3">
        <p>Jika Anda memiliki pertanyaan, kekhawatiran, atau permintaan terkait kebijakan privasi ini, silakan hubungi:</p>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 space-y-2">
          <p className="font-semibold text-content font-heading text-lg">TruBrush Privacy Team</p>
          <p className="text-content-muted">
            Email:{" "}
            <a href="mailto:privacy@trubrush.id" className="text-primary hover:underline underline-offset-2">
              privacy@trubrush.id
            </a>
          </p>
          <p className="text-content-muted">Jam Operasional: Senin–Jumat, 09.00–17.00 WIB</p>
          <p className="text-content-muted">Respons rata-rata: 2–3 hari kerja</p>
        </div>
        <p className="text-sm text-content-muted">
          Kebijakan ini dapat kami perbarui sewaktu-waktu. Perubahan signifikan akan diberitahukan melalui notifikasi di platform atau email terdaftar Anda. Versi terbaru selalu tersedia di halaman ini.
        </p>
      </div>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">

      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-3 py-1.5 rounded-full mb-4">
          <Shield className="w-4 h-4" />
          Kebijakan Privasi
        </div>
        <h1 className="font-display text-4xl font-bold text-content mb-4">
          Privasi Anda, Prioritas Kami
        </h1>
        <p className="text-lg text-content-muted max-w-2xl">
          TruBrush dibangun di atas kepercayaan komunitas seniman. Kami berkomitmen untuk transparan tentang bagaimana data Anda dikumpulkan, digunakan, dan dilindungi.
        </p>
        <p className="mt-4 text-sm text-content-muted">
          Berlaku sejak: <span className="text-content font-medium">1 Januari 2025</span>
          {" · "}
          Terakhir diperbarui: <span className="text-content font-medium">23 Juni 2025</span>
        </p>
      </div>

      {/* Highlight Banner */}
      <div className="mb-10 rounded-2xl bg-accent/10 border border-accent/20 p-5 flex gap-4">
        <Shield className="w-6 h-6 text-accent shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-content mb-1">Komitmen Anti-AI TruBrush</p>
          <p className="text-sm text-content-muted">
            Karya seni yang Anda unggah tidak pernah dan tidak akan pernah digunakan untuk melatih, menyempurnakan, atau mengembangkan model kecerdasan buatan manapun — baik oleh TruBrush maupun pihak ketiga. Data Anda adalah milik Anda sepenuhnya.
          </p>
        </div>
      </div>

      {/* Daftar Isi */}
      <nav className="mb-10 rounded-2xl bg-surface border border-slate-200 dark:border-slate-700 p-5">
        <p className="font-semibold text-content mb-3 text-sm uppercase tracking-wide">Daftar Isi</p>
        <ol className="space-y-1.5">
          {sections.map((section, index) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="flex items-center gap-2 text-sm text-content-muted hover:text-primary transition-colors"
              >
                <span className="text-xs text-primary font-medium w-5">{index + 1}.</span>
                {section.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* Konten Utama */}
      <div className="space-y-10">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 shrink-0">
                  <Icon className="w-4.5 h-4.5 text-primary" />
                </div>
                <h2 className="font-heading text-xl font-semibold text-content">{section.title}</h2>
              </div>
              <div className="pl-12 text-content-muted leading-relaxed">
                {section.content}
              </div>
            </section>
          );
        })}
      </div>

      {/* Divider */}
      <hr className="my-12 border-slate-200 dark:border-slate-700" />

      {/* Footer note */}
      <p className="text-center text-sm text-content-muted">
        Dengan menggunakan TruBrush, Anda menyetujui kebijakan privasi ini.{" "}
        <a href="#" className="text-primary hover:underline underline-offset-2">
          Syarat & Ketentuan
        </a>{" "}
        juga berlaku.
      </p>
    </div>
  );
}
