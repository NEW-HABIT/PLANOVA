'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Calendar,
  CheckCircle2,
  PieChart,
  Users,
  Compass,
  Palette,
  Clock,
  DollarSign,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Star,
  Layers,
  Heart,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { formatCurrency, calculateDaysRemaining } from '@/lib/utils';

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [demoTab, setDemoTab] = useState<'theme' | 'budget' | 'schedule'>('theme');

  const previewEvent = {
    title: "Rohan & Ananya's Royal Palace Wedding",
    location: "Jai Mahal Palace, Jaipur",
    date: "2026-12-18",
    budget: 2500000,
    spent: 1575000,
    guests: 350,
  };

  const daysLeft = calculateDaysRemaining(previewEvent.date);

  return (
    <div className="relative overflow-hidden">
      {/* Background ambient decorative glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] pointer-events-none -z-10">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-violet-400/15 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-28 right-1/4 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl animate-float"></div>
      </div>

      {/* 1. HERO SECTION */}
      <section className="pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-semibold mb-6 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-600" />
              <span>Next-Generation AI Event Planning Platform</span>
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
              <span className="text-violet-600 font-bold">Groq Llama 3.3 Engine</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]"
            >
              Your Event. Your Vision.{' '}
              <span className="bg-gradient-to-r from-indigo-700 via-violet-600 to-indigo-900 bg-clip-text text-transparent">
                Perfectlly Planned.
              </span>
            </motion.h1>

            {/* Supporting text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto"
            >
              Meet your AI event planner. Create personalized celebrations, manage your budget,
              coordinate vendors, and bring every detail together in one place.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/events/new"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-indigo-700 via-violet-600 to-indigo-800 hover:shadow-xl hover:shadow-indigo-600/25 active:scale-[0.98] transition-all"
              >
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Plan My Event</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-base font-semibold text-slate-700 bg-white border border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] shadow-card transition-all"
              >
                <span>Explore Live Workspace</span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </Link>
            </motion.div>

            {/* Tagline callout */}
            <p className="mt-4 text-xs font-medium text-slate-600 tracking-wide">
              "Every Great Moment Starts with a Plan." • No credit card required
            </p>
          </div>

          {/* INTERACTIVE EVENT-PLANNING PREVIEW WIDGET */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-14 max-w-5xl mx-auto rounded-3xl glass-panel p-4 sm:p-6 lg:p-8 shadow-2xl border border-indigo-100 relative"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between pb-6 border-b border-slate-200/70 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700">
                    Live Event Preview
                  </span>
                  <span className="text-xs text-slate-600 flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-violet-600" /> Dec 18, 2026
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                  {previewEvent.title}
                </h3>
                <p className="text-xs text-slate-600">{previewEvent.location} • {previewEvent.guests} Guests</p>
              </div>

              {/* Countdown badge */}
              <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-violet-50 p-2.5 px-4 rounded-2xl border border-indigo-100/80">
                <div className="text-center">
                  <span className="text-2xl font-black text-indigo-700">{daysLeft}</span>
                  <span className="block text-[10px] uppercase font-bold text-slate-600">Days To Go</span>
                </div>
                <div className="h-8 w-px bg-indigo-200/60"></div>
                <div>
                  <span className="text-xs font-semibold text-slate-700 block">Status: Planning</span>
                  <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> 68% Complete
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Tab bar */}
            <div className="flex items-center gap-2 my-5 border-b border-slate-200/70 pb-3 overflow-x-auto">
              <button
                onClick={() => setDemoTab('theme')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  demoTab === 'theme'
                    ? 'bg-indigo-700 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                AI Theme & Concept
              </button>
              <button
                onClick={() => setDemoTab('budget')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  demoTab === 'budget'
                    ? 'bg-indigo-700 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <PieChart className="w-3.5 h-3.5" />
                Budget & Reserve Tracker
              </button>
              <button
                onClick={() => setDemoTab('schedule')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  demoTab === 'schedule'
                    ? 'bg-indigo-700 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                Milestone Checklist
              </button>
            </div>

            {/* Tab 1: Theme Concept */}
            {demoTab === 'theme' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-2 space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    AI Concept Direction
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">
                    Royal Rajputana Oasis & Starry Night Canopy
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Opulent heritage grandeur blended with understated modern elegance. Deep indigo velvet drapery
                    punctuated by antique brass urns, fragrant marigold garlands, and ambient warm amber uplighting
                    under Jaipur’s open evening sky.
                  </p>
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      Harmonized Color Palette
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-lg bg-[#4338CA] shadow-sm"></div>
                        <span className="text-xs font-mono text-slate-600">Deep Indigo</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-lg bg-[#7C3AED] shadow-sm"></div>
                        <span className="text-xs font-mono text-slate-600">Electric Violet</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-lg bg-[#D97706] shadow-sm"></div>
                        <span className="text-xs font-mono text-slate-600">Antique Gold</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-lg bg-[#FDF2F8] border border-slate-200 shadow-sm"></div>
                        <span className="text-xs font-mono text-slate-600">Rose Mist</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative h-48 md:h-full rounded-2xl overflow-hidden shadow-md">
                  <Image
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80"
                    alt="Royal Wedding Decor Preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
                    <span className="text-xs text-white font-medium">Jai Mahal Palace Grounds</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Budget */}
            {demoTab === 'budget' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-white border border-slate-200">
                    <span className="text-xs text-slate-500 font-medium">Total Planned Budget</span>
                    <p className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(previewEvent.budget, 'INR')}</p>
                    <span className="text-[11px] text-slate-400">Strict mode enabled</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200">
                    <span className="text-xs text-slate-500 font-medium">Committed & Spent</span>
                    <p className="text-xl font-bold text-indigo-700 mt-1">{formatCurrency(previewEvent.spent, 'INR')}</p>
                    <span className="text-[11px] text-indigo-600 font-medium">63% of planned allocation</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200">
                    <span className="text-xs text-slate-500 font-medium">Emergency Reserve (8%)</span>
                    <p className="text-xl font-bold text-emerald-600 mt-1">{formatCurrency(200000, 'INR')}</p>
                    <span className="text-[11px] text-emerald-600 font-medium">100% Unspent & Safeguarded</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                    <span>Spending vs Budget Target</span>
                    <span>{formatCurrency(previewEvent.spent, 'INR')} / {formatCurrency(previewEvent.budget, 'INR')}</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-500 transition-all duration-1000"
                      style={{ width: `${(previewEvent.spent / previewEvent.budget) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Schedule */}
            {demoTab === 'schedule' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <div>
                      <h5 className="text-sm font-bold text-slate-900 line-through text-slate-400">
                        Finalize Palace Venue Booking & Stage Layout
                      </h5>
                      <span className="text-xs text-slate-400">Completed on Sep 15</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">Venue</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-indigo-600 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></div>
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-slate-900">
                        Dispatch Royal E-Invites with RSVP Tracking
                      </h5>
                      <span className="text-xs text-amber-600 font-semibold">Due in 5 days (Nov 10)</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">Urgent</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>
                    <div>
                      <h5 className="text-sm font-bold text-slate-900">
                        Coordinate Jaipur Airport Chauffeur Shuttles
                      </h5>
                      <span className="text-xs text-slate-500">Scheduled for Dec 05</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">Logistics</span>
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Want to customize this event or create your own from scratch?
              </span>
              <Link
                href="/events/evt_royal_wedding/plan"
                className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 group"
              >
                <span>Open Full Plan</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. HOW PLANOVA WORKS IN 3 STEPS */}
      <section className="py-20 bg-white border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-3 py-1 rounded-full">
              Seamless Workflow
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-3">
              How PLANOVA Works in 3 Simple Steps
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              No endless spreadsheets or fragmented notes. Go from idea to an actionable production plan in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-8 rounded-3xl bg-[#FAFAFF] border border-slate-200/80 hover:shadow-xl transition-all relative group">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xl mb-6 group-hover:scale-110 transition-transform">
                01
              </div>
              <h3 className="text-xl font-bold text-slate-900">Define Your Event Vision</h3>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                Tell PLANOVA your event category, expected guest count, target budget, and stylistic preferences
                (formal, modern, cultural, or whimsical).
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl bg-[#FAFAFF] border border-slate-200/80 hover:shadow-xl transition-all relative group">
              <div className="w-14 h-14 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center font-black text-xl mb-6 group-hover:scale-110 transition-transform">
                02
              </div>
              <h3 className="text-xl font-bold text-slate-900">Instant AI Plan Synthesis</h3>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                Our Groq Llama 3.3 engine generates an itemized budget, vendor selection checklist,
                day-of schedules, gourmet menus, and theme decor concepts.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl bg-[#FAFAFF] border border-slate-200/80 hover:shadow-xl transition-all relative group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xl mb-6 group-hover:scale-110 transition-transform">
                03
              </div>
              <h3 className="text-xl font-bold text-slate-900">Execute & Track Flawlessly</h3>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                Track real expenses against allocated budgets, manage vendor quotes side-by-side,
                collect guest RSVPs, and ask your dedicated AI assistant for on-the-fly adjustments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EVENT CATEGORIES SHOWCASE WITH REAL PHOTOGRAPHY */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                Versatile Planning
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-3">
                Tailored for Every Major Occasion
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                From intimate family birthdays to 2,500-attendee college fests and royal destination weddings.
              </p>
            </div>
            <Link
              href="/events/new"
              className="mt-4 md:mt-0 text-sm font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1.5"
            >
              Start Planning Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Weddings */}
            <div className="rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80"
                  alt="Royal Weddings"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 text-indigo-800 text-[11px] font-bold backdrop-blur-sm">
                  Weddings & Receptions
                </div>
              </div>
              <div className="p-5">
                <h4 className="font-bold text-slate-900 text-base">Royal & Destination Weddings</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Sangeet choreography, mandap decor, jewelry styling, and multi-day ceremonies.
                </p>
              </div>
            </div>

            {/* Card 2: Birthdays */}
            <div className="rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80"
                  alt="Milestone Birthdays"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 text-indigo-800 text-[11px] font-bold backdrop-blur-sm">
                  Milestone Birthdays
                </div>
              </div>
              <div className="p-5">
                <h4 className="font-bold text-slate-900 text-base">Kids & Milestone Celebrations</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Themed backdrops, custom illusionists, cake logistics, and goodie bag curation.
                </p>
              </div>
            </div>

            {/* Card 3: Corporate */}
            <div className="rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80"
                  alt="Corporate Summits"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 text-indigo-800 text-[11px] font-bold backdrop-blur-sm">
                  Corporate Summits
                </div>
              </div>
              <div className="p-5">
                <h4 className="font-bold text-slate-900 text-base">Keynotes, Galas & Offsites</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Audio-visual staging, attendee badges, networking cocktail dinners, and AV backup.
                </p>
              </div>
            </div>

            {/* Card 4: Fests */}
            <div className="rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80"
                  alt="College Fests"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 text-indigo-800 text-[11px] font-bold backdrop-blur-sm">
                  College & Youth Fests
                </div>
              </div>
              <div className="p-5">
                <h4 className="font-bold text-slate-900 text-base">Cultural Festivals & Concerts</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Artist riders, crowd security barriers, sound line arrays, and campus stall layouts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRICING SECTION */}
      <section className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-3 py-1 rounded-full">
              Transparent Pricing
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-3">
              Plans for Every Planner
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Start with free planning or unlock advanced collaborative multi-event powers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="p-8 rounded-3xl bg-[#FAFAFF] border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Free Starter</span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">₹0</span>
                  <span className="text-xs text-slate-500">/ forever</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">Perfect for personal birthdays and intimate gatherings.</p>

                <ul className="mt-6 space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 1 Active Event Workspace</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Basic AI Plan Generation</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Interactive Budget Tracker</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Up to 50 Guests RSVP</li>
                </ul>
              </div>
              <Link
                href="/events/new"
                className="mt-8 block text-center py-2.5 px-4 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Planner (Featured) */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-indigo-900 to-violet-950 text-white shadow-2xl relative flex flex-col justify-between border border-violet-700/50">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow">
                Most Popular
              </div>
              <div>
                <span className="text-xs font-bold text-violet-300 uppercase tracking-wider">Pro Planner</span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">₹1,499</span>
                  <span className="text-xs text-violet-200">/ event</span>
                </div>
                <p className="text-xs text-violet-200 mt-2">Tailored for weddings, destination events, and large parties.</p>

                <ul className="mt-6 space-y-3 text-xs text-violet-100">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-300" /> Unlimited AI Generations & Regenerations</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-300" /> Vendor Side-by-Side Comparison Matrix</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-300" /> Unlimited Guests & CSV Import/Export</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-300" /> Creative Studio Copywriting Tools</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-300" /> 24/7 Context-Aware AI Chat Assistant</li>
                </ul>
              </div>
              <Link
                href="/events/new"
                className="mt-8 block text-center py-3 px-4 rounded-xl text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 shadow-md transition"
              >
                Unlock Pro Planner
              </Link>
            </div>

            {/* Agency Studio */}
            <div className="p-8 rounded-3xl bg-[#FAFAFF] border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Studio & Enterprise</span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">₹4,999</span>
                  <span className="text-xs text-slate-500">/ month</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">For event production agencies, hotels, and college committees.</p>

                <ul className="mt-6 space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Unlimited Concurrent Events</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Team Collaboration & Role Access</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> White-Label PDF Export Branding</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Dedicated API & Priority Support</li>
                </ul>
              </div>
              <Link
                href="/pricing"
                className="mt-8 block text-center py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ ACCORDION */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900">Frequently Asked Questions</h2>
            <p className="text-slate-600 text-sm mt-1">Everything you need to know about PLANOVA and our AI planning engine.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How does PLANOVA's AI generate realistic event plans?",
                a: "PLANOVA uses the ultra-fast Groq Llama 3.3 70B model combined with curated event production benchmarks. It calculates venue sizing, catering plate ratios, and realistic vendor budgeting based on your location and guest count.",
              },
              {
                q: "Can I regenerate just one part of my plan, like the menu or budget?",
                a: "Yes! Every event workspace includes granular 'Regenerate Section' actions. You can keep your theme and timeline intact while regenerating only the dining menu, budget allocation, or decor concepts.",
              },
              {
                q: "How does PLANOVA prevent overspending?",
                a: "Our Smart Budget Manager reserves a non-double-counted Emergency Contingency (default 8-10%) and dynamically tracks quoted vs paid expenses with instant visual alerts if a category nears its threshold.",
              },
              {
                q: "Can I export my plan for vendors and family?",
                a: "Yes! You can export your full budget report as CSV, print your timeline milestones, and copy invitation wordings directly to your clipboard.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-slate-900 hover:text-indigo-600 transition"
                >
                  <span>{item.q}</span>
                  {activeFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-indigo-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FINAL BOTTOM CTA BANNER */}
      <section className="py-16 bg-gradient-to-r from-indigo-700 via-violet-600 to-indigo-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black">
            Ready to Plan an Unforgettable Celebration?
          </h2>
          <p className="mt-3 text-violet-100 text-sm sm:text-base max-w-xl mx-auto">
            Join thousands of smart planners who simplify budgets, vendors, and timelines with PLANOVA.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/events/new"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white text-indigo-900 font-bold text-sm shadow-xl hover:bg-violet-50 transition"
            >
              Start Planning Now
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-900/40 text-white border border-white/20 font-bold text-sm hover:bg-indigo-900/60 transition"
            >
              View Sample Workspaces
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
