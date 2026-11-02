# System Architecture: dvphotocheck.tech

## 1. Architectural Vision & Philosophy
`dvphotocheck.tech` is a **100% Client-Side, Privacy-First, Edge-Delivered Web Application** (with Progressive Web App capabilities). 
Unlike traditional photo processors that upload sensitive biometric photographs to remote cloud servers, `dvphotocheck.tech` executes all computer vision, AI facial landmark detection, canvas manipulation, and compression directly inside the user's browser sandbox using HTML5 Canvas, Web Workers, and WebAssembly (WASM).

### How We Beat `dvphotocheck.com`:
1. **Zero-Click AI Biometric Auto-Crop:** While the competitor forces users to manually drag and zoom their photo to fit an overlay, `dvphotocheck.tech` uses client-side MediaPipe Face Mesh (WASM) to detect the top of the head, chin, and eye level—automatically cropping and rotating the image to strict U.S. Department of State biometric ratios in one click (with manual override available).
2. **Real Biometric Validation (Not Just Metadata):** The competitor's checker only verifies file dimensions ($600 \times 600$) and byte size ($\le 240\text{ KB}$). Our checker validates **actual facial geometry** (head height $50\% - 69\%$, eye height $56\% - 69\%$ from bottom), head tilt, background uniformity, lighting shadows, and eyeglass presence.
3. **Encrypted Confirmation Vault & Printable Backup:** The competitor saves confirmation numbers in plain `localStorage`. We use the native **Web Crypto API (AES-GCM)** so users can lock their confirmation number with a passphrase or export a high-resolution, stylized "Official Confirmation Backup Card" (PNG/PDF) with a QR code.

---

## 2. Technology Stack (Optimized for Antigravity IDE)

* **Framework:** Next.js 14+ (App Router) configured with `output: 'export'` for Static Site Generation (SSG), OR Astro with React Islands (Next.js App Router is recommended for seamless Antigravity component generation).
* **Language:** TypeScript (Strict Mode).
* **Styling & UI:** Tailwind CSS + `shadcn/ui` (Radix Primitives) + Lucide Icons.
* **Client-Side AI & Vision:**
  * `@mediapipe/tasks-vision` (Face Landmarker & Image Segmenter running via WASM/WebGL).
  * HTML5 `<canvas>` and `OffscreenCanvas` (inside Web Workers to prevent UI thread freezing).
* **File Format & Compression Engine:**
  * `heic2any` (Client-side Apple `.HEIC` to `.JPG` conversion).
  * Custom Binary-Search JPEG Compression Loop + `piexifjs` (for stripping/normalizing EXIF metadata and enforcing sRGB color space).
* **Client Storage & Cryptography:**
  * `localStorage` & `IndexedDB` (for offline state and checklists).
  * Native Browser `SubtleCrypto` (Web Crypto API) for Confirmation Vault encryption.
* **Deployment & Edge Network:** Cloudflare Pages or Vercel (Global CDN, HTTP/3, Brotli compression).

---

## 3. High-Level Data Flow (100% Local Sandbox)

```
[User Device: Smartphone Camera / File System]
       │
       ▼ (Drops JPG, PNG, WebP, or Apple HEIC)
┌─────────────────────────────────────────────────────────────────┐
│ BROWSER CLIENT SANDBOX (Zero Network Payload for Images)        │
│                                                                 │
│  1. Ingestion Layer                                             │
│     ├── HEIC/WebP Decoder ──► Normalizes to Raw ImageBitmap     │
│                                                                 │
│  2. Web Worker: AI Biometric Engine (MediaPipe WASM)            │
│     ├── Detects 478 3D Facial Landmarks                         │
│     ├── Calculates Eye-Line Angle (Roll) & Head Pitch/Yaw       │
│     ├── Computes Crown-to-Chin & Eye-to-Bottom Ratios           │
│     └── Segmenter: Isolates Subject from Background             │
│                                                                 │
│  3. Interactive Canvas Engine (600x600 or 1200x1200)            │
│     ├── Auto-Aligns & Scales Face to DoS Spec                   │
│     ├── Manual Fine-Tuning (Zoom, Pan, Rotate, Guideline Toggle)│
│     └── Smart Background Normalizer (Off-White/Pure White)      │
│                                                                 │
│  4. Export & Compliance Pipeline                                │
│     ├── Binary Search JPEG Compressor (Target: 180KB - 235KB)   │
│     ├── EXIF Sanitizer & 24-bit sRGB Enforcer                   │
│     └── Multi-Export: Single 600x600 JPG OR 4x6 Print Sheet     │
└─────────────────────────────────────────────────────────────────┘
       │
       ▼
[Instant Local Download: DV-Lottery-Photo-Verified.jpg]
```

