"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  KeyRound, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  Plus, 
  Download, 
  Copy, 
  ExternalLink, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Sparkles,
  Info,
  Calendar,
  Image as ImageIcon
} from "lucide-react";
import { 
  VAULT_STORAGE_KEY, 
  validateConfirmationNumber, 
  suggestCharacterCorrections, 
  encryptVault, 
  decryptVault, 
  type VaultRecord, 
  type EncryptedVaultEnvelope 
} from "@/lib/crypto/vault";
import { renderConfirmationCard } from "@/lib/crypto/card-generator";
import { cn } from "@/lib/utils";

export default function VaultPage() {
  const [records, setRecords] = useState<VaultRecord[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [hasEncryptedData, setHasEncryptedData] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [unlockError, setUnlockError] = useState<string | null>(null);

  // New Record Form State
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [confCode, setConfCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [programYear, setProgramYear] = useState('2027');
  const [notes, setNotes] = useState('');
  const [formPassphrase, setFormPassphrase] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load Vault on Mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(VAULT_STORAGE_KEY);
      if (stored) {
        try {
          const envelope: EncryptedVaultEnvelope = JSON.parse(stored);
          if (envelope.isEncrypted) {
            setHasEncryptedData(true);
            setIsLocked(true);
          } else {
            setRecords(envelope.plainRecords || []);
            setHasEncryptedData(false);
            setIsLocked(false);
          }
        } catch {
          // Corrupted data
        }
      }
    }
  }, []);

  // Save Records to Storage
  const persistVault = async (updatedRecords: VaultRecord[], currentPassphrase?: string) => {
    setRecords(updatedRecords);
    if (typeof window !== "undefined") {
      const envelope = await encryptVault(updatedRecords, currentPassphrase);
      localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(envelope));
      setHasEncryptedData(envelope.isEncrypted);
    }
  };

  // Unlock Vault
  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setUnlockError(null);
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem(VAULT_STORAGE_KEY);
    if (!stored) return;

    try {
      const envelope: EncryptedVaultEnvelope = JSON.parse(stored);
      const decrypted = await decryptVault(envelope, passphrase);
      setRecords(decrypted);
      setIsLocked(false);
      setUnlockError(null);
    } catch (err: any) {
      setUnlockError(err?.message || "Incorrect passphrase.");
    }
  };

  // Lock Vault
  const handleLockVault = () => {
    if (hasEncryptedData) {
      setIsLocked(true);
      setRecords([]);
      setPassphrase('');
    }
  };

  // Add Record
  const handleSaveRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const validation = validateConfirmationNumber(confCode);
    if (!validation.isValid) {
      setFormError(validation.error || 'Invalid confirmation code');
      return;
    }

    if (!fullName.trim()) {
      setFormError('Please enter the principal applicant full name.');
      return;
    }

    const newRecord: VaultRecord = {
      id: Math.random().toString(36).substring(2, 9),
      confirmationNumber: validation.cleanCode,
      programYear,
      fullName: fullName.trim(),
      birthYear: birthYear.trim(),
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
    };

    const updated = [...records, newRecord];
    await persistVault(updated, formPassphrase || passphrase);

    // Reset Form
    setConfCode('');
    setFullName('');
    setBirthYear('');
    setNotes('');
    setFormPassphrase('');
    setIsAddingNew(false);
  };

  // Delete Record
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to remove this record from your vault?")) {
      const updated = records.filter((r) => r.id !== id);
      await persistVault(updated, passphrase);
    }
  };

  // Copy Code & Open Official Result Checker
  const handleCopyAndOpenPortal = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 3000);
    window.open("https://dvprogram.state.gov", "_blank", "noopener,noreferrer");
  };

  // Download Visual Backup Card PNG
  const handleDownloadCard = async (record: VaultRecord) => {
    try {
      const blob = await renderConfirmationCard(record);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `DV_Confirmation_Backup_${record.confirmationNumber}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to render confirmation card");
    }
  };

  // Download TXT Backup
  const handleDownloadTxt = (record: VaultRecord) => {
    const textContent = `U.S. DIVERSITY VISA LOTTERY CONFIRMATION RECORD
============================================================
Confirmation Number: ${record.confirmationNumber}
Entrant Full Name:   ${record.fullName}
Year of Birth:       ${record.birthYear}
Program Year:        DV-${record.programYear}
Date Saved:          ${new Date(record.createdAt).toLocaleDateString()}
Notes:               ${record.notes || 'None'}

OFFICIAL INSTRUCTIONS:
- Results are released in May on: https://dvprogram.state.gov
- The U.S. State Department will NEVER notify you by email or mail.
- Store this number safely. Clearing browser history will not erase offline backup cards.
`;
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DV_Confirmation_${record.confirmationNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Typo suggestions for entered code
  const typoSuggestions = confCode ? suggestCharacterCorrections(confCode) : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
              Web Crypto API • AES-GCM 256
            </span>
            <span className="text-xs text-slate-500 font-mono">Zero Server Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Encrypted DV Confirmation Vault
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Securely save your 16-character confirmation number locally with optional passphrase encryption.
          </p>
        </div>

        {/* Lock / Unlock Toggle Indicator */}
        <div className="flex items-center gap-3">
          {hasEncryptedData && !isLocked && (
            <button
              type="button"
              onClick={handleLockVault}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              <span>Lock Vault</span>
            </button>
          )}

          {!isLocked && (
            <button
              type="button"
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Save New Number</span>
            </button>
          )}
        </div>
      </div>

      {/* LOCKED VAULT SCREEN */}
      {isLocked && (
        <div className="mt-12 max-w-md mx-auto p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Vault Locked with AES-GCM
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter your master passphrase to decrypt your confirmation credentials.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-3">
            <input
              type="password"
              placeholder="Enter passphrase..."
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {unlockError && (
              <p className="text-xs text-red-500 font-semibold">{unlockError}</p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Vault</span>
            </button>
          </form>

          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 font-mono">
            Encrypted client-side. We cannot recover lost passphrases.
          </p>
        </div>
      )}

      {/* UNLOCKED VAULT CONTENT */}
      {!isLocked && (
        <div className="mt-8 space-y-6">
          
          {/* Add New Record Modal Form */}
          {isAddingNew && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 animate-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-blue-500" />
                  <span>Save DV Confirmation Record</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSaveRecord} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* 16-Character Confirmation Code */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      16-Character Confirmation Number *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 20271OABCDE89XYZ"
                      value={confCode}
                      onChange={(e) => setConfCode(e.target.value.toUpperCase())}
                      maxLength={18}
                      className="w-full px-3 py-2 text-xs sm:text-sm font-mono tracking-wider rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {typoSuggestions.length > 0 && (
                      <p className="text-[10px] text-blue-500 italic mt-0.5">
                        Tip: Verify confusing letters like &apos;0&apos; (zero) vs &apos;O&apos; (letter).
                      </p>
                    )}
                  </div>

                  {/* Program Year */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Program Year
                    </label>
                    <select
                      value={programYear}
                      onChange={(e) => setProgramYear(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="2027">DV-2027 (Results May 2026)</option>
                      <option value="2026">DV-2026 (Results May 2025)</option>
                      <option value="2025">DV-2025</option>
                    </select>
                  </div>

                  {/* Entrant Full Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Entrant Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="LAST NAME, First Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Year of Birth */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Year of Birth (YYYY)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1994"
                      value={birthYear}
                      onChange={(e) => setBirthYear(e.target.value)}
                      maxLength={4}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Optional Encryption Passphrase */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-blue-500" />
                      Optional Encryption Passphrase
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      Leave blank for standard local storage
                    </span>
                  </div>
                  <input
                    type="password"
                    placeholder="Lock this vault with a PIN or password..."
                    value={formPassphrase}
                    onChange={(e) => setFormPassphrase(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {formError && (
                  <p className="text-xs text-red-500 font-semibold">{formError}</p>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
                  >
                    Save to Local Vault
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Stored Records Roster */}
          <div className="space-y-4">
            {records.length === 0 ? (
              <div className="p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-500 flex items-center justify-center mx-auto">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  No Confirmation Numbers Stored
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Save your official 16-character confirmation number after submitting your entry on dvprogram.state.gov.
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(true)}
                  className="mt-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                >
                  Save First Confirmation Number
                </button>
              </div>
            ) : (
              records.map((rec) => (
                <div
                  key={rec.id}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold uppercase">
                        DV-{rec.programYear} Program Entry
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                        {rec.fullName}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDelete(rec.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Confirmation Code Display Box */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block">CONFIRMATION NUMBER</span>
                      <span className="text-xl sm:text-2xl font-black font-mono tracking-wider text-blue-600 dark:text-blue-400 select-all">
                        {rec.confirmationNumber}
                      </span>
                    </div>

                    {/* Copy and Open dvprogram.state.gov Action */}
                    <button
                      type="button"
                      onClick={() => handleCopyAndOpenPortal(rec.confirmationNumber, rec.id)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      {copiedId === rec.id ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Copied! Opening Portal...</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy &amp; Open dvprogram.state.gov</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Metadata Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block text-[10px]">BIRTH YEAR:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{rec.birthYear || 'Not set'}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block text-[10px]">RESULTS RELEASE:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        May {parseInt(rec.programYear, 10) - 1 || 2026}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 col-span-2 sm:col-span-1">
                      <span className="text-slate-400 block text-[10px]">SAVED DATE:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {new Date(rec.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Backup Card & File Export Actions */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleDownloadCard(rec)}
                      className="flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 shadow-xs"
                    >
                      <ImageIcon className="w-4 h-4 text-purple-500" />
                      <span>Download Backup Card (PNG)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownloadTxt(rec)}
                      className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"
                    >
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span>Save as .TXT</span>
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>

        </div>
      )}

    </div>
  );
}
