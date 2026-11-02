/**
 * Compliance Checker Types and Interfaces
 */

export type CheckStatus = 'PASS' | 'WARNING' | 'FAIL';

export interface ComplianceCheckResult {
  id: string; // e.g. 'CHK-01'
  name: string; // e.g. 'File Format'
  category: 'file' | 'biometric' | 'background';
  status: CheckStatus;
  value: string; // Measured formatted value, e.g. "JPEG (FF D8 FF)" or "48.2%"
  requirement: string; // Expected requirement string, e.g. "Baseline JPEG" or "50% - 69%"
  details: string; // Detailed diagnostic feedback
  rawMetric?: number; // Optional numerical value for math/graphs
}

export interface TechnicalAuditResult {
  isJpeg: boolean;
  magicBytesHex: string;
  fileSizeBytes: number;
  width: number;
  height: number;
  aspectRatio: number;
  isSquare: boolean;
  is24BitColor: boolean;
  colorVariance: number;
  hasExifMetadata: boolean;
  metadataTags: string[];
  exifDate?: string;
  isDateTooOld?: boolean;
  checks: ComplianceCheckResult[];
}

export interface BackgroundAnomaly {
  x: number;
  y: number;
  width: number;
  height: number;
  avgLuma: number;
  variance: number;
  isIssue: boolean;
}

export interface BiometricAuditResult {
  faceDetected: boolean;
  confidence: number;
  crownY: number; // in pixels
  chinY: number; // in pixels
  eyeY: number; // in pixels
  noseX: number; // in pixels
  headHeightPx: number;
  headHeightRatio: number; // e.g. 0.585
  eyeHeightRatio: number; // measured from bottom: (height - eyeY) / height
  horizontalCenterRatio: number; // noseX / width
  rollDegrees: number; // tilt angle
  pitchDegrees: number;
  yawDegrees: number;
  lightingSymmetryRatio: number; // cheek luminance difference %
  backgroundAvgLuma: number;
  backgroundRgbVariance: number;
  backgroundAnomalies: BackgroundAnomaly[];
  checks: ComplianceCheckResult[];
}

export interface FullAuditReport {
  overallStatus: CheckStatus;
  passCount: number;
  warningCount: number;
  failCount: number;
  technical: TechnicalAuditResult;
  biometric?: BiometricAuditResult;
  allChecks: ComplianceCheckResult[];
  timestamp: string;
}

