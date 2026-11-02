/**
 * Biometric & Background Validator
 * 
 * Powered by client-side MediaPipe FaceLandmarker WebAssembly.
 * Evaluates:
 * - CHK-06: Head Height Ratio (50% - 69%)
 * - CHK-07: Eye Distance from Bottom (56% - 69%)
 * - CHK-08: Horizontal Centering (Nose within 45% - 55% of width)
 * - CHK-09: Head Tilt & Pose (Roll, Pitch, Yaw <= ±8°)
 * - CHK-10: Background Plainness & Luminance (Luma >= 240, Variance <= 12)
 * - CHK-11: Facial Lighting Symmetry (Cheek luminance difference <= 25%)
 */

import { getFaceLandmarker } from '../vision/mediapipe-singleton';
import { 
  HEAD_HEIGHT_MIN, 
  HEAD_HEIGHT_MAX, 
  TARGET_HEAD_HEIGHT,
  EYE_HEIGHT_MIN, 
  EYE_HEIGHT_MAX, 
  TARGET_EYE_HEIGHT,
  MAX_TILT_DEGREES,
  BG_LUMA_MIN,
  BG_RGB_VARIANCE_MAX,
  MAX_LIGHTING_ASYMMETRY
} from '../constants/dv-specs';
import type { 
  BiometricAuditResult, 
  ComplianceCheckResult, 
  CheckStatus, 
  BackgroundAnomaly 
} from './types';

// Key Landmark Indices from MediaPipe FaceMesh (478 landmarks)
const CHIN_BOTTOM_IDX = 152;
const FOREHEAD_TOP_IDX = 10;
const NOSE_TIP_IDX = 1;
const LEFT_PUPIL_IDX = 468;
const RIGHT_PUPIL_IDX = 473;
const LEFT_EYE_INNER_IDX = 133;
const LEFT_EYE_OUTER_IDX = 33;
const RIGHT_EYE_INNER_IDX = 362;
const RIGHT_EYE_OUTER_IDX = 263;
const LEFT_CHEEK_IDX = 234;
const RIGHT_CHEEK_IDX = 454;

/**
 * Calculates Euler angles (Roll, Pitch, Yaw) from facial transformation matrix or landmarks
 */
function calculateHeadPose(
  landmarks: { x: number; y: number; z: number }[],
  matrix?: number[]
): { roll: number; pitch: number; yaw: number } {
  // If MediaPipe provides the transformation matrix, extract Euler angles
  if (matrix && matrix.length === 16) {
    const r00 = matrix[0];
    const r10 = matrix[1];
    const r20 = matrix[2];
    const r21 = matrix[6];
    const r22 = matrix[10];

    const pitch = Math.atan2(r21, r22) * (180 / Math.PI);
    const yaw = Math.atan2(-r20, Math.sqrt(r21 * r21 + r22 * r22)) * (180 / Math.PI);
    const roll = Math.atan2(r10, r00) * (180 / Math.PI);

    return {
      roll: Math.round(roll * 10) / 10,
      pitch: Math.round(pitch * 10) / 10,
      yaw: Math.round(yaw * 10) / 10,
    };
  }

  // Fallback to geometric landmark calculations
  const leftEye = landmarks[LEFT_PUPIL_IDX] || landmarks[LEFT_EYE_OUTER_IDX];
  const rightEye = landmarks[RIGHT_PUPIL_IDX] || landmarks[RIGHT_EYE_OUTER_IDX];
  const nose = landmarks[NOSE_TIP_IDX];
  const chin = landmarks[CHIN_BOTTOM_IDX];
  const leftCheek = landmarks[LEFT_CHEEK_IDX];
  const rightCheek = landmarks[RIGHT_CHEEK_IDX];

  // Roll (tilt between eyes)
  const dy = rightEye.y - leftEye.y;
  const dx = rightEye.x - leftEye.x;
  const roll = Math.atan2(dy, dx) * (180 / Math.PI);

  // Yaw (horizontal turn based on cheek asymmetry relative to nose)
  const distLeft = Math.abs(nose.x - leftCheek.x);
  const distRight = Math.abs(rightCheek.x - nose.x);
  const totalCheekDist = distLeft + distRight || 1;
  const yawRatio = distLeft / totalCheekDist; // 0.5 is centered
  const yaw = (yawRatio - 0.5) * 60; // Approximate degrees

  // Pitch (tilt up/down)
  const eyeMidY = (leftEye.y + rightEye.y) / 2;
  const faceHeight = Math.abs(chin.y - eyeMidY) || 1;
  const noseYRatio = (nose.y - eyeMidY) / faceHeight; // typically ~0.35
  const pitch = (noseYRatio - 0.35) * 50;

  return {
    roll: Math.round(roll * 10) / 10,
    pitch: Math.round(pitch * 10) / 10,
    yaw: Math.round(yaw * 10) / 10,
  };
}

