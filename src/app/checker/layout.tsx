import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "12-Point DV Photo Compliance Checker & Biometric Audit",
  description:
    "Free client-side 12-point biometric and technical validator for U.S. Diversity Visa photos. Audits 600x600 px dimensions, head height %, eye level band, lighting shadows, and JPEG headers.",
  alternates: {
    canonical: "https://dvphotocheck.tech/checker",
  },
  openGraph: {
    title: "12-Point DV Photo Compliance Checker | dvphotocheck.tech",
    description: "Audits your photo against 22 C.F.R. § 42.33 biometric geometry rules. 100% client-side privacy sandbox.",
    url: "https://dvphotocheck.tech/checker",
  },
};

export default function CheckerLayout({ children }: { children: React.ReactNode }) {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "12-Point DV Photo Compliance Checker",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Automated biometric and technical compliance validator auditing Diversity Visa photographs against U.S. Department of State specifications.",
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

