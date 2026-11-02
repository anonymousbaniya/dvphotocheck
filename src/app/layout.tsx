import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://dvphotocheck.tech"),
  title: {
    default: "dvphotocheck.tech — 100% Client-Side U.S. Diversity Visa Photo Suite",
    template: "%s | dvphotocheck.tech",
  },
  description:
    "The privacy-first U.S. Green Card Lottery photo suite. 1-Click AI biometric auto-crop, 12-point photo compliance validator, 4x6 print sheet generator, and encrypted confirmation vault. Zero server uploads.",
  keywords: [
    "DV Lottery photo",
    "Diversity Visa photo checker",
    "Green card lottery photo tool",
    "US visa photo crop",
    "600x600 photo generator",
    "biometric photo validator",
    "private DV photo",
    "USCIS photo tool",
    "DS-260 guide",
    "Diversity Visa 2026",
    "Diversity Visa 2027",
  ],
  authors: [{ name: "dvphotocheck.tech engineering team" }],
  creator: "dvphotocheck.tech",
  publisher: "dvphotocheck.tech",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "dvphotocheck.tech — 100% Client-Side U.S. Diversity Visa Photo Suite",
    description:
      "Automated biometric cropping and 12-point compliance check for U.S. Diversity Visa entrants. 100% client-side privacy sandbox.",
    url: "https://dvphotocheck.tech",
    siteName: "dvphotocheck.tech",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/icon.svg",
        width: 512,
        height: 512,
        alt: "dvphotocheck.tech Biometric Suite Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "dvphotocheck.tech — 100% Client-Side U.S. Diversity Visa Photo Suite",
    description:
      "1-Click AI biometric cropping, 12-point validator, and encrypted confirmation vault for the Green Card Lottery. 0 bytes uploaded.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "dvphotocheck.tech",
    url: "https://dvphotocheck.tech",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript, WebAssembly, and HTML5 Canvas support",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Privacy-first, 100% client-side photo cropper, biometric validator, and applicant tools for the U.S. Diversity Visa Program.",
  };

  return (
    <html lang="en" suppressHydrationWarning className="light">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex flex-col min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-blue-500/20 selection:text-blue-500">
        <ThemeProvider>
          <Navbar />
          <main id="top" className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
