import { getInitials } from "@/utils";

const avatarPalette = [
  "bg-primary",
  "bg-warm-hover",
  "bg-verified",
  "bg-premium",
  "bg-danger",
  "bg-mint",
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % avatarPalette.length;
  return avatarPalette[index];
}

export default function AvatarInitials({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  const initials = getInitials(name);
  const colorClass = getAvatarColor(name);

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full ${colorClass} text-white text-[10px] font-medium shrink-0 ${className}`}
    >
      {initials}
    </span>
  );
}
