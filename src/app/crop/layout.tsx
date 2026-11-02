import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "1-Click AI Biometric Photo Cropper & Studio",
  description:
    "Free client-side AI auto-crop tool for U.S. Diversity Visa lottery photos. Automatically detects facial landmarks, levels head tilt to 0°, scales head to 59.5%, and exports 600x600 px under 240 KB.",
  alternates: {
    canonical: "https://dvphotocheck.tech/crop",
  },
  openGraph: {
    title: "1-Click AI Biometric Photo Cropper | dvphotocheck.tech",
    description: "Biometric AI auto-crop and 4x6 print sheet generator for U.S. visa applicants. Zero server uploads.",
    url: "https://dvphotocheck.tech/crop",
  },
};

export default function CropLayout({ children }: { children: React.ReactNode }) {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "AI Biometric Photo Cropper & Studio",
    applicationCategory: "DesignApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "1-Click client-side WebAssembly photo cropper that aligns head height, eye level, and tilt to strict U.S. Department of State visa specifications.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      {children}
    </>
  );
}

