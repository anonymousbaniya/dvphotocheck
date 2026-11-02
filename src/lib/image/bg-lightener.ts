/**
 * Smart Edge-Preserving Background Lightener
 * 
 * Softly shifts off-white, light gray, or cream backgrounds toward pure #FFFFFF
 * while preserving natural hair strands and clothing borders through
 * saturation gating and feathered color curves.
 */

export interface BgLightenerOptions {
  // Luminance threshold above which pixels are shifted (typically 200 - 245)
  lumaThreshold?: number;
  // Maximum color saturation allowed for background pixels (0.0 to 1.0, typically 0.15)
  maxSaturation?: number;
  // Soft feather curve strength (0.0 to 1.0)
  featherStrength?: number;
}

/**
 * Applies soft white-point correction to the canvas in-place
 */
export function applyBackgroundLightener(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: BgLightenerOptions = {}
): void {
  const {
    lumaThreshold = 215,
    maxSaturation = 0.18,
    featherStrength = 0.85,
  } = options;

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;

    // Calculate saturation (0.0 to 1.0)
    const saturation = max === 0 ? 0 : (max - min) / max;

    // Only lighten pixels that are both low-saturation (near neutral/gray/white)
    // and already reasonably bright (above threshold)
    if (saturation <= maxSaturation && luma >= lumaThreshold) {
      // Calculate normalized position between threshold and 255
      const factor = (luma - lumaThreshold) / (255 - lumaThreshold);
      const shift = Math.min(1.0, Math.pow(factor, 0.7) * featherStrength);

      data[i] = Math.round(r + (255 - r) * shift);
      data[i + 1] = Math.round(g + (255 - g) * shift);
      data[i + 2] = Math.round(b + (255 - b) * shift);
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

