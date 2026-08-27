import AvatarInitials from "@/components/home/AvatarInitials";
import AccountMeta from "@/components/profile/AccountMeta";
import ProfileHeading from "@/components/profile/ProfileHeading";
import type { ProfileUser } from "@/types";

interface StaffProfileProps {
	user: ProfileUser;
}

export default function StaffProfile({ user }: StaffProfileProps) {
	return (
		<div className="max-w-5xl mx-auto px-3 sm:px-6 py-5 sm:py-8 space-y-6 sm:space-y-8">
			<ProfileHeading
				eyebrow="Profil Staff"
				title="Akun internal TruBrush"
				description="Role admin dan curator memiliki akses operasional yang berbeda dari artist dan client."
			/>
			<div className="bg-surface border border-content/10 rounded-2xl p-4 sm:p-6">
				<div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5">
					<AvatarInitials
						name={user.name}
						className="w-16 h-16 sm:w-20 sm:h-20 text-xl sm:text-2xl shrink-0"
					/>
					<div className="min-w-0">
						<h2 className="font-display text-xl sm:text-2xl font-bold text-content truncate">
							{user.name}
						</h2>
						<AccountMeta user={user} />
					</div>
				</div>
			</div>
		</div>
	);
}
