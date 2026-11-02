import React from "react";
import Link from "next/link";
import { 
  BookOpen, 
  Camera, 
  CheckCircle2, 
  KeyRound, 
  FileText, 
  HelpCircle, 
  ShieldAlert, 
  Calendar, 
  TrendingUp, 
  ExternalLink, 
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from "lucide-react";

export interface TocItem {
  id: string;
  title: string;
}

export const ALL_GUIDES = [
  { slug: "photo-requirements", title: "Photo Specifications", icon: Camera, desc: "600x600 px, 50-69% head height, no glasses" },
  { slug: "how-to-apply", title: "How to Apply for DV Lottery", icon: BookOpen, desc: "Step-by-step entry guide & fee rules" },
  { slug: "check-results", title: "Checking Your DV Results", icon: Calendar, desc: "Using Entrant Status Check in May" },
  { slug: "ds-260", title: "DS-260 Immigrant Visa Guide", icon: FileText, desc: "Complete DS-260 filing walkthrough" },
  { slug: "documents", title: "Civil Documents Checklist", icon: CheckCircle2, desc: "Police certificates, translations & records" },
  { slug: "interview", title: "Consular Interview Prep", icon: HelpCircle, desc: "Officer questions & 2NL appointment" },
  { slug: "visa-bulletin", title: "Visa Bulletin & Case Numbers", icon: TrendingUp, desc: "Regional cutoffs: AF, AS, EU, SA" },
  { slug: "scam-warning", title: "Scam Shield & Fraud Defense", icon: ShieldAlert, desc: "Recognizing fake winner emails & phishing" },
];

interface GuideLayoutProps {
  currentSlug: string;
  title: string;
  subtitle: string;
  category: string;
  lastUpdated?: string;
  toc: TocItem[];
  children: React.ReactNode;
}

export function GuideLayout({
  currentSlug,
  title,
  subtitle,
  category,
  lastUpdated = "2026/2027 Program Cycle",
  toc,
  children,
}: GuideLayoutProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 font-medium">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/guides" className="hover:text-blue-600 transition-colors">Guides Hub</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800 dark:text-slate-200 truncate">{title}</span>
      </nav>

      {/* Main Grid: Content + Sticky Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Main Article Content (Cols 1-8) */}
        <article className="lg:col-span-8 space-y-8">
          
          {/* Header */}
          <div className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {category}
              </span>
              <span className="text-xs text-slate-400 font-mono">Updated: {lastUpdated}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {title}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Body */}
          <div className="space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
            {children}
          </div>

          {/* Article Footer & Official Resources */}
          <div className="pt-8 mt-12 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
              <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Regulatory Notice &amp; Official Links</span>
              </p>
              <p>
                This guide is prepared based on Title 22 of the Code of Federal Regulations (22 C.F.R. § 42.33) and Foreign Affairs Manual (9 FAM 502.6). Always verify instructions on the official U.S. Department of State portal:{" "}
                <a href="https://dvprogram.state.gov" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline font-semibold inline-flex items-center gap-0.5">
                  dvprogram.state.gov <ExternalLink className="w-2.5 h-2.5" />
                </a>.
              </p>
            </div>
          </div>
        </article>

        {/* Sticky Sidebar (Cols 9-12) */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          
          {/* 1. Table of Contents */}
          {toc.length > 0 && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                On This Page
              </h3>
              <ul className="space-y-2 text-xs">
                {toc.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors block py-0.5"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 2. Contextual Tool CTAs */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-900/30 to-indigo-900/20 border border-blue-500/30 space-y-3 shadow-md">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
              <Camera className="w-4 h-4" />
              <span>Interactive Utilities</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Prepare Your Photo in 15 Seconds
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Use our client-side AI tool to crop and align your photo to exact 600x600 px Department of State specifications.
            </p>
            <div className="space-y-2 pt-1">
              <Link
                href="/crop"
                className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Open AI Photo Cropper</span>
              </Link>
              <Link
                href="/checker"
                className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>12-Point Photo Validator</span>
              </Link>
              <Link
                href="/vault"
                className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <KeyRound className="w-3.5 h-3.5 text-cyan-500" />
                <span>Encrypted Confirmation Vault</span>
              </Link>
            </div>
          </div>

          {/* 3. All Guides Index List */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              All 8 Applicant Guides
            </h3>
            <div className="space-y-1.5">
              {ALL_GUIDES.map((g) => {
                const isCurrent = g.slug === currentSlug;
                const Icon = g.icon;
                return (
                  <Link
                    key={g.slug}
                    href={`/guides/${g.slug}`}
                    className={`flex items-center gap-2.5 p-2 rounded-xl text-xs font-medium transition-all ${
                      isCurrent
                        ? "bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{g.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>

        </aside>

      </div>
    </div>
  );
}

