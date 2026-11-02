import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { GuideLayout } from "@/components/guides/GuideLayout";
import { TrendingUp, AlertTriangle, Calendar, ExternalLink, Globe2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Visa Bulletin & DV Case Numbers Decoded — dvphotocheck.tech",
  description: "Learn how Diversity Visa Case Numbers work, regional rank cutoffs (AF, AS, EU, SA, OC), reading the monthly Visa Bulletin, and the September 30 deadline.",
  alternates: {
    canonical: "https://dvphotocheck.tech/guides/visa-bulletin",
  },
};

const TOC = [
  { id: "case-number-anatomy", title: "1. Anatomy of a DV Case Number" },
  { id: "how-cutoffs-work", title: "2. How Monthly Cutoffs Work" },
  { id: "reading-bulletin", title: "3. Reading Section C of the Visa Bulletin" },
  { id: "regional-quotas", title: "4. Regional Caps & Ineligible Allocations" },
  { id: "sept-30-deadline", title: "5. The Absolute September 30 Deadline" },
];

export default function VisaBulletinGuidePage() {
  return (
    <GuideLayout
      currentSlug="visa-bulletin"
      title="The Visa Bulletin &amp; DV Case Numbers Decoded"
      subtitle="How regional rank numbers, monthly cutoffs, and visa quotas dictate when you can be scheduled for an interview."
      category="Case Number Analytics"
      toc={TOC}
    >
      <div className="p-5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-950 dark:text-purple-200 text-sm space-y-2">
        <p className="font-bold flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>Case Numbers Determine Your Priority Order</span>
        </p>
        <p className="text-xs sm:text-sm leading-relaxed">
          Diversity Visa processing is not scheduled randomly. Interviews are offered strictly in order of numerical ranking within each geographical region. A lower number means an earlier interview.
        </p>
      </div>

      <section id="case-number-anatomy" className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          1. Anatomy of a DV Case Number
        </h2>
        <p>
          Found on your Selection Notification Letter, a Case Number has 14 characters formatted as:
        </p>
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono not-prose">
          <span className="text-xl sm:text-2xl font-black text-white tracking-widest">
            <span className="text-blue-400">2026</span>
            <span className="text-purple-400">AF</span>
            <span className="text-slate-500">000</span>
            <span className="text-emerald-400">12345</span>
          </span>
          <div className="mt-3 grid grid-cols-3 text-[11px] text-slate-400 border-t border-slate-800 pt-3">
            <div><span className="text-blue-400 font-bold block">2026</span>Fiscal Year</div>
            <div><span className="text-purple-400 font-bold block">AF</span>Region Code</div>
            <div><span className="text-emerald-400 font-bold block">12345</span>Rank Position</div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono not-prose">
          <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <strong>AF:</strong> Africa
          </div>
          <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <strong>AS:</strong> Asia
          </div>
          <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <strong>EU:</strong> Europe
          </div>
          <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <strong>NA:</strong> North America (Bahamas)
          </div>
          <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <strong>OC:</strong> Oceania
          </div>
          <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <strong>SA:</strong> South America / Caribbean
          </div>
        </div>
      </section>

      <section id="how-cutoffs-work" className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          2. How Monthly Cutoffs Work
        </h2>
        <p>
          Around the 8th to 15th of each month, the Department of State publishes the <strong>Visa Bulletin</strong> on travel.state.gov. In Section C (Diversity Immigrant Category), it announces cutoff numbers for the upcoming two months.
        </p>
        <p>
          If the published cutoff for Africa for July is <strong>45,000</strong>, any applicant with an African Case Number <strong>below 45,000</strong> whose DS-260 is fully processed is eligible for interview scheduling. If marked <strong>&quot;Current&quot;</strong>, all processed cases in that region are eligible regardless of number.
        </p>
      </section>

      <section id="regional-quotas" className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          3. Regional &amp; Single-Country Caps
        </h2>
        <p>
          Under the Immigration and Nationality Act:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm">
          <li>No single country may receive more than <strong>7%</strong> (approx. 3,850 visas) of the total available diversity visas in any fiscal year.</li>
          <li>High-demand countries (e.g., Egypt, Algeria, Uzbekistan, Nepal) often have lower country-specific cutoffs published in the Visa Bulletin to avoid exceeding the 7% ceiling.</li>
        </ul>
      </section>

      <section id="sept-30-deadline" className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          4. The Absolute September 30 Fiscal Year Cutoff
        </h2>
        <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-xs sm:text-sm space-y-2 not-prose">
          <p className="font-bold text-red-900 dark:text-red-200 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span>Strict Statutory Midnight Deadline</span>
          </p>
          <p className="text-red-800 dark:text-red-300 leading-relaxed">
            By U.S. law (INA § 204(a)(1)(I)(ii)(II)), eligibility for a Diversity Visa strictly terminates at midnight on <strong>September 30</strong> of the program fiscal year.
          </p>
          <p className="text-red-800 dark:text-red-300 leading-relaxed">
            No visa can be issued after September 30, even if your interview was already conducted or your background checks were delayed. This is why having your DS-260 and civil documents in perfect order early is crucial.
          </p>
        </div>
      </section>

    </GuideLayout>
  );
}

