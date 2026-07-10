import AvatarInitials from "@/components/home/AvatarInitials";
import AccountMeta from "@/components/profile/AccountMeta";
import ProfileHeading from "@/components/profile/ProfileHeading";
import type { ProfileUser } from "@/components/profile/types";

interface StaffProfileProps {
	user: ProfileUser;
}

export default function StaffProfile({ user }: StaffProfileProps) {
	return (
		<div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
			<ProfileHeading
				eyebrow="Profil Staff"
				title="Akun internal TruBrush"
				description="Role admin dan curator memiliki akses operasional yang berbeda dari artist dan client."
			/>
			<div className="bg-surface border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
				<div className="flex items-start gap-4">
					<AvatarInitials
						name={user.name}
						className="w-20 h-20 text-2xl shrink-0"
					/>
					<div>
						<h2 className="font-display text-2xl font-bold text-content">
							{user.name}
						</h2>
						<AccountMeta user={user} />
					</div>
				</div>
			</div>
		</div>
	);
}
