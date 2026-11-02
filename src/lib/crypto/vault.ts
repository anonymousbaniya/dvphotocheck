/**
 * Zero-Knowledge Encrypted Confirmation Vault
 * 
 * Uses the native Web Crypto API:
 * - PBKDF2 (SHA-256, 100,000 iterations) for key derivation from user passphrase
 * - AES-GCM (256-bit key, 12-byte random IV) for authenticated encryption
 * - Zero plaintext data transmitted over any network (100% client-side)
 */

export interface VaultRecord {
  id: string;
  confirmationNumber: string; // 16 characters e.g. 20261A2B3C4D5E6F
  programYear: string; // e.g. "2026" or "2027"
  fullName: string;
  birthYear: string;
  submissionDate?: string;
  notes?: string;
  createdAt: string;
}

export interface EncryptedVaultEnvelope {
  version: 1;
  isEncrypted: boolean;
  saltHex?: string; // 16 bytes for PBKDF2
  ivHex?: string; // 12 bytes for AES-GCM
  cipherTextHex?: string; // Encrypted JSON string
  plainRecords?: VaultRecord[]; // Present only when isEncrypted === false
}

export const VAULT_STORAGE_KEY = 'dv_vault_v1';

/**
 * Validates a 16-character DV Confirmation Number format
 * Pattern: 4-digit Year (e.g. 2025, 2026, 2027) followed by 12 alphanumeric characters
 */
export function validateConfirmationNumber(code: string): {
  isValid: boolean;
  year?: string;
  cleanCode: string;
  error?: string;
} {
  const clean = code.trim().toUpperCase().replace(/[\s-]/g, '');

  if (clean.length === 0) {
    return { isValid: false, cleanCode: clean, error: 'Confirmation number is required.' };
  }

  if (clean.length !== 16) {
    return {
      isValid: false,
      cleanCode: clean,
      error: `Invalid length (${clean.length}/16 chars). DV confirmation numbers are exactly 16 characters.`,
    };
  }

  const yearPrefix = clean.substring(0, 4);
  const yearNum = parseInt(yearPrefix, 10);
  if (isNaN(yearNum) || yearNum < 2020 || yearNum > 2035) {
    return {
      isValid: false,
      cleanCode: clean,
      error: `Invalid program year prefix (${yearPrefix}). Must start with 4-digit year like 2026 or 2027.`,
    };
  }

  // Check remaining 12 alphanumeric characters
  const suffix = clean.substring(4);
  if (!/^[A-Z0-9]{12}$/.test(suffix)) {
    return {
      isValid: false,
      cleanCode: clean,
      error: 'Suffix must contain exactly 12 alphanumeric characters (letters and numbers only).',
    };
  }

  return { isValid: true, year: yearPrefix, cleanCode: clean };
}

/**
 * Common typo correction for official State Department entrant status check
 * (e.g. 0 vs O, 1 vs I, 8 vs B)
 */
export function suggestCharacterCorrections(code: string): string[] {
  const clean = code.trim().toUpperCase();
  const suggestions: string[] = [];

  // If there's an 'O' in numeric positions or '0' in letter positions
  if (clean.includes('O') || clean.includes('0')) {
    suggestions.push(`Try swapping 'O' (letter) and '0' (number): ${clean.replace(/O/g, '0')}`);
  }
  if (clean.includes('I') || clean.includes('1')) {
    suggestions.push(`Try swapping 'I' (letter) and '1' (number): ${clean.replace(/I/g, '1')}`);
  }
  if (clean.includes('B') || clean.includes('8')) {
    suggestions.push(`Try swapping 'B' (letter) and '8' (number): ${clean.replace(/B/g, '8')}`);
  }

  return suggestions;
}

// Helpers for buffer to hex conversions
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

/**
 * Derives a 256-bit AES-GCM CryptoKey from a passphrase using PBKDF2
 */
async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase) as unknown as BufferSource,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as unknown as BufferSource,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts an array of VaultRecords with AES-GCM
 */
export async function encryptVault(
  records: VaultRecord[],
  passphrase?: string
): Promise<EncryptedVaultEnvelope> {
  if (typeof window === 'undefined') {
    throw new Error('Web Crypto is only available client-side in browser.');
  }

  // If no passphrase supplied, return unencrypted envelope
  if (!passphrase || passphrase.trim() === '') {
    return {
      version: 1,
      isEncrypted: false,
      plainRecords: records,
    };
  }

  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);

  const enc = new TextEncoder();
  const dataBytes = enc.encode(JSON.stringify(records));

  const cipherBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv as unknown as BufferSource },
    key,
    dataBytes as unknown as BufferSource
  );

  return {
    version: 1,
    isEncrypted: true,
    saltHex: bufferToHex(salt.buffer),
    ivHex: bufferToHex(iv.buffer),
    cipherTextHex: bufferToHex(cipherBuffer),
  };
}

/**
 * Decrypts an EncryptedVaultEnvelope with a passphrase
 */
export async function decryptVault(
  envelope: EncryptedVaultEnvelope,
  passphrase?: string
): Promise<VaultRecord[]> {
  if (!envelope.isEncrypted) {
    return envelope.plainRecords || [];
  }

  if (!passphrase) {
    throw new Error('Passphrase required to unlock encrypted vault.');
  }

  if (!envelope.saltHex || !envelope.ivHex || !envelope.cipherTextHex) {
    throw new Error('Corrupted vault envelope metadata.');
  }

  const salt = hexToBuffer(envelope.saltHex);
  const iv = hexToBuffer(envelope.ivHex);
  const cipherBytes = hexToBuffer(envelope.cipherTextHex);

  const key = await deriveKey(passphrase, salt);

  try {
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv as unknown as BufferSource },
      key,
      cipherBytes as unknown as BufferSource
    );

    const dec = new TextDecoder();
    const jsonStr = dec.decode(decryptedBuffer);
    return JSON.parse(jsonStr) as VaultRecord[];
  } catch (e) {
    throw new Error('Incorrect passphrase or corrupted vault data.');
  }
}
