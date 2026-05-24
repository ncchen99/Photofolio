import type { Metadata } from "next";
import { EB_Garamond, Noto_Serif_TC, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-eb-garamond",
  display: "swap",
});

const notoSerifTC = Noto_Serif_TC({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-noto-serif-tc",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

import { cdnUrl } from "@/lib/cdn";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").trim();
const metadataBase = (() => {
  try {
    return new URL(siteUrl || "http://localhost:3000");
  } catch {
    return new URL("http://localhost:3000");
  }
})();

export const metadata: Metadata = {
  metadataBase,
  title: "horseface · Photofolio",
  description:
    "Photographs by 馬臉 (horseface) — Tanaka, Taiwan.",
  openGraph: {
    title: "horseface · Photofolio",
    description: "Photographs by 馬臉 (horseface) — Tanaka, Taiwan.",
    url: "/",
    siteName: "horseface · Photofolio",
    images: [
      {
        url: cdnUrl("/avatar.webp"),
        width: 1200,
        height: 630,
        alt: "horseface · Photofolio",
      },
    ],
    locale: "zh_TW",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "horseface · Photofolio",
    description: "Photographs by 馬臉 (horseface) — Tanaka, Taiwan.",
    images: [cdnUrl("/avatar.webp")],
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="zh-Hant"
      className={`${ebGaramond.variable} ${notoSerifTC.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-paper text-ink antialiased">{children}</body>
    </html>
  );
}
