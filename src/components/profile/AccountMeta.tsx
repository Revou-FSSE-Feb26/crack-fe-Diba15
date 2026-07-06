import { Mail, UserRound } from "lucide-react";

import type { ProfileUser } from "@/components/profile/types";

interface AccountMetaProps {
  user: ProfileUser;
}

export default function AccountMeta({ user }: AccountMetaProps) {
  return (
    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-content-muted">
      <span className="inline-flex items-center gap-1.5">
        <Mail className="w-4 h-4 text-primary" />
        {user.email}
      </span>
      <span className="inline-flex items-center gap-1.5 capitalize">
        <UserRound className="w-4 h-4 text-primary" />
        {user.role}
      </span>
    </div>
  );
}
