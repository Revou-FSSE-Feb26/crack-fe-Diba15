export function AvatarInitials({
    name,
    className = "",
}: {
    name: string;
    className?: string;
}) {
    const initials = name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();

    return (
        <span
            className={`inline-flex items-center justify-center rounded-full bg-primary text-white text-[10px] font-medium shrink-0 ${className}`}
        >
            {initials}
        </span>
    );
}
