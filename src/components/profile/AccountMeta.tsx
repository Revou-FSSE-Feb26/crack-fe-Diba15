import { Mail, UserRound } from "lucide-react";
import type { ProfileUser } from "@/types";

interface AccountMetaProps {
	user: ProfileUser;
}

export default function AccountMeta({ user }: AccountMetaProps) {
	return (
		<div className="mt-1 flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-xs sm:text-sm text-content-muted">
			<span className="inline-flex items-center gap-1.5 min-w-0 max-w-full truncate">
				<Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
				<span className="truncate">{user.email}</span>
			</span>
			<span className="inline-flex items-center gap-1.5 capitalize shrink-0">
				<UserRound className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
				{user.role}
			</span>
		</div>
	);
}