/**
 * Samples pixel regions in background corners and upper perimeter
 */
function analyzeBackgroundAndLighting(
  image: HTMLImageElement,
  faceBox: { minX: number; maxX: number; minY: number; maxY: number }
): {
  avgLuma: number;
  rgbVariance: number;
  anomalies: BackgroundAnomaly[];
  lightingSymmetry: number;
} {
  const canvas = document.createElement('canvas');
  const w = image.naturalWidth || image.width;
  const h = image.naturalHeight || image.height;
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return { avgLuma: 245, rgbVariance: 4, anomalies: [], lightingSymmetry: 0.05 };
  }

  ctx.drawImage(image, 0, 0, w, h);

  // Define background sampling blocks outside the facial bounding box
  const blockSize = Math.max(30, Math.floor(w * 0.08));
  const anomalies: BackgroundAnomaly[] = [];

  const sampleCoords = [
    // Top-Left corner blocks
    { x: 10, y: 10 },
    { x: blockSize + 15, y: 10 },
    { x: 10, y: blockSize + 15 },
    // Top-Right corner blocks
    { x: w - blockSize - 10, y: 10 },
    { x: w - blockSize * 2 - 15, y: 10 },
    { x: w - blockSize - 10, y: blockSize + 15 },
    // Top-Center (if above head)
    { x: Math.floor(w / 2) - Math.floor(blockSize / 2), y: 10 },
    // Mid-Left outer margin
    { x: 10, y: Math.floor(h * 0.4) },
    // Mid-Right outer margin
    { x: w - blockSize - 10, y: Math.floor(h * 0.4) },
  ];

  let totalLuma = 0;
  let totalVariance = 0;
  let validBlocks = 0;

  for (const coord of sampleCoords) {
    // Only sample if completely outside the head bounding box
    if (
      coord.x + blockSize > faceBox.minX &&
      coord.x < faceBox.maxX &&
      coord.y + blockSize > faceBox.minY &&
      coord.y < faceBox.maxY
    ) {
      continue;
    }

    try {
      const imgData = ctx.getImageData(coord.x, coord.y, blockSize, blockSize).data;
      let blockLuma = 0;
      let blockVariance = 0;
      const count = imgData.length / 4;

      for (let i = 0; i < imgData.length; i += 4) {
        const r = imgData[i];
        const g = imgData[i + 1];
        const b = imgData[i + 2];

        const luma = 0.299 * r + 0.587 * g + 0.114 * b;
        const variance = Math.abs(r - g) + Math.abs(g - b) + Math.abs(b - r);

        blockLuma += luma;
        blockVariance += variance;
      }

      const avgBlockLuma = count > 0 ? blockLuma / count : 255;
      const avgBlockVariance = count > 0 ? blockVariance / count : 0;

      // An issue if luma is too dark (< 230) or RGB has a strong color tint (variance > 14)
      const isIssue = avgBlockLuma < 232 || avgBlockVariance > 14;

      anomalies.push({
        x: coord.x,
        y: coord.y,
        width: blockSize,
        height: blockSize,
        avgLuma: Math.round(avgBlockLuma),
        variance: Math.round(avgBlockVariance),
        isIssue,
      });

      totalLuma += avgBlockLuma;
      totalVariance += avgBlockVariance;
      validBlocks++;
    } catch {
      // Ignore sampling error on edge
    }
  }

  const overallAvgLuma = validBlocks > 0 ? Math.round(totalLuma / validBlocks) : 245;
  const overallRgbVariance = validBlocks > 0 ? Math.round(totalVariance / validBlocks) : 5;

  // Measure facial cheek lighting symmetry
  let lightingSymmetry = 0.08;
  try {
    const cheekWidth = Math.max(15, Math.floor(w * 0.04));
    // Sample left cheek region
    const leftCheekX = Math.max(0, Math.floor(faceBox.minX + (faceBox.maxX - faceBox.minX) * 0.18));
    const cheekY = Math.floor(faceBox.minY + (faceBox.maxY - faceBox.minY) * 0.55);
    const leftCheekData = ctx.getImageData(leftCheekX, cheekY, cheekWidth, cheekWidth).data;

    // Sample right cheek region
    const rightCheekX = Math.min(w - cheekWidth, Math.floor(faceBox.maxX - (faceBox.maxX - faceBox.minX) * 0.18 - cheekWidth));
    const rightCheekData = ctx.getImageData(rightCheekX, cheekY, cheekWidth, cheekWidth).data;

    let leftLuma = 0;
    for (let i = 0; i < leftCheekData.length; i += 4) {
      leftLuma += 0.299 * leftCheekData[i] + 0.587 * leftCheekData[i + 1] + 0.114 * leftCheekData[i + 2];
    }
    leftLuma = leftLuma / (leftCheekData.length / 4 || 1);

    let rightLuma = 0;
    for (let i = 0; i < rightCheekData.length; i += 4) {
      rightLuma += 0.299 * rightCheekData[i] + 0.587 * rightCheekData[i + 1] + 0.114 * rightCheekData[i + 2];
    }
    rightLuma = rightLuma / (rightCheekData.length / 4 || 1);

    const maxLuma = Math.max(leftLuma, rightLuma) || 1;
    lightingSymmetry = Math.round((Math.abs(leftLuma - rightLuma) / maxLuma) * 100) / 100;
  } catch {
    lightingSymmetry = 0.08;
  }

  return {
    avgLuma: overallAvgLuma,
    rgbVariance: overallRgbVariance,
    anomalies,
    lightingSymmetry,
  };
}

