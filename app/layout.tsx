import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { auth } from "@/auth";
import { Providers } from "./providers";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { AdSenseScript } from "@/components/ads/AdSlot";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "Ink & Ideas";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Premium Blog`,
    template: `%s — ${SITE_NAME}`,
  },
  description: "Premium writing on design, technology, and the human experience.",
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  openGraph: { type: "website", locale: "en_US", url: SITE_URL, siteName: SITE_NAME },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth().catch(() => null);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <AdSenseScript />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers session={session}>{children}</Providers>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID ?? ""} />
      </body>
    </html>
  );
}
