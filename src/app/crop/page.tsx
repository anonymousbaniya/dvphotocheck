"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Upload, 
  Camera, 
  Sparkles, 
  RotateCw, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  Printer, 
  Users, 
  RefreshCw, 
  CheckCircle2, 
  ShieldCheck, 
  Sliders, 
  SlidersHorizontal,
  ArrowRight,
  Eye,
  Scan,
  Maximize2,
  Trash2,
  Plus
} from "lucide-react";
import confetti from "canvas-confetti";
import { convertToStandardImage, type NormalizedImageResult } from "@/lib/image/heic-converter";
import { calculateAutoCrop, type AutoCropTransform } from "@/lib/image/auto-crop";
import { applyBackgroundLightener } from "@/lib/image/bg-lightener";
import { 
  compressToDVSpec, 
  generate4x6PrintSheet, 
  exportFamilyBatchZip,
  type CompressedPhotoResult,
  type FamilyMemberItem
} from "@/lib/image/exporter";
import { CameraCapture } from "@/components/tools/CameraCapture";
import { cn } from "@/lib/utils";

export default function CropStudioPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Ingestion State
  const [imageResult, setImageResult] = useState<NormalizedImageResult | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isAutoAligning, setIsAutoAligning] = useState(false);
  const [alignSuccess, setAlignSuccess] = useState(false);

  // Target Export Canvas Dimensions (600x600 or 1200x1200)
  const [targetSize, setTargetSize] = useState<600 | 1200>(600);

  // Transformation Matrix State
  const [zoom, setZoom] = useState(1.0);
  const [rotation, setRotation] = useState(0); // in degrees
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);

  // Mouse & Touch Pan Interaction State
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Overlays & Image Enhancement Controls
  const [showGuides, setShowGuides] = useState(true);
  const [showOval, setShowOval] = useState(true);
  const [enableBgLightener, setEnableBgLightener] = useState(false);
  const [lumaThreshold, setLumaThreshold] = useState(215);

  // Export Stats
  const [compressedResult, setCompressedResult] = useState<CompressedPhotoResult | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Family Batch Queue State
  const [isFamilyDrawerOpen, setIsFamilyDrawerOpen] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberItem[]>([]);
  const [selectedRole, setSelectedRole] = useState<'Principal' | 'Spouse' | 'Child'>('Principal');
  const [memberName, setMemberName] = useState('');

  // Process File Ingestion
  const handleProcessFile = useCallback(async (file: File | Blob) => {
    try {
      const normalized = await convertToStandardImage(file);
      setImageResult(normalized);
      setAlignSuccess(false);

      // Default initial fit: center image on 600x600 canvas
      const w = normalized.width;
      const h = normalized.height;
      const initialScale = Math.min(600 / w, 600 / h);
      setZoom(initialScale);
      setRotation(0);
      setPanX((600 - w * initialScale) / 2);
      setPanY((600 - h * initialScale) / 2);
    } catch (err: any) {
      alert(err?.message || "Failed to load image");
    }
  }, []);

  // Check for image passed from Checker or elsewhere on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const transferredData = sessionStorage.getItem("dv_photo_transfer");
      if (transferredData) {
        sessionStorage.removeItem("dv_photo_transfer");
        fetch(transferredData)
          .then((res) => res.blob())
          .then((blob) => {
            handleProcessFile(blob);
          })
          .catch((e) => console.warn("Failed to load transferred photo:", e));
      }
    }
  }, [handleProcessFile]);

  // 1-Click AI Auto-Crop Execution
  const handleAutoAlign = async () => {
    if (!imageResult?.image) return;
    setIsAutoAligning(true);
    setAlignSuccess(false);

    try {
      const result = await calculateAutoCrop(imageResult.image, targetSize);
      if (result) {
        setRotation(result.rotationDegrees);
        setZoom(result.scale);
        setPanX(result.panX);
        setPanY(result.panY);
        setAlignSuccess(true);

        // Confetti celebration for successful biometric lock
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#2563EB', '#10B981', '#38BDF8'],
        });
      } else {
        alert("Could not detect facial landmarks clearly. Please ensure face is well-lit and directly facing the camera.");
      }
    } catch (err) {
      console.error("[Auto-Crop Error]", err);
      alert("AI Auto-Crop failed. You can adjust using the manual controls.");
    } finally {
      setIsAutoAligning(false);
    }
  };

  // Render Canvas
  const renderCanvas = useCallback(() => {
    if (!canvasRef.current || !imageResult?.image) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imageResult.image;
    const size = targetSize;
    canvas.width = size;
    canvas.height = size;

    // Clear background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);

    // Apply affine transform: Translate -> Rotate around center -> Scale
    ctx.save();
    ctx.translate(panX, panY);

    // Rotation around subject center
    const imgCenterX = (img.naturalWidth || img.width) / 2;
    const imgCenterY = (img.naturalHeight || img.height) / 2;

    ctx.translate(imgCenterX * zoom, imgCenterY * zoom);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-imgCenterX * zoom, -imgCenterY * zoom);

    ctx.drawImage(
      img,
      0,
      0,
      (img.naturalWidth || img.width) * zoom,
      (img.naturalHeight || img.height) * zoom
    );
    ctx.restore();

    // Apply Background Exposure Lightener if active
    if (enableBgLightener) {
      applyBackgroundLightener(ctx, size, size, {
        lumaThreshold,
        maxSaturation: 0.16,
        featherStrength: 0.9,
      });
    }

    // Update real-time export compression stats in background
    compressToDVSpec(canvas, targetSize)
      .then((res) => setCompressedResult(res))
      .catch(() => {});
  }, [imageResult, targetSize, zoom, rotation, panX, panY, enableBgLightener, lumaThreshold]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Touch & Mouse Drag Handlers
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
  };

  // Single Photo JPEG Download
  const handleDownloadSingle = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    try {
      const res = await compressToDVSpec(canvasRef.current, targetSize);
      const url = URL.createObjectURL(res.blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `DV_Lottery_Photo_${targetSize}x${targetSize}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Failed to export photo");
    } finally {
      setIsExporting(false);
    }
  };

  // 4x6 Printable Sheet Download
  const handleDownloadPrintSheet = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    try {
      const sheetBlob = await generate4x6PrintSheet(canvasRef.current);
      const url = URL.createObjectURL(sheetBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'DV_Lottery_4x6_Print_Sheet_300DPI.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Failed to generate 4x6 print sheet");
    } finally {
      setIsExporting(false);
    }
  };

  // Add to Family Queue
  const handleAddToFamilyQueue = async () => {
    if (!canvasRef.current) return;
    try {
      const res = await compressToDVSpec(canvasRef.current, 600);
      const previewUrl = URL.createObjectURL(res.blob);
      const newMember: FamilyMemberItem = {
        id: Math.random().toString(36).substring(2, 9),
        role: selectedRole,
        fullName: memberName.trim() || `${selectedRole}_${familyMembers.length + 1}`,
        blob: res.blob,
        previewUrl,
      };

      setFamilyMembers((prev) => [...prev, newMember]);
      setMemberName('');
      setIsFamilyDrawerOpen(true);
    } catch (e) {
      alert("Failed to queue family photo");
    }
  };

  // Download All Family ZIP
  const handleDownloadFamilyZip = async () => {
    if (familyMembers.length === 0) return;
    setIsExporting(true);
    try {
      const zipBlob = await exportFamilyBatchZip(familyMembers);
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'DV_Lottery_Family_Photos.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Failed to create family ZIP");
    } finally {
      setIsExporting(false);
    }
  };

  // Send Cropped Result to Checker
  const handleSendToChecker = async () => {
    if (!canvasRef.current) return;
    try {
      const res = await compressToDVSpec(canvasRef.current, targetSize);
      const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.98);
      sessionStorage.setItem('dv_photo_transfer', dataUrl);
      router.push('/checker');
    } catch {
      router.push('/checker');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Module A • AI Studio
            </span>
            <span className="text-xs text-slate-500 font-mono">1-Click 59.5% Biometric Lock</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            AI Photo Crop &amp; Alignment Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Detects head and eye geometry, counter-rotates head tilt to 0°, and formats to exact U.S. visa dimensions.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsFamilyDrawerOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 border border-slate-200 dark:border-slate-700"
          >
            <Users className="w-3.5 h-3.5 text-blue-500" />
            <span>Family Packager ({familyMembers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCameraOpen(true)}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Take Photo with Camera</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Canvas Studio (Cols 1-7) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Main Visual Canvas Container */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-3">
            
            {/* Resolution Selector & Status Bar */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2 font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {targetSize} × {targetSize} CANVAS
                </span>
                {alignSuccess && (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    AI Biometrics Locked
                  </span>
                )}
              </div>

              {/* Resolution Toggle */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setTargetSize(600)}
                  className={cn(
                    "px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all",
                    targetSize === 600
                      ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  600 × 600 (Standard)
                </button>
                <button
                  type="button"
                  onClick={() => setTargetSize(1200)}
                  className={cn(
                    "px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all",
                    targetSize === 1200
                      ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  1200 × 1200 (HD)
                </button>
              </div>
            </div>

            {/* Interactive Viewport Canvas */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-300 dark:border-slate-800 flex items-center justify-center select-none">
              
              {imageResult ? (
                <>
                  <canvas
                    ref={canvasRef}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    className="w-full h-full object-contain cursor-grab active:cursor-grabbing canvas-interactive"
                  />

                  {/* SVG Biometric Overlays */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 600">
                    {showGuides && (
                      <>
                        {/* Crown Level Band (Y=30 to Y=120) */}
                        <rect x="0" y="30" width="600" height="90" fill="#10B981" fillOpacity="0.08" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4 4" />
                        <text x="12" y="50" fill="#10B981" fontSize="16" fontWeight="bold" fontFamily="monospace">CROWN ZONE (50% - 69%)</text>

                        {/* Cyan Eye Level Band (Y=186 to Y=264) */}
                        <rect x="0" y="186" width="600" height="78" fill="#06B6D4" fillOpacity="0.12" stroke="#06B6D4" strokeWidth="1.5" />
                        <text x="12" y="206" fill="#06B6D4" fontSize="16" fontWeight="bold" fontFamily="monospace">EYE LEVEL BAND (56% - 69%)</text>
                        <line x1="0" y1="225" x2="600" y2="225" stroke="#06B6D4" strokeWidth="2" strokeDasharray="3 3" />
                        <text x="440" y="220" fill="#06B6D4" fontSize="14" fontFamily="monospace">Sweet Spot Y=225</text>

                        {/* Chin Level Indicator (Y=387, for 357px sweet spot) */}
                        <line x1="0" y1="387" x2="600" y2="387" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4 4" />
                        <text x="12" y="410" fill="#10B981" fontSize="16" fontWeight="bold" fontFamily="monospace">CHIN LEVEL (59.5% HEAD HEIGHT)</text>

                        {/* Dashed Vertical Center Axis */}
                        <line x1="300" y1="0" x2="300" y2="600" stroke="#94A3B8" strokeWidth="1" strokeDasharray="6 6" opacity="0.7" />
                      </>
                    )}

                    {showOval && (
                      <ellipse cx="300" cy="225" rx="130" ry="175" fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeDasharray="8 6" opacity="0.85" />
                    )}
                  </svg>
                </>
              ) : (
                /* Empty Dropzone State */
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center p-8 text-center cursor-pointer group space-y-3"
                >
                  <div className="w-16 h-16 rounded-2xl bg-blue-950/80 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Click or Drop Photo to Begin</p>
                    <p className="text-xs text-slate-400 mt-1">Accepts JPG, PNG, Apple HEIC, and WebP</p>
                  </div>
                </div>
              )}
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleProcessFile(e.target.files[0]);
                }
              }}
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
              className="hidden"
            />

            {/* Canvas Footer Guidance */}
            <div className="pt-1 flex flex-wrap items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>Drag canvas with mouse/touch to pan</span>
              <span>Head Oval: 50% - 69% | Eyes: 56% - 69%</span>
            </div>

          </div>

          {/* Quick Overlay Toggles */}
          <div className="flex items-center gap-3 text-xs">
            <button
              type="button"
              onClick={() => setShowGuides(!showGuides)}
              className={cn(
                "px-3 py-1.5 rounded-xl border font-semibold transition-all text-xs",
                showGuides
                  ? "bg-blue-50 dark:bg-blue-950/80 border-blue-500 text-blue-700 dark:text-blue-300"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
              )}
            >
              Toggle Measurement Lines
            </button>

            <button
              type="button"
              onClick={() => setShowOval(!showOval)}
              className={cn(
                "px-3 py-1.5 rounded-xl border font-semibold transition-all text-xs",
                showOval
                  ? "bg-blue-50 dark:bg-blue-950/80 border-blue-500 text-blue-700 dark:text-blue-300"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
              )}
            >
              Toggle Official Head Oval
            </button>
          </div>

        </div>

        {/* Right Side: Tools & Export Controls (Cols 8-12) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 1. Primary AI Alignment Action Box */}
          <div className="p-5 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/20 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold">1-Click AI Biometric Auto-Align</h3>
                <p className="text-[11px] text-blue-100">Solves head height (59.5%), eye band (62.5%), &amp; 0° tilt</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAutoAlign}
              disabled={!imageResult || isAutoAligning}
              className="w-full py-3.5 px-4 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-black text-sm shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isAutoAligning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Aligning Landmarks...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Auto-Align &amp; Crop to Spec</span>
                </>
              )}
            </button>
          </div>

          {/* 2. Manual Fine-Tuning Controls */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-blue-500" />
              Manual Fine-Tuning
            </h3>

            {/* Zoom Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <ZoomIn className="w-3.5 h-3.5" /> Zoom Scale
                </span>
                <span className="font-mono text-blue-600 dark:text-blue-400">
                  {zoom.toFixed(2)}x
                </span>
              </div>
              <input
                type="range"
                min="0.3"
                max="3.0"
                step="0.01"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            {/* Fine Rotation Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <RotateCw className="w-3.5 h-3.5" /> Head Level Rotation
                </span>
                <span className="font-mono text-blue-600 dark:text-blue-400">
                  {rotation.toFixed(1)}°
                </span>
              </div>
              <input
                type="range"
                min="-15"
                max="15"
                step="0.1"
                value={rotation}
                onChange={(e) => setRotation(parseFloat(e.target.value))}
                className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            {/* Quick 90-degree rotate & reset buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setRotation((r) => r - 90)}
                className="flex-1 py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> 90° Left
              </button>

              <button
                type="button"
                onClick={() => setRotation((r) => r + 90)}
                className="flex-1 py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1"
              >
                <RotateCw className="w-3 h-3" /> 90° Right
              </button>

              <button
                type="button"
                onClick={() => {
                  setZoom(1.0);
                  setRotation(0);
                  setPanX(0);
                  setPanY(0);
                }}
                className="py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Reset
              </button>
            </div>

            {/* 3. Smart Edge-Preserving White Background Lightener */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableBgLightener}
                  onChange={(e) => setEnableBgLightener(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded-md focus:ring-blue-500"
                />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Smart Edge-Preserving White Background Lightener
                </span>
              </label>

              {enableBgLightener && (
                <div className="space-y-1 pl-6 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Luminance Threshold</span>
                    <span>{lumaThreshold} / 255</span>
                  </div>
                  <input
                    type="range"
                    min="195"
                    max="245"
                    step="1"
                    value={lumaThreshold}
                    onChange={(e) => setLumaThreshold(parseInt(e.target.value, 10))}
                    className="w-full accent-blue-600 h-1 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Shifts off-white walls to pure #FFFFFF while preserving hair and collar edges.
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* 4. Export & Download Suite */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            
            {/* Live Size & Resolution Preview Pill */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">OUTPUT TARGET:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {targetSize} × {targetSize} px (1:1)
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px]">ESTIMATED FILE SIZE:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {compressedResult?.sizeKb || 184} KB &lt; 240 KB (PASS)
                </span>
              </div>
            </div>

            {/* Primary Action: Download Single Digital Photo */}
            <button
              type="button"
              onClick={handleDownloadSingle}
              disabled={!imageResult || isExporting}
              className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download DV Photo ({targetSize}×{targetSize} JPEG)</span>
            </button>

            {/* Secondary Action: Download 4x6 Printable Sheet (6 Photos) */}
            <button
              type="button"
              onClick={handleDownloadPrintSheet}
              disabled={!imageResult || isExporting}
              className="w-full py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Printer className="w-4 h-4 text-blue-500" />
              <span>Download 4×6&quot; Print Sheet (6 Photos @ 300 DPI)</span>
            </button>

            {/* Add to Family Queue & Verify Links */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={handleAddToFamilyQueue}
                disabled={!imageResult}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5 text-blue-500" />
                <span>Queue in Family Pack</span>
              </button>

              <button
                type="button"
                onClick={handleSendToChecker}
                disabled={!imageResult}
                className="py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
              >
                <span>Verify in Checker</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Live Guided Selfie Webcam Modal */}
      <CameraCapture
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(blob) => handleProcessFile(blob)}
      />

      {/* Family Queue Drawer Modal */}
      {isFamilyDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Family Batch Photo Packager
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFamilyDrawerOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-semibold"
              >
                Close
              </button>
            </div>

            {/* Add Member Form */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Queue Current Photo As:
              </p>

              <div className="grid grid-cols-3 gap-2 text-xs">
                {(['Principal', 'Spouse', 'Child'] as const).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={cn(
                      "py-2 px-3 rounded-xl border text-xs font-semibold transition-all",
                      selectedRole === role
                        ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
                    )}
                  >
                    {role}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Applicant Full Name (e.g. John Doe)"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddToFamilyQueue}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Save Photo
                </button>
              </div>
            </div>

            {/* Queued Roster */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Queued Members ({familyMembers.length})
              </p>

              {familyMembers.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-4 text-center">
                  No family photos queued yet. Crop a photo and click &quot;Save Photo&quot;.
                </p>
              ) : (
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {familyMembers.map((m, idx) => (
                    <div
                      key={m.id}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={m.previewUrl}
                          alt={m.fullName}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-300 dark:border-slate-700"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {idx + 1}. {m.fullName}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            Role: {m.role} • 600×600 JPEG
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setFamilyMembers((prev) => prev.filter((item) => item.id !== m.id));
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                        aria-label="Remove family member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Download ZIP Action */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setFamilyMembers([])}
                className="text-xs text-slate-400 hover:text-red-500"
              >
                Clear Queue
              </button>

              <button
                type="button"
                onClick={handleDownloadFamilyZip}
                disabled={familyMembers.length === 0 || isExporting}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-2 shadow-md shadow-blue-500/20 disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download All as Family ZIP (.zip)</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
