"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ListTodo, 
  CheckCircle2, 
  Circle, 
  Printer, 
  Download, 
  Upload, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw, 
  Calendar, 
  Camera, 
  FileText, 
  ShieldCheck, 
  Award,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChecklistItem {
  id: string;
  phase: 'entry' | 'post_selection';
  category: string;
  title: string;
  description: string;
  tips: string;
  completed: boolean;
}

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  // PHASE 1: OFFICIAL DV ENTRY (October - November)
  {
    id: 'chk-01',
    phase: 'entry',
    category: '1. Identification & Nativity',
    title: 'Verify Country of Chargeability & Passport Details',
    description: 'Confirm your birth country eligibility or establish cross-chargeability through your spouse.',
    tips: 'Passport is no longer strictly required at the initial electronic entry stage, but your legal name spelling and date of birth must match your government birth certificate exactly.',
    completed: false,
  },
  {
    id: 'chk-02',
    phase: 'entry',
    category: '2. Biometric Photos',
    title: 'Capture & Crop Principal Applicant Photo',
    description: 'Ensure 600x600 px square, strictly under 240 KB, 50%-69% head height, plain white background.',
    tips: 'Must have been taken within the last 6 months. Absolutely NO eyeglasses, uniforms, or digitally edited backgrounds.',
    completed: false,
  },
  {
    id: 'chk-03',
    phase: 'entry',
    category: '2. Biometric Photos',
    title: 'Capture & Verify Spouse & Child Photos',
    description: 'Prepare individual compliant 600x600 px photos for each family derivative listed.',
    tips: 'Even infants must have their own individual photo taken against a plain white sheet with eyes open and no parent hands/toys in frame.',
    completed: false,
  },
  {
    id: 'chk-04',
    phase: 'entry',
    category: '3. Form Submission',
    title: 'Submit Electronic Entry on dvprogram.state.gov',
    description: 'Complete Part 1 (Entrant Information) and Part 2 (Derivatives) on the official government website.',
    tips: 'The electronic registration is 100% FREE. Never submit more than once per person per year—duplicate entries result in automatic disqualification of all submissions.',
    completed: false,
  },
  {
    id: 'chk-05',
    phase: 'entry',
    category: '4. Confirmation Archival',
    title: 'Secure Confirmation Number in Encrypted Vault',
    description: 'Save your 16-character confirmation number (e.g. 2027XXXXXXXXXXXX) and export the Backup Card.',
    tips: 'The State Department will NEVER email or mail your selection status. If you lose this number, you cannot check your results in May.',
    completed: false,
  },

  // PHASE 2: POST-SELECTION ROADMAP (May - September)
  {
    id: 'chk-06',
    phase: 'post_selection',
    category: '1. Results & Case Number',
    title: 'Check Entrant Status Check (ESC) in May',
    description: 'Log into dvprogram.state.gov with your confirmation number to view your selection letter.',
    tips: 'If selected, print and save your official Selection Notification Letter containing your Regional Case Number (e.g. 2026AF00012345).',
    completed: false,
  },
  {
    id: 'chk-07',
    phase: 'post_selection',
    category: '2. DS-260 Visa Application',
    title: 'Submit Form DS-260 on CEAC Portal',
    description: 'Complete the online immigrant visa application for yourself and each family member on ceac.state.gov.',
    tips: 'Submit as early as possible. Visas are capped at ~55,000 globally and issued strictly in rank order of Case Numbers.',
    completed: false,
  },
  {
    id: 'chk-08',
    phase: 'post_selection',
    category: '3. Civil Documents Gathering',
    title: 'Collect Certified Civil Records & English Translations',
    description: 'Gather original birth certificates, marriage certificates, police clearances, and education certificates.',
    tips: 'Police certificates are required from every country where you have lived for 6+ months since age 16. Any document not in English must have a certified translation.',
    completed: false,
  },
  {
    id: 'chk-09',
    phase: 'post_selection',
    category: '4. Medical & Interview',
    title: 'Complete Authorized Panel Physician Medical Exam',
    description: 'Schedule a certified immigrant medical examination and vaccination review prior to interview.',
    tips: 'Medical exams must be conducted ONLY by designated embassy panel physicians, not your family doctor.',
    completed: false,
  },
  {
    id: 'chk-10',
    phase: 'post_selection',
    category: '4. Medical & Interview',
    title: 'Attend Consular Interview with $330 Fee & 2x2" Photos',
    description: 'Bring original documents, 2 physical 2x2" passport photos per person (print via our 4x6 sheet), and pay the $330 fee at embassy cashier.',
    tips: 'The $330 DV visa fee is non-refundable and paid ONLY in person at the embassy cashier on interview day.',
    completed: false,
  },
];

const STORAGE_KEY = 'dv_checklist_v1';

