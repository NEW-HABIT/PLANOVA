'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-3 py-1 rounded-full">
          Simple & Predictable
        </span>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mt-3">
          Investment in Peace of Mind
        </h1>
        <p className="text-slate-600 mt-2 text-base">
          Start for free today. Upgrade when you need advanced multi-vendor analytics and AI regenerations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Starter */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Free Starter</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-black text-slate-900">₹0</span>
              <span className="text-xs text-slate-500">/ forever</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Essential features for single-day personal parties.</p>

            <ul className="mt-6 space-y-3 text-xs text-slate-600">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 1 Active Event Workspace</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Full AI Plan Generation</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Core Budget Manager</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Up to 50 Guests Tracking</li>
            </ul>
          </div>
          <Link
            href="/events/new"
            className="mt-8 block text-center py-3 px-4 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition"
          >
            Start Free
          </Link>
        </div>

        {/* Pro */}
        <div className="p-8 rounded-3xl bg-gradient-to-b from-indigo-900 to-violet-950 text-white shadow-2xl relative flex flex-col justify-between border border-violet-600">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow">
            Recommended For Weddings
          </div>
          <div>
            <h3 className="text-sm font-bold text-violet-300 uppercase tracking-wider">Pro Planner</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-black">₹1,499</span>
              <span className="text-xs text-violet-200">/ event</span>
            </div>
            <p className="text-xs text-violet-200 mt-2">Comprehensive suite for grand weddings and multi-day celebrations.</p>

            <ul className="mt-6 space-y-3 text-xs text-violet-100">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-300" /> Unlimited AI Plan Regenerations</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-300" /> Vendor Comparison Matrix</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-300" /> Unlimited Guests & CSV Import</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-300" /> Creative Studio Copywriting</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-300" /> Dedicated 24/7 AI Assistant</li>
            </ul>
          </div>
          <Link
            href="/events/new"
            className="mt-8 block text-center py-3 px-4 rounded-xl text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 shadow-md transition"
          >
            Get Pro Planner
          </Link>
        </div>

        {/* Enterprise */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Studio / Agency</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-black text-slate-900">₹4,999</span>
              <span className="text-xs text-slate-500">/ month</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">For event management firms and hotel sales teams.</p>

            <ul className="mt-6 space-y-3 text-xs text-slate-600">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Unlimited Concurrent Events</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Collaborator Role Permissions</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> White-Label PDF Exporting</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Custom API Access</li>
            </ul>
          </div>
          <Link
            href="/events/new"
            className="mt-8 block text-center py-3 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
          >
            Contact Sales
          </Link>
        </div>
      </div>
    </div>
  );
}
