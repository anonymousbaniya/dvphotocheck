"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck, WifiOff, Wifi, Info } from "lucide-react";

export function PrivacyBadge() {
  const [isOnline, setIsOnline] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={() => setShowTooltip(!showTooltip)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="flex items-center gap-2 px-2.5 py-1 text-[11px] font-mono tracking-tight rounded border border-slate-300 bg-slate-100/90 text-slate-800 hover:border-slate-400 transition-colors"
        aria-label="Privacy guarantee status"
      >
        <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-semibold text-slate-900">0 B OUTBOUND</span>
        <span className="text-slate-400 hidden md:inline">|</span>
        <span className="text-slate-500 hidden md:inline">
          {isOnline ? "LOCAL SANDBOX" : "OFFLINE READY"}
        </span>
      </button>

      {/* Structured Technical Spec Tooltip */}
      {showTooltip && (
        <div className="absolute top-full right-0 mt-2 w-80 p-4 rounded-xl bg-white border border-slate-200 shadow-xl z-50 text-xs font-sans text-slate-700 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="font-mono text-[10px] tracking-widest uppercase text-slate-400 font-semibold">
              Telemetry Verification
            </span>
            <span className="font-mono text-[10px] text-emerald-600 font-bold">
              ZERO-TELEMETRY
            </span>
          </div>

          <p className="text-slate-600 leading-relaxed text-[11px]">
            Every image transformation, facial landmark computation, and encryption operation executes strictly inside your browser memory via WebAssembly (WASM).
          </p>

          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1">
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
              <span className="block text-slate-400">REMOTE INGESTION</span>
              <span className="font-bold text-slate-900">0.00 BYTES</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
              <span className="block text-slate-400">VISION ENGINE</span>
              <span className="font-bold text-slate-900">CLIENT WASM</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
