/**
 * Client-Side MediaPipe FaceLandmarker Singleton
 * 
 * Dynamically and lazily initializes @mediapipe/tasks-vision FaceLandmarker
 * running in WebAssembly (WASM) / WebGL mode directly in the user's browser.
 * Ensures zero server uploads and lazy loads bundle size (<150KB initial bundle).
 */

import type { FaceLandmarker as FaceLandmarkerType } from '@mediapipe/tasks-vision';

let landmarkerInstance: FaceLandmarkerType | null = null;
let landmarkerPromise: Promise<FaceLandmarkerType> | null = null;

const WASM_CDN_PATH = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm';
const MODEL_ASSET_URL = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task';

/**
 * Lazily retrieves or initializes the shared FaceLandmarker instance.
 * Safe for SSR (returns null or throws descriptive error when window is undefined).
 */
export async function getFaceLandmarker(): Promise<FaceLandmarkerType> {
  if (typeof window === 'undefined') {
    throw new Error('MediaPipe FaceLandmarker can only be initialized client-side in browser environment.');
  }

  if (landmarkerInstance) {
    return landmarkerInstance;
  }

  if (landmarkerPromise) {
    return landmarkerPromise;
  }

  landmarkerPromise = (async () => {
    try {
      const { FilesetResolver, FaceLandmarker } = await import('@mediapipe/tasks-vision');

      const filesetResolver = await FilesetResolver.forVisionTasks(WASM_CDN_PATH);

      const landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: MODEL_ASSET_URL,
          delegate: 'GPU', // Automatically falls back to CPU if WebGL/GPU is unavailable
        },
        outputFaceBlendshapes: false,
        outputFacialTransformationMatrixes: true,
        runningMode: 'IMAGE',
        numFaces: 1,
      });

      landmarkerInstance = landmarker;
      return landmarker;
    } catch (error) {
      // Clear the promise on error so subsequent attempts can retry
      landmarkerPromise = null;
      console.error('[MediaPipe Singleton] Failed to load FaceLandmarker:', error);
      throw error;
    }
  })();

  return landmarkerPromise;
}

/**
 * Checks if the singleton is already loaded in memory
 */
export function isFaceLandmarkerLoaded(): boolean {
  return landmarkerInstance !== null;
}

