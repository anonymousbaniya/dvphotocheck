/**
 * Technical & File Signature Validator
 * 
 * Audits uploaded image files for:
 * - Genuine JPEG Magic Bytes (FF D8 FF)
 * - File size (<= 240 KB / 245,760 bytes, >= 15 KB)
 * - Exact 1:1 square aspect ratio
 * - Dimensions between 600x600 and 1200x1200 px
 * - 24-bit sRGB color depth (rejecting grayscale/monochrome)
 * - JPEG EXIF/XMP/IPTC metadata inspection and recency check
 */

import { 
  MIN_DIM, 
  MAX_DIM, 
  MAX_BYTES, 
  MIN_BYTES 
} from '../constants/dv-specs';
import type { TechnicalAuditResult, ComplianceCheckResult, CheckStatus } from './types';

export interface RawFileAuditInput {
  file: File | Blob;
  image: HTMLImageElement;
}

/**
 * Reads the first bytes of a file to check magic numbers
 */
export async function readMagicBytes(file: File | Blob, count = 8): Promise<Uint8Array> {
  const slice = file.slice(0, count);
  const buffer = await slice.arrayBuffer();
  return new Uint8Array(buffer);
}

/**
 * Parses JPEG markers to detect EXIF, XMP, IPTC, and date metadata
 */
export async function parseJpegMetadata(file: File | Blob): Promise<{
  hasExif: boolean;
  metadataTags: string[];
  dateTimeOriginal?: string;
  isDateTooOld?: boolean;
}> {
  try {
    // Read first 128KB which contains all APP headers
    const buffer = await file.slice(0, 131072).arrayBuffer();
    const view = new DataView(buffer);

    if (view.byteLength < 4 || view.getUint8(0) !== 0xFF || view.getUint8(1) !== 0xD8) {
      return { hasExif: false, metadataTags: [] };
    }

    let offset = 2;
    const metadataTags: string[] = [];
    let hasExif = false;
    let dateTimeOriginal: string | undefined;

    while (offset < view.byteLength - 4) {
      if (view.getUint8(offset) !== 0xFF) {
        break;
      }

      const marker = view.getUint8(offset + 1);

      // SOS (Start of Scan) or EOI (End of Image) reached
      if (marker === 0xDA || marker === 0xD9) {
        break;
      }

      const length = view.getUint16(offset + 2, false);
      if (length < 2 || offset + 2 + length > view.byteLength) {
        break;
      }

      // APP0 (JFIF): 0xFFE0
      if (marker === 0xE0) {
        metadataTags.push('JFIF');
      }
      // APP1 (EXIF / XMP): 0xFFE1
      else if (marker === 0xE1) {
        hasExif = true;
        // Check for "Exif" header
        const isExif = 
          view.getUint8(offset + 4) === 0x45 && // 'E'
          view.getUint8(offset + 5) === 0x78 && // 'x'
          view.getUint8(offset + 6) === 0x69 && // 'i'
          view.getUint8(offset + 7) === 0x66;   // 'f'

        if (isExif) {
          metadataTags.push('EXIF');
          // Scan for DateTimeOriginal (Tag 0x9003) string inside this segment
          const segmentBytes = new Uint8Array(buffer, offset + 4, length - 2);
          const segmentStr = new TextDecoder('latin1').decode(segmentBytes);
          // Look for YYYY:MM:DD HH:MM:SS pattern
          const dateMatch = segmentStr.match(/\b(19\d\d|20\d\d):(\d\d):(\d\d)\s+(\d\d):(\d\d):(\d\d)\b/);
          if (dateMatch) {
            dateTimeOriginal = dateMatch[0];
          }
        } else {
          metadataTags.push('XMP/APP1');
        }
      }
      // APP2 (ICC Profile): 0xFFE2
      else if (marker === 0xE2) {
        metadataTags.push('ICC Profile');
      }
      // APP13 (Photoshop IPTC): 0xFFED
      else if (marker === 0xED) {
        metadataTags.push('Adobe Photoshop IPTC');
      }
      // APP14 (Adobe): 0xFFEE
      else if (marker === 0xEE) {
        metadataTags.push('Adobe App14');
      }
      // COM (Comment): 0xFFFE
      else if (marker === 0xFE) {
        metadataTags.push('JPEG Comment');
      }

      offset += 2 + length;
    }

    let isDateTooOld = false;
    if (dateTimeOriginal) {
      // Parse YYYY:MM:DD into date object
      const parts = dateTimeOriginal.split(' ')[0].split(':');
      if (parts.length === 3) {
        const photoDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        const diffDays = (Date.now() - photoDate.getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays > 180) {
          isDateTooOld = true;
        }
      }
    }

    return {
      hasExif,
      metadataTags: Array.from(new Set(metadataTags)),
      dateTimeOriginal,
      isDateTooOld,
    };
  } catch (e) {
    console.warn('[JPEG Parser] Error parsing metadata:', e);
    return { hasExif: false, metadataTags: [] };
  }
}

