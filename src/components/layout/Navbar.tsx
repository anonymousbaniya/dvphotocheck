"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShieldCheck, 
  HelpCircle, 
  UserSquare2,
  FileText,
  Calculator,
  ListTodo,
  KeyRound,
  Crop,
  CheckCircle2,
  Camera,
  Menu,
  X,
  ChevronDown
} from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Photo Tool", icon: Camera },
  { href: "/crop", label: "Crop Studio", icon: Crop },
  { href: "/checker", label: "12-Point Checker", icon: CheckCircle2 },
  { href: "/eligibility", label: "Eligibility", icon: Calculator },
  { href: "/checklist", label: "Checklist", icon: ListTodo },
  { href: "/vault", label: "Vault", icon: KeyRound },
  { href: "/guides/photo-requirements", label: "Guide", icon: HelpCircle },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3.5 gap-4">
          
          {/* Left: Brand Logo & Title */}
          <Link href="/" className="flex items-center gap-3.5 shrink-0 group focus:outline-none">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs group-hover:bg-blue-700 transition-colors">
              <UserSquare2 className="w-5 h-5" />
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-sans font-bold text-base sm:text-lg tracking-tight text-slate-900 leading-none">
                  DV Photo Checker
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300">
                  2026 READY
                </span>
              </div>
              <span className="text-xs text-slate-500 font-normal mt-1 hidden sm:inline">
                US Diversity Immigrant Visa Photo Verification Tool
              </span>
            </div>
          </Link>

          {/* Center: Spacious Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
            {NAV_LINKS.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    active
                      ? "bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs"
                      : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-blue-600" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right: Privacy Pill Badge & Mobile Menu Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            {/* 100% Client-Side Privacy Badge */}
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>100% Client-Side:</strong> No uploads</span>
            </div>

            {/* Mobile / Tablet Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
              aria-label="Toggle navigation"
            >
              <Menu className="w-4 h-4 text-slate-500" />
              <span>Tools</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${mobileMenuOpen ? "rotate-180" : ""}`} />
            </button>
          </div>

        </div>
      </div>

      {/* Mobile / Tablet Dropdown Menu (Only shown when toggled, never squishing page content) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {NAV_LINKS.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-blue-600"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-blue-600" : "text-slate-500"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
