import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.resolve(__dirname, '../public/test-photos');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log(`Generating synthetic DV test photos in: ${outputDir}`);

// Helper SVG generator for realistic portrait silhouette on white/custom background
function createPortraitSvg({
  width = 600,
  height = 600,
  bgColor = '#FFFFFF',
  skinColor = '#E0AC69',
  hairColor = '#3D2314',
  shirtColor = '#2B4C7E',
  isMonochrome = false
} = {}) {
  const actualSkin = isMonochrome ? '#888888' : skinColor;
  const actualHair = isMonochrome ? '#333333' : hairColor;
  const actualShirt = isMonochrome ? '#555555' : shirtColor;
  const actualEyes = isMonochrome ? '#222222' : '#1A1A1A';
  const actualLips = isMonochrome ? '#777777' : '#C46262';

  // Target proportions:
  // Image height = 600
  // Head height (crown to chin) = ~340px (56.6% of image height, DV spec: 50% - 69%)
  // Crown: y ~ 160
  // Chin: y ~ 500
  // Eye line: y ~ 240 (which is 360px from bottom = 60% of image height, DV spec: 56% - 69%)
  // Center: x = 300
  return `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <!-- Background -->
    <rect width="${width}" height="${height}" fill="${bgColor}"/>
    
    <!-- Shoulders / Torso -->
    <path d="M 120 ${height} C 140 480, 200 450, 250 445 L 350 445 C 400 450, 460 480, 480 ${height} Z" fill="${actualShirt}"/>
    
    <!-- Neck -->
    <rect x="265" y="410" width="70" height="70" rx="10" fill="${actualSkin}"/>
    
    <!-- Hair back/silhouette -->
    <ellipse cx="300" cy="270" rx="115" ry="140" fill="${actualHair}"/>
    
    <!-- Face Oval -->
    <ellipse cx="300" cy="300" rx="95" ry="125" fill="${actualSkin}"/>
    
    <!-- Hair top/front -->
    <path d="M 195 260 C 210 180, 390 180, 405 260 C 370 210, 230 210, 195 260 Z" fill="${actualHair}"/>
    
    <!-- Eyebrows -->
    <path d="M 235 215 Q 260 205 280 215" stroke="${actualHair}" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M 320 215 Q 340 205 365 215" stroke="${actualHair}" stroke-width="5" stroke-linecap="round" fill="none"/>
    
    <!-- Eyes (at y=240, 60% from bottom edge) -->
    <ellipse cx="258" cy="240" rx="14" ry="8" fill="#FFFFFF"/>
    <circle cx="258" cy="240" r="5" fill="${actualEyes}"/>
    
    <ellipse cx="342" cy="240" rx="14" ry="8" fill="#FFFFFF"/>
    <circle cx="342" cy="240" r="5" fill="${actualEyes}"/>
    
    <!-- Nose -->
    <path d="M 300 235 L 295 290 L 305 290 Z" fill="#CCA070"/>
    
    <!-- Mouth / Lips (at y=335) -->
    <path d="M 275 335 Q 300 345 325 335" stroke="${actualLips}" stroke-width="4" stroke-linecap="round" fill="none"/>
  </svg>
  `;
}

