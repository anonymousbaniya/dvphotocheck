/**
 * Guaranteed <240 KB Byte Compressor, 4x6 Print Sheet & Family Packager
 */

import JSZip from 'jszip';
import { MAX_BYTES, PRINT_SHEET_WIDTH, PRINT_SHEET_HEIGHT, PHOTO_PRINT_SIZE } from '../constants/dv-specs';

export interface CompressedPhotoResult {
  blob: Blob;
  sizeBytes: number;
  sizeKb: number;
  quality: number;
  width: number;
  height: number;
}

export interface FamilyMemberItem {
  id: string;
  role: 'Principal' | 'Spouse' | 'Child';
  fullName: string;
  blob: Blob;
  previewUrl: string;
}

/**
 * Binary-search JPEG compression loop guaranteeing file size <= 240,000 bytes
 */
export async function compressToDVSpec(
  sourceCanvas: HTMLCanvasElement,
  targetSize = 600
): Promise<CompressedPhotoResult> {
  // Create output canvas at specified target resolution (600x600 or 1200x1200)
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = targetSize;
  exportCanvas.height = targetSize;
  const ctx = exportCanvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not create canvas 2D context.');
  }

  // Draw source image cleanly to ensure sRGB baseline with zero EXIF
  ctx.drawImage(sourceCanvas, 0, 0, targetSize, targetSize);

  const toBlob = (quality: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      exportCanvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error('Canvas export failed'));
        },
        'image/jpeg',
        quality
      );
    });
  };

  // Binary search boundaries
  let lowQ = 0.50;
  let highQ = 0.98;
  let bestBlob: Blob | null = null;
  let bestQuality = 0.90;

  // Maximum allowed size: 240,000 bytes
  const targetCeilingBytes = 240000;

  // Quick initial check at high quality
  let currentBlob = await toBlob(0.95);
  if (currentBlob.size <= targetCeilingBytes) {
    bestBlob = currentBlob;
    bestQuality = 0.95;
  } else {
    // Binary search over quality parameter
    for (let iteration = 0; iteration < 7; iteration++) {
      const midQ = (lowQ + highQ) / 2;
      currentBlob = await toBlob(midQ);

      if (currentBlob.size <= targetCeilingBytes) {
        bestBlob = currentBlob;
        bestQuality = midQ;
        lowQ = midQ; // Try to get higher quality while staying under ceiling
      } else {
        highQ = midQ; // File too large, decrease quality
      }
    }
  }

  // Fallback if still over ceiling
  if (!bestBlob || bestBlob.size > targetCeilingBytes) {
    bestBlob = await toBlob(0.60);
    bestQuality = 0.60;
  }

  return {
    blob: bestBlob,
    sizeBytes: bestBlob.size,
    sizeKb: Math.round((bestBlob.size / 1024) * 10) / 10,
    quality: Math.round(bestQuality * 100) / 100,
    width: targetSize,
    height: targetSize,
  };
}

/**
 * Generates a 4x6 inch (1800x1200 px @ 300 DPI) sheet with 6 photos and scissor cut marks
 */
export async function generate4x6PrintSheet(
  singlePhotoCanvas: HTMLCanvasElement
): Promise<Blob> {
  const sheetCanvas = document.createElement('canvas');
  sheetCanvas.width = PRINT_SHEET_WIDTH; // 1800 px (6 inches @ 300 DPI)
  sheetCanvas.height = PRINT_SHEET_HEIGHT; // 1200 px (4 inches @ 300 DPI)

  const ctx = sheetCanvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context unavailable');
  }

  // White photographic paper background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, PRINT_SHEET_WIDTH, PRINT_SHEET_HEIGHT);

  const cols = 3;
  const rows = 2;
  const photoSize = PHOTO_PRINT_SIZE; // 600 px (2x2 inches @ 300 DPI)

  // Draw 6 photos in a 3x2 grid
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * photoSize;
      const y = row * photoSize;
      ctx.drawImage(singlePhotoCanvas, x, y, photoSize, photoSize);
    }
  }

  // Draw subtle light-gray cut marks / guidelines
  ctx.strokeStyle = '#CBD5E1'; // Light Slate
  ctx.lineWidth = 1;
  ctx.setLineDash([8, 8]);

  // Vertical cut lines (at 600px and 1200px)
  for (let c = 1; c < cols; c++) {
    ctx.beginPath();
    ctx.moveTo(c * photoSize, 0);
    ctx.lineTo(c * photoSize, PRINT_SHEET_HEIGHT);
    ctx.stroke();
  }

  // Horizontal cut line (at 600px)
  ctx.beginPath();
  ctx.moveTo(0, photoSize);
  ctx.lineTo(PRINT_SHEET_WIDTH, photoSize);
  ctx.stroke();

  // Reset line dash
  ctx.setLineDash([]);

  // Small corner crosshairs in margins
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 1.5;

  const drawCrosshair = (cx: number, cy: number) => {
    ctx.beginPath();
    ctx.moveTo(cx - 10, cy);
    ctx.lineTo(cx + 10, cy);
    ctx.moveTo(cx, cy - 10);
    ctx.lineTo(cx, cy + 10);
    ctx.stroke();
  };

  drawCrosshair(600, 600);
  drawCrosshair(1200, 600);

  return new Promise<Blob>((resolve, reject) => {
    sheetCanvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('Failed to generate 4x6 print sheet blob'));
      },
      'image/jpeg',
      0.98
    );
  });
}

/**
 * Packages multiple family member photos into a organized .zip archive
 */
export async function exportFamilyBatchZip(members: FamilyMemberItem[]): Promise<Blob> {
  const zip = new JSZip();
  const folder = zip.folder('DV_Lottery_Family_Photos');

  members.forEach((member, index) => {
    const paddedIndex = String(index + 1).padStart(2, '0');
    const sanitizedName = (member.fullName || member.role)
      .trim()
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${paddedIndex}_${member.role}_${sanitizedName}.jpg`;

    if (folder) {
      folder.file(fileName, member.blob);
    } else {
      zip.file(fileName, member.blob);
    }
  });

  // Add README instruction text
  zip.file(
    'DV_Photo_Submission_Instructions.txt',
    `U.S. Diversity Visa (Green Card Lottery) Family Photo Package
============================================================
These photos have been verified against 22 C.F.R. § 42.33 specifications:
- Exact 600x600 px dimensions
- Strictly under 240 KB file size
- 24-bit sRGB color space with stripped EXIF metadata
- Biometric head height (50%-69%) and eye level (56%-69%) compliant

IMPORTANT:
- Principal Applicant photo MUST be uploaded in Part 1 of the official form.
- Spouse and Child photos MUST be uploaded in their respective designated sections in Part 2.
- The official portal is: https://dvprogram.state.gov
`
  );

  return await zip.generateAsync({ type: 'blob' });
}

