import React from "react";
import { Terminal, Shield, Cpu, HardDrive, Download, Lock } from "lucide-react";

export function PrivacyArchitecture() {
  const stages = [
    {
      code: "STAGE-01",
      name: "Ephemeral Memory Allocation",
      tech: "FileReader API / ArrayBuffer",
      detail: "Uploaded HEIC, JPEG, or WebP byte streams are decoded directly into sandboxed browser RAM. No temporary disk caching or server uploads.",
      metric: "INBOUND: MEMORY-ONLY",
    },
    {
      code: "STAGE-02",
      name: "WASM Biometric Landmark Mesh",
      tech: "MediaPipe Vision Float16 (WASM)",
      detail: "Executes a 478-point 3D facial topology solver locally via WebAssembly. Computes eye pupils, nose tip, chin, and estimated crown height.",
      metric: "EXECUTION: CPU/GPU WEBGL",
    },
    {
      code: "STAGE-03",
      name: "Affine Transform & Normalization",
      tech: "HTML5 Canvas 2D Engine",
      detail: "Solves counter-rotation to level eye roll to 0.0°, scales head height to 59.5% of canvas, and samples background luminance outside silhouette.",
      metric: "PRECISION: 1:1 SQUARE",
    },
    {
      code: "STAGE-04",
      name: "Binary-Search JPEG Encoder",
      tech: "Client-Side Binary Search",
      detail: "Iteratively modulates compression quality between 0.70 and 0.98 to guarantee exact file size below 245,760 bytes (240 KB) before direct disk download.",
      metric: "CEILING: < 240,000 BYTES",
    },
  ];

  return (
    <section className="py-20 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-obsidian-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <div className="font-mono text-[11px] tracking-widest uppercase text-neutral-500 dark:text-neutral-400 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Hardware Execution Stack • Zero-Telemetry Guarantee
            </div>
            <h2 className="font-editorial italic text-3xl sm:text-4xl text-neutral-900 dark:text-neutral-100 font-normal">
              100% Client-Side <span className="font-sans font-bold not-italic">Processing Pipeline</span>
            </h2>
          </div>
          <div className="mt-4 md:mt-0 font-mono text-[11px] p-2 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300">
            NET_IO_TRANSMITTED: <span className="text-emerald-600 dark:text-emerald-400 font-bold">0.00 KB</span>
          </div>
        </div>

        {/* Technical Architecture Schematic */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l border-neutral-200 dark:border-neutral-800">
          {stages.map((stage, idx) => (
            <div
              key={idx}
              className="p-6 border-r border-b border-neutral-200 dark:border-neutral-800 bg-[#fcfbf9]/60 dark:bg-[#08090b]/60 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between font-mono text-[10px] text-neutral-400 dark:text-neutral-500 mb-4 pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                  <span className="font-bold text-neutral-900 dark:text-neutral-200">{stage.code}</span>
                  <span className="text-[9px] uppercase tracking-wider">{stage.tech}</span>
                </div>

                <h3 className="font-sans font-bold text-sm text-neutral-900 dark:text-white mb-2">
                  {stage.name}
                </h3>

                <p className="font-sans text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                  {stage.detail}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-200/60 dark:border-neutral-800 font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                {stage.metric}
              </div>
            </div>
          ))}
        </div>

        {/* Telemetry Console Strip */}
        <div className="mt-8 p-4 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 font-mono text-xs text-neutral-600 dark:text-neutral-400 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-neutral-500" />
            <span>Audit Proof: Open your browser DevTools (Network tab) during crop or checker operations.</span>
          </div>
          <span className="font-bold text-neutral-900 dark:text-neutral-100">
            ZERO OUTBOUND HTTP POST REQUESTS
          </span>
        </div>

      </div>
    </section>
  );
}
