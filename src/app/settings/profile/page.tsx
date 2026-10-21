'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Mail, Globe, DollarSign, CheckCircle2, Shield, ArrowLeft } from 'lucide-react';
import { PlanovaStore } from '@/lib/storage';
import { UserProfile, Currency, EventCategory } from '@/types';

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState<UserProfile>(PlanovaStore.getUser());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setProfile(PlanovaStore.getUser());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    PlanovaStore.setUser(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleInterest = (interest: EventCategory) => {
    const list = profile.planning_interests || [];
    const updated = list.includes(interest)
      ? list.filter((i) => i !== interest)
      : [...list, interest];
    setProfile({ ...profile, planning_interests: updated });
  };

  const allInterests: { key: EventCategory; label: string }[] = [
    { key: 'wedding', label: 'Weddings & Receptions' },
    { key: 'birthday', label: 'Birthdays & Milestones' },
    { key: 'anniversary', label: 'Anniversaries' },
    { key: 'corporate', label: 'Corporate Summits & Galas' },
    { key: 'college_fest', label: 'College Fests & Concerts' },
    { key: 'community', label: 'Community Festivals' },
  ];

  return (
    <div className="py-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Account & Profile</h1>
          <p className="text-xs text-slate-500 mt-1">Manage personal preferences and planning interests</p>
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
          Profile settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 sm:p-8 space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              disabled
              value={profile.email}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm cursor-not-allowed"
            />
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Email is verified for authentication</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Default Currency</label>
            <select
              value={profile.currency}
              onChange={(e) => setProfile({ ...profile, currency: e.target.value as Currency })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
            >
              <option value="INR">INR (₹) - Indian Rupee</option>
              <option value="USD">USD ($) - US Dollar</option>
              <option value="EUR">EUR (€) - Euro</option>
              <option value="GBP">GBP (£) - British Pound</option>
              <option value="AED">AED (AED) - UAE Dirham</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Region / Country</label>
            <input
              type="text"
              value={profile.region}
              onChange={(e) => setProfile({ ...profile, region: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
            Main Planning Interests
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {allInterests.map((item) => {
              const selected = profile.planning_interests?.includes(item.key);
              return (
                <button
                  type="button"
                  key={item.key}
                  onClick={() => toggleInterest(item.key)}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition flex items-center justify-between ${
                    selected
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-900'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{item.label}</span>
                  {selected && <CheckCircle2 className="w-4 h-4 text-indigo-700" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-700 hover:bg-indigo-800 shadow-md"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
