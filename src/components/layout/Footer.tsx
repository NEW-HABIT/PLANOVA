import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart, Shield, Terminal } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">PLANOVA</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              "Every Great Moment Starts with a Plan."
            </p>
            <p className="text-xs text-slate-500">
              Transforming ambitious celebrations into flawless reality with next-generation generative AI planning.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Powered by Groq Llama 3.3 70B
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/events/new" className="hover:text-white transition">AI Event Wizard</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition">Smart Dashboard</Link></li>
              <li><Link href="/features" className="hover:text-white transition">Interactive Budget Manager</Link></li>
              <li><Link href="/features" className="hover:text-white transition">Vendor Discovery & Comparison</Link></li>
              <li><Link href="/features" className="hover:text-white transition">Creative Studio</Link></li>
            </ul>
          </div>

          {/* Event Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Celebration Types</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/events/new" className="hover:text-white transition">Destination & Royal Weddings</Link></li>
              <li><Link href="/events/new" className="hover:text-white transition">Milestone Birthdays & Anniversaries</Link></li>
              <li><Link href="/events/new" className="hover:text-white transition">Global Corporate Summits</Link></li>
              <li><Link href="/events/new" className="hover:text-white transition">Inter-Collegiate Cultural Fests</Link></li>
              <li><Link href="/events/new" className="hover:text-white transition">Community Galas & Fundraisers</Link></li>
            </ul>
          </div>

          {/* Compliance & Security */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Trust & Engineering</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-indigo-400" /> PostgreSQL Row-Level Security</li>
              <li><span className="text-slate-500">Zod Strict Schema Validation</span></li>
              <li><span className="text-slate-500">Zero Secret Leak Guarantee</span></li>
              <li><span className="text-slate-500">Emergency Reserve Protection</span></li>
            </ul>
            <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-500">
              Ready for production deployment on Vercel and Supabase.
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PLANOVA. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">Security Overview</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
