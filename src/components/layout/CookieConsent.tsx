'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Cookie, X, Check } from 'lucide-react';
import { PlanovaStore } from '@/lib/storage';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasConsent = PlanovaStore.getCookieConsent();
    if (!hasConsent) {
      const timer = setTimeout(() => setShow(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    PlanovaStore.setCookieConsent(true);
    setShow(false);
  };

  const handleDecline = () => {
    PlanovaStore.setCookieConsent(true);
    setShow(false);
  };

  if (!show) return null;

  return (
    <aside aria-label="Privacy and Cookie Consent" className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="glass-panel p-5 rounded-3xl shadow-2xl border border-[#C7A9A3]/50 bg-[#F7EFE7]/95 backdrop-blur-xl space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3E3239] to-[#6B5560] flex items-center justify-center text-[#F7EFE7] shrink-0 shadow-md">
              <Cookie className="w-4 h-4 text-[#E8D2C4]" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#3E3239]">Privacy & Experience Cookies</h3>
              <span className="text-[11px] text-[#6B5560] font-medium">Your data stays strictly protected</span>
            </div>
          </div>
          <button
            onClick={handleDecline}
            className="p-1 rounded-lg text-[#9E8189] hover:text-[#3E3239] transition"
            aria-label="Dismiss cookie notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#6B5560] leading-relaxed">
          PLANOVA uses privacy-first session cookies to remember your event planning preferences, keep your workspace authenticated, and safeguard budget calculations.
        </p>

        <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#E8D2C4]">
          <Link
            href="/features"
            className="text-[11px] font-semibold text-[#6B5560] hover:text-[#3E3239] transition"
          >
            Learn More
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDecline}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#6B5560] hover:bg-[#E8D2C4]/40 transition"
            >
              Essential Only
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-1.5 rounded-xl text-xs font-bold text-[#F7EFE7] bg-gradient-to-r from-[#3E3239] via-[#6B5560] to-[#3E3239] hover:from-[#6B5560] hover:to-[#3E3239] shadow-md shadow-[#3E3239]/20 transition flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5 text-[#E8D2C4]" /> Accept All
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
