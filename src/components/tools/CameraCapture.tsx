"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Camera, X, RefreshCw, Sparkles, CheckCircle2, AlertTriangle } from "lucide-react";

interface CameraCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (blob: Blob) => void;
}

export function CameraCapture({ isOpen, onClose, onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isFrontCamera, setIsFrontCamera] = useState(true);

  // Start video stream
  const startCamera = useCallback(async () => {
    try {
      setErrorMessage(null);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: isFrontCamera ? 'user' : 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1920 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setHasPermission(true);
    } catch (err: any) {
      console.error('[Webcam Error]', err);
      setHasPermission(false);
      setErrorMessage('Could not access camera. Please allow camera permissions in your browser.');
    }
  }, [isFrontCamera]);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, startCamera]);

  // Capture current video frame to square Blob
  const takeSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const size = Math.min(video.videoWidth, video.videoHeight);
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Crop center square from video stream
    const sx = (video.videoWidth - size) / 2;
    const sy = (video.videoHeight - size) / 2;

    // Mirror image if front camera
    if (isFrontCamera) {
      ctx.translate(size, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          onCapture(blob);
          onClose();
        }
      },
      'image/jpeg',
      0.98
    );
  };

  const handleStartCountdown = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          takeSnapshot();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-800 text-white">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold">Live Guided DV Selfie Camera</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Viewport */}
        <div className="relative aspect-square w-full bg-black overflow-hidden flex items-center justify-center">
          <video
            ref={videoRef}
            playsInline
            muted
            className={`w-full h-full object-cover ${isFrontCamera ? '-scale-x-100' : ''}`}
          />

          {/* SVG Biometric Overlay Guides */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 600">
            {/* Crown Zone (50%-69%) */}
            <rect x="0" y="30" width="600" height="90" fill="#10B981" fillOpacity="0.08" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4 4" />
            <text x="16" y="52" fill="#10B981" fontSize="16" fontWeight="bold" fontFamily="monospace">CROWN LEVEL (50% - 69%)</text>

            {/* Cyan Eye Level Band (56%-69% from bottom => Y=186 to Y=264) */}
            <rect x="0" y="186" width="600" height="78" fill="#06B6D4" fillOpacity="0.12" stroke="#06B6D4" strokeWidth="1.5" />
            <text x="16" y="206" fill="#06B6D4" fontSize="16" fontWeight="bold" fontFamily="monospace">EYE LEVEL BAND (56% - 69%)</text>
            <line x1="0" y1="225" x2="600" y2="225" stroke="#06B6D4" strokeWidth="2" strokeDasharray="4 4" />

            {/* Chin Guide */}
            <line x1="0" y1="387" x2="600" y2="387" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4 4" />
            <text x="16" y="410" fill="#10B981" fontSize="16" fontWeight="bold" fontFamily="monospace">CHIN ALIGNMENT</text>

            {/* Vertical Center Line */}
            <line x1="300" y1="0" x2="300" y2="600" stroke="#94A3B8" strokeWidth="1" strokeDasharray="6 6" opacity="0.6" />

            {/* Silhouette Oval */}
            <ellipse cx="300" cy="225" rx="130" ry="175" fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeDasharray="8 6" opacity="0.8" />
          </svg>

          {/* Countdown Display */}
          {countdown !== null && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs">
              <span className="text-8xl font-black text-white animate-ping">
                {countdown}
              </span>
            </div>
          )}

          {/* Error display if camera denied */}
          {errorMessage && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950 text-white">
              <AlertTriangle className="w-12 h-12 text-amber-500 mb-3" />
              <p className="text-sm font-semibold">{errorMessage}</p>
              <button
                type="button"
                onClick={startCamera}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700"
              >
                Retry Camera Access
              </button>
            </div>
          )}
        </div>

        {/* Live Tips Banner */}
        <div className="px-6 py-2.5 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
          <span>Stand 3-4 feet in front of a white wall with direct, shadow-free light.</span>
          <button
            type="button"
            onClick={() => setIsFrontCamera(!isFrontCamera)}
            className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
          >
            <RefreshCw className="w-3 h-3" /> Flip Camera
          </button>
        </div>

        {/* Controls Footer */}
        <div className="px-6 py-4 flex items-center justify-center gap-4 bg-slate-900 border-t border-slate-800">
          <button
            type="button"
            onClick={takeSnapshot}
            disabled={countdown !== null || !hasPermission}
            className="px-6 py-3 rounded-2xl text-sm font-bold bg-white text-slate-950 hover:bg-slate-200 transition-colors shadow-lg disabled:opacity-50"
          >
            Instant Snap
          </button>

          <button
            type="button"
            onClick={handleStartCountdown}
            disabled={countdown !== null || !hasPermission}
            className="px-6 py-3 rounded-2xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25 flex items-center gap-2 disabled:opacity-50"
          >
            <Camera className="w-4 h-4" />
            <span>3s Timer Snap</span>
          </button>
        </div>

      </div>
    </div>
  );
}

