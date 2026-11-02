import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { GuideLayout } from "@/components/guides/GuideLayout";
import { FileText, CheckCircle2, AlertTriangle, ExternalLink, Calendar, Users, Camera } from "lucide-react";

export const metadata: Metadata = {
  title: "DS-260 Immigrant Visa Form Guide for DV Selectees — dvphotocheck.tech",
  description: "Comprehensive step-by-step DS-260 filing guide for DV Lottery winners: CEAC portal access, Case Number priority, civil document preparation, and interview scheduling.",
  alternates: {
    canonical: "https://dvphotocheck.tech/guides/ds-260",
  },
};

const TOC = [
  { id: "overview", title: "1. What is Form DS-260?" },
  { id: "ceac-login", title: "2. Logging into the CEAC Portal" },
  { id: "timing", title: "3. When Should You Submit Your DS-260?" },
  { id: "family", title: "4. Filing for Derivatives (Spouse & Kids)" },
  { id: "unlocking", title: "5. How to Unlock a Submitted DS-260" },
];

export default function DS260GuidePage() {
  return (
    <GuideLayout
      currentSlug="ds-260"
      title="DS-260 Immigrant Visa Electronic Application Guide"
      subtitle="The essential roadmap for DV Lottery winners filing Form DS-260 with the Kentucky Consular Center (KCC)."
      category="Post-Selection"
      toc={TOC}
    >
      <div className="p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-950 dark:text-indigo-200 text-sm space-y-2">
        <p className="font-bold flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Form DS-260 is Your Formal Visa Application</span>
        </p>
        <p className="text-xs sm:text-sm leading-relaxed">
          Being selected in the DV Lottery does NOT automatically grant you a Green Card. It only qualifies you to apply for one of the ~55,000 available immigrant visas. Form DS-260 is the formal legal application processed by the Department of State.
        </p>
      </div>

      <section id="overview" className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          1. What is Form DS-260?
        </h2>
        <p>
          Form DS-260 (Immigrant Visa Electronic Application) is an extensive online form administered through the Consular Electronic Application Center (CEAC). It collects detailed biographical, residential, educational, work, and security history for every applicant seeking an immigrant visa.
        </p>
      </section>

      <section id="ceac-login" className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          2. Accessing the CEAC Portal
        </h2>
        <p>
          To access your DS-260, go to{" "}
          <a href="https://ceac.state.gov/IV" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline font-semibold">
            ceac.state.gov/IV
          </a>{" "}
          and enter:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm">
          <li><strong>Case Number:</strong> Your 14-character Case Number without spaces (e.g. <code>2026AF00012345</code> or <code>2026EU00008765</code>).</li>
          <li><strong>Invoice ID Number:</strong> For DV applicants, your Invoice ID is your <strong>Principal Entrant Year of Birth (YYYY)</strong>.</li>
          <li>Select your role as <strong>&quot;Applicant&quot;</strong> and complete the CAPTCHA.</li>
        </ul>
      </section>

      <section id="timing" className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          3. When Should You Submit Form DS-260?
        </h2>
        <p>
          The Department of State selects approximately 100,000 to 140,000 applicants worldwide for only 55,000 available visas. Visas are issued strictly on a first-come, first-served basis according to regional Case Numbers:
        </p>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm space-y-2 not-prose">
          <p className="font-bold text-slate-900 dark:text-white">Strategic Filing Rule:</p>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Filing early (May–June) is generally recommended because KCC requires time to process background checks before your Case Number becomes current in the monthly Visa Bulletin. However, accuracy is paramount—never submit rushed or falsified information.
          </p>
        </div>
      </section>

      <section id="family" className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          4. Derivative Applications (Spouses &amp; Children)
        </h2>
        <p>
          A separate DS-260 form must be submitted for <strong>EACH family member</strong> immigrating with you. The primary applicant and all accompanying derivatives must complete their individual forms before KCC will schedule an interview appointment.
        </p>
        <p>
          If you got married or had a child after submitting your initial lottery entry in October, you can add them to your CEAC case by notifying the Kentucky Consular Center with certified birth/marriage certificates.
        </p>
      </section>

      <section id="unlocking" className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          5. How to Unlock a Submitted DS-260
        </h2>
        <p>
          Once you sign and submit Form DS-260, it becomes read-only. If you discover a significant error or change your passport details, you must contact KCC (or the embassy if your case has already been transferred) to request that your form be unlocked:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm">
          <li>Email: <strong>KCCDV@state.gov</strong></li>
          <li>Subject: <code>Case Number: 2026AF00012345 - Unlock DS-260 Request</code></li>
          <li>Include Principal Applicant full name, date of birth, and exact reason for the correction.</li>
        </ul>
      </section>

    </GuideLayout>
  );
}
