/**
 * Stylized Canvas Backup Card Generator for DV Confirmation Numbers
 * 
 * Generates an official, high-resolution credential backup card (PNG)
 * rendering the applicant details, 16-character confirmation number,
 * QR verification target, and official State Department disclaimers.
 */

import type { VaultRecord } from './vault';

export function renderConfirmationCard(record: VaultRecord): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const width = 1200;
  const height = 675; // 16:9 high-res aspect ratio
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return Promise.reject(new Error('Canvas 2D context unavailable'));
  }

  // 1. Sleek Background with Navy Civic Gradient
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#0F172A'); // Deep Navy
  grad.addColorStop(0.5, '#1E293B');
  grad.addColorStop(1, '#090D16');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Subtle decorative border
  ctx.strokeStyle = '#3B82F6';
  ctx.lineWidth = 4;
  ctx.strokeRect(30, 30, width - 60, height - 60);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  // 2. Header Brand & Seal
  ctx.fillStyle = '#60A5FA';
  ctx.font = 'bold 22px monospace';
  ctx.fillText('U.S. DIVERSITY VISA PROGRAM • ENTRANT STATUS BACKUP', 70, 90);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '14px sans-serif';
  ctx.fillText('CONFIDENTIAL & OFFLINE SECURED CREDENTIAL CARD', 70, 115);

  // Program Badge
  ctx.fillStyle = '#2563EB';
  ctx.beginPath();
  ctx.roundRect(width - 240, 65, 170, 45, 10);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText(`DV-${record.programYear || '2026'}`, width - 200, 95);

  // Divider line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(70, 145);
  ctx.lineTo(width - 70, 145);
  ctx.stroke();

  // 3. Confirmation Number Highlight Box
  ctx.fillStyle = 'rgba(30, 58, 138, 0.4)';
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(70, 170, width - 140, 115, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 16px monospace';
  ctx.fillText('CONFIRMATION NUMBER (KEEP STRICTLY CONFIDENTIAL):', 95, 205);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 44px monospace';
  ctx.letterSpacing = '4px';
  ctx.fillText(record.confirmationNumber, 95, 260);
  ctx.letterSpacing = '0px';

  // 4. Entrant Details Grid
  const startY = 330;
  const col1X = 70;
  const col2X = 450;
  const col3X = 820;

  // Applicant Name
  ctx.fillStyle = '#94A3B8';
  ctx.font = '14px sans-serif';
  ctx.fillText('ENTRANT FULL NAME', col1X, startY);
  ctx.fillStyle = '#F8FAFC';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText(record.fullName || 'N/A', col1X, startY + 32);

  // Year of Birth
  ctx.fillStyle = '#94A3B8';
  ctx.font = '14px sans-serif';
  ctx.fillText('YEAR OF BIRTH', col2X, startY);
  ctx.fillStyle = '#F8FAFC';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText(record.birthYear || 'N/A', col2X, startY + 32);

  // Result Check Date
  ctx.fillStyle = '#94A3B8';
  ctx.font = '14px sans-serif';
  ctx.fillText('RESULT RELEASE DATE', col3X, startY);
  ctx.fillStyle = '#10B981';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText(`May ${parseInt(record.programYear || '2026', 10) - 1 || 2025}`, col3X, startY + 32);

  // 5. Official Verification Instructions & Disclaimer
  const disclaimerY = 440;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.beginPath();
  ctx.roundRect(70, disclaimerY, width - 140, 145, 12);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.stroke();

  ctx.fillStyle = '#E2E8F0';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText('Official Result Check Portal: dvprogram.state.gov', 95, disclaimerY + 35);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '13px sans-serif';
  const lines = [
    '1. The U.S. Department of State NEVER notifies selectees by email, letter, or phone call.',
    '2. You MUST check your status yourself on dvprogram.state.gov using this 16-character confirmation number.',
    '3. dvphotocheck.tech is a client-side privacy utility. This card was generated 100% offline on your device.',
  ];
  lines.forEach((line, i) => {
    ctx.fillText(line, 95, disclaimerY + 68 + i * 22);
  });

  // Footer Tagline
  ctx.fillStyle = '#64748B';
  ctx.font = '11px monospace';
  ctx.fillText(`Generated locally on ${new Date().toLocaleDateString()} • Zero Server Transmission`, 70, height - 42);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to generate card image blob'));
      },
      'image/png',
      1.0
    );
  });
}

