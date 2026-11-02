import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { GuideLayout } from "@/components/guides/GuideLayout";
import { Check, X, Camera, AlertTriangle, Sparkles, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Official DV Lottery Photo Requirements & Biometric Specs — dvphotocheck.tech",
  description: "Official U.S. Department of State photo requirements for Diversity Visa (Green Card Lottery). 600x600 px dimensions, 50%-69% head height, eye level rules, and background tolerances.",
  alternates: {
    canonical: "https://dvphotocheck.tech/guides/photo-requirements",
  },
};

const TOC = [
  { id: "dimensions", title: "1. Dimensions, Format & File Size" },
  { id: "biometrics", title: "2. Head Height & Eye Level Geometry" },
  { id: "background", title: "3. Background Color & Lighting Rules" },
  { id: "disqualifications", title: "4. Common Rejection Reasons" },
  { id: "infants", title: "5. Child & Infant Photo Rules" },
  { id: "faq", title: "6. Frequently Asked Questions" },
];

export default function PhotoRequirementsPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What are the exact dimensions for a DV Lottery photo?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The photo must be a square aspect ratio (1:1), minimum 600x600 pixels, maximum 1200x1200 pixels, in JPEG format under 240 KB (245,760 bytes)."
        }
      },
      {
        "@type": "Question",
        "name": "Are eyeglasses allowed in Diversity Visa photos?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Since November 1, 2016, eyeglasses are strictly prohibited in U.S. visa photos under Department of State regulations. Wearing glasses results in automated entry disqualification."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use last year's photo for my new DV application?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Photos must be taken within the last 6 months to reflect your current appearance. Submitting the same photo from a previous year results in automated disqualification."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <GuideLayout
        currentSlug="photo-requirements"
        title="Official U.S. Diversity Visa Photo Specifications"
        subtitle="The definitive technical and biometric guide to passing Department of State photo validation without disqualification."
        category="Technical Specs"
        toc={TOC}
      >
        {/* Intro Highlight Box */}
        <div className="p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-950 dark:text-blue-200 text-sm space-y-2">
          <p className="font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Why Photo Compliance Decides Your Entry</span>
          </p>
          <p className="leading-relaxed text-xs sm:text-sm">
            Over 30% of all Diversity Visa submissions are rejected annually before human review due to invalid photo dimensions, bad head ratios, background shadows, or eyeglasses. The Kentucky Consular Center (KCC) runs automated computer vision algorithms that silently disqualify non-compliant entries.
          </p>
        </div>

        {/* Section 1 */}
        <section id="dimensions" className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            1. Dimensions, Format &amp; File Size Specifications
          </h2>
          <p>
            Per <strong>22 C.F.R. § 42.33</strong>, your digital image file must satisfy strict file container properties:
          </p>

          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 not-prose">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 dark:bg-slate-900 font-bold text-slate-700 dark:text-slate-300">
                <tr>
                  <th className="p-3 sm:p-4">Parameter</th>
                  <th className="p-3 sm:p-4">Official Requirement</th>
                  <th className="p-3 sm:p-4">Target Sweet Spot</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="p-3 sm:p-4 font-semibold">Dimensions</td>
                  <td className="p-3 sm:p-4 font-mono">600 × 600 px to 1200 × 1200 px</td>
                  <td className="p-3 sm:p-4 text-emerald-600 font-mono font-bold">600 × 600 px</td>
                </tr>
                <tr>
                  <td className="p-3 sm:p-4 font-semibold">Aspect Ratio</td>
                  <td className="p-3 sm:p-4 font-mono">1:1 (Exact square)</td>
                  <td className="p-3 sm:p-4 text-emerald-600 font-mono font-bold">1.000 (1:1)</td>
                </tr>
                <tr>
                  <td className="p-3 sm:p-4 font-semibold">File Format</td>
                  <td className="p-3 sm:p-4 font-mono">JPEG (.jpg / .jpeg)</td>
                  <td className="p-3 sm:p-4 text-emerald-600 font-mono font-bold">Baseline sRGB JPEG</td>
                </tr>
                <tr>
                  <td className="p-3 sm:p-4 font-semibold">Maximum File Size</td>
                  <td className="p-3 sm:p-4 font-mono">≤ 240 KB (245,760 bytes)</td>
                  <td className="p-3 sm:p-4 text-emerald-600 font-mono font-bold">160 – 220 KB</td>
                </tr>
                <tr>
                  <td className="p-3 sm:p-4 font-semibold">Color Depth</td>
                  <td className="p-3 sm:p-4 font-mono">24-bit RGB (8 bits/channel)</td>
                  <td className="p-3 sm:p-4 text-emerald-600 font-mono font-bold">sRGB (No grayscale)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 2 */}
        <section id="biometrics" className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            2. Biometric Head Height &amp; Eye Level Geometry
          </h2>
          <p>
            Unlike generic passport photos, the U.S. Department of State mandates exact vertical ratios for facial placement:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-mono text-blue-500 font-bold block">HEAD HEIGHT RATIO</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">50% – 69%</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Measured from the bottom of your chin to the top of your hair/crown. On a 600×600 px canvas, this equals <strong>300 px to 414 px</strong> (Ideal target: 357 px / 59.5%).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-mono text-cyan-500 font-bold block">EYE LEVEL HEIGHT</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">56% – 69%</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Measured from the <strong>bottom edge of the photo</strong> to the horizontal line passing through both pupils. Equals <strong>336 px to 414 px</strong> from bottom (Y = 186 to 264 px from top).
              </p>
            </div>
          </div>

          {/* SVG Diagram of Biometrics */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center not-prose">
            <div className="max-w-xs mx-auto aspect-square relative rounded-xl bg-slate-900 overflow-hidden border border-slate-700">
              <svg className="w-full h-full" viewBox="0 0 600 600">
                {/* Crown Line */}
                <rect x="0" y="30" width="600" height="90" fill="#10B981" fillOpacity="0.15" stroke="#10B981" strokeWidth="2" strokeDasharray="6 6" />
                <text x="20" y="55" fill="#10B981" fontSize="18" fontWeight="bold" fontFamily="monospace">CROWN LEVEL (Top 50%-69%)</text>
                
                {/* Eye Band */}
                <rect x="0" y="186" width="600" height="78" fill="#06B6D4" fillOpacity="0.25" stroke="#06B6D4" strokeWidth="2" />
                <text x="20" y="210" fill="#06B6D4" fontSize="18" fontWeight="bold" fontFamily="monospace">EYE LEVEL (56%-69% from bottom)</text>

                {/* Chin Line */}
                <line x1="0" y1="387" x2="600" y2="387" stroke="#10B981" strokeWidth="2" strokeDasharray="6 6" />
                <text x="20" y="415" fill="#10B981" fontSize="18" fontWeight="bold" fontFamily="monospace">CHIN LEVEL (357px Head Height)</text>

                {/* Silhouette Oval */}
                <ellipse cx="300" cy="225" rx="130" ry="175" fill="none" stroke="#3B82F6" strokeWidth="2" strokeDasharray="8 6" opacity="0.6" />
              </svg>
            </div>
            <p className="text-xs text-slate-400 mt-2 font-mono">Figure: Official 600×600 Biometric Zoning Coordinate Grid</p>
          </div>
        </section>

        {/* Section 3 */}
        <section id="background" className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            3. Background Color, Plainness &amp; Lighting Rules
          </h2>
          <p>
            The background must be plain, uniform white or off-white. The following rules are rigorously enforced:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li><strong>No Background Shadows:</strong> Shadows cast by the head, ears, or shoulders on the wall behind you trigger automated rejections. Stand 3 to 4 feet in front of the wall to eliminate cast shadows.</li>
            <li><strong>No Objects or Patterns:</strong> No furniture, door frames, wallpaper patterns, textures, or picture frames may be visible in the frame.</li>
            <li><strong>Lighting Balance:</strong> Face must be illuminated evenly on both sides. Avoid harsh directional sunlight that creates dark shadows across one cheek.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section id="disqualifications" className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            4. Top 5 Reasons DV Photos Are Disqualified
          </h2>

          <div className="space-y-3 not-prose">
            {[
              {
                title: "1. Wearing Eyeglasses (Banned Since 2016)",
                desc: "Even clear prescription lenses or glare-free glasses are 100% prohibited. Eyeglass frames obscure facial recognition eye vectors.",
                verdict: "FAIL",
              },
              {
                title: "2. Reusing Last Year's Photo",
                desc: "Photos must have been taken within the past 6 months. KCC facial recognition software automatically compares new entries with previous years.",
                verdict: "FAIL",
              },
              {
                title: "3. AI Cutout or Retouched Backgrounds",
                desc: "Digitally replacing the background with artificial flat white using 'magic wand' tools creates jagged hair halos and triggers digital alteration disqualification.",
                verdict: "FAIL",
              },
              {
                title: "4. Incorrect Head Height (Too Close or Too Far)",
                desc: "Head height occupying less than 50% or more than 69% of the frame fails biometric measurement rules.",
                verdict: "FAIL",
              },
              {
                title: "5. Head Tilt or Sideways Turned Glance",
                desc: "Subject must face the camera directly with eyes open and neutral facial expression. Head roll beyond 3 degrees is flagged.",
                verdict: "FAIL",
              },
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/30 dark:bg-red-950/20 flex items-start gap-3">
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-red-600 text-white flex-shrink-0 mt-0.5">
                  {item.verdict}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5 */}
        <section id="infants" className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            5. Infant &amp; Child Photo Guidelines
          </h2>
          <p>
            When entering children in Part 2 of the Diversity Visa application, remember:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm">
            <li>No other person may be in the photograph (e.g. no parent hands holding the baby).</li>
            <li>For infants unable to sit upright, lay them on a plain white sheet or place them in a car seat covered with a white sheet.</li>
            <li>The child&apos;s eyes should be open and facing the camera. A slight smile or open mouth is tolerated for infants under 1 year old.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section id="faq" className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            6. Frequently Asked Questions
          </h2>
          <div className="space-y-3 not-prose">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Can I take the photo on my smartphone?</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Yes! Modern smartphones have high-quality cameras that easily exceed 600x600 pixels. Use our web app to crop and format it directly on your device.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">What clothing should I wear?</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Wear normal everyday attire. Uniforms of any kind (military, commercial, or police) are prohibited. Religious clothing worn daily (e.g., hijab) is permitted as long as the entire face from hairline to chin is visible.
              </p>
            </div>
          </div>
        </section>

      </GuideLayout>
    </>
  );
}

