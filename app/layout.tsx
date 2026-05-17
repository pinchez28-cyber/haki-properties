import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.hakimarketplace.com"),
  title: {
    default: "Haki Marketplace",
    template: "%s | Haki Marketplace",
  },
  description:
    "Verified homes, land, and real estate deals across East Africa.",
  openGraph: {
    title: "Haki Marketplace",
    description:
      "Find verified homes, land, and real estate deals across East Africa.",
    url: "https://www.hakimarketplace.com",
    siteName: "Haki Marketplace",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Haki Marketplace homes and land",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Haki Marketplace",
    description:
      "Find verified homes, land, and real estate deals across East Africa.",
    images: ["/opengraph-image"],
  },
  icons: {
    icon: "/icon",
    apple: "/apple-icon",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
