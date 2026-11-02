import React from "react";
import Link from "next/link";
import { 
  Camera, 
  CheckCircle2, 
  Calculator, 
  ListTodo, 
  KeyRound, 
  BookOpen, 
  FileText, 
  ShieldAlert, 
  ArrowUpRight 
} from "lucide-react";

interface UtilityEntry {
  index: string;
  title: string;
  category: string;
  description: string;
  href: string;
  specs: string;
}

const UTILITIES: UtilityEntry[] = [
  {
    index: "01",
    title: "AI Auto-Crop Studio",
    category: "BIOMETRIC ENGINE",
    description: "Evaluates 478-point facial mesh in WASM, levels roll angle to 0.0°, and positions eye-line at 62.5% from bottom edge.",
    href: "/crop",
    specs: "600×600 px • <240 KB JPEG",
  },
  {
    index: "02",
    title: "12-Point Compliance Audit",
    category: "VERIFICATION MATRIX",
    description: "Evaluates JPEG magic bytes (FF D8 FF), 24-bit sRGB channel variance, background luminance ≥ 240, and EXIF recency.",
    href: "/checker",
    specs: "Full DoS 12-Check Rule Matrix",
  },
  {
    index: "03",
    title: "Nativity & Eligibility Wizard",
    category: "REGULATORY LOGIC",
    description: "Evaluates native country chargeability, cross-chargeability through spouse/parents, and O*NET Job Zone SVP ≥ 7.0 criteria.",
    href: "/eligibility",
    specs: "INA § 203(c) Classification",
  },
  {
    index: "04",
    title: "Entry & DS-260 Checklist",
    category: "APPLICANT WORKFLOW",
    description: "Persistent multi-stage preparation and post-selection tracker with printable export and LocalStorage encryption.",
    href: "/checklist",
    specs: "LocalStorage • Zero Telemetry",
  },
  {
    index: "05",
    title: "Encrypted Confirmation Vault",
    category: "WEB CRYPTO AES-GCM",
    description: "Store your 2027 confirmation number with PBKDF2 salt derivation, AES-GCM 256-bit encryption, and PNG backup card generation.",
    href: "/vault",
    specs: "PBKDF2 • AES-GCM 256-Bit",
  },
  {
    index: "06",
    title: "DoD & State Photo Specs",
    category: "REGULATORY CODEX",
    description: "Illustrated guide on acceptable head tilt tolerances, lighting ratios, plain off-white thresholds, and strict eyeglass bans.",
    href: "/guides/photo-requirements",
    specs: "Visual Specimen Archive",
  },
  {
    index: "07",
    title: "DS-260 Immigrant Visa Guide",
    category: "SELECTEE ROADMAP",
    description: "Detailed roadmap for lottery winners: CEAC portal login, Case Number sequencing, civil documents, and 2NL consular scheduling.",
    href: "/guides/ds-260",
    specs: "Post-Selection Procedure",
  },
  {
    index: "08",
    title: "Anti-Fraud & Scam Defense",
    category: "SECURITY DIRECTIVE",
    description: "Authoritative warnings against fraudulent third-party payment demands, phishing emails, and predatory lottery visa brokers.",
    href: "/guides/scam-warning",
    specs: "Consular Advisory Bulletin",
  },
];

export function UtilityGrid() {
  return (
    <section className="py-20 border-t border-neutral-200 dark:border-neutral-800 bg-[#fcfbf9] dark:bg-[#08090b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <div className="font-mono text-[11px] tracking-widest uppercase text-neutral-500 dark:text-neutral-400 mb-2">
              System Capabilities & Directory
            </div>
            <h2 className="font-editorial italic text-3xl sm:text-4xl text-neutral-900 dark:text-neutral-100 font-normal">
              Suite Modules <span className="font-sans font-bold not-italic">& Specifications</span>
            </h2>
          </div>
          <p className="mt-3 md:mt-0 font-mono text-xs text-neutral-500 dark:text-neutral-400 max-w-sm">
            [ 8 INTEGRATED TOOLS • 100% CLIENT EXECUTABLE • ZERO CLOUD PIPELINE ]
          </p>
        </div>

        {/* Brutalist Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-neutral-200 dark:border-neutral-800">
          {UTILITIES.map((item) => (
            <Link
              key={item.index}
              href={item.href}
              className="group relative p-6 border-r border-b border-neutral-200 dark:border-neutral-800 bg-white/40 dark:bg-obsidian-950/40 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between font-mono text-[11px] text-neutral-400 dark:text-neutral-500 mb-4 pb-2 border-b border-neutral-100 dark:border-neutral-900">
                  <span className="font-bold text-neutral-900 dark:text-neutral-200">{item.index}</span>
                  <span className="text-[10px] tracking-wider uppercase">{item.category}</span>
                </div>

                <h3 className="font-sans font-bold text-base text-neutral-900 dark:text-white group-hover:text-cobalt-600 dark:group-hover:text-cobalt-400 transition-colors mb-2">
                  {item.title}
                </h3>

                <p className="font-sans text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-900 flex items-center justify-between font-mono text-[10px]">
                <span className="text-neutral-500 dark:text-neutral-400">{item.specs}</span>
                <span className="flex items-center gap-0.5 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                  OPEN <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
