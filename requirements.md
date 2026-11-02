# Technical & Functional Requirements: dvphotocheck.tech

> **Instructions for Antigravity IDE:** Use this file as the definitive engineering specification and acceptance criteria checklist when generating code, components, and tests for `dvphotocheck.tech`.

---

## 1. Functional Requirements (FR)

### Module A: Photo Ingestion & Canvas Engine
* **FR-A1 (File Formats):** The file input dropzone MUST accept `image/jpeg`, `image/png`, `image/webp`, and `image/heic` / `image/heif`. If an Apple `.HEIC` file is provided, it MUST be automatically converted client-side to an `ImageBitmap` prior to rendering.
* **FR-A2 (WebRTC Camera):** The application MUST provide a `"Take Photo with Camera"` button utilizing `navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1920 }, height: { ideal: 1920 } } })` with a live SVG head-and-shoulders guide overlay and a 3-second countdown timer.
* **FR-A3 (Output Resolution Toggle):** The user MUST be able to export at the standard **$600 \times 600\text{ px}$** (default) or high-res **$1200 \times 1200\text{ px}$**, both strictly maintaining a $1:1$ aspect ratio and $< 240\text{ KB}$ file size.
* **FR-A4 (Biometric Overlay):** The interactive canvas MUST display toggleable SVG measurement zones:
  * **Crown Line (Top of Head):** Guided zone between $Y = 30\text{ px}$ and $Y = 120\text{ px}$ (on a $600\text{ px}$ canvas).
  * **Chin Line (Bottom of Head):** Guided zone ensuring total head height is $300\text{ px}$ ($50\%$) to $414\text{ px}$ ($69\%$).
  * **Eye Level Band:** Horizontal cyan band between $Y = 186\text{ px}$ ($69\%$ from bottom) and $Y = 264\text{ px}$ ($56\%$ from bottom).
  * **Vertical Center Line:** Dashed vertical center axis at $X = 300\text{ px}$.

### Module B: AI Auto-Crop & Biometric Validator
* **FR-B1 (Facial Landmark Detection):** Integrate `@mediapipe/tasks-vision` (`FaceLandmarker`) running in browser WASM/WebGL mode (with graceful fallback to manual mode if WebGL is disabled).
* **FR-B2 (1-Click Auto-Align):** Provide an `"Auto-Align & Crop"` button that automatically:
  1. Rotates the image so the angle between left and right eye centers is $0^\circ$.
  2. Scales the image so the crown-to-chin height equals $357\text{ px}$ ($59.5\%$ of $600\text{ px}$).
  3. Positions the midpoint of the eyes at $(X = 300\text{ px}, Y = 225\text{ px})$.
* **FR-B3 (12-Point Compliance Matrix):** The Photo Checker MUST evaluate and render a live status badge (`PASS`, `WARNING`, `FAIL`) for each of the following 12 checks:

| Check ID | Requirement Name | Mathematical / Technical Acceptance Rule |
| :--- | :--- | :--- |
| `CHK-01` | File Format | Valid JPEG (`image/jpeg`), Magic Bytes start with `FF D8 FF`. |
| `CHK-02` | File Size | $\le 240,000\text{ bytes}$ ($240\text{ KB}$) AND $\ge 15,000\text{ bytes}$. |
| `CHK-03` | Image Dimensions | Width $\in [600, 1200]\text{ px}$, Height $\in [600, 1200]\text{ px}$. |
| `CHK-04` | Aspect Ratio | $\text{Width} === \text{Height}$ (Exact $1:1$ square). |
| `CHK-05` | Color Depth | 24-bit RGB color; check that R, G, B channels are not identical ($R \neq G \neq B$ across facial pixels) to reject black-and-white photos. |
| `CHK-06` | Head Height Ratio | $\frac{Y_{\text{chin}} - Y_{\text{crown}}}{\text{Height}} \in [0.50, 0.69]$. |
| `CHK-07` | Eye Distance from Bottom | $\frac{\text{Height} - Y_{\text{eyes}}}{\text{Height}} \in [0.56, 0.69]$. |
| `CHK-08` | Horizontal Centering | $\frac{|X_{\text{nose}} - (\text{Width}/2)|}{\text{Width}} \le 0.06$ (Within $6\%$ of center). |
| `CHK-09` | Head Tilt / Pose | Roll $|\theta| \le 3.0^\circ$; Yaw symmetry ratio between left/right cheek width $\in [0.80, 1.20]$. |
| `CHK-10` | Background Uniformity | Sampled corner/edge regions must have mean RGB $> 225$ and luminance standard deviation $\sigma < 18$. |
| `CHK-11` | Facial Lighting Symmetry | Difference in average luminance between left cheek and right cheek $\le 25\%$ (flags harsh side shadows). |
| `CHK-12` | Recency & EXIF Audit | If EXIF `DateTimeOriginal` exists and is $> 180\text{ days}$ from current date, flag `WARNING: Photo may be older than 6 months`. |

