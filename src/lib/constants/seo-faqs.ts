export interface SeoFaqItem {
  question: string;
  answer: string;
}

export const DV_SEO_FAQS: SeoFaqItem[] = [
  {
    question: "What is DVPhotoCheck (dvphotocheck.tech)?",
    answer:
      "DVPhotoCheck (dvphotocheck.tech) is a free, 100% client-side DV Photo Check and U.S. Diversity Visa (Green Card Lottery) photo checker and biometric cropper. It instantly validates image dimensions, file size, head proportions, eye level, and background brightness directly inside your web browser.",
  },
  {
    question: "What are the official DV Lottery photo requirements (600x600 pixels, 240 KB, JPEG)?",
    answer:
      "Per official U.S. Department of State guidelines, your DV Lottery photo must be an exact 1:1 square JPEG (.jpg) measuring 600×600 pixels to 1200×1200 pixels, in 24-bit sRGB color, and strictly under 240 KB (245,760 bytes). Head height must measure 50% to 69% of the image height, eye level must fall between 56% and 69% from the bottom edge, the background must be plain white or off-white without shadows, and eyeglasses are prohibited.",
  },
  {
    question: "How do I check my head size (50%–69%) and eye level (56%–69%) on DVPhotoCheck?",
    answer:
      "Upload or capture your photo in the inspector and click Auto-Align or adjust the zoom, rotation, and pan controls to fit the live State Department oval and eye-level band. Our local biometric validator measures head height and eye-line geometry automatically before exporting a compliant 600×600 JPEG.",
  },
  {
    question: "Is my photo uploaded to any server on DVPhotoCheck?",
    answer:
      "No. All facial landmark detection, cropping, background lightening, EXIF stripping, and 240 KB JPEG compression run 100% locally in your browser using HTML5 Canvas and WebAssembly. Zero bytes of your photo or personal data are ever transmitted to or stored on any remote server.",
  },
];

