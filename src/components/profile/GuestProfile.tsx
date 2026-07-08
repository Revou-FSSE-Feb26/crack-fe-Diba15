import Link from "next/link";

import AvatarInitials from "@/components/home/AvatarInitials";

export default function GuestProfile() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-surface border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center">
        <AvatarInitials name="Guest User" className="w-20 h-20 text-2xl mx-auto" />
        <h1 className="mt-4 font-display text-2xl font-bold text-content">
          Masuk untuk melihat profil
        </h1>
        <p className="mt-2 text-sm text-content-muted">
          Profil artist dan client akan ditampilkan sesuai role akun kamu.
        </p>
        <Link
          href="/login"
          className="mt-5 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-background shadow-sm transition-colors hover:bg-primary-hover"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
