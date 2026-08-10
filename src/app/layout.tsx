import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { WhatsAppFab } from "@/components/whatsapp/WhatsAppFab";
import { siteConfig } from "@/lib/utils";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Investors Circle | Intelligent Investment Opportunities",
    template: "%s | Investors Circle",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "Investors Circle",
    "investment opportunities",
    "private investments",
    "real estate investing",
    "investment network",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "Investors Circle | Intelligent Investment Opportunities",
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Investors Circle | Intelligent Investment Opportunities",
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  sameAs: [],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScrollProvider>
          {children}
          <WhatsAppFab />
        </SmoothScrollProvider>
        <AnalyticsProvider />
      </body>
    </html>
  );
}
