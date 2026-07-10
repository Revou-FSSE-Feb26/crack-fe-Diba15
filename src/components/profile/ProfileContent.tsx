"use client";

import ArtistProfile from "@/components/profile/ArtistProfile";
import ClientProfile from "@/components/profile/ClientProfile";
import GuestProfile from "@/components/profile/GuestProfile";
import StaffProfile from "@/components/profile/StaffProfile";
import { useMounted } from "@/hooks/useMounted";
import { useUserStore } from "@/store/UserStore";

export default function ProfileContent() {
	const { user, isArtist, isClient } = useUserStore();
	const mounted = useMounted();

	if (!mounted) {
		return (
			<div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
				<div className="bg-surface border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
					<p className="text-sm text-content-muted">Memuat profil...</p>
				</div>
			</div>
		);
	}

	if (!user) {
		return <GuestProfile />;
	}

	if (isArtist()) {
		return <ArtistProfile user={user} />;
	}

	if (isClient()) {
		return <ClientProfile user={user} />;
	}

	return <StaffProfile user={user} />;
}
