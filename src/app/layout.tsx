import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { TrubrushProvider } from "@/context/TrubrushContext";

// 1. Konfigurasi Font Utama (Heading)
const fontOutfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

// 2. Konfigurasi Font Sekunder (Body & UI)
const fontBody = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | TruBrush",
    default: "TruBrush - Authentic Art & Commission Platform",
  },
  description: "Platform media sosial dan komisi ilustrator yang 100% bebas AI. Temukan karya seni asli buatan manusia, pekerjakan artis terverifikasi, dan bertransaksi aman dengan sistem Escrow.",
  keywords: [
    "TruBrush",
    "illustrator",
    "anti-AI art",
    "human art",
    "commission platform",
    "escrow art commission",
    "verified artist",
    "social media for artists",
    "jasa ilustrasi",
    "gambar asli"
  ],
  authors: [{ name: "Developer TruBrush" }],
  creator: "TruBrush Team",
  publisher: "TruBrush",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontOutfit.variable} ${fontBody.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="h-full">
        <TrubrushProvider>
          {children}
        </TrubrushProvider>
      </body>
    </html>
  );
}