### Module C: Export, Compression & Print Engine
* **FR-C1 (Byte-Exact JPEG Compression):** When exporting, execute a binary search over JPEG quality parameters so the output file size lands safely between **$140\text{ KB}$ and $235\text{ KB}$**, never exceeding $240,000\text{ bytes}$.
* **FR-C2 (EXIF Sanitization):** Strip potentially problematic camera maker notes or GPS coordinates while ensuring clean sRGB baseline JPEG headers.
* **FR-C3 (4x6 Printable Sheet Generator):** Provide a secondary export button `"Download 4x6 Print Sheet (6 Photos)"` that creates an $1800 \times 1200\text{ px}$ ($300\text{ DPI}$) canvas containing six $600 \times 600\text{ px}$ ($2 \times 2\text{ inch}$) photos arranged in a $3 \times 2$ grid with subtle light-gray crop marks for physical printing.

### Module D: Applicant Utilities (Eligibility, Checklist, Confirmation Vault)
* **FR-D1 (Eligibility Checker):** Must include an up-to-date country lookup list distinguishing eligible and historically ineligible countries, plus an interactive 2-step flow for Cross-Chargeability (Spouse/Parent exceptions) and Education/Work Experience verification.
* **FR-D2 (Encrypted Confirmation Saver):**
  * Store records in `localStorage` under key `dv_vault_v1`.
  * Allow optional AES-GCM encryption via `window.crypto.subtle` using a user-supplied PIN/passphrase (PBKDF2 key derivation).
  * Provide a `"Download Backup Card (PNG)"` feature that renders the Confirmation Number, Full Name, Birth Year, and Official Result Check URL (`dvprogram.state.gov`) onto a stylized HTML5 canvas and downloads it to the user's device.
* **FR-D3 (Interactive Entry Checklist):** Multi-stage checklist with completion percentage progress bar, persisted automatically in `localStorage`, with an option to export/print the checklist.

---

## 2. Non-Functional Requirements (NFR)

* **NFR-01 (100% Client-Side Privacy Guarantee):** Zero image blobs, base64 strings, facial landmarks, or confirmation numbers may ever be transmitted over the network. All processing MUST happen in memory inside the client browser.
* **NFR-02 (Offline Functionality):** Once loaded, the Photo Cropper, Photo Checker, and Confirmation Saver MUST function even if the user disconnects from the internet (`navigator.onLine === false`).
* **NFR-03 (Performance & Bundle Size):**
  * Core initial JS bundle $< 150\text{ KB}$ (gzipped).
  * MediaPipe WASM vision assets MUST be dynamically imported (`import()`) only when the user interacts with the photo tool.
  * Google PageSpeed / Lighthouse target: **$\ge 95$ across Performance, Accessibility, Best Practices, and SEO**.
* **NFR-04 (Mobile Responsiveness):** Touch gestures (pinch-to-zoom, single-finger drag) on the HTML5 canvas MUST prevent default page scrolling (`touch-action: none`) so mobile users can position their face smoothly.
* **NFR-05 (Legal & Government Disclaimer):** The footer and header MUST clearly state that `dvphotocheck.tech` is an independent, privacy-first utility and is **not** affiliated with the U.S. Department of State, USCIS, or any government agency, while linking directly to `dvprogram.state.gov`.

---

## 3. Step-by-Step Build Plan for Antigravity IDE

When prompting Antigravity to build the codebase from these three `.md` files, execute in these 5 phases:

1. **Phase 1: Project Scaffolding & Design System**
   * Initialize Next.js (Static Export) + Tailwind CSS + `shadcn/ui` + Lucide icons.
   * Build the global layout, responsive navigation, Privacy Proof Badge (`0 Bytes Uploaded`), and SEO metadata structure.
2. **Phase 2: Core Image & Biometric Engine (`src/lib/`)**
   * Implement `compressor.ts` (binary search $<240\text{ KB}$ JPEG exporter).
   * Implement `faceLandmarker.ts` & `autoCropMath.ts` (MediaPipe integration + crown/chin/eye ratio math).
   * Implement `bgAnalyzer.ts` (background luminance/shadow checker + subtle white-point normalizer).
3. **Phase 3: Interactive Tools (`PhotoWorkspace` & `PhotoChecker`)**
   * Build the unified drag-and-drop + WebRTC Camera workspace with SVG biometric overlays, auto-crop button, manual zoom/pan/rotate controls, and 4x6 print sheet generator.
   * Build the 12-Point Compliance Checker dashboard with visual measurement rulers drawn directly over the uploaded photo.
4. **Phase 4: Applicant Suite (`Eligibility`, `Checklist`, `Confirmation Vault`, `Family Packager`)**
   * Build the interactive Eligibility Wizard, LocalStorage Entry Checklist, Family Batch ZIP packager, and Web-Crypto Confirmation Saver with PNG Backup Card export.
5. **Phase 5: SEO Guides, FAQ Schema & PWA Polish**
   * Generate the 8 comprehensive Markdown/MDX guides (How to Apply, Photo Specs, DS-260, Interview Prep, Visa Bulletin, Scam Warning, etc.) with structured `FAQPage` and `SoftwareApplication` JSON-LD schema.