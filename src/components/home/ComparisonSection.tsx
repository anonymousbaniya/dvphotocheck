import React from "react";
import { Check, X, ShieldAlert, ShieldCheck } from "lucide-react";

export function ComparisonSection() {
  const auditPoints = [
    {
      spec: "Server-Side Image Ingestion",
      dvTech: "0 Bytes (Processed exclusively in browser RAM via WASM)",
      others: "Photos uploaded to unvetted remote servers/databases",
      dvPassed: true,
    },
    {
      spec: "Biometric Facial Recognition Privacy",
      dvTech: "478-point facial mesh evaluated locally; discarded on tab close",
      others: "Facial landmarks retained for model training or ad tracking",
      dvPassed: true,
    },
    {
      spec: "File Size Compliance Enforcement",
      dvTech: "Guaranteed binary search compression strictly < 240 KB",
      others: "Arbitrary quality slider risking automatic disqualification",
      dvPassed: true,
    },
    {
      spec: "Biometric Ratio Precision",
      dvTech: "Mathematical solver targeting exact 59.5% head & 62.5% eye axis",
      others: "Manual inaccurate dragging or rough visual guess",
      dvPassed: true,
    },
    {
      spec: "Pricing & Paywalls",
      dvTech: "100% Free, Open Architecture, Zero Paywalls",
      others: "Charges $7–$15 per download or requires email capture",
      dvPassed: true,
    },
    {
      spec: "Confirmation Number Storage",
      dvTech: "Optional Web Crypto AES-GCM 256-bit client-side encryption",
      others: "Unencrypted plain text or stored in third-party databases",
      dvPassed: true,
    },
  ];

  return (
    <section className="py-20 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-100/40 dark:bg-obsidian-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="font-mono text-[11px] tracking-widest uppercase text-neutral-500 dark:text-neutral-400 mb-2">
            Audit Ledger • 22 CFR § 42.33
          </div>
          <h2 className="font-editorial italic text-3xl sm:text-4xl text-neutral-900 dark:text-neutral-100 font-normal">
            Bespoke In-Browser Architecture <span className="font-sans font-bold not-italic">vs. Cloud Converters</span>
          </h2>
          <p className="mt-3 font-sans text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Most commercial photo services quietly ingest your biometric portrait into cloud databases. dvphotocheck.tech is built on an immutable client-side sandbox.
          </p>
        </div>

        {/* Brutalist Audit Table */}
        <div className="overflow-x-auto border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-obsidian-950">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/80 font-mono text-[10px] tracking-wider text-neutral-500 uppercase">
                <th className="py-3.5 px-4 w-1/3">Security & Compliance Metric</th>
                <th className="py-3.5 px-4 w-1/3 text-cobalt-600 dark:text-cobalt-400 font-bold border-l border-neutral-200 dark:border-neutral-800">
                  dvphotocheck.tech (Local WASM)
                </th>
                <th className="py-3.5 px-4 w-1/3 text-neutral-400 border-l border-neutral-200 dark:border-neutral-800">
                  Generic Commercial Tools
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {auditPoints.map((point, idx) => (
                <tr key={idx} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 transition-colors">
                  <td className="py-4 px-4 font-medium text-neutral-900 dark:text-neutral-200 flex items-start gap-2">
                    <span className="font-mono text-[10px] text-neutral-400 mt-0.5">0{idx + 1}.</span>
                    <span>{point.spec}</span>
                  </td>
                  <td className="py-4 px-4 text-neutral-800 dark:text-neutral-300 border-l border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{point.dvTech}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-neutral-500 dark:text-neutral-400 border-l border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-start gap-2">
                      <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{point.others}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
}