async function run() {
  const generatedFiles = [];

  // 1. photo_compliant.jpg: 600x600, pure white BG, genuine baseline JPEG, comfortable size (e.g. ~80-150 KB)
  {
    // Add fine visual texture in clothing to achieve realistic file size around 60-120 KB
    const svg = createPortraitSvg({ width: 600, height: 600, bgColor: '#FFFFFF' });
    const outPath = path.join(outputDir, 'photo_compliant.jpg');
    await sharp(Buffer.from(svg))
      .jpeg({ quality: 95, chromaSubsampling: '4:4:4' })
      .toFile(outPath);
    const stat = fs.statSync(outPath);
    console.log(`✓ Generated photo_compliant.jpg: 600x600, ${(stat.size / 1024).toFixed(1)} KB`);
    generatedFiles.push({ name: 'photo_compliant.jpg', size: stat.size, dims: '600x600', status: 'Expected: PASS' });
  }

  // 2. photo_oversized_dims.jpg: 1400x1400 (exceeds 1200px max)
  {
    const svg = createPortraitSvg({ width: 1400, height: 1400, bgColor: '#FFFFFF' });
    const outPath = path.join(outputDir, 'photo_oversized_dims.jpg');
    await sharp(Buffer.from(svg))
      .jpeg({ quality: 85 })
      .toFile(outPath);
    const stat = fs.statSync(outPath);
    console.log(`✓ Generated photo_oversized_dims.jpg: 1400x1400, ${(stat.size / 1024).toFixed(1)} KB`);
    generatedFiles.push({ name: 'photo_oversized_dims.jpg', size: stat.size, dims: '1400x1400', status: 'Expected: FAIL (CHK-03)' });
  }

  // 3. photo_oversized_file.jpg: 600x600 but file size > 240 KB (245,760 B)
  {
    // High frequency colored noise to defeat JPEG compression and exceed 240KB
    const width = 600;
    const height = 600;
    const rawNoise = Buffer.alloc(width * height * 3);
    for (let i = 0; i < rawNoise.length; i++) {
      rawNoise[i] = Math.floor(Math.random() * 256);
    }
    const outPath = path.join(outputDir, 'photo_oversized_file.jpg');
    // Save uncompressed / minimal subsampling with noise at quality 100
    await sharp(rawNoise, { raw: { width, height, channels: 3 } })
      .jpeg({ quality: 100, chromaSubsampling: '4:4:4' })
      .toFile(outPath);
    
    // Ensure it strictly exceeds 245,760 bytes. If not, append trailing bytes
    let stat = fs.statSync(outPath);
    if (stat.size <= 245760) {
      const needed = 250000 - stat.size;
      fs.appendFileSync(outPath, Buffer.alloc(needed, 0x00));
      stat = fs.statSync(outPath);
    }
    console.log(`✓ Generated photo_oversized_file.jpg: 600x600, ${(stat.size / 1024).toFixed(1)} KB (> 240 KB)`);
    generatedFiles.push({ name: 'photo_oversized_file.jpg', size: stat.size, dims: '600x600', status: 'Expected: FAIL (CHK-02)' });
  }

  // 4. photo_non_square.jpg: 600x800 (rectangular, 3:4 aspect ratio)
  {
    const svg = createPortraitSvg({ width: 600, height: 800, bgColor: '#FFFFFF' });
    const outPath = path.join(outputDir, 'photo_non_square.jpg');
    await sharp(Buffer.from(svg))
      .jpeg({ quality: 90 })
      .toFile(outPath);
    const stat = fs.statSync(outPath);
    console.log(`✓ Generated photo_non_square.jpg: 600x800, ${(stat.size / 1024).toFixed(1)} KB`);
    generatedFiles.push({ name: 'photo_non_square.jpg', size: stat.size, dims: '600x800', status: 'Expected: FAIL (CHK-04)' });
  }

  // 5. photo_grayscale.jpg: 600x600 pure monochrome
  {
    const svg = createPortraitSvg({ width: 600, height: 600, bgColor: '#F0F0F0', isMonochrome: true });
    const outPath = path.join(outputDir, 'photo_grayscale.jpg');
    await sharp(Buffer.from(svg))
      .grayscale()
      .jpeg({ quality: 96 })
      .toFile(outPath);
    const stat = fs.statSync(outPath);
    console.log(`✓ Generated photo_grayscale.jpg: 600x600, ${(stat.size / 1024).toFixed(1)} KB`);
    generatedFiles.push({ name: 'photo_grayscale.jpg', size: stat.size, dims: '600x600', status: 'Expected: FAIL (CHK-05)' });
  }

  // 6. photo_dark_background.jpg: 600x600 with dark gray/shadowed background
  {
    const svg = createPortraitSvg({ width: 600, height: 600, bgColor: '#7A8288' });
    const outPath = path.join(outputDir, 'photo_dark_background.jpg');
    await sharp(Buffer.from(svg))
      .jpeg({ quality: 90 })
      .toFile(outPath);
    const stat = fs.statSync(outPath);
    console.log(`✓ Generated photo_dark_background.jpg: 600x600, ${(stat.size / 1024).toFixed(1)} KB`);
    generatedFiles.push({ name: 'photo_dark_background.jpg', size: stat.size, dims: '600x600', status: 'Expected: FAIL (CHK-09 / CHK-10)' });
  }

  // 7. photo_fake_jpeg.jpg: PNG image saved with .jpg extension (Magic bytes 89 50 4E)
  {
    const svg = createPortraitSvg({ width: 600, height: 600, bgColor: '#FFFFFF' });
    const outPath = path.join(outputDir, 'photo_fake_jpeg.jpg');
    await sharp(Buffer.from(svg))
      .png()
      .toFile(outPath);
    const stat = fs.statSync(outPath);
    console.log(`✓ Generated photo_fake_jpeg.jpg (PNG disguise): 600x600, ${(stat.size / 1024).toFixed(1)} KB`);
    generatedFiles.push({ name: 'photo_fake_jpeg.jpg', size: stat.size, dims: '600x600', status: 'Expected: FAIL (CHK-01)' });
  }

  console.log('\n--- Generated Test Suite Summary ---');
  console.table(generatedFiles);
}

run().catch((err) => {
  console.error('Error generating synthetic test photos:', err);
  process.exit(1);
});
