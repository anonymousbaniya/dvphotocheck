import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DV_SEO_FAQS } from "@/lib/constants/seo-faqs";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://dvphotocheck.tech"),
  title: {
    default: "DVPhotoCheck (dvphotocheck.tech) – Free DV Lottery Photo Checker & Validator",
    template: "%s | DVPhotoCheck",
  },
  description:
    "DVPhotoCheck (dvphotocheck.tech) is a free online DV Lottery and US Visa photo checker. Instantly validate 600x600px dimensions, head size, eye level, and background compliance.",
  keywords: [
    "dvphotocheck",
    "dv photo check",
    "dvphotocheck.tech",
    "DV lottery photo checker",
    "green card photo validator",
    "600x600 photo check",
    "US visa photo tool",
    "DV Lottery photo",
    "Diversity Visa photo checker",
    "600x600 photo generator",
    "biometric photo validator",
  ],
  authors: [{ name: "DVPhotoCheck Engineering Team" }],
  creator: "DVPhotoCheck",
  publisher: "DVPhotoCheck",
  alternates: {
    canonical: "https://dvphotocheck.tech/",
  },
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "DVPhotoCheck (dvphotocheck.tech) – Free DV Lottery Photo Checker & Validator",
    description:
      "DVPhotoCheck (dvphotocheck.tech) is a free online DV Lottery and US Visa photo checker. Instantly validate 600x600px dimensions, head size, eye level, and background compliance.",
    url: "https://dvphotocheck.tech/",
    siteName: "DVPhotoCheck",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DVPhotoCheck — Free US DV Lottery Photo Checker & 600x600 Validator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DVPhotoCheck (dvphotocheck.tech) – Free DV Lottery Photo Checker & Validator",
    description:
      "Free online DV Lottery photo checker at dvphotocheck.tech. Validate 600x600px dimensions, 240 KB JPEG size, head height (50%-69%), eye level, and background 100% locally.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://dvphotocheck.tech/#website",
        name: "DVPhotoCheck",
        alternateName: [
          "dvphotocheck",
          "DV Photo Check",
          "dvphotocheck.tech",
          "DV Lottery Photo Checker",
        ],
        url: "https://dvphotocheck.tech/",
      },
      {
        "@type": ["WebApplication", "SoftwareApplication"],
        "@id": "https://dvphotocheck.tech/#webapp",
        name: "DVPhotoCheck",
        alternateName: ["dvphotocheck", "DVPhotoCheck — Free DV Lottery Photo Checker"],
        url: "https://dvphotocheck.tech/",
        applicationCategory: "UtilityApplication",
        operatingSystem: "All",
        browserRequirements: "Requires JavaScript, WebAssembly, and HTML5 Canvas support",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        description:
          "Free online DV Lottery photo checker and compliance validator for U.S. Diversity Visa applicants.",
      },
      {
        "@type": "FAQPage",
        "@id": "https://dvphotocheck.tech/#faq",
        mainEntity: DV_SEO_FAQS.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
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
