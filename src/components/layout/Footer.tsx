import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-500 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <Link href="/" className="font-bold text-sm text-slate-900">
              DVPhotoCheck <span className="text-blue-600 font-semibold">(dvphotocheck.tech)</span>
            </Link>
            <p className="text-xs text-slate-500 max-w-md leading-relaxed">
              DVPhotoCheck is a free, 100% client-side DV Lottery photo checker and 600×600 biometric cropper for U.S. Diversity Visa applicants. Validate head size, eye level, and background uniformity with zero server uploads.
            </p>
            <p className="text-[11px] text-slate-400 max-w-md leading-relaxed">
              Independent utility — not affiliated with or endorsed by the U.S. Department of State or U.S. Government.
            </p>
          </div>

          {/* Tools */}
          <div className="space-y-2.5">
            <h3 className="font-semibold text-slate-900">
              Tools
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/crop" className="hover:text-blue-600 transition-colors">
                  Photo Cropper
                </Link>
              </li>
              <li>
                <Link href="/checker" className="hover:text-blue-600 transition-colors">
                  Compliance Checker
                </Link>
              </li>
              <li>
                <Link href="/eligibility" className="hover:text-blue-600 transition-colors">
                  Eligibility Wizard
                </Link>
              </li>
              <li>
                <Link href="/checklist" className="hover:text-blue-600 transition-colors">
                  Application Checklist
                </Link>
              </li>
              <li>
                <Link href="/vault" className="hover:text-blue-600 transition-colors">
                  Confirmation Vault
                </Link>
              </li>
            </ul>
          </div>

          {/* Guides */}
          <div className="space-y-2.5">
            <h3 className="font-semibold text-slate-900">
              Guides
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/guides/photo-requirements" className="hover:text-blue-600 transition-colors">
                  Photo Specifications
                </Link>
              </li>
              <li>
                <Link href="/guides/how-to-apply" className="hover:text-blue-600 transition-colors">
                  How to Apply
                </Link>
              </li>
              <li>
                <Link href="/guides/check-results" className="hover:text-blue-600 transition-colors">
                  Checking Results
                </Link>
              </li>
              <li>
                <Link href="/guides/ds-260" className="hover:text-blue-600 transition-colors">
                  DS-260 Visa Guide
                </Link>
              </li>
              <li>
                <Link href="/guides/scam-warning" className="hover:text-blue-600 transition-colors">
                  Scam Warnings
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Disclaimer & Official References */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} DVPhotoCheck (dvphotocheck.tech). All processing done client-side.
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/photos.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors inline-flex items-center gap-1"
            >
              <span>State Dept. Photo Rules</span>
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
            <a
              href="https://tsg.phototool.state.gov/photo"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors inline-flex items-center gap-1"
            >
              <span>Official Photo Tool</span>
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
            <a
              href="https://dvprogram.state.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors inline-flex items-center gap-1"
            >
              <span>DV Program Portal</span>
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