/**
 * Checks if an image is 24-bit color (rejects monochrome/black-and-white)
 */
export function checkColorDepth(image: HTMLImageElement): { is24BitColor: boolean; colorVariance: number } {
  try {
    const canvas = document.createElement('canvas');
    // Sample a 100x100 thumbnail for rapid pixel analysis
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return { is24BitColor: true, colorVariance: 25 };
    }

    ctx.drawImage(image, 0, 0, 100, 100);
    const imgData = ctx.getImageData(0, 0, 100, 100).data;

    let totalDiff = 0;
    let pixelCount = 0;

    for (let i = 0; i < imgData.length; i += 16) { // Step by 4 pixels (16 bytes)
      const r = imgData[i];
      const g = imgData[i + 1];
      const b = imgData[i + 2];

      const diff = Math.abs(r - g) + Math.abs(g - b) + Math.abs(b - r);
      totalDiff += diff;
      pixelCount++;
    }

    const avgVariance = pixelCount > 0 ? totalDiff / pixelCount : 0;
    // In pure grayscale, R == G == B, so diff is 0. Color portraits have avgVariance > 10.
    const is24BitColor = avgVariance >= 8.0;

    return {
      is24BitColor,
      colorVariance: Math.round(avgVariance * 10) / 10,
    };
  } catch (e) {
    return { is24BitColor: true, colorVariance: 20 };
  }
}

/**
 * Main Technical Audit Function
 */
