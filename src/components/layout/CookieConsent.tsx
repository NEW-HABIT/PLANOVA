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
      <div className="glass-panel p-5 rounded-3xl shadow-2xl border border-indigo-200/60 bg-white/95 backdrop-blur-xl space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-700 to-violet-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <Cookie className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Privacy & Experience Cookies</h3>
              <span className="text-[11px] text-slate-500 font-medium">Your data stays strictly protected</span>
            </div>
          </div>
          <button
            onClick={handleDecline}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition"
            aria-label="Dismiss cookie notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          PLANOVA uses privacy-first session cookies to remember your event planning preferences, keep your workspace authenticated, and safeguard budget calculations.
        </p>

        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
          <Link
            href="/features"
            className="text-[11px] font-semibold text-slate-500 hover:text-indigo-700 transition"
          >
            Learn More
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDecline}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Essential Only
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-700 to-violet-600 hover:opacity-95 shadow-md shadow-indigo-600/20 transition flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" /> Accept All
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
