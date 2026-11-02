/**
 * Client-Side Ingestion and Normalization Converter
 * 
 * Transparently accepts Apple HEIC/HEIF, WebP, PNG, and JPEG files,
 * converting them in-memory to standard HTMLImageElement or ImageBitmap
 * without any server transmission.
 */

export interface NormalizedImageResult {
  image: HTMLImageElement;
  bitmap?: ImageBitmap;
  blob: Blob;
  mimeType: string;
  width: number;
  height: number;
  wasConverted: boolean;
}

/**
 * Detects if a file or blob is an Apple HEIC/HEIF image
 */
export function isHeicFile(file: File | Blob): boolean {
  if (file.type === 'image/heic' || file.type === 'image/heif') {
    return true;
  }
  if ('name' in file && typeof file.name === 'string') {
    const ext = file.name.split('.').pop()?.toLowerCase();
    return ext === 'heic' || ext === 'heif';
  }
  return false;
}

/**
 * Transparently converts any supported upload (HEIC, WebP, PNG, JPEG)
 * to an in-memory HTMLImageElement.
 */
export async function convertToStandardImage(file: File | Blob): Promise<NormalizedImageResult> {
  if (typeof window === 'undefined') {
    throw new Error('Image conversion can only be performed client-side in browser environment.');
  }

  let finalBlob: Blob = file;
  let wasConverted = false;

  // Handle Apple HEIC/HEIF conversion
  if (isHeicFile(file)) {
    try {
      const heic2anyModule = await import('heic2any');
      const heic2any = heic2anyModule.default || heic2anyModule;
      const converted = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.98,
      });

      finalBlob = Array.isArray(converted) ? converted[0] : converted;
      wasConverted = true;
    } catch (err) {
      console.error('[HEIC Converter] Failed to decode HEIC file:', err);
      throw new Error('Unable to convert HEIC image. Please upload a standard JPG or PNG.');
    }
  }

  // Load into HTMLImageElement
  const objectUrl = URL.createObjectURL(finalBlob);

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image into memory. The file may be corrupted.'));
    };
    img.src = objectUrl;
  });

  // Optional: create ImageBitmap if supported
  let bitmap: ImageBitmap | undefined;
  if ('createImageBitmap' in window) {
    try {
      bitmap = await createImageBitmap(image);
    } catch {
      // Fallback gracefully if createImageBitmap fails
    }
  }

  return {
    image,
    bitmap,
    blob: finalBlob,
    mimeType: finalBlob.type || 'image/jpeg',
    width: image.naturalWidth,
    height: image.naturalHeight,
    wasConverted,
  };
}

/**
 * Safely creates an ImageBitmap from an HTMLImageElement or Blob
 */
export async function getImageBitmap(source: HTMLImageElement | Blob): Promise<ImageBitmap> {
  if (typeof window === 'undefined') {
    throw new Error('createImageBitmap is only available in browser environments.');
  }

  if (source instanceof HTMLImageElement) {
    return await createImageBitmap(source);
  }

  const normalized = await convertToStandardImage(source);
  if (normalized.bitmap) {
    return normalized.bitmap;
  }
  return await createImageBitmap(normalized.image);
}

