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

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: "Horse Face · Photofolio",
  description:
    "Photographs by 馬臉 (Horse Face) — Tanaka, Taiwan.",
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
