import { getInitials } from "@/utils";

export default function AvatarInitials({
    name,
    className = "",
}: {
    name: string;
    className?: string;
}) {
    const initials = getInitials(name);

    return (
        <span
            className={`inline-flex items-center justify-center rounded-full bg-primary text-white text-[10px] font-medium shrink-0 ${className}`}
        >
            {initials}
        </span>
    );
}
