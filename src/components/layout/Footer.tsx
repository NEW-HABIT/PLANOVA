import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart, Shield, CheckCircle2 } from 'lucide-react';

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
            <p className="text-xs text-slate-400 leading-relaxed font-serif italic">
              "Every Great Moment Starts with a Plan."
            </p>
            <p className="text-xs text-slate-500">
              Transforming ambitious celebrations into seamless reality with curated event intelligence and precision budgeting.
            </p>
            <div className="flex items-center gap-2 text-xs text-violet-300 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700 w-fit">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></span>
              Curated Event Intelligence
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Celebration Suite</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/events/new" className="hover:text-white transition">Personalized Event Wizard</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition">Production Dashboard</Link></li>
              <li><Link href="/features" className="hover:text-white transition">Smart Budget Allocator</Link></li>
              <li><Link href="/features" className="hover:text-white transition">Curated Vendor Discovery</Link></li>
              <li><Link href="/features" className="hover:text-white transition">Creative Invitation Studio</Link></li>
            </ul>
          </div>

          {/* Event Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Celebration Types</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/events/new" className="hover:text-white transition">Destination & Royal Weddings</Link></li>
              <li><Link href="/events/new" className="hover:text-white transition">Milestone Birthdays & Anniversaries</Link></li>
              <li><Link href="/events/new" className="hover:text-white transition">Global Corporate Galas</Link></li>
              <li><Link href="/events/new" className="hover:text-white transition">Youth & Cultural Festivals</Link></li>
              <li><Link href="/events/new" className="hover:text-white transition">Community Banquets & Soirées</Link></li>
            </ul>
          </div>

          {/* Trust & Craft */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Trust & Privacy</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2 text-slate-300">
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                <span>Private & Encrypted Workspaces</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Hidden Fees or Surprise Costs</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Protected Emergency Contingencies</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Dedicated Production Checklist</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PLANOVA. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Charter</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">Guest Privacy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
