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
              dvphotocheck<span className="text-blue-600">.tech</span>
            </Link>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              A 100% private, client-side photo tool for U.S. Diversity Visa applicants. Crop, validate, and prepare your photo with zero server uploads.
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

        {/* Bottom Disclaimer */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} dvphotocheck.tech. All processing done client-side.
          </div>
          <div>
            <a
              href="https://dvprogram.state.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-700 transition-colors inline-flex items-center gap-1"
            >
              <span>Official U.S. State Department Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
