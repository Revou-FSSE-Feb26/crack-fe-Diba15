import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Auth",
};

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div className="min-h-full flex flex-col">
                <div className="flex flex-col flex-1">
                    {children}
                </div>
            </div>
        </>
    );
}
