import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { StructuredData } from "@/components/StructuredData";
import { site } from "@/data/site";

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "500", "600"],
});

const siteUrl = "https://miners-arms.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "The Miners Arms | British Grill House | West Bromwich",
    template: "%s · The Miners Arms",
  },
  description:
    "The Miners Arms, West Bromwich. A British grill house where the full English, slow-cooked Indian curries and hand-folded Chinese small plates share one table. Dine in, takeaway & bookings.",
  keywords: [
    "Miners Arms",
    "West Bromwich restaurant",
    "Indian curry West Bromwich",
    "Chinese food West Bromwich",
    "mixed grill",
    "full English breakfast",
    "bao buns",
    "crispy aromatic duck",
    "B70 0TW",
  ],
  authors: [{ name: "The Miners Arms" }],
  icons: {
    icon: site.logo,
    apple: site.logo,
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl,
    siteName: site.name,
    title: "The Miners Arms | British Grill House | West Bromwich",
    description:
      "Three kitchens, one roof. English breakfasts, Indian curries & Chinese small plates in the heart of West Bromwich.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "The Miners Arms dining room",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Miners Arms | British Grill House | West Bromwich",
    description:
      "English breakfasts, Indian curries & Chinese small plates under one roof.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0908",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" className={`${display.variable} ${sans.variable} ${serif.variable}`}>
      <body className="font-sans antialiased">
        <StructuredData />
        {children}
      </body>
    </html>
  );
}
