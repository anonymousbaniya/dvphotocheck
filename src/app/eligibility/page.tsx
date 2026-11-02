"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Calculator, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft, 
  Search, 
  Globe2, 
  Briefcase, 
  GraduationCap, 
  Users, 
  Camera, 
  HelpCircle,
  FileCheck,
  Sparkles,
  Info
} from "lucide-react";
import { 
  COUNTRIES, 
  INELIGIBLE_COUNTRIES, 
  SAMPLE_ONET_OCCUPATIONS, 
  type CountryInfo, 
  type ONetOccupation 
} from "@/lib/constants/countries";
import { cn } from "@/lib/utils";

export default function EligibilityCalculatorPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Nativity & Chargeability State
  const [selectedCountryName, setSelectedCountryName] = useState('Nepal');
  const [countrySearch, setCountrySearch] = useState('');
  
  // Cross-Chargeability State
  const [isCrossChargeable, setIsCrossChargeable] = useState(false);
  const [spouseCountryName, setSpouseCountryName] = useState('');
  const [parentBornCountryName, setParentBornCountryName] = useState('');

  // Step 2: Education vs Work Experience State
  const [qualificationType, setQualificationType] = useState<'education' | 'work'>('education');
  const [hasHighSchoolDiploma, setHasHighSchoolDiploma] = useState<boolean | null>(true);
  const [hasGEDOnly, setHasGEDOnly] = useState(false);
  
  // Work Experience selection
  const [selectedJob, setSelectedJob] = useState<ONetOccupation>(SAMPLE_ONET_OCCUPATIONS[0]);
  const [hasTwoYearsExperience, setHasTwoYearsExperience] = useState(true);

  // Step 3: Family Derivatives State
  const [maritalStatus, setMaritalStatus] = useState<'single' | 'married_foreign' | 'married_us' | 'divorced'>('single');
  const [childCount, setChildCount] = useState<number>(0);

  // Resolve Primary Country
  const primaryCountry = useMemo(() => {
    return COUNTRIES.find((c) => c.name.toLowerCase() === selectedCountryName.toLowerCase()) || COUNTRIES[0];
  }, [selectedCountryName]);

  // Resolve Spouse Country for Cross-Chargeability
  const spouseCountry = useMemo(() => {
    if (!spouseCountryName) return null;
    return COUNTRIES.find((c) => c.name.toLowerCase() === spouseCountryName.toLowerCase());
  }, [spouseCountryName]);

  // Determine Step 1 Eligibility
  const isDirectlyEligible = primaryCountry.isEligible;
  const isSpouseEligible = spouseCountry?.isEligible || false;
  const isChargeabilityPassed = isDirectlyEligible || (isCrossChargeable && isSpouseEligible);

  // Determine Step 2 Eligibility
  const isEducationQualified = qualificationType === 'education' && hasHighSchoolDiploma && !hasGEDOnly;
  const isWorkQualified = qualificationType === 'work' && selectedJob.qualifies && hasTwoYearsExperience;
  const isEducationWorkPassed = isEducationQualified || isWorkQualified;

  // Total Photos Needed
  const totalPhotosNeeded = 1 + (maritalStatus === 'married_foreign' ? 1 : 0) + childCount;

  // Filter countries for dropdown search
  const filteredCountries = useMemo(() => {
    if (!countrySearch) return COUNTRIES;
    return COUNTRIES.filter((c) => c.name.toLowerCase().includes(countrySearch.toLowerCase()));
  }, [countrySearch]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 mb-3">
          <Calculator className="w-3.5 h-3.5" />
          <span>Official 22 C.F.R. § 42.33 Eligibility Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Diversity Visa Eligibility Calculator
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-xl mx-auto">
          Verify if you qualify for the DV Lottery based on country nativity, education/work experience, and family derivative rules.
        </p>
      </div>

      {/* 3-Step Wizard Navigation Indicator */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8">
        {[
          { step: 1, label: '1. Country & Nativity', icon: Globe2 },
          { step: 2, label: '2. Education / O*NET', icon: GraduationCap },
          { step: 3, label: '3. Family & Photos', icon: Users },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = currentStep === item.step;
          const isCompleted = currentStep > item.step;

          return (
            <button
              key={item.step}
              type="button"
              onClick={() => setCurrentStep(item.step as 1 | 2 | 3)}
              className={cn(
                "p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5",
                isActive
                  ? "bg-purple-50 dark:bg-purple-950/50 border-purple-500 text-purple-900 dark:text-purple-200 shadow-sm"
                  : isCompleted
                  ? "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800/60 text-slate-400"
              )}
            >
              <div
                className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0",
                  isActive
                    ? "bg-purple-600 text-white"
                    : isCompleted
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                )}
              >
                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : item.step}
              </div>
              <span className="text-xs sm:text-sm font-bold truncate hidden sm:inline">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* STEP 1: Country of Chargeability & Cross-Chargeability */}
      {currentStep === 1 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 animate-in fade-in duration-200">
          
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-purple-600" />
              <span>Step 1: What is your country of birth?</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              In U.S. immigration law, eligibility is determined by your <strong>country of birth (nativity)</strong>, NOT your citizenship, current passport, or country of residence.
            </p>
          </div>

          {/* Searchable Country Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Select Your Birth Country:
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search country..."
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <select
              size={5}
              value={selectedCountryName}
              onChange={(e) => setSelectedCountryName(e.target.value)}
              className="w-full mt-1 p-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
            >
              {filteredCountries.map((c) => (
                <option key={c.code} value={c.name} className="p-1.5 rounded">
                  {c.name} {c.isEligible ? '— (Eligible)' : '— (INELIGIBLE)'}
                </option>
              ))}
            </select>
          </div>

          {/* Eligibility Banner for Selected Country */}
          {isDirectlyEligible ? (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold">
                  {primaryCountry.name} is ELIGIBLE for the DV Lottery!
                </p>
                <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5">
                  Region: {primaryCountry.region}. You qualify under the native country chargeability rule.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-300 dark:border-red-800 text-red-900 dark:text-red-200 space-y-3">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold">
                    {primaryCountry.name} is NOT directly eligible for the DV Program.
                  </p>
                  <p className="text-xs text-red-800 dark:text-red-300 mt-0.5">
                    More than 50,000 immigrants from {primaryCountry.name} moved to the U.S. in the past five years. However, you may still qualify through <strong>Cross-Chargeability</strong>!
                  </p>
                </div>
              </div>

              {/* Cross-Chargeability Analyzer Activation */}
              <div className="mt-4 pt-4 border-t border-red-200 dark:border-red-800/60 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Cross-Chargeability Analyzer (INA § 202(b))
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isCrossChargeable}
                      onChange={(e) => setIsCrossChargeable(e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">
                      My spouse was born in an eligible country (Claiming Spouse Chargeability)
                    </span>
                  </label>

                  {isCrossChargeable && (
                    <div className="pl-6 pt-2 space-y-2">
                      <p className="text-[11px] text-slate-500">Select spouse&apos;s country of birth:</p>
                      <select
                        value={spouseCountryName}
                        onChange={(e) => setSpouseCountryName(e.target.value)}
                        className="w-full p-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      >
                        <option value="">-- Choose Spouse Birth Country --</option>
                        {COUNTRIES.filter((c) => c.isEligible).map((c) => (
                          <option key={c.code} value={c.name}>
                            {c.name} ({c.region})
                          </option>
                        ))}
                      </select>

                      {spouseCountry?.isEligible && (
                        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span>
                            <strong>Qualified!</strong> You can enter by claiming cross-chargeability through your spouse ({spouseCountry.name}), provided both of you are issued visas and enter the U.S. together.
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Next Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-purple-600 hover:bg-purple-700 text-white transition-colors flex items-center gap-2 shadow-md shadow-purple-500/20"
            >
              <span>Continue to Education &amp; Work Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* STEP 2: Education vs Work O*NET Evaluator */}
      {currentStep === 2 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 animate-in fade-in duration-200">
          
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-purple-600" />
              <span>Step 2: Education or Qualifying Work Experience</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              You must meet <strong>EITHER</strong> the Education requirement <strong>OR</strong> the Work Experience requirement.
            </p>
          </div>

          {/* Toggle between Education and Work Path */}
          <div className="grid grid-cols-2 gap-3 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setQualificationType('education')}
              className={cn(
                "py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2",
                qualificationType === 'education'
                  ? "bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              )}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Path A: High School Education</span>
            </button>

            <button
              type="button"
              onClick={() => setQualificationType('work')}
              className={cn(
                "py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2",
                qualificationType === 'work'
                  ? "bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              )}
            >
              <Briefcase className="w-4 h-4" />
              <span>Path B: O*NET Work Experience</span>
            </button>
          </div>

          {/* PATH A: EDUCATION */}
          {qualificationType === 'education' && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                High School Education Criteria
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Requires successful completion of a formal 12-year course of elementary and secondary education comparable to a U.S. high school diploma.
              </p>

              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-800 dark:text-slate-200 font-medium">
                  <input
                    type="checkbox"
                    checked={hasHighSchoolDiploma === true}
                    onChange={(e) => setHasHighSchoolDiploma(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <span>I have completed a formal 12-year high school curriculum or higher university degree.</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-800 dark:text-slate-200 font-medium">
                  <input
                    type="checkbox"
                    checked={hasGEDOnly}
                    onChange={(e) => setHasGEDOnly(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <span>My only certificate is a GED, equivalency certificate, or adult correspondence course.</span>
                </label>
              </div>

              {hasGEDOnly && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs">
                  <strong>Warning: </strong> Per U.S. Department of State regulations, high school equivalency certificates (such as the GED) or correspondence degrees are <strong>NOT</strong> accepted for DV qualification. You must qualify via Work Experience.
                </div>
              )}
            </div>
          )}

          {/* PATH B: O*NET WORK EXPERIENCE */}
          {qualificationType === 'work' && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    U.S. Department of Labor O*NET Criteria
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Must have 2 years of experience within the past 5 years in an occupation in <strong>Job Zone 4 or 5</strong> with Specific Vocational Preparation (SVP) <strong>&ge; 7.0</strong>.
                  </p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold flex-shrink-0">
                  onetonline.org
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Select an Occupation to Check O*NET Job Zone &amp; SVP:
                </label>
                <select
                  value={selectedJob.code}
                  onChange={(e) => {
                    const found = SAMPLE_ONET_OCCUPATIONS.find((o) => o.code === e.target.value);
                    if (found) setSelectedJob(found);
                  }}
                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  {SAMPLE_ONET_OCCUPATIONS.map((job) => (
                    <option key={job.code} value={job.code}>
                      {job.title} — Job Zone {job.jobZone} (SVP {job.svp}) {job.qualifies ? '✓ QUALIFIES' : '✗ DOES NOT QUALIFY'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3.5 rounded-xl border flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-slate-400 text-[10px] block">O*NET RATING:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Zone {selectedJob.jobZone} • SVP {selectedJob.svp}
                  </span>
                </div>
                <div>
                  <span
                    className={cn(
                      "text-[10px] font-black px-2.5 py-1 rounded-full uppercase",
                      selectedJob.qualifies
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                    )}
                  >
                    {selectedJob.qualifies ? 'Qualifying Occupation' : 'Non-Qualifying Role'}
                  </span>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-800 dark:text-slate-200 font-medium pt-1">
                <input
                  type="checkbox"
                  checked={hasTwoYearsExperience}
                  onChange={(e) => setHasTwoYearsExperience(e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <span>I have at least 2 full years of experience in this role within the last 5 years.</span>
              </label>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-purple-600 hover:bg-purple-700 text-white transition-colors flex items-center gap-2 shadow-md shadow-purple-500/20"
            >
              <span>Continue to Family &amp; Photos Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* STEP 3: Family Derivatives & Comprehensive Verdict */}
      {currentStep === 3 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 animate-in fade-in duration-200">
          
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              <span>Step 3: Family Derivatives &amp; Photo Count</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              State Department rules strictly require listing your spouse and all unmarried children under 21, even if they will not immigrate with you.
            </p>
          </div>

          {/* Marital Status Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              What is your current legal marital status?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                { value: 'single', label: 'Unmarried / Single' },
                { value: 'married_foreign', label: 'Married (Spouse is not a U.S. citizen/LPR)' },
                { value: 'married_us', label: 'Married (Spouse is U.S. citizen or Green Card holder)' },
                { value: 'divorced', label: 'Legally Divorced or Widowed' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setMaritalStatus(opt.value as any)}
                  className={cn(
                    "p-3 rounded-xl border text-left font-semibold transition-all",
                    maritalStatus === opt.value
                      ? "bg-purple-50 dark:bg-purple-950/70 border-purple-500 text-purple-900 dark:text-purple-200 shadow-xs"
                      : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Child Count */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Number of Unmarried Children Under 21 Years Old:</span>
              <span className="font-mono text-purple-600 dark:text-purple-400 text-base">{childCount}</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={childCount}
              onChange={(e) => setChildCount(parseInt(e.target.value, 10))}
              className="w-full accent-purple-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
            <p className="text-[11px] text-slate-500 leading-tight">
              Includes biological children, legally adopted children, and stepchildren under 21 who are unmarried. Failure to list all eligible children results in automatic disqualification.
            </p>
          </div>

          {/* FINAL READINESS VERDICT CARD */}
          <div
            className={cn(
              "p-6 rounded-3xl border shadow-lg space-y-4",
              isChargeabilityPassed && isEducationWorkPassed
                ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500/50 text-emerald-900 dark:text-emerald-200"
                : "bg-red-50 dark:bg-red-950/50 border-red-500/50 text-red-900 dark:text-red-200"
            )}
          >
            <div className="flex items-start gap-4">
              {isChargeabilityPassed && isEducationWorkPassed ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-500 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-8 h-8 text-red-500 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <h3 className="text-lg font-black tracking-tight">
                  {isChargeabilityPassed && isEducationWorkPassed
                    ? '100% ELIGIBLE TO ENTER THE DIVERSITY VISA PROGRAM'
                    : 'CURRENTLY NOT QUALIFIED UNDER DV RULES'}
                </h3>
                <p className="text-xs sm:text-sm mt-1 leading-relaxed opacity-90">
                  {isChargeabilityPassed && isEducationWorkPassed
                    ? `You satisfy all statutory criteria under INA § 203(c). You have valid native chargeability (${primaryCountry.name}${isCrossChargeable ? ` via ${spouseCountry?.name}` : ''}) and satisfy the education/work standard.`
                    : 'You do not currently satisfy the statutory requirements. Review country nativity or education/work experience criteria.'}
                </p>
              </div>
            </div>

            {/* Exact Required Photos Breakdown */}
            <div className="mt-4 pt-4 border-t border-emerald-200 dark:border-emerald-800/60 text-xs space-y-2">
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-blue-500" />
                  Exact Photos Required for Your Submission:
                </span>
                <span className="font-mono text-sm">{totalPhotosNeeded} Biometric Photos</span>
              </div>

              <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300 text-[11px]">
                <li><strong>1× Principal Applicant Photo</strong> (Your personal 600×600 px photo)</li>
                {maritalStatus === 'married_foreign' && (
                  <li><strong>1× Spouse Photo</strong> (Must be taken within 6 months, plain white background)</li>
                )}
                {childCount > 0 && (
                  <li><strong>{childCount}× Child Photo{childCount > 1 ? 's' : ''}</strong> (One individual 600×600 px photo per child; no parents in frame)</li>
                )}
              </ul>
            </div>

          </div>

          {/* Action Links */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Step 2
            </button>

            <Link
              href="/crop"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
            >
              <Camera className="w-4 h-4" />
              <span>Crop Your {totalPhotosNeeded} Photos Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      )}

    </div>
  );
}
