import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { GuideLayout } from "@/components/guides/GuideLayout";
import { CheckCircle2, FileText, Camera, Printer, AlertTriangle, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Civil Documents & Evidence Checklist for DV Selectees — dvphotocheck.tech",
  description: "Complete list of required civil documents for Diversity Visa winners: police certificates, birth certificates, certified translations, medical exam records, and 2x2 passport photos.",
  alternates: {
    canonical: "https://dvphotocheck.tech/guides/documents",
  },
};

const TOC = [
  { id: "core-documents", title: "1. Core Personal Civil Documents" },
  { id: "police-certificates", title: "2. Police Clearance Certificate Rules" },
  { id: "translations", title: "3. Certified English Translation Standards" },
  { id: "photos", title: "4. Physical 2x2\" Photographs (4x6 Print Sheet)" },
  { id: "medical", title: "5. Immigrant Medical Exam Guidelines" },
];

export default function DocumentsGuidePage() {
  return (
    <GuideLayout
      currentSlug="documents"
      title="Civil Documents &amp; Evidence Checklist for Selectees"
      subtitle="The comprehensive documentation checklist required by the U.S. Embassy for your immigrant visa interview."
      category="Document Gathering"
      toc={TOC}
    >
      <div className="p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-950 dark:text-blue-200 text-sm space-y-2">
        <p className="font-bold flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Original Documents Required at the Interview</span>
        </p>
        <p className="text-xs sm:text-sm leading-relaxed">
          You must bring both the <strong>original</strong> and a <strong>photocopy</strong> of each required civil document for every person applying for a visa. Originals will be inspected and returned to you by the consular officer.
        </p>
      </div>

      <section id="core-documents" className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          1. Core Personal Civil Documents
        </h2>
        <div className="space-y-3 not-prose">
          {[
            {
              title: "Birth Certificates",
              desc: "Original long-form government birth certificate showing applicant name, date and place of birth, and both parents' full legal names. Hospital certificates are usually insufficient.",
            },
            {
              title: "Passports",
              desc: "Valid unexpired international passport with at least 6 months validity beyond intended date of entry into the United States for each family member.",
            },
            {
              title: "Marriage / Divorce Certificates",
              desc: "Original civil marriage certificate if married. If previously married, certified copies of all termination records (divorce decrees, death certificates, or annulment records).",
            },
            {
              title: "Military Records",
              desc: "If you served in the armed forces of any country, an official certified military record detailing your service and discharge conduct.",
            },
            {
              title: "Court & Prison Records",
              desc: "If convicted of any crime, certified court records showing the charge, disposition, and sentence, even if pardoned or expunged.",
            },
          ].map((doc, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{doc.title}</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-6">
                {doc.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="police-certificates" className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          2. Police Clearance Certificate Rules (9 FAM 502.6)
        </h2>
        <p>
          Every applicant aged <strong>16 years or older</strong> must provide police clearance certificates from:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm">
          <li><strong>Country of Nationality:</strong> If you have resided there for at least 6 months at any time in your life.</li>
          <li><strong>Country of Current Residence:</strong> If you have lived there for 6 months or more.</li>
          <li><strong>Any Other Country:</strong> Where you have lived for <strong>12 months or more</strong> since turning 16.</li>
          <li><strong>Any Location Where Arrested:</strong> Regardless of duration or outcome.</li>
        </ul>
        <p className="text-xs text-slate-500">
          U.S. police certificates are NOT required (FBI checks are executed automatically).
        </p>
      </section>

      <section id="translations" className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          3. Certified English Translation Standards
        </h2>
        <p>
          All civil documents not written in English or the official language of the country where the consular post is located must be accompanied by a certified translation:
        </p>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-mono space-y-2 not-prose">
          <p className="text-slate-700 dark:text-slate-300 font-sans">Required Certification Statement:</p>
          <div className="p-3 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
            &quot;I [Translator Name] certify that I am fluent in English and [Foreign Language], and that this is a true and accurate translation of the attached document to the best of my ability.&quot;
            <br />
            Signature, Date, and Contact Information
          </div>
        </div>
      </section>

      <section id="photos" className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          4. Physical 2x2&quot; Photographs for the Interview
        </h2>
        <p>
          Each applicant must bring <strong>two identical physical 2×2 inch (51×51 mm)</strong> photographic prints to the embassy interview. The photos must have been taken within the last 6 months against a plain white background without eyeglasses.
        </p>
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/30 to-indigo-900/20 border border-blue-500/30 flex items-center justify-between gap-4 not-prose">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Generate Interview 4×6 Print Sheet</h4>
            <p className="text-xs text-slate-500 mt-0.5">Prints 6 exact 2x2&quot; photos on one 300 DPI sheet with cut marks for $0.35 at any photo kiosk.</p>
          </div>
          <Link
            href="/crop"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1.5 flex-shrink-0"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Open Tool</span>
          </Link>
        </div>
      </section>

      <section id="medical" className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          5. Immigrant Medical Examination
        </h2>
        <p>
          Prior to your consular interview, all applicants must undergo an immigrant medical examination conducted by an <strong>embassy-authorized panel physician</strong>. The exam includes:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm">
          <li>Review of medical history, physical examination, and chest X-ray (for tuberculosis).</li>
          <li>Blood tests for communicable diseases.</li>
          <li>Required CDC vaccinations (MMR, Polio, Tetanus, COVID-19, etc.).</li>
        </ul>
        <p className="text-xs text-slate-500">
          The clinic will either provide you a sealed medical envelope (DO NOT OPEN IT) or transmit results directly to the embassy electronically via eMedical.
        </p>
      </section>

    </GuideLayout>
  );
}

