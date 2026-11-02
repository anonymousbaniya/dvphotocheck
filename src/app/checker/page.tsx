"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Upload, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  Camera, 
  RefreshCw, 
  Sliders, 
  ShieldCheck, 
  Info, 
  FileCheck, 
  Download,
  Eye,
  Scan,
  Maximize2
} from "lucide-react";
import { convertToStandardImage, type NormalizedImageResult } from "@/lib/image/heic-converter";
import { runFullPhotoAudit } from "@/lib/validators";
import { stripImageMetadata } from "@/lib/image/metadata-stripper";
import type { FullAuditReport, ComplianceCheckResult, CheckStatus } from "@/lib/validators/types";
import { cn } from "@/lib/utils";

export default function CheckerPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Application State
  const [file, setFile] = useState<File | Blob | null>(null);
  const [imageResult, setImageResult] = useState<NormalizedImageResult | null>(null);
  const [auditReport, setAuditReport] = useState<FullAuditReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isStripping, setIsStripping] = useState(false);
  const [sanitizedBlob, setSanitizedBlob] = useState<Blob | null>(null);

  // Overlay Controls
  const [showRulers, setShowRulers] = useState(true);
  const [showHeadZone, setShowHeadZone] = useState(true);
  const [showAnomalies, setShowAnomalies] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'file' | 'biometric' | 'background'>('all');

  // Process File Ingestion
  const processFile = useCallback(async (selectedFile: File | Blob) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setAuditReport(null);
    setSanitizedBlob(null);

    try {
      // Convert HEIC/PNG/WebP to standard HTMLImageElement
      const normalized = await convertToStandardImage(selectedFile);
      setFile(selectedFile);
      setImageResult(normalized);

      // Run 12-point audit
      const report = await runFullPhotoAudit(normalized.blob, normalized.image);
      setAuditReport(report);
    } catch (err: any) {
      console.error('[Audit Error]', err);
      setAnalysisError(err?.message || 'Failed to process image. Please try another file.');
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // Check for image passed from homepage or crop page on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const transferredData = sessionStorage.getItem("dv_photo_transfer");
      if (transferredData) {
        sessionStorage.removeItem("dv_photo_transfer");
        fetch(transferredData)
          .then((res) => res.blob())
          .then((blob) => {
            processFile(blob);
          })
          .catch((e) => console.warn("Failed to load transferred photo:", e));
      }
    }
  }, [processFile]);

  // Handle Drag & Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  // Canvas Drawing with Overlays
  useEffect(() => {
    if (!canvasRef.current || !imageResult?.image) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imageResult.image;
    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;

    canvas.width = w;
    canvas.height = h;

    // Draw base image
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);

    const bio = auditReport?.biometric;

    // 1. Draw Background Anomaly Highlights
    if (showAnomalies && bio?.backgroundAnomalies) {
      for (const anomaly of bio.backgroundAnomalies) {
        if (anomaly.isIssue) {
          ctx.fillStyle = 'rgba(239, 68, 68, 0.25)'; // Red translucent
          ctx.fillRect(anomaly.x, anomaly.y, anomaly.width, anomaly.height);
          ctx.strokeStyle = '#EF4444';
          ctx.lineWidth = 2;
          ctx.strokeRect(anomaly.x, anomaly.y, anomaly.width, anomaly.height);

          // Small tag
          ctx.fillStyle = '#EF4444';
          ctx.font = `bold ${Math.max(12, Math.floor(w * 0.02))}px monospace`;
          ctx.fillText(`Luma: ${anomaly.avgLuma}`, anomaly.x + 4, anomaly.y + 16);
        }
      }
    }

    // 2. Draw Biometric Measurement Rulers
    if (showRulers && bio?.faceDetected) {
      const fontSize = Math.max(14, Math.floor(w * 0.024));
      ctx.font = `bold ${fontSize}px sans-serif`;

      // Crown Line (Green)
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(0, bio.crownY);
      ctx.lineTo(w, bio.crownY);
      ctx.stroke();

      // Crown Tag
      ctx.fillStyle = '#10B981';
      ctx.fillRect(10, bio.crownY - fontSize - 6, Math.min(300, w * 0.45), fontSize + 8);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(`Crown (Top of Head)`, 16, bio.crownY - 6);

      // Chin Line (Green)
      ctx.beginPath();
      ctx.moveTo(0, bio.chinY);
      ctx.lineTo(w, bio.chinY);
      ctx.stroke();

      // Chin Tag
      ctx.fillStyle = '#10B981';
      ctx.fillRect(10, bio.chinY + 4, Math.min(320, w * 0.45), fontSize + 8);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(`Chin (${Math.round(bio.headHeightRatio * 100)}% Head Height)`, 16, bio.chinY + fontSize + 2);

      // Eye Level Line (Cyan)
      ctx.strokeStyle = '#06B6D4';
      ctx.lineWidth = 3;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, bio.eyeY);
      ctx.lineTo(w, bio.eyeY);
      ctx.stroke();

      // Eye Level Tag
      ctx.fillStyle = '#06B6D4';
      ctx.fillRect(w - Math.min(300, w * 0.45) - 10, bio.eyeY - fontSize - 6, Math.min(300, w * 0.45), fontSize + 8);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(`Eye Level: ${Math.round(bio.eyeHeightRatio * 100)}% from bottom`, w - Math.min(300, w * 0.45) - 4, bio.eyeY - 6);

      // Reset Line Dash
      ctx.setLineDash([]);
    }

    // 3. Draw Official DoS Biometric Target Oval
    if (showHeadZone) {
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      // Target center: x=50%, eye level at 62.5% from bottom => y=37.5% from top
      ctx.ellipse(w * 0.5, h * 0.44, w * 0.23, h * 0.30, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [imageResult, auditReport, showRulers, showHeadZone, showAnomalies]);

  // Strip Metadata Handler
  const handleStripMetadata = async () => {
    if (!imageResult?.image) return;
    setIsStripping(true);
    try {
      const sanitized = await stripImageMetadata(imageResult.image);
      setSanitizedBlob(sanitized);
      // Re-run audit with sanitized blob
      const newReport = await runFullPhotoAudit(sanitized, imageResult.image);
      setAuditReport(newReport);
    } catch (e) {
      console.error('[Strip Error]', e);
    } finally {
      setIsStripping(false);
    }
  };

  // Transfer Image to AI Cropper
  const handleSendToCropper = () => {
    if (!imageResult?.image) return;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = imageResult.image.naturalWidth || imageResult.image.width;
      canvas.height = imageResult.image.naturalHeight || imageResult.image.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(imageResult.image, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.98);
        sessionStorage.setItem('dv_photo_transfer', dataUrl);
      }
    } catch {
      // Fallback
    }
    router.push('/crop');
  };

  // Test with Sample Demo Photo
  const handleLoadSample = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Pure white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, 600, 600);

      // Subtle off-white shadow on top-left to trigger realistic warning
      const grad = ctx.createRadialGradient(50, 50, 10, 50, 50, 150);
      grad.addColorStop(0, '#E2E8F0');
      grad.addColorStop(1, '#FFFFFF');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 150, 150);

      // Shoulders / chest
      ctx.fillStyle = '#1E3A8A';
      ctx.beginPath();
      ctx.ellipse(300, 580, 220, 140, 0, 0, Math.PI * 2);
      ctx.fill();

      // Neck
      ctx.fillStyle = '#FBCFE8';
      ctx.fillRect(260, 390, 80, 80);

      // Head / Face (Height 357px, 59.5%)
      ctx.fillStyle = '#FDE047';
      ctx.beginPath();
      ctx.ellipse(300, 260, 130, 178, 0, 0, Math.PI * 2);
      ctx.fill();

      // Hair
      ctx.fillStyle = '#451A03';
      ctx.beginPath();
      ctx.arc(300, 200, 135, Math.PI, 0, false);
      ctx.fill();

      // Eyes (Y = 225px, 62.5% from bottom)
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.arc(245, 225, 8, 0, Math.PI * 2);
      ctx.arc(355, 225, 8, 0, Math.PI * 2);
      ctx.fill();

      // Nose tip (X = 300)
      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.arc(300, 275, 6, 0, Math.PI * 2);
      ctx.fill();

      // Smile / mouth
      ctx.strokeStyle = '#DC2626';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(300, 330, 28, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.stroke();

      canvas.toBlob((b) => {
        if (b) {
          processFile(b);
        }
      }, 'image/jpeg', 0.95);
    }
  };

  // Filter Checks by Category
  const filteredChecks = auditReport?.allChecks.filter((c) => {
    if (selectedCategory === 'all') return true;
    return c.category === selectedCategory;
  }) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Module B • Biometric Engine
            </span>
            <span className="text-xs text-slate-500 font-mono">22 C.F.R. § 42.33</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            12-Point DV Photo Compliance Checker
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Audits your photograph against official biometric geometry, byte size, dimensions, and lighting rules.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {imageResult && (
            <button
              type="button"
              onClick={() => {
                setImageResult(null);
                setAuditReport(null);
                setFile(null);
              }}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Check Another</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSendToCropper}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Open AI Cropper</span>
          </button>
        </div>
      </div>

      {/* Upload Zone (Visible when no photo is loaded) */}
      {!imageResult && (
        <div className="mt-8 max-w-3xl mx-auto">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 rounded-3xl p-10 sm:p-14 text-center bg-white dark:bg-slate-900/60 shadow-lg hover:shadow-2xl transition-all cursor-pointer group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInput}
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
              className="hidden"
            />

            <div className="w-20 h-20 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
              <Upload className="w-10 h-10" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Drag &amp; Drop your photo here to audit
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
              Accepts <strong>JPEG, PNG, WebP, and Apple HEIC</strong>. Runs 100% locally in your browser sandbox using WebAssembly.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white group-hover:bg-blue-700 transition-colors shadow-sm">
                Browse Files from Device
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLoadSample();
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Try with Sample Image</span>
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-6 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Zero Uploads
              </span>
              <span>•</span>
              <span>WASM Biometric Audit</span>
              <span>•</span>
              <span>EXIF Privacy Scan</span>
            </div>
          </div>

          {analysisError && (
            <div className="mt-4 p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
              <XCircle className="w-4 h-4 flex-shrink-0" />
              <span>{analysisError}</span>
            </div>
          )}
        </div>
      )}

      {/* Loading Spinner */}
      {isAnalyzing && (
        <div className="my-12 p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-xl max-w-md mx-auto">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Analyzing 478 Facial Landmarks...
          </h3>
          <p className="text-xs text-slate-500 font-mono">
            Executing MediaPipe WASM client-side. Zero server transmission.
          </p>
        </div>
      )}

      {/* Split-Screen Results View */}
      {imageResult && auditReport && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Canvas with Toggleable Visual Overlays (Cols 1-5) */}
          <div className="lg:col-span-5 space-y-4 sticky top-24">
            
            {/* Visual Canvas Box */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 font-mono">
                  <Scan className="w-4 h-4 text-blue-500" />
                  VISUAL_MEASUREMENT_CANVAS
                </span>
                <span className="font-mono text-[10px] text-slate-500 font-semibold">
                  {imageResult.width} × {imageResult.height} PX
                </span>
              </div>

              {/* Rendered Canvas */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-200 dark:border-slate-800">
                <canvas
                  ref={canvasRef}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Overlay Control Toggles */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Visual Overlays
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setShowRulers(!showRulers)}
                    className={cn(
                      "px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition-all text-center",
                      showRulers
                        ? "bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300 font-semibold"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500"
                    )}
                  >
                    Biometric Rulers
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowHeadZone(!showHeadZone)}
                    className={cn(
                      "px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition-all text-center",
                      showHeadZone
                        ? "bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300 font-semibold"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500"
                    )}
                  >
                    Head Oval Zone
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowAnomalies(!showAnomalies)}
                    className={cn(
                      "px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition-all text-center",
                      showAnomalies
                        ? "bg-red-50 dark:bg-red-950/60 border-red-500 text-red-700 dark:text-red-300 font-semibold"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500"
                    )}
                  >
                    Flag Shadows
                  </button>
                </div>
              </div>

              {/* Key File Specifications Badges */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px]">FILE SIZE:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {Math.round((file?.size || 0) / 1024)} KB
                  </span>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px]">FORMAT:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {auditReport.technical.isJpeg ? 'JPEG (Valid)' : 'Non-JPEG'}
                  </span>
                </div>
              </div>

            </div>

            {/* AI Auto-Fix Callout Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/40 to-indigo-900/30 border border-blue-500/40 text-white space-y-3 shadow-lg">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <h4 className="text-sm font-bold">Need Auto-Alignment?</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                If your head size, eye level, tilt, or dimensions failed, our 1-Click AI Cropper can automatically align your face to 59.5% head height and export a clean 600×600 px photo.
              </p>
              <button
                type="button"
                onClick={handleSendToCropper}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <span>Fix Automatically in AI Cropper</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Right Panel: 12-Point Scorecard (Cols 6-12) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Master Compliance Banner */}
            <div
              className={cn(
                "p-5 rounded-2xl border shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
                auditReport.overallStatus === 'PASS'
                  ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500/60 text-emerald-900 dark:text-emerald-200"
                  : auditReport.overallStatus === 'WARNING'
                  ? "bg-amber-50 dark:bg-amber-950/60 border-amber-500/60 text-amber-900 dark:text-amber-200"
                  : "bg-red-50 dark:bg-red-950/60 border-red-500/60 text-red-900 dark:text-red-200"
              )}
            >
              <div className="flex items-start gap-3.5">
                {auditReport.overallStatus === 'PASS' ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 flex-shrink-0 mt-0.5" />
                ) : auditReport.overallStatus === 'WARNING' ? (
                  <AlertTriangle className="w-8 h-8 text-amber-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-500 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h3 className="text-lg font-black tracking-tight leading-tight">
                    {auditReport.overallStatus === 'PASS'
                      ? '100% COMPLIANT WITH U.S. VISA RULES'
                      : auditReport.overallStatus === 'WARNING'
                      ? 'PASSED WITH WARNINGS'
                      : 'DISQUALIFICATION RISKS DETECTED'}
                  </h3>
                  <p className="text-xs mt-1 opacity-90 leading-relaxed">
                    {auditReport.overallStatus === 'PASS'
                      ? 'This photo satisfies all 12 technical and biometric requirements for the Electronic Diversity Visa (DV) Program.'
                      : auditReport.overallStatus === 'WARNING'
                      ? 'The photo meets fundamental criteria, but contains potential risks (e.g. metadata, off-white background, or minor tilt).'
                      : 'Critical specifications failed. Submitting this photo may lead to automated disqualification by the Department of State.'}
                  </p>
                </div>
              </div>

              {/* Status Score Counts */}
              <div className="flex sm:flex-col items-center sm:items-end gap-2 text-xs font-mono font-bold flex-shrink-0">
                <span className="text-emerald-600 dark:text-emerald-400">
                  {auditReport.passCount} PASS
                </span>
                <span className="text-amber-600 dark:text-amber-400">
                  {auditReport.warningCount} WARN
                </span>
                <span className="text-red-600 dark:text-red-400">
                  {auditReport.failCount} FAIL
                </span>
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={cn(
                  "flex-1 py-1.5 px-3 rounded-lg font-semibold transition-all",
                  selectedCategory === 'all'
                    ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                )}
              >
                All 12 Checks
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('file')}
                className={cn(
                  "flex-1 py-1.5 px-3 rounded-lg font-semibold transition-all",
                  selectedCategory === 'file'
                    ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                )}
              >
                File Specs (6)
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('biometric')}
                className={cn(
                  "flex-1 py-1.5 px-3 rounded-lg font-semibold transition-all",
                  selectedCategory === 'biometric'
                    ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                )}
              >
                Biometrics (4)
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('background')}
                className={cn(
                  "flex-1 py-1.5 px-3 rounded-lg font-semibold transition-all",
                  selectedCategory === 'background'
                    ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                )}
              >
                Lighting (2)
              </button>
            </div>

            {/* Metadata Sanitize Action Strip (If EXIF or editing tags are found) */}
            {auditReport.technical.hasExifMetadata && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300">
                    EXIF metadata / camera tags detected ({auditReport.technical.metadataTags.join(', ')}).
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleStripMetadata}
                  disabled={isStripping || sanitizedBlob !== null}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {isStripping ? (
                    <span>Sanitizing...</span>
                  ) : sanitizedBlob ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Stripped
                    </span>
                  ) : (
                    <span>Strip Metadata &amp; Fix</span>
                  )}
                </button>
              </div>
            )}

            {/* 12 Checks List */}
            <div className="space-y-3">
              {filteredChecks.map((check) => (
                <div
                  key={check.id}
                  className={cn(
                    "p-4 rounded-xl border bg-white dark:bg-slate-900 transition-all",
                    check.status === 'PASS'
                      ? "border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/40"
                      : check.status === 'WARNING'
                      ? "border-amber-300 dark:border-amber-800/80 bg-amber-50/20"
                      : "border-red-300 dark:border-red-800/80 bg-red-50/20"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {check.id}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {check.name}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Req: {check.requirement}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={cn(
                        "text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider",
                        check.status === 'PASS'
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                          : check.status === 'WARNING'
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                          : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-300 dark:border-red-800"
                      )}
                    >
                      {check.status}
                    </span>
                  </div>

                  {/* Measurement Value & Details */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                      Measured: <span className="text-blue-600 dark:text-blue-400">{check.value}</span>
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                      {check.details}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setImageResult(null);
                  setAuditReport(null);
                  setFile(null);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Upload Different Photo
              </button>

              <button
                type="button"
                onClick={handleSendToCropper}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
              >
                <span>Fix Automatically in AI Cropper</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
