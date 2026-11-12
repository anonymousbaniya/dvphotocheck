import React from "react";
import { ChevronDown, ExternalLink, ShieldCheck } from "lucide-react";
import { DV_SEO_FAQS } from "@/lib/constants/seo-faqs";

const HOW_IT_WORKS_STEPS = [
  {
    step: "Step 01",
    title: "1. Upload or Capture Your Photo Locally",
    description:
      "Select a JPEG, PNG, WebP, or HEIC photo—or take one with your camera. Your image is decoded directly inside browser memory with zero server uploads.",
  },
  {
    step: "Step 02",
    title: "2. Run Biometric & 600×600 Pixel Validation",
    description:
      "Our validator measures head size (50%–69% of image height), eye level (56%–69% from the bottom edge), 24-bit color depth, lighting uniformity, and square 1:1 framing in real time.",
  },
  {
    step: "Step 03",
    title: "3. Export a Compliant 240 KB JPEG or 4×6 Sheet",
    description:
      "Use 1-Click Auto-Align or fine zoom/rotation sliders, then export a metadata-free 600×600 pixels JPEG strictly under 240 KB—or a 4×6 print sheet ready for consular interviews.",
  },
];

const OFFICIAL_SPEC_ROWS = [
  {
    spec: "Dimensions & Aspect Ratio",
    requirement: "600 × 600 pixels to 1200 × 1200 pixels (Exact 1:1 square)",
    detail: "Exports exact 600×600px (or 1200×1200px in Crop Studio) with zero distortion.",
  },
  {
    spec: "File Format & Max Size",
    requirement: "JPEG (.jpg), maximum 240 KB (245,760 bytes)",
    detail: "Automatically compressed below 240 KB while preserving sharp facial detail and stripping EXIF metadata.",
  },
  {
    spec: "Color Space & Depth",
    requirement: "24-bit sRGB full color",
    detail: "Black-and-white, grayscale, or sepia photographs are rejected by the State Department E-DV system.",
  },
  {
    spec: "Head Size (Height)",
    requirement: "50% to 69% of total image height",
    detail: "Measured from the bottom of the chin to the top of the head including hair (1 inch to 1 3/8 inches on a 2×2 print).",
  },
  {
    spec: "Eye Level Position",
    requirement: "56% to 69% from the bottom edge",
    detail: "Both eyes must sit cleanly inside the cyan calibration band with head tilt leveled to 0°.",
  },
  {
    spec: "Background & Lighting",
    requirement: "Plain white or off-white, zero shadows",
    detail: "Uniform neutral lighting across face and backdrop; no patterns, textures, or rough AI cutout halos.",
  },
  {
    spec: "Glasses & Expression",
    requirement: "No eyeglasses; neutral facial expression",
    detail: "Prescription glasses, sunglasses, and tinted lenses are prohibited. Both eyes open, mouth closed, facing straight forward.",
  },
  {
    spec: "Photo Recency",
    requirement: "Taken within the last 6 months",
    detail: "Must reflect your current appearance; reusing a photo from a previous Diversity Visa entry causes disqualification.",
  },
];

export function SeoGuideSection() {
  return (
    <div className="space-y-10 sm:space-y-12">
      {/* How DVPhotoCheck Works & Official U.S. State Department Photo Requirements */}
      <section
        aria-labelledby="how-dvphotocheck-works-heading"
        className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-2xs space-y-8"
      >
        <div className="space-y-2 max-w-3xl">
          <div className="text-xs font-bold text-blue-600 uppercase tracking-widest">
            DV Photo Check Guide &amp; Specifications
          </div>
          <h2
            id="how-dvphotocheck-works-heading"
            className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight"
          >
            How DVPhotoCheck Works &amp; Official U.S. State Department Photo Requirements
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            <strong>DVPhotoCheck</strong> (<strong>dvphotocheck.tech</strong>) checks your U.S. Diversity Visa (Green Card Lottery) entry photo against official Department of State digital image rules—verifying{" "}
            <strong>600×600 pixels</strong>, <strong>240 KB</strong> maximum JPEG size, <strong>24-bit color</strong>,{" "}
            <strong>head size</strong>, and <strong>eye level</strong> before you submit on the E-DV portal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {HOW_IT_WORKS_STEPS.map((item) => (
            <article
              key={item.step}
              className="p-6 rounded-2xl border border-slate-200/80 bg-slate-50/60 space-y-2.5"
            >
              <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {item.step}
              </span>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">{item.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.description}</p>
            </article>
          ))}
        </div>

        {/* Official U.S. Department of State Requirements Table */}
        <div className="space-y-4 pt-2">
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Official U.S. Department of State DV Lottery Photo Specifications Table
          </h3>
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#e8f2fc] text-[#0a2540] border-b border-blue-200/80">
                  <th scope="col" className="py-3.5 px-4 font-bold">
                    Requirement
                  </th>
                  <th scope="col" className="py-3.5 px-4 font-bold">
                    Official Standard
                  </th>
                  <th scope="col" className="py-3.5 px-4 font-bold">
                    How It Is Validated
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 bg-white">
                {OFFICIAL_SPEC_ROWS.map((row) => (
                  <tr key={row.spec} className="hover:bg-slate-50/80 transition-colors">
                    <th scope="row" className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      {row.spec}
                    </th>
                    <td className="py-3.5 px-4 font-medium text-blue-700">{row.requirement}</td>
                    <td className="py-3.5 px-4 text-slate-600 leading-relaxed">{row.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-slate-500">
            <div className="inline-flex items-center gap-2 text-emerald-700 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
              <span>100% browser-based verification — zero photos leave your device.</span>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/photos.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline"
              >
                <span>U.S. Dept. of State Photo Requirements</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
              <a
                href="https://tsg.phototool.state.gov/photo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline"
              >
                <span>Official State Dept. Photo Tool</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Crawlable FAQ Section matching JSON-LD FAQPage */}
      <section
        aria-labelledby="dvphotocheck-faq-heading"
        className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-2xs space-y-6"
      >
        <div className="space-y-1.5">
          <h2 id="dvphotocheck-faq-heading" className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            DVPhotoCheck Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Answers on DV Photo Check rules, 600×600 pixel geometry, 240 KB export, and client-side privacy.
          </p>
        </div>

        <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
          {DV_SEO_FAQS.map((faq, index) => (
            <details key={faq.question} open={index === 0} className="group py-4">
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-semibold text-sm sm:text-base text-slate-900 hover:text-blue-600 transition-colors">
                <h3>{faq.question}</h3>
                <ChevronDown
                  className="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="mt-2.5 pr-6 text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

