import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Encrypted Confirmation Vault & Offline Backup Card",
  description:
    "Zero-knowledge AES-GCM encrypted confirmation number vault for DV Lottery applicants. Generates high-resolution PNG backup credential cards for offline phone storage.",
  alternates: {
    canonical: "https://dvphotocheck.tech/vault",
  },
  openGraph: {
    title: "Encrypted Confirmation Vault | dvphotocheck.tech",
    description: "Store your 16-character confirmation number locally with Web Crypto AES-GCM encryption.",
    url: "https://dvphotocheck.tech/vault",
  },
};

export default function VaultLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

