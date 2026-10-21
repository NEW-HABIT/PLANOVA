'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bell, ShieldCheck, ArrowLeft, CheckCircle2, Lock } from 'lucide-react';

export default function PreferencesPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [budgetWarnings, setBudgetWarnings] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="py-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Preferences</h1>
          <p className="text-xs text-slate-500 mt-1">Configure alerts, privacy, and workspace behavior</p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Preferences updated!
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 sm:p-8 space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Notifications & Alerts</h3>

          <label className="flex items-start gap-3 cursor-pointer p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/70 transition">
            <input
              type="checkbox"
              checked={budgetWarnings}
              onChange={(e) => setBudgetWarnings(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-indigo-600"
            />
            <div>
              <span className="text-xs font-bold text-slate-800 block">Strict Budget Overrun Warnings</span>
              <span className="text-[11px] text-slate-500">
                Immediately display high-visibility alerts when category expenses exceed the planned threshold.
              </span>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/70 transition">
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-indigo-600"
            />
            <div>
              <span className="text-xs font-bold text-slate-800 block">Milestone Deadline Reminders</span>
              <span className="text-[11px] text-slate-500">
                Alert on upcoming tasks due within 48 hours.
              </span>
            </div>
          </label>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-700 hover:bg-indigo-800 shadow-md"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
