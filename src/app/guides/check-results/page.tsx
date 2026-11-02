import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { GuideLayout } from "@/components/guides/GuideLayout";
import { Calendar, Search, KeyRound, AlertCircle, ExternalLink, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "How to Check DV Lottery Results (Entrant Status Check) — dvphotocheck.tech",
  description: "Official guide on checking your Diversity Visa Lottery status on dvprogram.state.gov. Learn how to read your selection letter and recover a lost confirmation number.",
  alternates: {
    canonical: "https://dvphotocheck.tech/guides/check-results",
  },
};

const TOC = [
  { id: "when", title: "1. When Are Results Released?" },
  { id: "how-to-check", title: "2. How to Check Entrant Status" },
  { id: "reading-letter", title: "3. Reading Your Selection Notification" },
  { id: "lost-number", title: "4. Recovering a Lost Confirmation Number" },
  { id: "confusing-chars", title: "5. Confusing Character Matrix (0 vs O, 1 vs I)" },
];

export default function CheckResultsGuidePage() {
  return (
    <GuideLayout
      currentSlug="check-results"
      title="How to Check Your DV Lottery Results"
      subtitle="Complete walkthrough on using the Entrant Status Check (ESC) portal on dvprogram.state.gov."
      category="Results & Selection"
      toc={TOC}
    >
      <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-sm space-y-2">
        <p className="font-bold flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Results Open Annually in May</span>
        </p>
        <p className="text-xs sm:text-sm leading-relaxed">
          Entrant Status Check for the DV-2026 program opened in <strong>May 2025</strong> and remains open until <strong>September 30, 2026</strong>. For DV-2027, results open in <strong>May 2026</strong>.
        </p>
      </div>

      <section id="when" className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          1. When Are Results Released?
        </h2>
        <p>
          Results are published on the first Tuesday or Saturday in May (at noon Eastern Time). The official selection list is updated exclusively through the online Entrant Status Check (ESC) on{" "}
          <a href="https://dvprogram.state.gov" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline font-semibold">
            dvprogram.state.gov
          </a>.
        </p>
      </section>

      <section id="how-to-check" className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          2. How to Check Your Entrant Status
        </h2>
        <ol className="list-decimal pl-5 space-y-2 text-sm">
          <li>Visit <strong>dvprogram.state.gov</strong> and click the blue <strong>&quot;Check Status&quot;</strong> button.</li>
          <li>Click <strong>&quot;Continue&quot;</strong> on the welcome page.</li>
          <li>Enter your <strong>16-character Confirmation Number</strong> (e.g. <code>20261A2B3C4D5E6F</code>).</li>
          <li>Enter your <strong>Last / Family Name</strong> only (do not include first or middle names).</li>
          <li>Enter your <strong>Year of Birth</strong> as four digits (e.g. <code>1992</code>).</li>
          <li>Complete the visual CAPTCHA verification code and click <strong>&quot;Submit&quot;</strong>.</li>
        </ol>
      </section>

      <section id="reading-letter" className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          3. Understanding Your Result Letter
        </h2>
        <div className="space-y-3 not-prose">
          <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-600 text-white font-bold">SELECTED</span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
              &quot;You have been randomly selected for further processing in the Diversity Immigrant Visa Program...&quot;
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Congratulations! This letter contains your official <strong>Case Number</strong> (e.g., <code>2026AS00004521</code>). Immediately save this letter and proceed to our <Link href="/guides/ds-260" className="text-blue-600 underline font-semibold">DS-260 Guide</Link>.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-500 text-white font-bold">NOT SELECTED</span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
              &quot;Based on the information provided, the Entry HAS NOT BEEN SELECTED...&quot;
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Your entry was not chosen in the primary drawing. Keep your number saved until the end of the fiscal year (September 30), as additional selections occasionally take place.
            </p>
          </div>
        </div>
      </section>

      <section id="lost-number" className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          4. How to Recover a Lost Confirmation Number
        </h2>
        <p>
          If you misplaced your confirmation number, click the <strong>&quot;Forgot Confirmation Number&quot;</strong> link on the ESC portal. The system will prompt you for:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm">
          <li>Program Year (e.g. 2026 or 2027)</li>
          <li>Primary Entrant Full Legal Name</li>
          <li>Date of Birth (Month, Day, Year)</li>
          <li>The exact <strong>Email Address</strong> used when submitting the entry</li>
        </ul>
        <p className="text-xs text-slate-500">
          If the information matches State Department records, your confirmation number will be displayed on the screen.
        </p>
      </section>

      <section id="confusing-chars" className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          5. Common Confusing Characters
        </h2>
        <p>
          Many applicants receive an &quot;Invalid Confirmation Number&quot; error due to typographical confusion. The State Department warns of these common substitutions:
        </p>
        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 text-xs not-prose">
          <table className="w-full text-left">
            <thead className="bg-slate-100 dark:bg-slate-900 font-bold">
              <tr>
                <th className="p-3">Character</th>
                <th className="p-3">Common Confusion</th>
                <th className="p-3">Resolution Advice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              <tr>
                <td className="p-3 font-bold text-blue-600">0 (Zero) vs O (Letter)</td>
                <td className="p-3">Typing number 0 instead of letter O</td>
                <td className="p-3 font-sans">Swap &apos;0&apos; with &apos;O&apos; and re-attempt.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-blue-600">1 (One) vs I (Letter)</td>
                <td className="p-3">Typing uppercase &apos;I&apos; instead of digit &apos;1&apos;</td>
                <td className="p-3 font-sans">In many fonts, &apos;1&apos; and &apos;I&apos; appear identical. Try both.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-blue-600">8 (Eight) vs B (Letter)</td>
                <td className="p-3">Misreading blurred printouts</td>
                <td className="p-3 font-sans">Replace &apos;8&apos; with &apos;B&apos; or vice versa.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </GuideLayout>
  );
}

