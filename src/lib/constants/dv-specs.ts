/**
 * Official U.S. Department of State (DoS) Biometric & Technical Specifications
 * for Diversity Visa (DV Lottery) and U.S. Immigrant / Non-Immigrant Visa Photos.
 * 
 * References:
 * - 22 C.F.R. § 42.33 (Diversity Visa Program Regulations)
 * - U.S. Department of State Bureau of Consular Affairs Photo Requirements
 */

export const MIN_DIM = 600;
export const MAX_DIM = 1200;
export const MAX_BYTES = 245760; // 240 KB (240 * 1024 bytes)
export const MIN_BYTES = 15000; // 15 KB (under this, compression artifacts are severe)

// Biometric Ratios (as fraction of total image height)
export const HEAD_HEIGHT_MIN = 0.50; // 50% (300px on 600x600 canvas)
export const HEAD_HEIGHT_MAX = 0.69; // 69% (414px on 600x600 canvas)
export const TARGET_HEAD_HEIGHT = 0.595; // 59.5% (357px sweet spot)

// Eye level measured from the BOTTOM of the photo
export const EYE_HEIGHT_MIN = 0.56; // 56% from bottom (336px from bottom, Y = 264px from top)
export const EYE_HEIGHT_MAX = 0.69; // 69% from bottom (414px from bottom, Y = 186px from top)
export const TARGET_EYE_HEIGHT = 0.625; // 62.5% from bottom (375px from bottom, Y = 225px from top)

// Centering & Alignment tolerances
export const MAX_CENTERING_OFFSET = 0.06; // Face center within ±6% of vertical center axis
export const MAX_TILT_DEGREES = 3.0; // Max acceptable head roll angle in degrees
export const TARGET_TILT_DEGREES = 1.5; // Auto-align threshold

// Background & Lighting tolerances
export const BG_LUMA_MIN = 240; // High luma for off-white to pure white background
export const BG_RGB_VARIANCE_MAX = 12; // Maximum RGB channel variance across background
export const BG_LUMA_STD_DEV_MAX = 18; // Max standard deviation of background luminance
export const MAX_LIGHTING_ASYMMETRY = 0.25; // Max 25% luminance difference between cheeks

// JPEG Magic Bytes and signatures
export const JPEG_MAGIC_BYTES = [0xFF, 0xD8, 0xFF];

// Printable Sheet Specifications (4x6 inch sheet @ 300 DPI)
export const PRINT_SHEET_WIDTH = 1800; // 6 inches * 300 DPI
export const PRINT_SHEET_HEIGHT = 1200; // 4 inches * 300 DPI
export const PHOTO_PRINT_SIZE = 600; // 2 inches * 300 DPI