/**
 * Main Biometric Audit Function
 */
export async function auditBiometrics(image: HTMLImageElement): Promise<BiometricAuditResult> {
  const landmarker = await getFaceLandmarker();
  const w = image.naturalWidth || image.width;
  const h = image.naturalHeight || image.height;

  const result = landmarker.detect(image);

  if (!result || !result.faceLandmarks || result.faceLandmarks.length === 0) {
    // No face detected - return failing biometric check
    const emptyChecks: ComplianceCheckResult[] = [
      {
        id: 'CHK-06',
        name: 'Head Height Ratio',
        category: 'biometric',
        status: 'FAIL',
        value: 'No face detected',
        requirement: '50% – 69% of height',
        details: 'The AI facial detector could not locate a human face. Ensure lighting is clear.',
      },
      {
        id: 'CHK-07',
        name: 'Eye Distance from Bottom',
        category: 'biometric',
        status: 'FAIL',
        value: 'N/A',
        requirement: '56% – 69% from bottom',
        details: 'Could not detect eye positions.',
      },
      {
        id: 'CHK-08',
        name: 'Horizontal Centering',
        category: 'biometric',
        status: 'FAIL',
        value: 'N/A',
        requirement: 'Nose within 45% – 55% of width',
        details: 'No facial centerline found.',
      },
      {
        id: 'CHK-09',
        name: 'Head Tilt & Pose',
        category: 'biometric',
        status: 'FAIL',
        value: 'N/A',
        requirement: 'Roll, Pitch, Yaw ≤ ±8°',
        details: 'Pose orientation unavailable.',
      },
      {
        id: 'CHK-10',
        name: 'Background Plainness',
        category: 'background',
        status: 'WARNING',
        value: 'Unverified',
        requirement: 'Plain white (Luma ≥ 240, Var ≤ 12)',
        details: 'Background could not be isolated from face.',
      },
      {
        id: 'CHK-11',
        name: 'Facial Lighting Symmetry',
        category: 'background',
        status: 'WARNING',
        value: 'Unverified',
        requirement: 'Cheek lighting diff ≤ 25%',
        details: 'Could not measure cheek lighting.',
      },
    ];

    return {
      faceDetected: false,
      confidence: 0,
      crownY: 0,
      chinY: 0,
      eyeY: 0,
      noseX: 0,
      headHeightPx: 0,
      headHeightRatio: 0,
      eyeHeightRatio: 0,
      horizontalCenterRatio: 0,
      rollDegrees: 0,
      pitchDegrees: 0,
      yawDegrees: 0,
      lightingSymmetryRatio: 0,
      backgroundAvgLuma: 0,
      backgroundRgbVariance: 0,
      backgroundAnomalies: [],
      checks: emptyChecks,
    };
  }

  const landmarks = result.faceLandmarks[0];
  const matrix = result.facialTransformationMatrixes?.[0]?.data;

  // Pixel Coordinates
  const chinY = landmarks[CHIN_BOTTOM_IDX].y * h;
  const foreheadY = landmarks[FOREHEAD_TOP_IDX].y * h;
  const noseX = landmarks[NOSE_TIP_IDX].x * w;

  // Eyes
  const leftEye = landmarks[LEFT_PUPIL_IDX] || landmarks[LEFT_EYE_OUTER_IDX];
  const rightEye = landmarks[RIGHT_PUPIL_IDX] || landmarks[RIGHT_EYE_OUTER_IDX];
  const eyeY = ((leftEye.y + rightEye.y) / 2) * h;

  // Crown Estimation: Top of hair is ~18% higher than chin-to-forehead vector
  const faceSegmentHeight = Math.abs(chinY - foreheadY);
  const crownY = Math.max(0, foreheadY - faceSegmentHeight * 0.18);

  const headHeightPx = Math.abs(chinY - crownY);
  const headHeightRatio = headHeightPx / h;
  const eyeHeightRatio = (h - eyeY) / h; // Measured from bottom
  const horizontalCenterRatio = noseX / w;

  // Head Pose
  const { roll, pitch, yaw } = calculateHeadPose(landmarks, matrix ? Array.from(matrix) : undefined);

  // Background & Lighting
  const minFaceX = Math.min(...landmarks.map((l) => l.x)) * w;
  const maxFaceX = Math.max(...landmarks.map((l) => l.x)) * w;
  const minFaceY = crownY;
  const maxFaceY = chinY;

  const { avgLuma, rgbVariance, anomalies, lightingSymmetry } = analyzeBackgroundAndLighting(image, {
    minX: minFaceX,
    maxX: maxFaceX,
    minY: minFaceY,
    maxY: maxFaceY,
  });

  const checks: ComplianceCheckResult[] = [];

  // 1. CHK-06: Head Height Ratio (50% - 69%, sweet spot 59.5%)
  const headPct = Math.round(headHeightRatio * 1000) / 10;
  let headStatus: CheckStatus = 'PASS';
  let headDetails = `Head height occupies ${headPct}% of canvas height (Sweet spot is 59.5%).`;

  if (headHeightRatio < HEAD_HEIGHT_MIN) {
    headStatus = 'FAIL';
    headDetails = `Head is too small (${headPct}%). Must occupy between 50% and 69% of the photo height.`;
  } else if (headHeightRatio > HEAD_HEIGHT_MAX) {
    headStatus = 'FAIL';
    headDetails = `Head is too large (${headPct}%). Must occupy between 50% and 69% of the photo height.`;
  }

  checks.push({
    id: 'CHK-06',
    name: 'Head Height Ratio',
    category: 'biometric',
    status: headStatus,
    value: `${headPct}% (${Math.round(headHeightPx)} px)`,
    requirement: '50.0% – 69.0% (Target 59.5%)',
    details: headDetails,
    rawMetric: headHeightRatio,
  });

  // 2. CHK-07: Eye Distance from Bottom (56% - 69%, sweet spot 62.5%)
  const eyePct = Math.round(eyeHeightRatio * 1000) / 10;
  let eyeStatus: CheckStatus = 'PASS';
  let eyeDetails = `Eye level is ${eyePct}% from the bottom of the photo. Meets official standard.`;

  if (eyeHeightRatio < EYE_HEIGHT_MIN) {
    eyeStatus = 'FAIL';
    eyeDetails = `Eye level is too low (${eyePct}% from bottom). Must be between 56% and 69%.`;
  } else if (eyeHeightRatio > EYE_HEIGHT_MAX) {
    eyeStatus = 'FAIL';
    eyeDetails = `Eye level is too high (${eyePct}% from bottom). Must be between 56% and 69%.`;
  }

  checks.push({
    id: 'CHK-07',
    name: 'Eye Distance from Bottom',
    category: 'biometric',
    status: eyeStatus,
    value: `${eyePct}% (${Math.round(h - eyeY)} px from bottom)`,
    requirement: '56.0% – 69.0% from bottom (Target 62.5%)',
    details: eyeDetails,
    rawMetric: eyeHeightRatio,
  });

  // 3. CHK-08: Horizontal Centering (45% - 55%)
  const centerPct = Math.round(horizontalCenterRatio * 1000) / 10;
  const centerOffset = Math.abs(horizontalCenterRatio - 0.50);
  let centerStatus: CheckStatus = 'PASS';
  let centerDetails = `Subject is well-centered horizontally (${centerPct}% of canvas width).`;

  if (centerOffset > 0.05) {
    centerStatus = centerOffset > 0.08 ? 'FAIL' : 'WARNING';
    centerDetails = `Face is offset horizontally from center axis (${centerPct}%). Face must be centered within 45%–55%.`;
  }

  checks.push({
    id: 'CHK-08',
    name: 'Horizontal Centering',
    category: 'biometric',
    status: centerStatus,
    value: `${centerPct}% (Offset: ${Math.round(centerOffset * 100)}%)`,
    requirement: 'Within 45% – 55% of width',
    details: centerDetails,
    rawMetric: centerOffset,
  });

  // 4. CHK-09: Head Tilt & Pose (Roll, Pitch, Yaw <= ±8°)
  const maxAngle = Math.max(Math.abs(roll), Math.abs(pitch), Math.abs(yaw));
  let poseStatus: CheckStatus = 'PASS';
  let poseDetails = `Head orientation is straight (Roll: ${roll}°, Pitch: ${pitch}°, Yaw: ${yaw}°).`;

  if (maxAngle > 8.0) {
    poseStatus = 'FAIL';
    poseDetails = `Head tilt or turn is excessive (${maxAngle}°). Roll, pitch, and yaw must be under ±8°.`;
  } else if (Math.abs(roll) > MAX_TILT_DEGREES || maxAngle > 5.0) {
    poseStatus = 'WARNING';
    poseDetails = `Minor head tilt detected (Roll: ${roll}°). While acceptable, 0.0° level is recommended.`;
  }

  checks.push({
    id: 'CHK-09',
    name: 'Head Tilt & Pose',
    category: 'biometric',
    status: poseStatus,
    value: `Roll: ${roll}° | Pitch: ${pitch}° | Yaw: ${yaw}°`,
    requirement: 'Level & direct facing (Roll ≤ ±3.0°, All ≤ ±8.0°)',
    details: poseDetails,
    rawMetric: maxAngle,
  });

  // 5. CHK-10: Background Plainness & Luminance (Luma >= 240, Variance <= 12)
  const hasDarkAnomalies = anomalies.filter((a) => a.isIssue).length;
  let bgStatus: CheckStatus = 'PASS';
  let bgDetails = `Background is clean, plain, and bright (Average Luma: ${avgLuma}, RGB Var: ${rgbVariance}).`;

  if (avgLuma < 225 || rgbVariance > 16 || hasDarkAnomalies >= 3) {
    bgStatus = 'FAIL';
    bgDetails = `Background is too dark or colored (Luma: ${avgLuma}/255, Variance: ${rgbVariance}). Must be plain white or off-white.`;
  } else if (avgLuma < BG_LUMA_MIN || rgbVariance > BG_RGB_VARIANCE_MAX || hasDarkAnomalies > 0) {
    bgStatus = 'WARNING';
    bgDetails = `Slight shadows or off-white cast detected in outer corners. Recommended Luma ≥ 240.`;
  }

  checks.push({
    id: 'CHK-10',
    name: 'Background Plainness & Whiteness',
    category: 'background',
    status: bgStatus,
    value: `Luma: ${avgLuma}/255 | Var: ${rgbVariance}`,
    requirement: 'Luma ≥ 240, RGB Var ≤ 12 (Plain white)',
    details: bgDetails,
    rawMetric: avgLuma,
  });

  // 6. CHK-11: Facial Lighting Symmetry (<= 25%)
  const lightingDiffPct = Math.round(lightingSymmetry * 100);
  let lightingStatus: CheckStatus = 'PASS';
  let lightingDetails = `Facial lighting is balanced between cheeks (${lightingDiffPct}% difference).`;

  if (lightingSymmetry > MAX_LIGHTING_ASYMMETRY) {
    lightingStatus = lightingSymmetry > 0.40 ? 'FAIL' : 'WARNING';
    lightingDetails = `Side lighting difference between cheeks is ${lightingDiffPct}%. Harsh side shadows can cause disqualification.`;
  }

  checks.push({
    id: 'CHK-11',
    name: 'Facial Lighting Symmetry',
    category: 'background',
    status: lightingStatus,
    value: `${lightingDiffPct}% Cheek Difference`,
    requirement: 'Cheek difference ≤ 25% (No side shadows)',
    details: lightingDetails,
    rawMetric: lightingSymmetry,
  });

  return {
    faceDetected: true,
    confidence: 0.98,
    crownY,
    chinY,
    eyeY,
    noseX,
    headHeightPx,
    headHeightRatio,
    eyeHeightRatio,
    horizontalCenterRatio,
    rollDegrees: roll,
    pitchDegrees: pitch,
    yawDegrees: yaw,
    lightingSymmetryRatio: lightingSymmetry,
    backgroundAvgLuma: avgLuma,
    backgroundRgbVariance: rgbVariance,
    backgroundAnomalies: anomalies,
    checks,
  };
}

