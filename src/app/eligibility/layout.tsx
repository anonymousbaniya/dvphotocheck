import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DV Lottery Eligibility & Nativity Calculator",
  description:
    "Check your U.S. Green Card Lottery eligibility by native country of birth, spouse cross-chargeability rules, and Department of Labor O*NET Job Zone experience criteria.",
  alternates: {
    canonical: "https://dvphotocheck.tech/eligibility",
  },
  openGraph: {
    title: "DV Lottery Eligibility & Nativity Calculator | dvphotocheck.tech",
    description: "Verify country eligibility, cross-chargeability exceptions, and O*NET qualifications.",
    url: "https://dvphotocheck.tech/eligibility",
  },
};

export default function EligibilityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

