/**
 * JPEG Metadata Sanitizer & Stripper
 * 
 * Re-encodes the image onto a pristine HTML5 canvas context to completely
 * strip Adobe Photoshop, IPTC, GPS location, and other EXIF metadata tags,
 * ensuring clean baseline sRGB JPEG output.
 */

export async function stripImageMetadata(image: HTMLImageElement, quality = 0.95): Promise<Blob> {
  if (typeof window === 'undefined') {
    throw new Error('stripImageMetadata is client-only.');
  }

  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth || image.width;
  canvas.height = image.naturalHeight || image.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context unavailable.');
  }

  // Draw clean pixels
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create sanitized JPEG blob.'));
        }
      },
      'image/jpeg',
      quality
    );
  });
}

