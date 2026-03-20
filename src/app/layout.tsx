import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Bananaverse — Logistics Intelligence Platform",
    template: "%s | Bananaverse",
  },
  description:
    "Real-time fleet tracking, AI-optimized routing, and end-to-end shipment management. Deliver smarter with Bananaverse.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://bananaverse.app"
  ),
  icons: {
    icon: [{ url: "/favicon.svg?v=5", type: "image/svg+xml" }],
    apple: "/favicon.svg?v=5",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
