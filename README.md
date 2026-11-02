# DV Photo Checker & Biometric Suite (DV-2026 Ready)

A privacy-first, 100% client-side web application for verifying, calibrating, and cropping photos for the U.S. Electronic Diversity Immigrant Visa (Green Card Lottery) Program.

Zero server uploads. All image processing, facial landmark calculation, and encryption execute strictly within the browser memory via WebAssembly and HTML5 Canvas.

---

## Key Features

- **Photo Inspector & Calibration:** Drag-and-drop or use the live camera to inspect your photo with pan, zoom, and rotation controls.
- **Biometric Overlays:** Official U.S. State Department eye-level band (56%–69% from bottom) and head oval (50%–69% height).
- **1-Click AI Auto-Align:** Automatic face detection and head-tilt leveling using MediaPipe FaceLandmarker in WebAssembly.
- **Background Lightener:** Intelligent luminance thresholding to whiten off-white backgrounds without washing out hair or clothing.
- **Compliant Exporters:**
  - Standard 600×600 px JPEG strictly compressed under 240 KB with binary-search optimization.
  - 4×6-inch print sheet (1800×1200 px at 300 DPI) containing 6 photo tiles with cutting guides.
- **12-Point Compliance Audit:** Comprehensive checks covering file format, dimensions, aspect ratio, color depth, brightness, head/eye proportions, and EXIF metadata stripping.
- **Crop Studio:** Multi-resolution crop (600×600 or 1200×1200) and family batch processing with single-click ZIP export.
- **Eligibility Calculator:** 3-step wizard evaluating native country chargeability, cross-chargeability, and education/work qualifications.
- **Entry Checklist:** 12-step preparation roadmap with LocalStorage progress persistence and printable view.
- **Confirmation Vault:** Client-side PBKDF2 + AES-256-GCM encrypted confirmation number storage and printable backup card.
- **Reference Gallery & Guides:** Official photo specimens comparing compliant vs. non-compliant photos.

---

## Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router, Static Export ready)
- **UI & Styling:** [React 18](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide.dev/)
- **Vision & AI:** [@mediapipe/tasks-vision](https://developers.google.com/mediapipe/solutions/vision/face_landmarker) (Client-side WebAssembly)
- **Image Processing:** HTML5 Canvas, Sharp (for build-time tests), `heic2any` (HEIC/HEIF conversion)
- **Utilities:** `jszip`, `canvas-confetti`, `clsx`, `tailwind-merge`

---

## Getting Started Locally

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.17.0 or later)
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/dvphotocheck.git
   cd dvphotocheck
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Production Build & Deploy

To build the static production bundle:

```bash
npm run build
```

This generates the static export in the `out/` directory, ready for deployment on [Vercel](https://vercel.com), Netlify, GitHub Pages, or any static web host.

---

## Deployment to Vercel

1. Push this repository to GitHub.
2. Sign in to [Vercel](https://vercel.com/) and click **Add New > Project**.
3. Import your GitHub repository (`dvphotocheck`).
4. Keep the default settings (Framework Preset: **Next.js**).
5. Click **Deploy**.

---

## Disclaimer

This utility is an independent verification tool built according to publicly available U.S. Department of State photo specifications. It is not affiliated with, endorsed by, or associated with the U.S. Government or the U.S. Department of State.
