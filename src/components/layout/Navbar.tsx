'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sparkles, 
  Calendar, 
  Menu, 
  X, 
  PlusCircle, 
  LayoutDashboard, 
  User, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthPage = pathname.startsWith('/auth');

  return (
    <header className="sticky top-0 z-50 glass-nav transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-700 via-violet-600 to-indigo-900 flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform duration-200">
              <div className="relative">
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                <div className="absolute -inset-1 border border-white/30 rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-800 via-violet-700 to-indigo-900 bg-clip-text text-transparent">
                PLANOVA
              </span>
              <span className="text-[9px] font-medium tracking-widest text-violet-600 -mt-1 uppercase">
                AI Event Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {!isAuthPage && (
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <Link 
                href="/dashboard" 
                className={`flex items-center gap-1.5 transition-colors hover:text-indigo-600 ${pathname === '/dashboard' ? 'text-indigo-600 font-semibold' : ''}`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link 
                href="/features" 
                className={`transition-colors hover:text-indigo-600 ${pathname === '/features' ? 'text-indigo-600 font-semibold' : ''}`}
              >
                Features
              </Link>
              <Link 
                href="/pricing" 
                className={`transition-colors hover:text-indigo-600 ${pathname === '/pricing' ? 'text-indigo-600 font-semibold' : ''}`}
              >
                Pricing
              </Link>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold">
                <Sparkles className="w-3 h-3 text-violet-600" />
                Groq Llama 3.3
              </div>
            </nav>
          )}

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {!isAuthPage && (
              <>
                <Link
                  href="/auth/sign-in"
                  className="px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:text-indigo-700 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/events/new"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-700 via-violet-600 to-indigo-800 hover:opacity-95 shadow-md shadow-indigo-600/20 active:scale-[0.98] transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Plan My Event</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/events/new"
              className="p-2 text-white bg-indigo-600 rounded-lg"
              title="New Event"
            >
              <PlusCircle className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-indigo-600 rounded-lg"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-slate-200 px-4 pt-3 pb-5 space-y-3 shadow-xl">
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-base font-medium text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <LayoutDashboard className="w-5 h-5 text-indigo-600" />
            Dashboard
          </Link>
          <Link
            href="/features"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-base font-medium text-slate-700 rounded-lg hover:bg-slate-100"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-base font-medium text-slate-700 rounded-lg hover:bg-slate-100"
          >
            Pricing
          </Link>
          <Link
            href="/events/new"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-700 to-violet-600 shadow-md"
          >
            <PlusCircle className="w-5 h-5" />
            Plan My Event
          </Link>
        </div>
      )}
    </header>
  );
}
