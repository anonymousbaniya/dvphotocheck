import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive DV Entry & Post-Selection Checklist",
  description:
    "Persistent step-by-step checklist tracking your Diversity Visa journey: photo capture, entry submission, result checking, DS-260 filing, and consular interview prep.",
  alternates: {
    canonical: "https://dvphotocheck.tech/checklist",
  },
  openGraph: {
    title: "Interactive DV Entry & Post-Selection Checklist | dvphotocheck.tech",
    description: "Track your progress from registration to interview. Auto-saves locally.",
    url: "https://dvphotocheck.tech/checklist",
  },
};

export default function ChecklistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

