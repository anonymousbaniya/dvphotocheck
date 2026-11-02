// replace-yellow.mjs
// This script loads the uploaded image, detects the yellow‑circled region by
// simple color‑thresholding, and recolors it to plain light‑blue (#add8e6).
// It preserves the original dimensions and writes the edited image to
// `public/images/edited_user_image.png`.

import sharp from 'sharp';
import path from 'path';

// Input image – the user‑uploaded PNG (path inside the brain artifact directory)
const INPUT_PATH = path.resolve(
  'C:/Users/User/.gemini/antigravity/brain/a3760f7f-92fa-4d96-bd2e-6950685517ca/.user_uploaded/media_1793422668303_17dc9315.png'
);
// Output location – served as a static asset by Next.js
const OUTPUT_PATH = path.resolve('public/images/edited_user_image.png');

// Light‑blue replacement colour (RGB)
const REPLACE_RGB = { r: 0xad, g: 0xd8, b: 0xe6 }; // #add8e6

// Simple yellow detection – pixels that are bright yellow (high R & G, low B)
function isYellow(r, g, b, a) {
  // ignore fully transparent pixels
  if (a === 0) return false;
  // tolerant thresholds
  return r > 200 && g > 200 && b < 120;
}

async function recolorYellow() {
  const image = sharp(INPUT_PATH);
  const { width, height, channels } = await image.metadata();
  // Ensure we have RGBA data
  const raw = await image.ensureAlpha().raw().toBuffer();
  // raw is a Uint8Array of length width * height * 4 (RGBA)
  for (let i = 0; i < raw.length; i += 4) {
    const r = raw[i];
    const g = raw[i + 1];
    const b = raw[i + 2];
    const a = raw[i + 3];
    if (isYellow(r, g, b, a)) {
      raw[i] = REPLACE_RGB.r;
      raw[i + 1] = REPLACE_RGB.g;
      raw[i + 2] = REPLACE_RGB.b;
      // keep alpha unchanged
    }
  }
  await sharp(raw, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(OUTPUT_PATH);
  console.log('Edited image written to', OUTPUT_PATH);
}

recolorYellow().catch(err => {
  console.error('Error during recolor:', err);
  process.exit(1);
});