export default function ChecklistPage() {
  const [items, setItems] = useState<ChecklistItem[]>(DEFAULT_CHECKLIST);
  const [activePhase, setActivePhase] = useState<'entry' | 'post_selection'>('entry');
  const [expandedTipId, setExpandedTipId] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setItems(JSON.parse(stored));
        } catch {
          // Fallback to default
        }
      }
    }
  }, []);

  // Save to localStorage on change
  const saveItems = (updated: ChecklistItem[]) => {
    setItems(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const toggleItem = (id: string) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    saveItems(updated);
  };

  const resetChecklist = () => {
    if (confirm("Reset all checklist progress back to default?")) {
      saveItems(DEFAULT_CHECKLIST);
    }
  };

  // Export JSON Backup
  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DV_Checklist_Progress_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON Backup
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          saveItems(parsed);
          alert("Checklist successfully imported!");
        }
      } catch {
        alert("Invalid checklist file format");
      }
    };
    reader.readAsText(file);
  };

  // Print Checklist
  const handlePrint = () => {
    window.print();
  };

  // Compute Progress Statistics
  const phaseItems = items.filter((item) => item.phase === activePhase);
  const completedCount = phaseItems.filter((item) => item.completed).length;
  const progressPct = Math.round((completedCount / (phaseItems.length || 1)) * 100);

  // Group items by category
  const categories = Array.from(new Set(phaseItems.map((item) => item.category)));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              Module D • Preparation Tracker
            </span>
            <span className="text-xs text-slate-500 font-mono">Auto-saved to device</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Interactive DV Lottery Checklist
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Track your progress through registration, official submission, and post-selection consular processing.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="p-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
            title="Print checklist"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleExportJSON}
            className="p-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
            title="Export JSON backup"
          >
            <Download className="w-4 h-4" />
          </button>

          <label className="p-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors cursor-pointer" title="Import JSON">
            <Upload className="w-4 h-4" />
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>

          <button
            type="button"
            onClick={resetChecklist}
            className="p-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
            title="Reset progress"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Switchable Phase Tabs */}
      <div className="mt-8 grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setActivePhase('entry')}
          className={cn(
            "py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2",
            activePhase === 'entry'
              ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
          )}
        >
          <Calendar className="w-4 h-4" />
          <span>Phase 1: Entry Preparation (Oct – Nov)</span>
        </button>

        <button
          type="button"
          onClick={() => setActivePhase('post_selection')}
          className={cn(
            "py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2",
            activePhase === 'post_selection'
              ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
          )}
        >
          <Award className="w-4 h-4 text-emerald-500" />
          <span>Phase 2: Selectee Roadmap (May – Sep)</span>
        </button>
      </div>

      {/* Progress Bar Header Card */}
      <div className="mt-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
          <span className="text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Overall Readiness Progress</span>
          </span>
          <span className="font-mono text-blue-600 dark:text-blue-400 text-base">
            {completedCount} / {phaseItems.length} ({progressPct}%)
          </span>
        </div>

        <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Category Accordion Groups */}
      <div className="mt-8 space-y-6">
        {categories.map((cat) => {
          const catItems = phaseItems.filter((i) => i.category === cat);
          return (
            <div key={cat} className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                {cat}
              </h3>

              <div className="space-y-3">
                {catItems.map((item) => {
                  const isExpanded = expandedTipId === item.id;
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "p-4 sm:p-5 rounded-2xl border transition-all duration-150",
                        item.completed
                          ? "bg-emerald-50/20 dark:bg-emerald-950/20 border-emerald-500/30"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div
                          onClick={() => toggleItem(item.id)}
                          className="flex items-start gap-3.5 cursor-pointer select-none flex-1"
                        >
                          <div className="mt-0.5 flex-shrink-0">
                            {item.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                            )}
                          </div>
                          <div>
                            <h4
                              className={cn(
                                "text-sm sm:text-base font-bold",
                                item.completed
                                  ? "line-through text-slate-400 dark:text-slate-500"
                                  : "text-slate-900 dark:text-white"
                              )}
                            >
                              {item.title}
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        {/* Tips Toggle */}
                        <button
                          type="button"
                          onClick={() => setExpandedTipId(isExpanded ? null : item.id)}
                          className="p-1 rounded text-slate-400 hover:text-slate-600 flex-shrink-0"
                          aria-label="Toggle official instructions"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Expandable Pro-Tip */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl animate-in fade-in duration-150">
                          <span className="font-bold text-blue-600 dark:text-blue-400 block mb-1">
                            Official Regulatory Tip:
                          </span>
                          {item.tips}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Helpful Links Box */}
      <div className="mt-12 p-6 rounded-3xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white">
            Need compliant photos for Step 2?
          </h4>
          <p className="text-slate-500 mt-0.5">
            Crop your photo to exact 600x600 px dimensions with 1-click AI biometric alignment.
          </p>
        </div>
        <Link
          href="/crop"
          className="px-5 py-2.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors flex-shrink-0"
        >
          Open AI Photo Cropper →
        </Link>
      </div>

    </div>
  );
}
