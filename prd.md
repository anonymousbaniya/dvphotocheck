# Product Requirements Document (PRD): dvphotocheck.tech

## 1. Product Overview
* **Product Name:** dvphotocheck.tech
* **Tagline:** The Smarter, 100% Private U.S. Diversity Visa (Green Card Lottery) Photo & Application Suite.
* **Objective:** Build an industry-leading, privacy-first web toolkit for U.S. Diversity Visa (DV Lottery) applicants that surpasses `dvphotocheck.com` in usability, biometric accuracy, mobile compatibility, and applicant organization.
* **Target Audience:** Global applicants entering the annual U.S. Diversity Visa Program, as well as selectees preparing for DS-260 submission and consular interviews. Often accessing via mid-range smartphones on varying network speeds.

---

## 2. Competitive Gap Analysis (`dvphotocheck.com` vs. `dvphotocheck.tech`)

| Feature / Dimension | `dvphotocheck.com` (Baseline) | `dvphotocheck.tech` (Our Superior Product) |
| :--- | :--- | :--- |
| **Photo Cropping** | Manual drag, zoom slider, and 90° rotation inside an oval template. | **1-Click AI Biometric Auto-Crop** (auto-detects crown, chin, eye line, and levels tilted heads) + manual fine-tuning. |
| **Photo Checker** | Checks basic file metadata only ($600 \times 600\text{ px}$, $<240\text{ KB}$, JPEG). | **12-Point Biometric & Technical Audit:** Validates actual head height %, eye level %, head tilt, eyeglasses, background shadows, and JPEG headers. |
| **Camera Capture** | Upload existing file only. | **Live Guided Selfie Camera:** Take a photo directly in-browser with live posture/lighting feedback and a timer. |
| **Supported Formats** | Standard JPG/PNG. | **Full Apple `.HEIC`, `.WEBP`, `.PNG`, `.JPG` support** with automatic client-side conversion to baseline sRGB JPEG. |
| **Family Management** | Single photo export (`DV-Lottery-Photo.jpg`). | **Family Batch Mode:** Process & zip named photos for Principal, Spouse, and Children (`LastName_FirstName_Role.jpg`) so families don't mix up files. |
| **Print Support** | Digital $600 \times 600$ only. | **4x6" Print Sheet Generator:** Generates a printable $4 \times 6\text{ inch}$ sheet with six $2 \times 2\text{ inch}$ photos and cut marks for the Consular Interview. |
| **Confirmation Saver** | Plaintext browser `localStorage`. | **Encrypted Vault + Printable Recovery Card:** Passphrase encryption + downloadable PNG/PDF card with QR code so clearing browser cache never loses the number. |

---

## 3. Core Feature Epics & User Stories

### Epic 1: Intelligent DV Photo Crop & Studio (`PhotoWorkspace`)
**Goal:** Allow any user to turn a raw smartphone portrait into a 100% compliant $600 \times 600\text{ px}$ ($\le 240\text{ KB}$) DV Lottery photo in under 15 seconds.

* **US 1.1 (Multi-Format Dropzone & Live Camera):** As a user on an iPhone or Android, I can upload `.JPG`, `.PNG`, `.WEBP`, or `.HEIC` files, or open my device camera with a live biometric silhouette overlay.
* **US 1.2 (AI Auto-Align):** As soon as I load a photo, the tool detects my face, levels my eyes horizontally, scales my head to $59.5\%$ of the frame, and places my eyes at $62.5\%$ from the bottom automatically.
* **US 1.3 (Interactive Manual Override):** I can toggle the official USCIS/DoS visual overlay (Green Head Zone: $50\% - 69\%$, Cyan Eye Zone: $56\% - 69\%$) and use touch pinch-to-zoom, drag-to-pan, fine rotation slider ($-15^\circ$ to $+15^\circ$), and $90^\circ$ flip buttons.
* **US 1.4 (Background Lighting Helper):** I can toggle a "Background Exposure Balancer" that gently normalizes off-white/light-gray walls to pure `#FFFFFF` without creating artificial cutout edges, accompanied by a clear disclaimer on official DoS no-alteration rules.
* **US 1.5 (Smart Export):** I can download the final image as a single $600 \times 600\text{ px}$ JPEG (guaranteed $<240\text{ KB}$) OR download a $4 \times 6\text{ inch}$ ($1800 \times 1200\text{ px}$ at 300 DPI) printable sheet containing 6 physical $2 \times 2\text{ inch}$ passport photos for my visa interview.

### Epic 2: 12-Point DV Photo Compliance Checker (`PhotoChecker`)
**Goal:** Give applicants complete peace of mind by auditing pre-cropped photos against both technical file rules and biometric geometry rules.

* **US 2.1 (Technical File Validation):** Instant verification of:
  1. File Format (`image/jpeg` with valid `FF D8 FF` signature).
  2. File Size ($\le 240\text{ KB}$ and $\ge 10\text{ KB}$).
  3. Exact Dimensions ($600 \times 600\text{ px}$ to $1200 \times 1200\text{ px}$).
  4. Aspect Ratio (Exact $1:1$ square).
  5. Color Space & Depth (24-bit color sRGB, rejecting grayscale/monochrome images).
  6. Compression Ratio check (ensuring image is not blurry/over-compressed).
