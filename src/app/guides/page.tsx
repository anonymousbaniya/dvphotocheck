import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { 
  BookOpen, 
  ArrowRight, 
  Camera, 
  CheckCircle2, 
  FileText, 
  HelpCircle, 
  ShieldAlert, 
  Calendar, 
  TrendingUp, 
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { ALL_GUIDES } from "@/components/guides/GuideLayout";

export const metadata: Metadata = {
  title: "Official Diversity Visa Knowledge & Guides Hub — dvphotocheck.tech",
  description: "Comprehensive guides for U.S. Green Card Lottery applicants: photo specifications, how to apply, checking results, DS-260 guide, document checklist, consular interview, and scam warning.",
  alternates: {
    canonical: "https://dvphotocheck.tech/guides",
  },
};

export default function GuidesHubIndexPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "U.S. Diversity Visa Comprehensive Guides Hub",
    description: "Official guides and technical specifications for DV Lottery applicants and selectees.",
    url: "https://dvphotocheck.tech/guides",
    hasPart: ALL_GUIDES.map((g) => ({
      "@type": "WebPage",
      name: g.title,
      description: g.desc,
      url: `https://dvphotocheck.tech/guides/${g.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 mb-3 border border-blue-200 dark:border-blue-800">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Complete Legal &amp; Procedural Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Diversity Visa Guides Hub
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Everything you need to know about the U.S. Green Card Lottery—from taking a 100% compliant photo to filing Form DS-260 and passing the consular interview.
          </p>
        </div>

        {/* 8-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ALL_GUIDES.map((guide, idx) => {
            const Icon = guide.icon;
            return (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group relative flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-200"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className="text-[10px] font-mono text-slate-400 block mb-1">
                    GUIDE 0{idx + 1}
                  </span>

                  <h2 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                    {guide.title}
                  </h2>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {guide.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <span>Read Guide</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-800/40 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg font-bold">Ready to Prepare Your Biometric Photo?</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Run your photo through our client-side AI auto-align and 12-point validator before you submit on dvprogram.state.gov.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="/crop"
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md"
            >
              Open AI Cropper
            </Link>
            <Link
              href="/checker"
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors border border-slate-700"
            >
              Check Existing Photo
            </Link>
          </div>
        </div>

      </div>
    </>
  );
}