---

## 4. Directory & Module Structure

When building this project in Antigravity, enforce the following modular directory structure:

```text
dvphotocheck.tech/
├── public/
│   ├── models/                     # Cached WASM / MediaPipe model assets (optional local fallback)
│   ├── templates/                  # Official USCIS/DoS SVG silhouette overlays
│   └── manifest.json               # PWA Manifest for offline mobile use
├── src/
│   ├── app/                        # Next.js App Router (Static Export)
│   │   ├── layout.tsx              # Global SEO, Schema.org JSON-LD, Navbar, Footer
│   │   ├── page.tsx                # Landing Page + Unified Photo Tool Workspace
│   │   ├── photo-crop-tool/        # Dedicated Interactive Crop & AI Align Page
│   │   ├── photo-checker/          # Dedicated 12-Point Biometric & Technical Validator
│   │   ├── eligibility-calculator/ # Country of Chargeability + Education/Work Wizard
│   │   ├── entry-checklist/        # Interactive LocalStorage Preparation Tracker
│   │   ├── confirmation-saver/     # AES-GCM Encrypted Vault + Backup Card Generator
│   │   ├── family-photo-packager/  # Multi-applicant batch organizer (Principal, Spouse, Kids)
│   │   └── guides/                 # MDX/Static Content Hub
│   │       ├── how-to-apply/
│   │       ├── photo-requirements/
│   │       ├── ds-260-guide/
│   │       ├── document-checklist/
│   │       ├── interview-prep/
│   │       ├── visa-bulletin/
│   │       └── scam-warning/
│   ├── components/
│   │   ├── ui/                     # shadcn/ui reusable primitives
│   │   ├── tools/
│   │   │   ├── PhotoWorkspace.tsx  # Master Canvas + Controls
│   │   │   ├── BiometricOverlay.tsx# SVG interactive guidelines (Head oval, Eye band)
│   │   │   ├── CheckerReport.tsx   # Live 12-point green/red compliance matrix
│   │   │   ├── PrintSheetGen.tsx   # 4x6 inch (4-up / 6-up) printable sheet generator
│   │   │   └── CameraCapture.tsx   # Live WebRTC Selfie Camera with posture silhouette
│   │   └── layout/
│   │       ├── PrivacyBadge.tsx    # Live "Offline-Ready / 0 Bytes Uploaded" indicator
│   │       └── Header.tsx
│   ├── lib/
│   │   ├── vision/
│   │   │   ├── faceLandmarker.ts   # MediaPipe initialization & landmark math
│   │   │   ├── autoCropMath.ts     # Affine transformation matrix for auto-centering
│   │   │   └── bgAnalyzer.ts       # Pixel variance, shadow, and RGB #FFFFFF threshold logic
│   │   ├── image/
│   │   │   ├── compressor.ts       # Iterative binary-search JPEG byte compressor (<240KB)
│   │   │   ├── heicConverter.ts    # Wrapper for Apple HEIC ingestion
│   │   │   └── exifValidator.ts    # File header (FF D8 FF) & color depth checker
│   │   ├── crypto/
│   │   │   └── vault.ts            # Web Crypto API encryption/decryption for Confirmation #
│   │   └── constants/
│   │       ├── dvSpecs.ts          # Hardcoded DoS mathematical constants
│   │       └── countries.ts        # Eligible/Ineligible countries + O*NET job zones
│   └── workers/
│       └── imageProcessor.worker.ts# Offloads heavy pixel manipulation from main UI thread
```

---

## 5. Core Technical Algorithms & Specifications

