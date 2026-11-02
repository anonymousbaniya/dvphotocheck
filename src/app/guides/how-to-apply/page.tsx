import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { GuideLayout } from "@/components/guides/GuideLayout";
import { CheckCircle2, AlertTriangle, ExternalLink, Calendar, Users, Camera, KeyRound } from "lucide-react";

export const metadata: Metadata = {
  title: "How to Apply for the U.S. Diversity Visa Lottery — dvphotocheck.tech",
  description: "Complete step-by-step walkthrough for entering the official U.S. Green Card Lottery (DV-2026 / DV-2027) on dvprogram.state.gov. Learn entry rules, family derivative requirements, and fee policies.",
  alternates: {
    canonical: "https://dvphotocheck.tech/guides/how-to-apply",
  },
};

const TOC = [
  { id: "timeline", title: "1. Registration Window & Program Timeline" },
  { id: "fees", title: "2. The Official Fee Policy (100% Free Entry)" },
  { id: "step-by-step", title: "3. Step-by-Step Application Walkthrough" },
  { id: "derivatives", title: "4. Spouse & Child Derivative Rules" },
  { id: "confirmation", title: "5. Saving Your Confirmation Number" },
];

export default function HowToApplyGuidePage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How much does it cost to enter the DV Lottery?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Submitting an entry on the official U.S. government website (dvprogram.state.gov) is completely free. There are no registration fees charged by the Department of State."
        }
      },
      {
        "@type": "Question",
        "name": "When does the DV Lottery open and close?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The registration window typically opens in early October and closes in early November (usually noon Eastern Daylight Time). Exact dates are published in the annual instructions on travel.state.gov."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <GuideLayout
        currentSlug="how-to-apply"
        title="How to Apply for the U.S. Diversity Visa (Green Card Lottery)"
        subtitle="The authoritative, step-by-step manual to entering the official DV Program without costly third-party middlemen."
        category="Application Roadmap"
        toc={TOC}
      >
        {/* Important Warning Alert */}
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-sm space-y-2">
          <p className="font-bold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span>The ONLY Official Portal: dvprogram.state.gov</span>
          </p>
          <p className="text-xs sm:text-sm leading-relaxed">
            There is only one official website for submitting entries:{" "}
            <a href="https://dvprogram.state.gov" target="_blank" rel="noopener noreferrer" className="font-bold underline text-amber-950 dark:text-amber-100">
              dvprogram.state.gov
            </a>
            . Any other website ending in <code>.com</code>, <code>.org</code>, or <code>.net</code> is an unaffiliated third-party agency or scam.
          </p>
        </div>

        {/* Section 1 */}
        <section id="timeline" className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            1. Registration Window &amp; Program Timeline
          </h2>
          <p>
            The Diversity Visa Program runs on an annual schedule. Understanding the timeline prevents missed deadlines:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 not-prose">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-mono font-bold text-blue-500 block">OCTOBER – NOVEMBER</span>
              <p className="font-bold text-slate-900 dark:text-white mt-1 text-sm">Registration Window</p>
              <p className="text-xs text-slate-500 mt-1">Submit your electronic entry online at dvprogram.state.gov.</p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-mono font-bold text-emerald-500 block">MAY (FOLLOWING YEAR)</span>
              <p className="font-bold text-slate-900 dark:text-white mt-1 text-sm">Entrant Status Check</p>
              <p className="text-xs text-slate-500 mt-1">Check selection status using your 16-character confirmation number.</p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-mono font-bold text-indigo-500 block">OCTOBER – SEPTEMBER</span>
              <p className="font-bold text-slate-900 dark:text-white mt-1 text-sm">Interviews &amp; Visa Issuance</p>
              <p className="text-xs text-slate-500 mt-1">Selectees file DS-260, undergo medical, and attend consular interviews.</p>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section id="fees" className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            2. The Official Fee Policy
          </h2>
          <p>
            A common misconception is that entering the DV Lottery requires an upfront payment. Under current Department of State regulations:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Initial Registration: $0 (FREE).</strong> The U.S. government charges no fee to submit the Electronic Diversity Visa entry form.</li>
            <li><strong>Post-Selection Visa Application Fee: $330.</strong> This fee is paid strictly in person at the U.S. Embassy or Consulate cashier on the day of your consular interview. It is NEVER paid online or in advance.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section id="step-by-step" className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            3. Step-by-Step Application Walkthrough
          </h2>
          <div className="space-y-4 not-prose">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-blue-500">STEP 1</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Prepare Your Biometric Photos in Advance</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                You have a strict 60-minute time limit to complete the online form once you begin. Having verified 600×600 px JPEGs ready for yourself and all family members ensures you do not get timed out. Use our <Link href="/crop" className="text-blue-600 dark:text-blue-400 underline font-semibold">AI Photo Cropper</Link> beforehand.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-blue-500">STEP 2</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Fill Part 1: Entrant Information</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Enter your Name, Gender, Birth Date, City of Birth, Country of Birth, Country of Eligibility (Nativity or Cross-Chargeability), Mailing Address, Email, Education Level, and Marital Status.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-blue-500">STEP 3</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Fill Part 2: Derivatives (Spouse &amp; Children)</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Enter information and upload individual photographs for your legal spouse and all living unmarried children under 21 years of age.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-blue-500">STEP 4</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Review &amp; Submit</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Carefully review every field on the review screen. Once submitted, changes cannot be made under any circumstances.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section id="derivatives" className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            4. Spouse &amp; Child Derivative Rules (Disqualification Trap)
          </h2>
          <p>
            The single most common ground for consular visa denial is failure to list qualifying family members:
          </p>
          <div className="p-4 rounded-xl bg-red-50/50 dark:bg-red-950/30 border border-red-300 dark:border-red-800 text-xs sm:text-sm space-y-2">
            <p className="font-bold text-red-900 dark:text-red-200">Strict Legal Requirement:</p>
            <p className="text-red-800 dark:text-red-300">
              You <strong>MUST</strong> list your spouse (unless deceased or legally divorced) and <strong>ALL</strong> natural children, legally adopted children, and stepchildren under age 21—<strong>even if they do not live with you, or do not intend to immigrate with you</strong>.
            </p>
            <p className="text-red-800 dark:text-red-300">
              Omitting a spouse or child on your entry form results in mandatory disqualification of your entire case at the interview.
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section id="confirmation" className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            5. Archiving Your Confirmation Number
          </h2>
          <p>
            Upon successful submission, the system generates a Submission Confirmation Screen showing:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm">
            <li>Entrant Name</li>
            <li>Confirmation Number (16 characters, e.g. <code>20271OABCDE89XYZ</code>)</li>
            <li>Year of Birth</li>
            <li>Digital Signature</li>
          </ul>
          <p>
            Do not rely solely on screenshotting your browser. Store it immediately in our <Link href="/vault" className="text-blue-600 dark:text-blue-400 underline font-semibold">Encrypted Vault</Link> to generate an offline PNG Backup Card.
          </p>
        </section>

      </GuideLayout>
    </>
  );
}