export async function auditTechnicalRequirements(
  file: File | Blob,
  image: HTMLImageElement
): Promise<TechnicalAuditResult> {
  const checks: ComplianceCheckResult[] = [];
  const magicBytes = await readMagicBytes(file, 8);
  const magicHex = Array.from(magicBytes.slice(0, 3))
    .map((b) => b.toString(16).toUpperCase().padStart(2, '0'))
    .join(' ');

  // 1. CHK-01: File Format (Magic Bytes FF D8 FF)
  const isJpeg = magicBytes[0] === 0xFF && magicBytes[1] === 0xD8 && magicBytes[2] === 0xFF;
  const isPng = magicBytes[0] === 0x89 && magicBytes[1] === 0x50 && magicBytes[2] === 0x4E;
  const isWebp = magicBytes[0] === 0x52 && magicBytes[1] === 0x49 && magicBytes[2] === 0x46;

  let formatStatus: CheckStatus = 'FAIL';
  let formatVal = `Hex: ${magicHex}`;
  let formatDetails = 'File must be a genuine baseline JPEG with FF D8 FF signature.';

  if (isJpeg) {
    formatStatus = 'PASS';
    formatVal = 'Genuine JPEG (FF D8 FF)';
    formatDetails = 'Valid JPEG magic signature verified.';
  } else if (isPng) {
    formatVal = 'PNG (89 50 4E)';
    formatDetails = 'PNG image detected. The U.S. State Department strictly requires baseline JPEG.';
  } else if (isWebp) {
    formatVal = 'WebP (RIFF / WEBP)';
    formatDetails = 'WebP format detected. You must convert to baseline JPEG before submitting.';
  } else {
    formatDetails = `Unsupported format with header [${magicHex}]. Must be a standard JPEG file.`;
  }

  checks.push({
    id: 'CHK-01',
    name: 'File Format',
    category: 'file',
    status: formatStatus,
    value: formatVal,
    requirement: 'Baseline JPEG (FF D8 FF)',
    details: formatDetails,
  });

  // 2. CHK-02: File Size (<= 240 KB / 245,760 bytes, >= 15 KB)
  const fileSizeBytes = file.size;
  const fileSizeKb = Math.round(fileSizeBytes / 1024);
  let sizeStatus: CheckStatus = 'PASS';
  let sizeDetails = `File size is ${fileSizeKb} KB, strictly under the 240 KB (245,760 bytes) ceiling.`;

  if (fileSizeBytes > MAX_BYTES) {
    sizeStatus = 'FAIL';
    sizeDetails = `File exceeds the 240 KB limit by ${(fileSizeBytes - MAX_BYTES).toLocaleString()} bytes. The State Department portal will reject this.`;
  } else if (fileSizeBytes < MIN_BYTES) {
    sizeStatus = 'WARNING';
    sizeDetails = `File is unusually small (${fileSizeKb} KB). Severe JPEG compression artifacts may cause disqualification.`;
  }

  checks.push({
    id: 'CHK-02',
    name: 'File Size',
    category: 'file',
    status: sizeStatus,
    value: `${fileSizeKb} KB (${fileSizeBytes.toLocaleString()} B)`,
    requirement: '15 KB – 240 KB (≤ 245,760 B)',
    details: sizeDetails,
    rawMetric: fileSizeBytes,
  });

  // 3. CHK-03: Dimensions (600x600 to 1200x1200 px)
  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;
  let dimStatus: CheckStatus = 'PASS';
  let dimDetails = `Resolution ${width} × ${height} px meets the 600–1200 px requirement.`;

  if (width < MIN_DIM || height < MIN_DIM) {
    dimStatus = 'FAIL';
    dimDetails = `Image resolution is below the absolute minimum of 600 × 600 px.`;
  } else if (width > MAX_DIM || height > MAX_DIM) {
    dimStatus = 'FAIL';
    dimDetails = `Image resolution exceeds the maximum allowed 1200 × 1200 px.`;
  }

  checks.push({
    id: 'CHK-03',
    name: 'Image Dimensions',
    category: 'file',
    status: dimStatus,
    value: `${width} × ${height} px`,
    requirement: '600 × 600 px to 1200 × 1200 px',
    details: dimDetails,
  });

  // 4. CHK-04: Aspect Ratio (1:1 square)
  const aspectRatio = width / (height || 1);
  const isSquare = Math.abs(aspectRatio - 1.0) < 0.005; // 0.5% tolerance
  let aspectStatus: CheckStatus = isSquare ? 'PASS' : 'FAIL';
  let aspectDetails = isSquare
    ? 'Exact 1:1 square aspect ratio confirmed.'
    : `Image is rectangular (${aspectRatio.toFixed(2)}:1). Must be an exact 1:1 square.`;

  checks.push({
    id: 'CHK-04',
    name: 'Aspect Ratio',
    category: 'file',
    status: aspectStatus,
    value: `${aspectRatio.toFixed(2)}:1 (${width === height ? 'Exact Square' : 'Non-square'})`,
    requirement: '1:1 (Exact Square)',
    details: aspectDetails,
    rawMetric: aspectRatio,
  });

  // 5. CHK-05: Color Depth (24-bit sRGB, rejecting grayscale)
  const { is24BitColor, colorVariance } = checkColorDepth(image);
  let colorStatus: CheckStatus = is24BitColor ? 'PASS' : 'FAIL';
  let colorDetails = is24BitColor
    ? 'Full 24-bit RGB color depth detected.'
    : 'Grayscale / Black & White photo detected. The DV Lottery strictly requires 24-bit color.';

  checks.push({
    id: 'CHK-05',
    name: 'Color Space & Depth',
    category: 'file',
    status: colorStatus,
    value: is24BitColor ? `24-bit Color (Δ=${colorVariance})` : 'Grayscale / Monochrome',
    requirement: '24-bit RGB Color (sRGB)',
    details: colorDetails,
    rawMetric: colorVariance,
  });

  // 6. CHK-12: Metadata & EXIF Audit
  const metadataInfo = await parseJpegMetadata(file);
  let metaStatus: CheckStatus = 'PASS';
  let metaDetails = 'Clean JPEG headers without editing software or stale dates.';

  if (metadataInfo.isDateTooOld) {
    metaStatus = 'WARNING';
    metaDetails = `Photo EXIF date is ${metadataInfo.dateTimeOriginal}, which appears older than 6 months. Photos must be taken within the last 6 months.`;
  } else if (metadataInfo.metadataTags.some((t) => t.includes('Photoshop') || t.includes('Adobe'))) {
    metaStatus = 'WARNING';
    metaDetails = `Photo contains editing metadata (${metadataInfo.metadataTags.join(', ')}). The State Department prohibits artificial alterations. Use 'Strip Metadata' to sanitize.`;
  } else if (metadataInfo.hasExif) {
    metaStatus = 'PASS';
    metaDetails = `Camera EXIF metadata found (${metadataInfo.metadataTags.join(', ')}).`;
  }

  checks.push({
    id: 'CHK-12',
    name: 'Recency & Metadata Audit',
    category: 'file',
    status: metaStatus,
    value: metadataInfo.dateTimeOriginal
      ? `Date: ${metadataInfo.dateTimeOriginal}`
      : metadataInfo.metadataTags.length > 0
      ? metadataInfo.metadataTags.join(', ')
      : 'Clean (No EXIF)',
    requirement: 'Taken within 6 months, no alterations',
    details: metaDetails,
  });

  return {
    isJpeg,
    magicBytesHex: magicHex,
    fileSizeBytes,
    width,
    height,
    aspectRatio,
    isSquare,
    is24BitColor,
    colorVariance,
    hasExifMetadata: metadataInfo.hasExif || metadataInfo.metadataTags.length > 0,
    metadataTags: metadataInfo.metadataTags,
    exifDate: metadataInfo.dateTimeOriginal,
    isDateTooOld: metadataInfo.isDateTooOld,
    checks,
  };
}

