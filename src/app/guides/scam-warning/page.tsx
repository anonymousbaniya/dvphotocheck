import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { GuideLayout } from "@/components/guides/GuideLayout";
import { ShieldAlert, AlertTriangle, XCircle, CheckCircle2, DollarSign, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Diversity Visa Scam Shield & Fraud Warning — dvphotocheck.tech",
  description: "Protect yourself against Diversity Visa fraud: how to spot fake lottery notification emails, fraudulent Western Union payment demands, and predatory immigration brokers.",
  alternates: {
    canonical: "https://dvphotocheck.tech/guides/scam-warning",
  },
};

const TOC = [
  { id: "golden-rule", title: "1. The #1 Golden Rule of the DV Lottery" },
  { id: "fake-emails", title: "2. Anatomy of a Fake 'You Won' Email" },
  { id: "phishing-sites", title: "3. Spotting Phony .com & .org Websites" },
  { id: "unscrupulous-agents", title: "4. The Hostage Confirmation Number Scam" },
  { id: "reporting", title: "5. How to Report Fraud to the U.S. Government" },
];

export default function ScamWarningGuidePage() {
  return (
    <GuideLayout
      currentSlug="scam-warning"
      title="Diversity Visa Scam Shield &amp; Fraud Defense"
      subtitle="How to protect your money, identity, and visa eligibility from predatory immigration scammers and phishing operations."
      category="Fraud Defense"
      toc={TOC}
    >
      <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-200 text-sm space-y-2">
        <p className="font-bold flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          <span>The U.S. Government NEVER Sends Selection Emails</span>
        </p>
        <p className="text-xs sm:text-sm leading-relaxed">
          The Department of State will <strong>never</strong> contact you via email, SMS, phone, or letter to inform you that you have won the lottery. Any communication claiming you have been selected and demanding money is 100% fraudulent.
        </p>
      </div>

      <section id="golden-rule" className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          1. The #1 Golden Rule of the DV Program
        </h2>
        <p>
          The <strong>ONLY</strong> official way to find out if your entry was selected is to visit:
        </p>
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono not-prose">
          <a
            href="https://dvprogram.state.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg sm:text-xl font-bold text-blue-400 hover:underline"
          >
            https://dvprogram.state.gov
          </a>
        </div>
        <p>
          You must check this website yourself every May using your 16-character confirmation number.
        </p>
      </section>

      <section id="fake-emails" className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          2. Anatomy of a Fake &quot;You Won&quot; Scam Email
        </h2>
        <p>
          Scammers send millions of phishing emails annually mimicking State Department seals and Great Seals of the United States. Key red flags include:
        </p>
        <div className="space-y-3 not-prose">
          {[
            {
              flag: "Sent from Non-.gov Addresses",
              example: "From: usa-state-dept@gmail.com, visa-center@usa.com, or uscis@dvlottery-gov.org",
              expl: "All official U.S. government communications end strictly in '.gov'. Any email from gmail, yahoo, or custom domains is fake.",
            },
            {
              flag: "Demanding Wire Transfers or Gift Cards",
              example: "Instructions to send $880 via Western Union, MoneyGram, Bitcoin, or Zelle to a 'consular officer'",
              expl: "The State Department never accepts wire transfers. The $330 fee is paid strictly in person at the embassy cashier on interview day.",
            },
            {
              flag: "Urgent 48-Hour Ultimatum",
              example: "'Your visa will be permanently cancelled if payment is not wired within 48 hours'",
              expl: "Fabricated urgency is designed to panic victims into wiring money without verifying official sources.",
            },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/20 dark:bg-rose-950/10 space-y-1">
              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-rose-600 text-white font-mono uppercase">
                Red Flag #{idx + 1}
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white pt-1">{item.flag}</h3>
              <p className="text-xs font-mono text-rose-600 dark:text-rose-400">{item.example}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 pt-1 leading-relaxed">{item.expl}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="phishing-sites" className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          3. Phony .com, .org, and Third-Party Portals
        </h2>
        <p>
          Hundreds of commercial websites copy official U.S. logos, patriotic eagle emblems, and Statue of Liberty images to charge $50 to $250 for submitting your entry. Many of these services:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm">
          <li>Submit entries late or improperly, causing disqualification.</li>
          <li>Never actually submit your application and simply steal your credit card details.</li>
          <li>Charge recurring monthly subscription fees without your knowledge.</li>
        </ul>
      </section>

      <section id="unscrupulous-agents" className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          4. The &quot;Hostage Confirmation Number&quot; Extortion
        </h2>
        <p>
          In many regions, local internet cafes or visa brokers offer to submit entries &quot;for free.&quot; They intentionally withhold the 16-character confirmation number from the applicant.
        </p>
        <p>
          When the applicant is selected in May, the broker demands between <strong>$2,000 and $10,000 USD</strong> to release the confirmation number or attempts to force a fraudulent sham marriage with someone paying to immigrate as a derivative.
        </p>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
          Protection Rule: Always submit your own application. It takes less than 10 minutes on dvprogram.state.gov, and your confirmation number will remain strictly in your possession.
        </div>
      </section>

      <section id="reporting" className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          5. Reporting Fraud
        </h2>
        <p>
          If you receive fraudulent emails or discover predatory websites claiming to represent the U.S. Diversity Visa Program:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm">
          <li>Forward the scam email directly to the Department of Justice / Federal Trade Commission at <strong>reportfraud.ftc.gov</strong>.</li>
          <li>File a complaint with the FBI Internet Crime Complaint Center (IC3) at <strong>ic3.gov</strong>.</li>
        </ul>
      </section>

    </GuideLayout>
  );
}
