export default function Button({
    children,
    className = "",
    variant = "primary",
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "danger";
}) {

    if (variant === "danger") {
        return (
            <button {...props} className={`${className} px-6 py-3 rounded-lg font-semibold text-danger bg-danger/10 hover:bg-danger/20 transition-colors flex items-center gap-2 cursor-pointer`}>
                {children}
            </button>
        )
    }

    if (variant === "secondary") {
        return (
            <button {...props} className={`${className} px-6 py-3 rounded-lg font-semibold text-primary bg-accent/20 hover:bg-accent/40 dark:text-accent transition-colors cursor-pointer`}>
                {children}
            </button>
        )
    }

    return (
        <button {...props} className={`${className} px-6 py-3 rounded-lg font-semibold text-background bg-primary hover:bg-primary-hover transition-colors shadow-sm cursor-pointer`}>
            {children}
        </button>
    )
}