/**
 * Mathematical AI Auto-Crop Engine for U.S. Diversity Visa Photos
 * 
 * Computes exact affine transformations to achieve:
 * - 0.0° horizontal eye level (counter-rotating roll angle)
 * - 59.0% - 59.5% head height ratio (crown to chin)
 * - 62.5% eye level measured from bottom (37.5% from top)
 * - Horizontal centering on nose bridge axis
 */

import { getFaceLandmarker } from '../vision/mediapipe-singleton';

export interface AutoCropTransform {
  // Angle in degrees to counter-rotate to level eyes
  rotationDegrees: number;
  // Bounding square in source image coordinates
  sourceCropBox: {
    x: number;
    y: number;
    size: number;
  };
  // Canvas coordinate parameters for rendering
  scale: number;
  panX: number;
  panY: number;
  // Biometric measurements
  metrics: {
    headHeightPx: number;
    headHeightRatio: number; // ~0.59
    eyeHeightRatio: number; // ~0.625
    rollDegrees: number;
    dEyeChin: number;
    crownY: number;
    chinY: number;
    eyeY: number;
    noseX: number;
  };
}

const CHIN_IDX = 152;
const NOSE_IDX = 1;
const LEFT_PUPIL_IDX = 468;
const RIGHT_PUPIL_IDX = 473;
const LEFT_OUTER_EYE_IDX = 33;
const RIGHT_OUTER_EYE_IDX = 263;

/**
 * Executes MediaPipe facial landmarking and calculates the optimal crop transform
 */
export async function calculateAutoCrop(
  image: HTMLImageElement,
  targetCanvasSize = 600
): Promise<AutoCropTransform | null> {
  const landmarker = await getFaceLandmarker();
  const w = image.naturalWidth || image.width;
  const h = image.naturalHeight || image.height;

  const result = landmarker.detect(image);
  if (!result || !result.faceLandmarks || result.faceLandmarks.length === 0) {
    return null;
  }

  const landmarks = result.faceLandmarks[0];

  // Coordinates
  const leftEye = landmarks[LEFT_PUPIL_IDX] || landmarks[LEFT_OUTER_EYE_IDX];
  const rightEye = landmarks[RIGHT_PUPIL_IDX] || landmarks[RIGHT_OUTER_EYE_IDX];
  const chin = landmarks[CHIN_IDX];
  const nose = landmarks[NOSE_IDX];

  const leftEyeX = leftEye.x * w;
  const leftEyeY = leftEye.y * h;
  const rightEyeX = rightEye.x * w;
  const rightEyeY = rightEye.y * h;

  const eyeY = (leftEyeY + rightEyeY) / 2;
  const eyeX = (leftEyeX + rightEyeX) / 2;
  const chinY = chin.y * h;
  const chinX = chin.x * w;
  const noseX = nose.x * w;

  // 1. Calculate Eye Line Roll Angle
  const dy = rightEyeY - leftEyeY;
  const dx = rightEyeX - leftEyeX;
  const rollRadians = Math.atan2(dy, dx);
  const rollDegrees = rollRadians * (180 / Math.PI);
  // Counter-rotation to level eyes horizontally
  const rotationDegrees = -rollDegrees;

  // 2. Head Height and Crown Estimation
  // Distance from eye level to chin
  const dEyeChin = Math.abs(chinY - eyeY);
  // True crown position is estimated at 0.85 * dEyeChin above eyes
  const crownY = Math.max(0, eyeY - 0.85 * dEyeChin);
  const headHeightPx = Math.abs(chinY - crownY);

  // 3. Target Crop Square Side S
  // Targeting 59.0% of canvas height for head height: S = H_head / 0.59
  const S = Math.max(headHeightPx / 0.59, 100);

  // 4. Center Coordinates
  // Eyes positioned at 37.5% from top (62.5% from bottom)
  // Horizontally centered on nose bridge axis
  const cropX = noseX - S / 2;
  const cropY = eyeY - 0.375 * S;

  // Scale factor to map square S to targetCanvasSize
  const scale = targetCanvasSize / S;

  // Pan offsets for canvas center origin
  // When rotated around center of crop:
  const panX = (targetCanvasSize / 2) - (noseX * scale);
  const panY = (0.375 * targetCanvasSize) - (eyeY * scale);

  return {
    rotationDegrees: Math.round(rotationDegrees * 100) / 100,
    sourceCropBox: {
      x: Math.round(cropX),
      y: Math.round(cropY),
      size: Math.round(S),
    },
    scale,
    panX,
    panY,
    metrics: {
      headHeightPx: Math.round(headHeightPx),
      headHeightRatio: 0.59,
      eyeHeightRatio: 0.625,
      rollDegrees: Math.round(rollDegrees * 10) / 10,
      dEyeChin: Math.round(dEyeChin),
      crownY: Math.round(crownY),
      chinY: Math.round(chinY),
      eyeY: Math.round(eyeY),
      noseX: Math.round(noseX),
    },
  };
}

