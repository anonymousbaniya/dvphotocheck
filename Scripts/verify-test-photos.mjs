import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testPhotosDir = path.resolve(__dirname, '../public/test-photos');

const DV_SPECS = {
  MIN_DIM: 600,
  MAX_DIM: 1200,
  MAX_BYTES: 245760, // 240 KB
  MIN_BYTES: 15360,  // 15 KB
  BG_LUMA_MIN: 240,
  COLOR_VAR_MIN: 8.0
};

async function testFile(filename) {
  const filePath = path.join(testPhotosDir, filename);
  const buffer = fs.readFileSync(filePath);
  const stat = fs.statSync(filePath);

  // 1. Magic bytes
  const isJpeg = buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
  const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E;
  const magicHex = Array.from(buffer.subarray(0, 3)).map(b => b.toString(16).toUpperCase().padStart(2, '0')).join(' ');

  // Metadata using sharp
  const metadata = await sharp(buffer).metadata();
  const width = metadata.width || 0;
  const height = metadata.height || 0;
  const aspectRatio = width / (height || 1);
  const isSquare = Math.abs(aspectRatio - 1.0) < 0.005;

  // Color variance check (using raw RGB pixels)
  const rawImage = await sharp(buffer).resize(100, 100, { fit: 'fill' }).raw().toBuffer();
  let totalDiff = 0;
  let pixelCount = 0;
  for (let i = 0; i < rawImage.length; i += metadata.channels || 3) {
    const r = rawImage[i];
    const g = rawImage[i + 1] ?? r;
    const b = rawImage[i + 2] ?? r;
    totalDiff += Math.abs(r - g) + Math.abs(g - b) + Math.abs(b - r);
    pixelCount++;
  }
  const avgColorVariance = pixelCount > 0 ? totalDiff / pixelCount : 0;
  const is24BitColor = avgColorVariance >= DV_SPECS.COLOR_VAR_MIN && (metadata.channels || 1) >= 3;

  // Background corner luminance test (top-left 50x50 corner)
  const cornerRaw = await sharp(buffer)
    .extract({ left: 10, top: 10, width: 40, height: 40 })
    .raw()
    .toBuffer();
  let lumaSum = 0;
  const cornerPixels = 40 * 40;
  for (let i = 0; i < cornerRaw.length; i += metadata.channels || 3) {
    const r = cornerRaw[i];
    const g = cornerRaw[i + 1] ?? r;
    const b = cornerRaw[i + 2] ?? r;
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;
    lumaSum += luma;
  }
  const cornerLuma = Math.round(lumaSum / cornerPixels);

  return {
    filename,
    sizeBytes: stat.size,
    sizeKb: (stat.size / 1024).toFixed(1),
    magicHex,
    isJpeg,
    isPng,
    width,
    height,
    aspectRatio: aspectRatio.toFixed(2),
    isSquare,
    colorVariance: avgColorVariance.toFixed(1),
    is24BitColor,
    cornerLuma,
    isLumaCompliant: cornerLuma >= DV_SPECS.BG_LUMA_MIN
  };
}

async function run() {
  console.log('--- Verifying Synthetic DV Test Photos ---');
  const files = [
    'photo_compliant.jpg',
    'photo_oversized_dims.jpg',
    'photo_oversized_file.jpg',
    'photo_non_square.jpg',
    'photo_grayscale.jpg',
    'photo_dark_background.jpg',
    'photo_fake_jpeg.jpg'
  ];

  const results = [];
  let allAssertionsPassed = true;

  for (const f of files) {
    const res = await testFile(f);
    results.push(res);

    if (f === 'photo_compliant.jpg') {
      const pass = res.isJpeg && res.sizeBytes <= DV_SPECS.MAX_BYTES && res.isSquare && res.width === 600 && res.is24BitColor && res.isLumaCompliant;
      if (!pass) {
        console.error(`❌ Assertion failed for ${f}: expected PASS all`);
        allAssertionsPassed = false;
      }
    } else if (f === 'photo_oversized_dims.jpg') {
      const failsDims = res.width > DV_SPECS.MAX_DIM || res.height > DV_SPECS.MAX_DIM;
      if (!failsDims) {
        console.error(`❌ Assertion failed for ${f}: expected dims > 1200`);
        allAssertionsPassed = false;
      }
    } else if (f === 'photo_oversized_file.jpg') {
      const failsSize = res.sizeBytes > DV_SPECS.MAX_BYTES;
      if (!failsSize) {
        console.error(`❌ Assertion failed for ${f}: expected size > 245,760 bytes`);
        allAssertionsPassed = false;
      }
    } else if (f === 'photo_non_square.jpg') {
      const failsAspect = !res.isSquare;
      if (!failsAspect) {
        console.error(`❌ Assertion failed for ${f}: expected non-square aspect ratio`);
        allAssertionsPassed = false;
      }
    } else if (f === 'photo_grayscale.jpg') {
      const failsColor = !res.is24BitColor;
      if (!failsColor) {
        console.error(`❌ Assertion failed for ${f}: expected grayscale rejection`);
        allAssertionsPassed = false;
      }
    } else if (f === 'photo_dark_background.jpg') {
      const failsLuma = !res.isLumaCompliant;
      if (!failsLuma) {
        console.error(`❌ Assertion failed for ${f}: expected dark background rejection`);
        allAssertionsPassed = false;
      }
    } else if (f === 'photo_fake_jpeg.jpg') {
      const failsJpeg = !res.isJpeg && res.isPng;
      if (!failsJpeg) {
        console.error(`❌ Assertion failed for ${f}: expected fake JPEG (PNG header) rejection`);
        allAssertionsPassed = false;
      }
    }
  }

  console.table(results.map(r => ({
    File: r.filename,
    Format: r.isJpeg ? 'JPEG' : (r.isPng ? 'PNG disguised' : 'Unknown'),
    Size: `${r.sizeKb} KB`,
    Dimensions: `${r.width}x${r.height}`,
    Square: r.isSquare ? 'Yes (1:1)' : `No (${r.aspectRatio}:1)`,
    Color: r.is24BitColor ? `24-bit (Δ=${r.colorVariance})` : `Monochrome (Δ=${r.colorVariance})`,
    CornerLuma: `${r.cornerLuma} / 255 (≥240 req)`
  })));

  if (allAssertionsPassed) {
    console.log('✅ ALL TEST PHOTOS CONFORM TO EXPECTED AUDIT OUTCOMES!');
  } else {
    console.error('❌ SOME TEST ASSERTIONS FAILED.');
    process.exit(1);
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

