/**
 * Master Compliance Audit Runner
 * 
 * Orchestrates technical file signature analysis and MediaPipe biometric analysis,
 * producing a unified 12-point compliance audit report.
 */

import { auditTechnicalRequirements } from './technical-validator';
import { auditBiometrics } from './biometric-validator';
import type { FullAuditReport, CheckStatus, ComplianceCheckResult } from './types';

export * from './types';
export * from './technical-validator';
export * from './biometric-validator';

export async function runFullPhotoAudit(
  file: File | Blob,
  image: HTMLImageElement
): Promise<FullAuditReport> {
  // Run technical file inspection
  const technicalResult = await auditTechnicalRequirements(file, image);

  // Run MediaPipe biometric inspection
  let biometricResult;
  try {
    biometricResult = await auditBiometrics(image);
  } catch (error) {
    console.error('[Biometric Validator Error]', error);
  }

  // Combine all checks
  const allChecks: ComplianceCheckResult[] = [
    ...technicalResult.checks,
    ...(biometricResult ? biometricResult.checks : []),
  ];

  // Sort checks by ID CHK-01 .. CHK-12
  allChecks.sort((a, b) => {
    const numA = parseInt(a.id.replace('CHK-', ''), 10) || 0;
    const numB = parseInt(b.id.replace('CHK-', ''), 10) || 0;
    return numA - numB;
  });

  // Calculate overall verdict
  let failCount = 0;
  let warningCount = 0;
  let passCount = 0;

  for (const check of allChecks) {
    if (check.status === 'FAIL') {
      failCount++;
    } else if (check.status === 'WARNING') {
      warningCount++;
    } else {
      passCount++;
    }
  }

  let overallStatus: CheckStatus = 'PASS';
  if (failCount > 0) {
    overallStatus = 'FAIL';
  } else if (warningCount > 0) {
    overallStatus = 'WARNING';
  }

  return {
    overallStatus,
    passCount,
    warningCount,
    failCount,
    technical: technicalResult,
    biometric: biometricResult,
    allChecks,
    timestamp: new Date().toISOString(),
  };
}

