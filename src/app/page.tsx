"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Upload, 
  Camera, 
  Sparkles, 
  RotateCw, 
  RotateCcw, 
  Download, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  Check, 
  X, 
  AlertTriangle,
  RefreshCw,
  Lightbulb,
  CloudUpload,
  Info,
  Crop,
  Calculator,
  ListTodo,
  KeyRound,
  ArrowRight,
  BookOpen,
  HelpCircle
} from "lucide-react";
import confetti from "canvas-confetti";
import { convertToStandardImage, type NormalizedImageResult } from "@/lib/image/heic-converter";
import { calculateAutoCrop } from "@/lib/image/auto-crop";
import { applyBackgroundLightener } from "@/lib/image/bg-lightener";
import { compressToDVSpec, generate4x6PrintSheet } from "@/lib/image/exporter";
import { runFullPhotoAudit } from "@/lib/validators";
import type { FullAuditReport } from "@/lib/validators/types";
import { CameraCapture } from "@/components/tools/CameraCapture";

export default function HomePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Ingestion State
  const [currentFile, setCurrentFile] = useState<File | Blob | null>(null);
  const [imageResult, setImageResult] = useState<NormalizedImageResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Cropper Matrix State
  const [zoom, setZoom] = useState(1.0);
  const [rotation, setRotation] = useState(0); // in degrees
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [showOval, setShowOval] = useState(true);
  const [enableBgLightener, setEnableBgLightener] = useState(false);
  const [isAutoAligning, setIsAutoAligning] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Checker Diagnostic State
  const [auditReport, setAuditReport] = useState<FullAuditReport | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  // Touch and mouse pan tracking
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Handle incoming file
  const handleProcessFile = useCallback(async (file: File | Blob) => {
    setIsProcessing(true);
    setErrorMessage(null);
    setExportSuccess(false);

    try {
      const normalized = await convertToStandardImage(file);
      setCurrentFile(file);
      setImageResult(normalized);

      // Fit image onto 600x600 canvas initially
      const w = normalized.width;
      const h = normalized.height;
      const initialScale = Math.min(600 / w, 600 / h);
      setZoom(initialScale);
      setRotation(0);
      setPanX((600 - w * initialScale) / 2);
      setPanY((600 - h * initialScale) / 2);

      // Run 6-Point / 12-Point Compliance Audit
      setIsAuditing(true);
      runFullPhotoAudit(normalized.blob, normalized.image)
        .then((report) => setAuditReport(report))
        .catch((e) => console.warn("[Audit] Failed:", e))
        .finally(() => setIsAuditing(false));

    } catch (err: any) {
      console.error("[Ingestion Error]", err);
      setErrorMessage(err?.message || "Failed to load image. Please select a valid JPG or PNG file.");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // 1-Click AI Auto-Align
  const handleAutoAlign = async () => {
    if (!imageResult?.image) return;
    setIsAutoAligning(true);
    setErrorMessage(null);

    try {
      const result = await calculateAutoCrop(imageResult.image, 600);
      if (result) {
        setRotation(result.rotationDegrees);
        setZoom(result.scale);
        setPanX(result.panX);
        setPanY(result.panY);

        confetti({
          particleCount: 35,
          spread: 50,
          origin: { y: 0.6 },
          colors: ["#2563EB", "#10B981", "#38BDF8"],
        });
      } else {
        setErrorMessage("Face not automatically detected. You can easily adjust the photo manually using the zoom and rotation controls.");
      }
    } catch (err) {
      console.warn("[Auto-Crop] Fallback to manual:", err);
      setErrorMessage("Face detection model could not be loaded. Please adjust the photo using the sliders below.");
    } finally {
      setIsAutoAligning(false);
    }
  };

  // Render Canvas
  const renderCanvas = useCallback(() => {
    if (!canvasRef.current || !imageResult?.image) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 600;

    // Fill white background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, 600, 600);

    // Apply affine transformations
    ctx.save();
    ctx.translate(300, 300);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-300, -300);

    ctx.translate(panX, panY);
    ctx.scale(zoom, zoom);

    ctx.drawImage(imageResult.image, 0, 0);
    ctx.restore();

    // Background Lightener
    if (enableBgLightener) {
      applyBackgroundLightener(ctx, 600, 600, { lumaThreshold: 215 });
    }

    // Official State Department Overlay Guides
    if (showOval) {
      ctx.save();

      // Cyan Eye-Level Guide Band (56% to 69% from bottom = Y: 186 to Y: 264)
      ctx.fillStyle = "rgba(6, 182, 212, 0.12)";
      ctx.fillRect(0, 186, 600, 78);
      ctx.strokeStyle = "rgba(6, 182, 212, 0.75)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(0, 186, 600, 78);

      // Center Vertical Line
      ctx.strokeStyle = "rgba(100, 116, 139, 0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(300, 0);
      ctx.lineTo(300, 600);
      ctx.stroke();

      // Head Oval Guide (50% - 69% head height)
      ctx.strokeStyle = "rgba(37, 99, 235, 0.85)";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.ellipse(300, 275, 115, 150, 0, 0, 2 * Math.PI);
      ctx.stroke();

      // Labels
      ctx.setLineDash([]);
      ctx.fillStyle = "#0284c7";
      ctx.font = "bold 11px system-ui, sans-serif";
      ctx.fillText("EYE LEVEL (56% – 69%)", 14, 230);

      ctx.fillStyle = "#2563eb";
      ctx.fillText("HEAD TOP (MAX 69%)", 14, 130);
      ctx.fillText("CHIN (MIN 50%)", 14, 420);

      ctx.restore();
    }
  }, [imageResult, rotation, panX, panY, zoom, enableBgLightener, showOval]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Touch and Mouse Pan Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX - panX, y: e.clientY - panY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    setPanX(e.clientX - dragStartRef.current.x);
    setPanY(e.clientY - dragStartRef.current.y);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Export 600x600 JPEG (< 240 KB)
  const handleDownloadPhoto = async () => {
    if (!canvasRef.current || !imageResult?.image) return;
    setIsExporting(true);

    try {
      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = 600;
      exportCanvas.height = 600;
      const ctx = exportCanvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, 600, 600);

      ctx.save();
      ctx.translate(300, 300);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-300, -300);

      ctx.translate(panX, panY);
      ctx.scale(zoom, zoom);

      ctx.drawImage(imageResult.image, 0, 0);
      ctx.restore();

      if (enableBgLightener) {
        applyBackgroundLightener(ctx, 600, 600, { lumaThreshold: 215 });
      }

      const compressed = await compressToDVSpec(exportCanvas, 600);

      const url = URL.createObjectURL(compressed.blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "dv_lottery_photo_600x600.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportSuccess(true);
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#10B981", "#2563EB", "#F59E0B"],
      });
    } catch (err: any) {
      alert("Export failed: " + (err?.message || "Unknown error"));
    } finally {
      setIsExporting(false);
    }
  };

  // Export 4x6 Print Sheet (1800x1200 px, 6 Photos)
  const handleDownloadPrintSheet = async () => {
    if (!canvasRef.current || !imageResult?.image) return;

    try {
      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = 600;
      exportCanvas.height = 600;
      const ctx = exportCanvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, 600, 600);

      ctx.save();
      ctx.translate(300, 300);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-300, -300);

      ctx.translate(panX, panY);
      ctx.scale(zoom, zoom);

      ctx.drawImage(imageResult.image, 0, 0);
      ctx.restore();

      if (enableBgLightener) {
        applyBackgroundLightener(ctx, 600, 600, { lumaThreshold: 215 });
      }

      const sheetBlob = await generate4x6PrintSheet(exportCanvas);
      const url = URL.createObjectURL(sheetBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "dv_photo_4x6_print_sheet.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e: any) {
      alert("Failed to create print sheet: " + (e?.message || "Error"));
    }
  };

  // Reset Photo
  const handleReset = () => {
    setImageResult(null);
    setCurrentFile(null);
    setAuditReport(null);
    setExportSuccess(false);
    setErrorMessage(null);
  };

  // Drag & drop handlers
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Map 12-point checks to the 6 critical cards in the screenshot
  const getDiagnosticStatus = (id: string): { status: "Pending" | "Pass" | "Fail" | "Warning"; value?: string } => {
    if (!auditReport) return { status: "Pending" };
    const check = auditReport.allChecks.find((c) => c.id === id);
    if (!check) return { status: "Pending" };
    if (check.status === "PASS") return { status: "Pass", value: check.value };
    if (check.status === "WARNING") return { status: "Warning", value: check.value };
    return { status: "Fail", value: check.value };
  };

  const diagDims = getDiagnosticStatus("CHK-03");
  const diagSize = getDiagnosticStatus("CHK-02");
  const diagFormat = getDiagnosticStatus("CHK-01");
  const diagColor = getDiagnosticStatus("CHK-05");
  const diagBg = getDiagnosticStatus("CHK-10");
  const diagHead = getDiagnosticStatus("CHK-06");

  const renderBadge = (item: { status: "Pending" | "Pass" | "Fail" | "Warning"; value?: string }) => {
    if (item.status === "Pass") {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          Pass
        </span>
      );
    }
    if (item.status === "Fail") {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          Fail
        </span>
      );
    }
    if (item.status === "Warning") {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          Warning
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-500 border border-slate-200/80">
        Pending
      </span>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafd] text-slate-900">
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-12">
        
        {/* 1. Hero Banner (Plain Light Blue Card) */}
        <section className="rounded-3xl bg-[#e8f2fc] border border-blue-200/90 text-slate-900 p-8 sm:p-12 shadow-xs relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            
            {/* Pill tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/95 text-blue-700 border border-blue-200 shadow-2xs">
              <Check className="w-3.5 h-3.5 text-blue-600" />
              <span>Official U.S. State Dept Specifications</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0a2540] leading-tight">
              Verify, Calibrate &amp; Crop Your DV Lottery Photo
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl font-normal">
              Ensure your Diversity Visa entry isn&apos;t rejected for photo non-compliance. Our tool verifies dimensions, background color uniformity, eye &amp; head proportions, and exports a compliant 600×600 JPEG.
            </p>

          </div>
        </section>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-center justify-between">
            <span>{errorMessage}</span>
            <button onClick={() => setErrorMessage(null)} className="text-amber-500 hover:text-amber-700 ml-2">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 2. Main Two-Column Tool Section: Photo Inspector & Compliance Diagnostic */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Photo Inspector (Cols 1-7) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Photo Inspector</span>
              </h2>

              <span className="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                {imageResult ? "Photo Calibrated" : "Awaiting photo"}
              </span>
            </div>

            {/* State A: Awaiting Photo Dropzone */}
            {!imageResult ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-blue-200 hover:border-blue-400 rounded-3xl p-12 sm:p-20 text-center cursor-pointer bg-blue-50/20 hover:bg-blue-50/40 transition-all duration-200"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleProcessFile(e.target.files[0]);
                    }
                  }}
                  accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                  className="hidden"
                />

                <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-5 shadow-xs">
                  <CloudUpload className="w-8 h-8" />
                </div>

                {isProcessing ? (
                  <div className="space-y-2 py-4">
                    <div className="text-base font-semibold text-slate-900 animate-pulse">
                      Reading photo into browser memory...
                    </div>
                    <div className="text-xs text-slate-500">
                      Processing 100% locally on your device
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                      Click to browse or drop photo here
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 mb-6 max-w-md mx-auto">
                      Accepted: <strong>JPEG / JPG</strong> (or PNG). Minimum <strong>600 × 600 px</strong>, max size <strong>240 KB</strong>
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-600 mb-8">
                      <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                        <Check className="w-4 h-4" /> Neutral expression
                      </span>
                      <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                        <Check className="w-4 h-4" /> White/off-white background
                      </span>
                      <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                        <Check className="w-4 h-4" /> No eyeglasses
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Choose Photo</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsCameraOpen(true);
                        }}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs sm:text-sm font-semibold hover:bg-slate-50 transition-colors"
                      >
                        <Camera className="w-4 h-4 text-slate-500" />
                        <span>Use Camera</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* State B: Photo Loaded into Interactive Inspector Canvas */
              <div className="space-y-5">
                
                {/* Action buttons header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleAutoAlign}
                      disabled={isAutoAligning}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{isAutoAligning ? "Aligning..." : "Auto-Align"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowOval(!showOval)}
                      className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-colors ${
                        showOval
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      Oval {showOval ? "On" : "Off"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setEnableBgLightener(!enableBgLightener)}
                      className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-colors ${
                        enableBgLightener
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                      title="Whiten background pixels"
                    >
                      Clean BG
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs sm:text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1.5 font-medium px-2 py-1 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Upload New</span>
                  </button>
                </div>

                {/* Canvas Inspector */}
                <div className="flex justify-center py-2">
                  <div className="relative rounded-2xl border border-slate-300 overflow-hidden shadow-xs bg-slate-100">
                    <canvas
                      ref={canvasRef}
                      onPointerDown={handlePointerDown}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      className="cursor-grab active:cursor-grabbing w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] touch-none block"
                    />
                    <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-md bg-black/65 text-white text-[11px] font-mono pointer-events-none">
                      Drag to pan • 600×600 px
                    </div>
                  </div>
                </div>

                {/* Sliders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200 text-xs sm:text-sm">
                  <div>
                    <div className="flex justify-between text-slate-600 mb-1.5 font-medium text-xs">
                      <span>Zoom: {Math.round(zoom * 100)}%</span>
                      <button onClick={() => setZoom(1.0)} className="text-blue-600 font-semibold hover:underline">Reset</button>
                    </div>
                    <input
                      type="range"
                      min="0.4"
                      max="2.5"
                      step="0.01"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-600 mb-1.5 font-medium text-xs">
                      <span>Rotation: {rotation.toFixed(1)}°</span>
                      <button onClick={() => setRotation(0)} className="text-blue-600 font-semibold hover:underline">0°</button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setRotation((r) => r - 90)}
                        className="p-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors"
                        title="-90°"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="range"
                        min="-15"
                        max="15"
                        step="0.2"
                        value={rotation}
                        onChange={(e) => setRotation(parseFloat(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                      <button
                        type="button"
                        onClick={() => setRotation((r) => r + 90)}
                        className="p-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors"
                        title="+90°"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Export Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3.5">
                  <button
                    type="button"
                    onClick={handleDownloadPhoto}
                    disabled={isExporting}
                    className="w-full sm:flex-1 py-3.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isExporting ? "Compressing..." : "Export Compliant 600×600 JPEG"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadPrintSheet}
                    className="w-full sm:w-auto py-3.5 px-5 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Printer className="w-4 h-4 text-slate-500" />
                    <span>4×6 Print Sheet</span>
                  </button>
                </div>

                {exportSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs sm:text-sm text-center font-medium border border-emerald-200">
                    ✓ Photo downloaded successfully! Verified strictly under 240 KB.
                  </div>
                )}

              </div>
            )}

          </div>

          {/* Right Column: Compliance Diagnostic (Cols 8-12) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs flex flex-col justify-between">
            
            <div className="space-y-5">
              
              {/* Diagnostic Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">
                  Compliance Diagnostic
                </h2>

                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  !auditReport
                    ? "bg-slate-100 text-slate-600"
                    : auditReport.overallStatus === "PASS"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : "bg-rose-100 text-rose-800 border border-rose-200"
                }`}>
                  {!auditReport ? "NO PHOTO" : auditReport.overallStatus === "PASS" ? "ALL CHECKS PASSED" : "ISSUES FOUND"}
                </span>
              </div>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Load an image to automatically run 6 critical DV-2026 eligibility checks against State Department regulations.
              </p>

              {/* 6 Key Checks Diagnostic List */}
              <div className="space-y-3">
                
                {/* 1. Dimensions & Aspect Ratio */}
                <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-start justify-between gap-3 text-xs sm:text-sm">
                  <div>
                    <div className="font-semibold text-slate-900">
                      Dimensions & Aspect Ratio
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Square 1:1 ratio. Between 600×600 px and 1200×1200 px.
                    </div>
                  </div>
                  {renderBadge(diagDims)}
                </div>

                {/* 2. File Size Limit */}
                <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-start justify-between gap-3 text-xs sm:text-sm">
                  <div>
                    <div className="font-semibold text-slate-900">
                      File Size Limit
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Must be equal to or less than 240 KB (245,760 bytes).
                    </div>
                  </div>
                  {renderBadge(diagSize)}
                </div>

                {/* 3. File Format */}
                <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-start justify-between gap-3 text-xs sm:text-sm">
                  <div>
                    <div className="font-semibold text-slate-900">
                      File Format
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Must be standard Joint Photographic Experts Group (JPEG / .jpg).
                    </div>
                  </div>
                  {renderBadge(diagFormat)}
                </div>

                {/* 4. Color Depth */}
                <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-start justify-between gap-3 text-xs sm:text-sm">
                  <div>
                    <div className="font-semibold text-slate-900">
                      Color Depth (24-bit sRGB)
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Full color sRGB. Black & white, grayscale or sepia photos are rejected.
                    </div>
                  </div>
                  {renderBadge(diagColor)}
                </div>

                {/* 5. Background Light & Contrast */}
                <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-start justify-between gap-3 text-xs sm:text-sm">
                  <div>
                    <div className="font-semibold text-slate-900">
                      Background Light & Contrast
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Must be neutral plain white or off-white with no patterns or dark shadows.
                    </div>
                  </div>
                  {renderBadge(diagBg)}
                </div>

                {/* 6. Head & Eye Alignment */}
                <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-start justify-between gap-3 text-xs sm:text-sm">
                  <div>
                    <div className="font-semibold text-slate-900">
                      Head & Eye Alignment
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Head size 50%–69% total height; eyes positioned 56%–69% from bottom.
                    </div>
                  </div>
                  {renderBadge(diagHead)}
                </div>

              </div>

            </div>

            {/* Bottom Helpful Tip Box */}
            <div className="mt-6 p-4 rounded-2xl bg-blue-50/80 border border-blue-200/90 text-xs sm:text-sm text-blue-900 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Need a fix?</strong> Use the zoom and drag controls on the inspector to match the oval & eye guidelines, then tap <strong>Export Compliant 600×600 JPEG</strong> to solve size and ratio issues automatically.
              </p>
            </div>
          </div>

        </section>

        {/* 3. Official Photo Reference Gallery (Screenshot 2) */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
          
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              Official Photo Reference Gallery
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Compare your photo with official Department of State requirements to avoid immediate entry disqualification.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 1. Compliant Ideal */}
            <div className="rounded-xl border-2 border-emerald-400/80 p-4 bg-emerald-50/20 flex flex-col justify-between">
              <div>
                <div className="flex justify-end mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-1 shadow-2xs">
                    <Check className="w-3 h-3" /> Compliant
                  </span>
                </div>

                {/* Real Photo: Ideal Compliant */}
                <div className="w-full aspect-square bg-[#ffffff] rounded-lg border border-slate-200 overflow-hidden mb-3 relative">
                  <Image
                    src="/images/reference/ref_compliant.jpg"
                    alt="Ideal Acceptance: Neutral expression, white background, square aspect, proper head proportion"
                    width={240}
                    height={240}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <div className="text-center">
                  <div className="font-bold text-xs text-slate-900">
                    Ideal Acceptance
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    Neutral expression, white background, square aspect, proper head proportion.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. No Eyeglasses */}
            <div className="rounded-xl border-2 border-rose-300 p-4 bg-rose-50/20 flex flex-col justify-between">
              <div>
                <div className="flex justify-end mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white flex items-center gap-1 shadow-2xs">
                    <X className="w-3 h-3" /> Eyeglasses
                  </span>
                </div>

                {/* Real Photo: Eyeglasses Prohibited */}
                <div className="w-full aspect-square bg-[#ffffff] rounded-lg border border-slate-200 overflow-hidden mb-3 relative">
                  <Image
                    src="/images/reference/ref_eyeglasses.jpg"
                    alt="No Eyeglasses: Eyeglasses prohibited in DV lottery photos"
                    width={240}
                    height={240}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <div className="text-center">
                  <div className="font-bold text-xs text-slate-900">
                    No Eyeglasses Allowed
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    Glasses of any kind (even prescription) are strictly prohibited in DV photos.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Dark Background */}
            <div className="rounded-xl border-2 border-rose-300 p-4 bg-rose-50/20 flex flex-col justify-between">
              <div>
                <div className="flex justify-end mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white flex items-center gap-1 shadow-2xs">
                    <X className="w-3 h-3" /> Dark Background
                  </span>
                </div>

                {/* Real Photo: Shadows & Dark Background */}
                <div className="w-full aspect-square bg-[#ffffff] rounded-lg border border-slate-200 overflow-hidden mb-3 relative">
                  <Image
                    src="/images/reference/ref_dark_background.jpg"
                    alt="Shadows & Dark Bg: Background must be plain, uniform white or light off-white"
                    width={240}
                    height={240}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <div className="text-center">
                  <div className="font-bold text-xs text-slate-900">
                    Shadows & Dark Bg
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    Background must be plain, uniform white or light off-white without cast shadows.
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Tilted Head */}
            <div className="rounded-xl border-2 border-amber-300 p-4 bg-amber-50/20 flex flex-col justify-between">
              <div>
                <div className="flex justify-end mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white flex items-center gap-1 shadow-2xs">
                    <AlertTriangle className="w-3 h-3" /> Tilted Head
                  </span>
                </div>

                {/* Real Photo: Tilted Head / Gaze */}
                <div className="w-full aspect-square bg-[#ffffff] rounded-lg border border-slate-200 overflow-hidden mb-3 relative">
                  <Image
                    src="/images/reference/ref_tilted_head.jpg"
                    alt="Tilted Head: Head must directly face camera with eyes open and looking straight forward"
                    width={240}
                    height={240}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <div className="text-center">
                  <div className="font-bold text-xs text-slate-900">
                    Tilted Head / Gaze
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    Head must directly face the camera with eyes open and looking straight forward.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </section>

        {/* 4. Essential DV-2026 Photo Requirements Checklist (Screenshot 2) */}
        <section className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-2xs space-y-6">
          
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Essential DV-2026 Photo Requirements Checklist
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Key standards enforced by consular algorithms and entry validation systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm">
            
            <div className="p-5 sm:p-6 rounded-2xl border border-slate-200/80 bg-slate-50/60 space-y-2">
              <div className="font-bold text-slate-900 text-sm sm:text-base">
                1. Recency &amp; Age
              </div>
              <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
                Must be taken within the last 6 months to reflect your current appearance. Reusing past years&apos; photos leads to auto-disqualification.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl border border-slate-200/80 bg-slate-50/60 space-y-2">
              <div className="font-bold text-slate-900 text-sm sm:text-base">
                2. Head Coverings &amp; Hats
              </div>
              <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
                Headwear is not permitted except for documented religious or medical reasons, and must not obscure any portion of the face.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl border border-slate-200/80 bg-slate-50/60 space-y-2">
              <div className="font-bold text-slate-900 text-sm sm:text-base">
                3. Expression &amp; Pose
              </div>
              <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
                Neutral facial expression with both eyes open and mouth naturally closed. Smiling widely or frowning is not permitted.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl border border-slate-200/80 bg-slate-50/60 space-y-2">
              <div className="font-bold text-slate-900 text-sm sm:text-base">
                4. Digital Retouching &amp; AI
              </div>
              <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
                Do not alter facial features, airbrush skin, or use AI filters. Digital background cutouts that leave rough halo edges can cause rejection.
              </p>
            </div>

          </div>

        </section>

        {/* 5. Spacious Companion Suite Tools Section */}
        <section className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-2xs space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-6 border-b border-slate-100">
            <div>
              <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1.5">
                Full Ecosystem Directory
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                All DV-2026 Companion Tools &amp; Features
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md">
              100% client-side privacy. Zero server transmission. Switch to any tool below:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Tool 1: Full Cropper Studio */}
            <Link 
              href="/crop" 
              className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 hover:shadow-xs transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Crop className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    Module A
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5">
                  Full Crop Studio
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Advanced multi-resolution crop (600×600 or 1200×1200), 59.5% biometric lock, and family batch queue with ZIP download.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                <span>Launch Crop Studio</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Tool 2: 12-Point Compliance Checker */}
            <Link 
              href="/checker" 
              className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 hover:shadow-xs transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    Module B
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5">
                  12-Point Compliance Audit
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  In-depth biometric audit, JPEG magic bytes verification, lighting shadow detection, and 1-click EXIF metadata stripper.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                <span>Run 12-Point Audit</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Tool 3: Eligibility Calculator */}
            <Link 
              href="/eligibility" 
              className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 hover:shadow-xs transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    Module C
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5">
                  Eligibility Calculator
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  3-step assessment for native country chargeability, cross-chargeability rules, and qualifying education or work experience.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                <span>Check Eligibility</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Tool 4: Entry Checklist */}
            <Link 
              href="/checklist" 
              className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 hover:shadow-xs transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ListTodo className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    Module D
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5">
                  Application Checklist
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  12-step preparation roadmap with persistent progress saving, exportable JSON backup, and printable format.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                <span>Open Checklist</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Tool 5: Confirmation Vault */}
            <Link 
              href="/vault" 
              className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 hover:shadow-xs transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    Module E
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5">
                  Encrypted Vault
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Store your DV confirmation number with client-side PBKDF2 + AES-GCM 256-bit encryption and printable wallet backup card.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                <span>Access Vault</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Tool 6: Photo Requirements Guide */}
            <Link 
              href="/guides/photo-requirements" 
              className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 hover:shadow-xs transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    Module F
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5">
                  Photo Specifications
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Complete illustrated State Department guidelines covering lighting, background, poses, eyeglass prohibitions, and child photos.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                <span>View Guidelines</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

          </div>
        </section>

        {/* 6. Minimal State Department Disclaimer Footer */}
        <footer className="pt-6 pb-10 text-center text-xs text-slate-400 space-y-1.5">
          <div>
            This utility is an independent verification tool built according to public U.S. Department of State photo standards.
          </div>
          <div>
            Not affiliated with or endorsed by the U.S. Government or Department of State. All image processing occurs strictly inside your browser.
          </div>
        </footer>

      </main>

      {/* Camera Capture Modal */}
      {isCameraOpen && (
        <CameraCapture
          isOpen={isCameraOpen}
          onCapture={(blob) => {
            setIsCameraOpen(false);
            handleProcessFile(blob);
          }}
          onClose={() => setIsCameraOpen(false)}
        />
      )}

    </div>
  );
}
