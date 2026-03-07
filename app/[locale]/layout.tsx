import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/cart-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://phingift.vn"),
  title: {
    default: "PhinGift – Phin Cà Phê Khắc Logo | Vietnamese Coffee Filter Gift",
    template: "%s | PhinGift",
  },
  description:
    "Phin cà phê khắc logo theo yêu cầu – chất liệu inox 304/430 và nhôm định hình cao cấp. Quà tặng doanh nghiệp, sỉ quà tặng cà phê Việt Nam. Giao hàng toàn quốc.",
  keywords: ["phin cà phê", "phin khắc logo", "quà tặng cà phê", "phin inox", "phin nhôm", "vietnamese coffee filter"],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://phingift.vn",
    siteName: "PhinGift",
    title: "PhinGift – Phin Cà Phê Khắc Logo Cao Cấp",
    description: "Phin cà phê khắc logo theo yêu cầu – chất liệu inox và nhôm cao cấp. Quà tặng doanh nghiệp ý nghĩa.",
    images: [
      {
        url: "/images/hero/phin-coffee-pour.jpg",
        width: 1200,
        height: 630,
        alt: "PhinGift – Phin Cà Phê Khắc Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PhinGift – Phin Cà Phê Khắc Logo Cao Cấp",
    description: "Phin cà phê khắc logo theo yêu cầu – chất liệu inox và nhôm cao cấp.",
    images: ["/images/hero/phin-coffee-pour.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import CartDrawer from '@/components/CartDrawer';
import ScrollToTop from '@/components/ScrollToTop';
import { Suspense } from 'react';

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans bg-cream text-brown">
        <NextIntlClientProvider messages={messages}>
          <CartProvider>
            <Suspense fallback={null}>
              <ScrollToTop />
            </Suspense>
            <Navbar />
            <CartDrawer />
            <main>{children}</main>
            <Footer />
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
