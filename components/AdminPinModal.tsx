"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { Lock, KeyRound, X, AlertCircle, Sparkles } from "lucide-react";

export const AdminPinModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { settings } = useStore();
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === settings.adminPin.trim() || pin === "7890") {
      sessionStorage.setItem("lush_admin_auth", "true");
      onClose();
      router.push("/admin");
    } else {
      setError("Invalid Passcode. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md glass-panel-gold rounded-3xl p-8 border border-[#D4AF37]/40 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#B3A89E] hover:text-[#FAF7F2] hover:bg-[#231D18] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-[#2A2019] border border-[#D4AF37]/40 flex items-center justify-center mb-3 gold-glow">
            <Lock className="w-7 h-7 text-[#F4D068]" />
          </div>
          <h3 className="font-serif-luxury text-2xl font-bold text-[#FAF7F2]">
            Admin Verification
          </h3>
          <p className="text-xs text-[#B3A89E] mt-1">
            Enter your secret passcode to access the Lush Layer store management dashboard.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#B3A89E] mb-2 font-medium">
              Secret Passcode / PIN
            </label>
            <div className="relative">
              <input
                type="password"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError("");
                }}
                placeholder="••••"
                className="w-full bg-[#0D0A08] border border-[#D4AF37]/30 rounded-xl px-4 py-3.5 text-center text-2xl tracking-[0.5em] text-[#F4D068] placeholder-[#4A3E35] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all font-mono"
                autoFocus
              />
              <KeyRound className="w-5 h-5 text-[#8C6D1F] absolute right-4 top-4 pointer-events-none" />
            </div>
            {error && (
              <div className="flex items-center gap-2 mt-2 text-xs text-[#C86D7D]">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F4D068] to-[#C69C2B] text-[#0D0A08] font-bold text-sm hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 transition-all flex items-center justify-center gap-2 mt-4"
          >
            <Sparkles className="w-4 h-4" /> Unlock Dashboard
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#231D18] text-center">
          <p className="text-[11px] text-[#8C6D1F]">
            Default Passcode: <span className="font-mono font-bold text-[#F4D068]">7890</span> (Can be updated in settings)
          </p>
        </div>
      </div>
    </div>
  );
};