### 5.1 Biometric Auto-Crop Geometry (`autoCropMath.ts`)
The U.S. Department of State requires:
* **Output Dimensions:** $600 \times 600\text{ px}$ (minimum) to $1200 \times 1200\text{ px}$ (maximum), $1:1$ aspect ratio.
* **Head Height ($H_{\text{head}}$):** From the top of the hair/crown ($Y_{\text{crown}}$) to the bottom of the chin ($Y_{\text{chin}}$) must occupy between $50\%$ ($300\text{ px}$) and $69\%$ ($414\text{ px}$) of total image height. Target sweet spot: **$59.5\%$ ($357\text{ px}$)**.
* **Eye Level ($Y_{\text{eyes}}$):** Measured from the **bottom** of the photo to the horizontal line passing through both pupils, must be between $56\%$ ($336\text{ px}$ from bottom, or $Y = 264\text{ px}$ from top) and $69\%$ ($414\text{ px}$ from bottom, or $Y = 186\text{ px}$ from top). Target sweet spot: **$62.5\%$ from bottom ($Y = 225\text{ px}$ from top)**.

**Algorithmic Execution:**
1. Extract landmarks from MediaPipe: Left Pupil ($P_L$), Right Pupil ($P_R$), Chin Bottom ($P_{\text{chin}}$), Forehead Top ($P_{\text{forehead}}$).
2. Estimate Crown ($Y_{\text{crown}}$) by extending the vector from $P_{\text{chin}} \to P_{\text{forehead}}$ upward by $18\%$ to account for hair volume (or using the top bounding pixel of the MediaPipe Person Segmenter mask).
3. Calculate head roll angle:
   $$\theta = \arctan2(P_{R,y} - P_{L,y}, P_{R,x} - P_{L,x})$$
   If $|\theta| > 1.5^\circ$, auto-rotate canvas by $-\theta$ to level the eyes horizontally.
4. Calculate required scale factor ($S$):
   $$S = \frac{357}{Y_{\text{chin}} - Y_{\text{crown}}}$$
5. Translate image so the midpoint between pupils aligns at $X = 300\text{ px}$ and $Y = 225\text{ px}$.

### 5.2 Iterative Byte-Ceiling Compressor (`compressor.ts`)
* **Constraint:** File size must be $\le 240,000\text{ bytes}$ ($240\text{ KB}$). However, overly compressed photos ($\le 30\text{ KB}$) may be rejected for compression artifacts.
* **Algorithm:**
  1. Render final $600 \times 600$ canvas.
  2. Run binary search on `canvas.toBlob('image/jpeg', quality)` with `quality` $\in [0.50, 0.98]$.
  3. Find the highest `quality` value that produces a Blob size between $150\text{ KB}$ and $235\text{ KB}$.
  4. Verify JPEG magic bytes (`FF D8 FF`) and inject standard JFIF 96/300 DPI headers if required.

### 5.3 Smart Background Lightener & Shadow Detector (`bgAnalyzer.ts`)
* **Policy Nuance:** The U.S. Department of State prohibits heavy digital alterations that change a person's appearance or swap backgrounds completely with artificial cutouts, which can trigger fraud detection filters. However, correcting minor exposure/white-balance cast on a real white wall is helpful.
* **Implementation:**
  1. **Shadow/Uniformity Check:** Sample peripheral background blocks (top-left, top-right, mid-left, mid-right outside the shoulder mask). Compute luminance standard deviation ($\sigma_L$). If $\sigma_L > 18$, warn the user: *"Uneven lighting or shadow detected on background."*
  2. **Subtle Exposure Balance (Optional Toggle):** Instead of a harsh jagged magic-wand cutout, apply a soft levels adjustment (white-point clipping) to background pixels with low saturation ($S < 0.12$) and high luminance ($L > 0.78$), smoothly shifting off-white/cream walls toward `#FFFFFF` while preserving natural hair edges.

---

## 6. Performance, Privacy & Security Architecture
* **Zero Telemetry on Photos:** Enforce a strict Content Security Policy (`CSP`) where `connect-src` blocks outbound POST requests from the photo tool routes. Display a live **"Network Inspector Proof"** badge showing `0 KB Uploaded`.
* **Lighthouse 100/100 Target:**
  * Lazy-load the WASM AI models only when the user drops an image or clicks "Open Camera".
  * First Contentful Paint (FCP) $< 0.8\text{s}$ via static HTML generation.
* **PWA Offline Support:** Register a Service Worker that caches the core HTML, CSS, JS, and WASM models so applicants in regions with unstable internet can load the site once and process photos completely offline.