* **US 2.2 (Biometric & Visual Validation):** Using client-side vision, verify and display exact percentages for:
  7. **Head Height Ratio:** Must be $50\% - 69\%$ ($300\text{ px} - 414\text{ px}$). Shows visual ruler on the photo.
  8. **Eye Height Ratio:** Must be $56\% - 69\%$ from bottom ($336\text{ px} - 414\text{ px}$). Shows visual ruler.
  9. **Horizontal Centering & Head Tilt:** Head centered within $\pm 5\%$ of vertical axis; eye-line tilt $< 3^\circ$.
  10. **Background Plainness:** Checks outer background pixels for whiteness and absence of heavy shadows/patterns.
  11. **Eyeglass & Occlusion Check:** Detects if the subject appears to be wearing glasses (banned since 2016) or has eyes closed.
  12. **Neutral Expression Check:** Flags excessive mouth openness/smiling if outside neutral bounds.
* **US 2.3 (One-Click Fix):** If a photo fails dimensions, file size, or head positioning in the Checker, display a `"Fix Automatically in Crop Tool →"` button that passes the image directly into the Cropper.

### Epic 3: Family Batch Photo Organizer (`FamilyPackager`)
**Goal:** Prevent a major cause of DV disqualification—submitting the wrong photo for a family member or reusing an old photo.

* **US 3.1 (Family Roster):** Users can add slots for `Principal Applicant`, `Spouse`, and `Child 1..N`.
* **US 3.2 (Duplicate & EXIF Date Warning):** If the user uploads a photo whose EXIF `DateTimeOriginal` is older than 6 months, display a friendly warning: *"Warning: This photo appears to have been taken more than 6 months ago."* Also block uploading the exact same image hash for two different family members.
* **US 3.3 (Clean ZIP Export):** Export all verified family photos in a single `.zip` with clear filenames (`01_Principal_John_Doe.jpg`, `02_Spouse_Jane_Doe.jpg`).

### Epic 4: Eligibility Calculator & O*NET Work Experience Wizard
**Goal:** Help users verify if they qualify to enter before they waste time filling out the form.

* **US 4.1 (Country & Nativity Resolver):** Interactive wizard asking: *1. Country of Birth*, *2. Spouse's Country of Birth* (Cross-Chargeability check), *3. Parents' Residence at Time of Your Birth*.
* **US 4.2 (Education vs. Work Qualification):** Checks if the user meets the High School Diploma minimum OR guides them through qualifying occupations requiring 2 years of experience (referencing official Department of Labor O*NET Job Zone 4 & 5, SVP $\ge 7.0$ criteria).

### Epic 5: Encrypted Confirmation Saver & Entry Checklist
**Goal:** Solve the #1 tragedy of the DV Lottery—losing the Confirmation Number between November and May, or losing it when browser cache is cleared.

* **US 5.1 (Local Encrypted Vault):** Save Confirmation Number, Entrant Full Name (Last, First, Middle), Year of Birth, and Program Year locally. Optional password lock via Web Crypto AES-GCM.
* **US 5.2 (Downloadable Confirmation Backup Card):** Generate a clean, printable/saveable image card (`DV-Confirmation-Backup.png`) and `.txt` file containing the details + a local QR code so users can save it to their phone's camera roll or Google Drive/iCloud.
* **US 5.3 (Interactive Entry & Selectee Checklist):** Persistent local progress tracker covering Pre-Submission, Submission Day, Result Checking (May), DS-260 Filing, Document Gathering, Medical Exam, and Consular Interview.

### Epic 6: Comprehensive Knowledge Base & Scam Shield
**Goal:** Capture organic SEO traffic and protect immigrants from predatory scams.

* **US 6.1 (8 Structured Guides):**
  1. `How to Apply` (Step-by-step walkthrough + current fee/passport requirement updates).
  2. `Photo Requirements` (Interactive DoS visual examples of Good vs. Bad photos).
  3. `Confirmation Saver & Result Check Guide` (How to use `dvprogram.state.gov`).
  4. `DS-260 Guide` (Post-selection immigrant visa application guide).
  5. `Document Checklist` (Civil documents, police certificates, translations).
  6. `Interview Preparation` (Common consular officer questions & financial proof).
  7. `Visa Bulletin Decoder` (Understanding Case Numbers, regions like AF/AS/EU, and current cutoffs).
  8. `Scam Warning & Fee Guide` (Explaining the official $1 electronic registration fee vs. $330 consular interview fee, and how to spot fake "You Won!" emails).

---

## 4. User Experience (UX) & Design System
* **Visual Identity:** Trustworthy civic-tech aesthetic. Deep Navy (`#0F172A`), Official Trust Blue (`#2563EB`), Compliance Emerald (`#10B981`), Warning Amber (`#F59E0B`), and Alert Crimson (`#EF4444`).
* **Zero-Friction Above the Fold:** The homepage immediately displays the interactive **Drop Photo / Check Photo** workspace above the fold—no marketing fluff blocking the utility.
* **Privacy Transparency:** Every tool features a persistent `"100% Client-Side • 0 Server Uploads • Works Offline"` live status pill. Users can even turn on Airplane Mode after loading the page and verify the tool still works.
* **Accessibility & Internationalization Ready:** High-contrast typography (Inter + JetBrains Mono for technical readouts), full keyboard navigation, and clean string architecture ready for multi-language expansion (English, Spanish, French, Arabic, Nepali, Russian).