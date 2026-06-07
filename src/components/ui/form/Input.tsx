export default function Input({
    label = "",
    placeholder = "",
    type = "text",
    children,
    ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
    className?: string;
    label?: string;
    placeholder?: string;
} & { children?: React.ReactNode }) {
    return (
        <div>
            <label className="block text-sm font-semibold mb-1.5">{label}</label>
            <div className="relative">
                {children && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {children}
                    </div>
                )
                }
                <input
                    {...props}
                    type={type}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#1D2D37] border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#33658A] dark:focus:ring-[#86BBD8] focus:border-transparent outline-none transition-all"
                />
            </div>
        </div>
    );
}