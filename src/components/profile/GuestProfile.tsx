import Link from "next/link";
import AvatarInitials from "@/components/home/AvatarInitials";

export default function GuestProfile() {
	return (
		<div className="max-w-5xl mx-auto px-3 sm:px-6 py-5 sm:py-8">
			<div className="bg-surface border border-content/10 rounded-2xl p-4 sm:p-6 text-center">
				<AvatarInitials
					name="Guest User"
					className="w-16 h-16 sm:w-20 sm:h-20 text-xl sm:text-2xl mx-auto"
				/>
				<h1 className="mt-3.5 sm:mt-4 font-display text-xl sm:text-2xl font-bold text-content">
					Masuk untuk melihat profil
				</h1>
				<p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-content-muted">
					Profil artist dan client akan ditampilkan sesuai role akun kamu.
				</p>
				<Link
					href="/login"
					className="mt-4 sm:mt-5 inline-flex items-center justify-center rounded-lg bg-primary px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-background shadow-sm transition-colors hover:bg-primary-hover"
				>
					Login
				</Link>
			</div>
		</div>
	);
}
