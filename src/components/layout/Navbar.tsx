"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  ShieldCheck, 
  HelpCircle, 
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
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 py-2 sm:py-3.5 gap-2 sm:gap-4">
          
          {/* Left: Brand Logo & Title */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3.5 shrink-0 group focus:outline-none min-w-0">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-xs ring-1 ring-slate-900/10 transition-transform group-hover:scale-105 bg-[#0b1329] flex items-center justify-center shrink-0">
              <Image
                src="/icon-192.png"
                alt="DVPhotoCheck Logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-sans font-bold text-sm sm:text-base lg:text-lg tracking-tight text-slate-900 leading-none truncate">
                  DVPhotoCheck
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 shrink-0">
                  2026
                </span>
              </div>
              <span className="text-xs text-slate-500 font-normal mt-1 hidden sm:inline">
                DV Photo Check • U.S. Diversity Visa Photo Tool
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
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* 100% Client-Side Privacy Badge */}
            <div className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>100% Client-Side:</strong> No uploads</span>
            </div>

            {/* Mobile / Tablet Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
              aria-label="Toggle navigation"
            >
              <Menu className="w-4 h-4 text-slate-500" />
              <span className="hidden xs:inline sm:inline">Tools</span>
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
