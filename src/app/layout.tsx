import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LeaseFlex — Mobility Protection for Renters",
  description:
    "Life changes. Your lease shouldn't trap you. Get flexibility for a small monthly fee.",
  openGraph: {
    title: "LeaseFlex — Your Lease Shouldn't Trap You",
    description:
      "Break your lease without the financial hit. AI-powered protection starting at $12/mo.",
    siteName: "LeaseFlex",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "LeaseFlex — Your Lease Shouldn't Trap You",
    description:
      "Break your lease without the financial hit. AI-powered protection starting at $12/mo.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} font-sans antialiased bg-white text-neutral-900`}>
        <Navbar />
        <main className="pt-16 animate-page-in">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
