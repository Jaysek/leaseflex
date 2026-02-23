import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LeaseFlex — Break your lease without the penalty.",
  description:
    "LeaseFlex covers early termination fees so you can move when life changes. Starting at $19/month.",
  metadataBase: new URL("https://leaseflex.io"),
  openGraph: {
    title: "Break your lease without the penalty.",
    description:
      "LeaseFlex covers early termination fees so you can move when life changes. Starting at $19/month.",
    url: "https://leaseflex.io",
    siteName: "LeaseFlex",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "LeaseFlex — Break your lease without the penalty",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Break your lease without the penalty.",
    description:
      "LeaseFlex covers early termination fees so you can move when life changes. Starting at $19/month.",
    images: ["/og.png"],
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
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name: 'LeaseFlex Lease Protection',
    description: 'Monthly subscription that covers lease-break penalties, early termination fees, and remaining rent obligations.',
    provider: {
      '@type': 'Organization',
      name: 'LeaseFlex',
      url: 'https://leaseflex.io',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: '19',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '19',
        priceCurrency: 'USD',
        billingDuration: 'P1M',
      },
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${geist.variable} font-sans antialiased bg-white text-neutral-900`}>
        <Navbar />
        <main className="pt-16 animate-page-in">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
