import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { GuideLayout } from "@/components/guides/GuideLayout";
import { HelpCircle, CheckCircle2, AlertTriangle, Calendar, Award, DollarSign } from "lucide-react";

export const metadata: Metadata = {
  title: "Consular Interview Preparation & Questions for DV Winners — dvphotocheck.tech",
  description: "Comprehensive guide to the Diversity Visa interview: 2NL appointment letter, typical officer questions, the $330 fee, financial proof, and visa issuance.",
  alternates: {
    canonical: "https://dvphotocheck.tech/guides/interview",
  },
};

const TOC = [
  { id: "2nl", title: "1. The Second Notification Letter (2NL)" },
  { id: "fee", title: "2. The $330 Visa Fee at the Embassy" },
  { id: "questions", title: "3. Common Consular Officer Questions" },
  { id: "public-charge", title: "4. Financial Self-Sufficiency (Public Charge)" },
  { id: "aftermath", title: "5. After Approval: Traveling to the U.S." },
];

export default function InterviewGuidePage() {
  return (
    <GuideLayout
      currentSlug="interview"
      title="Consular Interview Preparation for DV Selectees"
      subtitle="How to ace your embassy interview, answer officer questions, and successfully receive your immigrant visa."
      category="Interview Day"
      toc={TOC}
    >
      <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-sm space-y-2">
        <p className="font-bold flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>The Final Stage of the Diversity Visa Journey</span>
        </p>
        <p className="text-xs sm:text-sm leading-relaxed">
          The interview is typically short (5 to 15 minutes), but decisive. The consular officer will review your original documents, verify high school or work qualifications, ensure family derivatives are genuine, and confirm you are not inadmissible under U.S. immigration law.
        </p>
      </div>

      <section id="2nl" className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          1. The Second Notification Letter (2NL)
        </h2>
        <p>
          When your regional Case Number is about to become current in the monthly Visa Bulletin and KCC has finished processing your DS-260, you will receive an email stating: <em>&quot;There has been an update to your case status. Please log in to dvprogram.state.gov.&quot;</em>
        </p>
        <p>
          This is the <strong>Second Notification Letter (2NL)</strong>. It informs you of your exact interview date, time, and embassy location. Print several copies of this appointment letter.
        </p>
      </section>

      <section id="fee" className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          2. The $330 Diversity Visa Application Fee
        </h2>
        <p>
          Before speaking to the consular officer, you will be directed to the embassy cashier window:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm">
          <li><strong>Amount:</strong> $330 USD per applicant (including spouse and each child).</li>
          <li><strong>Payment Mode:</strong> Cash (U.S. Dollars or local currency equivalent) or major credit cards.</li>
          <li><strong>Non-Refundable:</strong> If your visa is denied, this fee is non-refundable by law.</li>
        </ul>
      </section>

      <section id="questions" className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          3. Top 10 Common Consular Officer Questions
        </h2>
        <div className="space-y-3 not-prose">
          {[
            { q: "Where were you born?", a: "Validates your claimed native country of chargeability." },
            { q: "What is your highest level of education?", a: "Verifies high school 12-year curriculum certificate." },
            { q: "What do you do for work?", a: "Cross-checks DS-260 employment history and O*NET qualifications." },
            { q: "When and where did you get married?", a: "Crucial for marriages entered into after lottery submission to test validity." },
            { q: "Where do you plan to live in the United States?", a: "Reviewing your initial destination address." },
            { q: "Do you have relatives or friends in the U.S.?", a: "Checks support network and address provided on DS-260." },
            { q: "Have you ever been arrested or convicted of a crime?", a: "Mandatory statutory admissibility question." },
            { q: "Have you ever lived in the U.S. illegally or overstayed a visa?", a: "Testing 3-year / 10-year unlawful presence bars." },
          ].map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm">
              <p className="font-bold text-slate-900 dark:text-white">Q: {item.q}</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Context: {item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="public-charge" className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          4. Financial Self-Sufficiency &amp; Public Charge
        </h2>
        <p>
          Under INA § 212(a)(4), applicants who are likely to become a public charge are inadmissible. You must demonstrate that you can financially support yourself and your family in the U.S.:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm">
          <li><strong>Personal Savings:</strong> Bank statements showing sufficient liquid assets.</li>
          <li><strong>Affidavit of Support (Form I-134):</strong> Optional but recommended if your savings are modest, signed by a U.S. citizen or permanent resident friend/relative.</li>
          <li><strong>Job Offer or Skills:</strong> Employability in your profession.</li>
        </ul>
      </section>

      <section id="aftermath" className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          5. After Visa Approval
        </h2>
        <p>
          If approved, the consular officer will keep your passport to print the machine-readable immigrant visa foil (valid for up to 6 months, matching medical exam expiration). You will also receive instructions to pay the <strong>$220 USCIS Immigrant Fee</strong> online before your physical Green Card is produced.
        </p>
      </section>

    </GuideLayout>
  );
}

