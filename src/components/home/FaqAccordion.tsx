"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "What are the exact requirements for a DV lottery photo?",
    answer:
      "Per official U.S. State Department rules: The photo must be an exact 1:1 square JPEG (between 600×600 px and 1200×1200 px), in 24-bit color, under 240 KB (245,760 bytes). Your head must take up between 50% and 69% of the height, and your eye line must sit between 56% and 69% from the bottom of the photo.",
  },
  {
    question: "How do I know my photo is never uploaded or saved?",
    answer:
      "All photo cropping, face landmark detection, and file compression take place 100% inside your web browser using WebAssembly. No image files or facial measurements are ever sent to any remote server. Zero bytes are uploaded.",
  },
  {
    question: "Are eyeglasses or head coverings allowed?",
    answer:
      "Eyeglasses and sunglasses have been completely prohibited since 2016. Wearing glasses will result in automatic disqualification. Religious head coverings are allowed as long as the entire face from hairline to chin is clearly visible without shadows.",
  },
  {
    question: "Can I use the same photo I used last year?",
    answer:
      "No. The photo must be taken within the last 6 months. Consular systems use automated facial recognition to compare entries across years. Reusing an older photo will lead to disqualification.",
  },
  {
    question: "What is the 4x6 print sheet?",
    answer:
      "When selected for a visa interview, consular posts require physical 2×2 inch paper photos. Our 4x6 print sheet tool arranges six compliant 2×2 inch photos on a standard 1800×1200 px sheet with crop marks, ready to print at any local print shop or pharmacy kiosk.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-20 border-b border-neutral-100 dark:border-neutral-850">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Simple Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-white">
            Frequently asked questions
          </h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Quick answers about official specifications and privacy.
          </p>
        </div>

        {/* Clean Accordion */}
        <div className="divide-y divide-neutral-200 dark:divide-neutral-800 border-t border-b border-neutral-200 dark:border-neutral-800">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between gap-4 text-left group py-1"
                >
                  <h3 className="text-sm sm:text-base font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {faq.question}
                  </h3>
                  <div className="p-1 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white shrink-0">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-2 pr-6 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
