'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
  Award,
  Sparkle,
  X,
  ChevronLeft,
  ChevronRight,
  Quote,
} from 'lucide-react';
import { formatCurrency, calculateDaysRemaining } from '@/lib/utils';
import { PlanovaStore } from '@/lib/storage';
import { CompletedEventReview } from '@/types';

export default function LandingPage() {
  const router = useRouter();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [demoTab, setDemoTab] = useState<'theme' | 'budget' | 'schedule'>('theme');
  const [isAuth, setIsAuth] = useState(false);
  const [previousWorks, setPreviousWorks] = useState<CompletedEventReview[]>([]);
  const [activeModalWork, setActiveModalWork] = useState<CompletedEventReview | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);

  useEffect(() => {
    setIsAuth(PlanovaStore.isAuthenticated());
    setPreviousWorks(PlanovaStore.getPreviousWorks());
  }, []);

  const handlePlanMyEventClick = (e: React.MouseEvent) => {
    if (!PlanovaStore.isAuthenticated()) {
      e.preventDefault();
      router.push('/auth/sign-in?redirect=/events/new');
    }
  };

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
      {/* Background ambient aesthetic glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] pointer-events-none -z-10">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-violet-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-28 right-1/4 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl animate-float"></div>
      </div>

      {/* 1. HERO SECTION */}
      <section className="pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Aesthetic Pill badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200/70 text-violet-800 text-xs font-bold mb-6 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>Intelligent Event Planning & Production</span>
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
              <span className="text-indigo-700">Flawless Executions</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.14]"
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
              className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal"
            >
              Meet your personal event planner. Create personalized celebrations, manage your budget,
              coordinate vendors, and bring every exquisite detail together in one calm space.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href={isAuth ? "/events/new" : "/auth/sign-in?redirect=/events/new"}
                onClick={handlePlanMyEventClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-indigo-700 via-violet-600 to-indigo-800 hover:shadow-xl hover:shadow-indigo-600/30 active:scale-[0.98] transition-all"
              >
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Plan My Event</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={isAuth ? "/dashboard" : "/auth/sign-in?redirect=/dashboard"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl text-base font-semibold text-slate-700 bg-white border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] shadow-card transition-all"
              >
                <span>Explore Live Workspace</span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </Link>
            </motion.div>

            <p className="mt-4 text-xs font-medium text-slate-500 tracking-wide">
              "Every Great Moment Starts with a Plan." • Login required to create your event
            </p>
          </div>

          {/* INTERACTIVE EVENT-PLANNING PREVIEW WIDGET */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-14 max-w-5xl mx-auto rounded-3xl glass-panel p-5 sm:p-7 lg:p-8 shadow-2xl border border-indigo-100 relative"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between pb-6 border-b border-slate-200/70 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700">
                    Featured Master Plan
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-violet-600" /> Dec 18, 2026
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5">
                  {previewEvent.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium">{previewEvent.location} • {previewEvent.guests} Guests</p>
              </div>

              {/* Countdown badge */}
              <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-50/80 to-violet-50/80 p-3 px-5 rounded-2xl border border-indigo-100">
                <div className="text-center">
                  <span className="text-2xl font-black text-indigo-700">{daysLeft}</span>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Days To Go</span>
                </div>
                <div className="h-8 w-px bg-indigo-200/60"></div>
                <div>
                  <span className="text-xs font-bold text-slate-700 block">Status: Planning</span>
                  <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> 68% Prepared
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
                Theme & Atmosphere
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
                Production Milestones
              </button>
            </div>

            {/* Tab 1: Theme Concept */}
            {demoTab === 'theme' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-2 space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Atmospheric Direction
                  </div>
                  <h4 className="text-lg font-extrabold text-slate-900">
                    Royal Rajputana Oasis & Starry Night Canopy
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    Opulent heritage grandeur blended with understated modern elegance. Deep indigo velvet drapery
                    punctuated by antique brass urns, fragrant marigold garlands, and ambient warm amber uplighting
                    under Jaipur’s open evening sky.
                  </p>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Curated Color Palette
                    </span>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-lg bg-[#4338CA] shadow-sm"></div>
                        <span className="text-xs font-medium text-slate-600">Deep Indigo</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-lg bg-[#7C3AED] shadow-sm"></div>
                        <span className="text-xs font-medium text-slate-600">Electric Violet</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-lg bg-[#D97706] shadow-sm"></div>
                        <span className="text-xs font-medium text-slate-600">Antique Gold</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-lg bg-[#FDF2F8] border border-slate-200 shadow-sm"></div>
                        <span className="text-xs font-medium text-slate-600">Rose Mist</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative h-48 md:h-56 rounded-2xl overflow-hidden shadow-md">
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
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                    <span className="text-xs text-slate-500 font-medium">Total Planned Budget</span>
                    <p className="text-xl font-black text-slate-900 mt-1">{formatCurrency(previewEvent.budget, 'INR')}</p>
                    <span className="text-[11px] text-slate-400">Strict mode enabled</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                    <span className="text-xs text-slate-500 font-medium">Committed & Spent</span>
                    <p className="text-xl font-black text-indigo-700 mt-1">{formatCurrency(previewEvent.spent, 'INR')}</p>
                    <span className="text-[11px] text-indigo-600 font-medium">63% of planned allocation</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                    <span className="text-xs text-slate-500 font-medium">Emergency Reserve (8%)</span>
                    <p className="text-xl font-black text-emerald-600 mt-1">{formatCurrency(200000, 'INR')}</p>
                    <span className="text-[11px] text-emerald-600 font-medium">100% Unspent & Safeguarded</span>
                  </div>
                </div>

                {/* Progress bar with aesthetic gradient */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                    <span>Spending vs Budget Target</span>
                    <span>{formatCurrency(previewEvent.spent, 'INR')} / {formatCurrency(previewEvent.budget, 'INR')}</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-600 via-violet-500 to-amber-400 transition-all duration-1000"
                      style={{ width: `${(previewEvent.spent / previewEvent.budget) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Schedule */}
            {demoTab === 'schedule' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <div>
                      <h5 className="text-sm font-bold text-slate-400 line-through">
                        Finalize Palace Venue Booking & Stage Layout
                      </h5>
                      <span className="text-xs text-slate-400">Completed on Sep 15</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">Venue</span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200">
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
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">Priority</span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200">
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
                Want to customize this celebration or create your own?
              </span>
              <Link
                href={isAuth ? "/events/evt_royal_wedding/plan" : "/auth/sign-in?redirect=/events/evt_royal_wedding/plan"}
                className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 group"
              >
                <span>Open Full Master Plan</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. OUR PREVIOUS WORKS SECTION (Showcase of Real Celebrations) */}
      <section id="previous-works" className="py-20 bg-white border-y border-slate-200/60 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-700 bg-violet-100/70 px-3.5 py-1.5 rounded-full">
              Real Experiences & Accomplishments
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
              Our Previous Works
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              Click any celebration to view high-resolution event galleries, verified owner reviews, and real financial savings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {previousWorks.map((work, idx) => (
              <div
                key={work.id || idx}
                onClick={() => {
                  setActiveModalWork(work);
                  setActivePhotoIdx(0);
                }}
                className="rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                {/* Image Header with Pills */}
                <div className="relative h-60 w-full overflow-hidden bg-slate-900">
                  <Image
                    src={work.gallery_images?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'}
                    alt={work.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-black/20 to-black/10 pointer-events-none" />

                  {/* Top-Left Category / Theme Tag Pill */}
                  <div className="absolute top-3.5 left-3.5 px-3.5 py-1 rounded-full bg-white text-slate-900 text-xs font-bold shadow-md tracking-tight">
                    {work.tag || work.category}
                  </div>

                  {/* Top-Right Photo Count Indicator */}
                  <div className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full bg-black/60 text-white text-[11px] font-bold backdrop-blur-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>{work.gallery_images?.length || 1} Photos</span>
                  </div>

                  {/* Bottom info on image: Location & Budget */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs drop-shadow">
                    <span className="font-bold truncate max-w-[65%]">{work.location}</span>
                    <span className="font-extrabold text-amber-300 shrink-0">{work.budget}</span>
                  </div>
                </div>

                {/* Card Content Matching Exact Provided Screenshot */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[11px] font-bold text-indigo-600 tracking-wider uppercase block">
                      {work.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1 leading-snug group-hover:text-indigo-600 transition-colors">
                      {work.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2">
                      {work.highlight || work.owner_review}
                    </p>
                  </div>

                  {/* Divider and Footer: Guest Count & Status */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{work.guests} Guests</span>
                    </div>

                    <div className="flex items-center gap-1.5 font-bold text-emerald-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Executed Flawlessly</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href={isAuth ? "/events/new" : "/auth/sign-in?redirect=/events/new"}
              onClick={handlePlanMyEventClick}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold text-white bg-indigo-700 hover:bg-indigo-800 shadow-md transition"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Create Your Event Blueprint</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* INTERACTIVE PREVIOUS WORK MODAL (Animated Photo Gallery & Owner Review) */}
      {activeModalWork && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setActiveModalWork(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 my-auto animate-in zoom-in-95 duration-200 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-gradient-to-r from-slate-50 via-white to-indigo-50/40">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700">
                    {activeModalWork.tag || activeModalWork.category}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {activeModalWork.location}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  {activeModalWork.title}
                </h3>
              </div>

              <button
                onClick={() => setActiveModalWork(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition shrink-0"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Active Photo with navigation and animation */}
            <div className="relative h-64 sm:h-84 md:h-96 w-full bg-slate-900 overflow-hidden">
              <motion.div
                key={activePhotoIdx}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="relative w-full h-full"
              >
                <Image
                  src={
                    activeModalWork.gallery_images?.[activePhotoIdx] ||
                    activeModalWork.gallery_images?.[0] ||
                    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80'
                  }
                  alt={activeModalWork.title}
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>

              {/* Prev / Next Controls */}
              {activeModalWork.gallery_images && activeModalWork.gallery_images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActivePhotoIdx((prev) =>
                        prev === 0 ? activeModalWork.gallery_images.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/90 active:scale-95 transition backdrop-blur-sm z-10"
                    title="Previous Photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setActivePhotoIdx((prev) =>
                        prev === activeModalWork.gallery_images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/90 active:scale-95 transition backdrop-blur-sm z-10"
                    title="Next Photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Photo position badge */}
              <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/70 text-white text-[11px] font-bold backdrop-blur-sm z-10">
                Photo {activePhotoIdx + 1} of {activeModalWork.gallery_images?.length || 1}
              </div>
            </div>

            {/* Thumbnail selector strip */}
            {activeModalWork.gallery_images && activeModalWork.gallery_images.length > 1 && (
              <div className="flex items-center gap-2 p-3 bg-slate-50 border-b border-slate-100 overflow-x-auto">
                {activeModalWork.gallery_images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePhotoIdx(i)}
                    className={`relative w-16 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activePhotoIdx === i
                        ? 'border-indigo-600 scale-105 shadow-md ring-2 ring-indigo-200'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="Thumbnail" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Event Metrics & Owner Review Details */}
            <div className="p-5 sm:p-6 space-y-5">
              {/* Event Metrics Badges */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Budget</span>
                  <span className="text-sm font-black text-indigo-900">{activeModalWork.budget}</span>
                </div>
                <div className="p-3 rounded-2xl bg-violet-50/70 border border-violet-100 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Attendance</span>
                  <span className="text-sm font-black text-violet-900">{activeModalWork.guests} Guests</span>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Execution Outcome</span>
                  <span className="text-sm font-black text-emerald-800">100% On-Budget</span>
                </div>
              </div>

              {/* Owner Testimonial Card: "How PLANOVA Helped" */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-sm relative shadow-sm">
                      {activeModalWork.owner_avatar ? (
                        <Image
                          src={activeModalWork.owner_avatar}
                          alt={activeModalWork.owner_name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span>{activeModalWork.owner_name?.charAt(0) || 'H'}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{activeModalWork.owner_name}</h4>
                      <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified Celebration Host
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                    {[...Array(activeModalWork.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                <div className="relative pt-1">
                  <Quote className="w-5 h-5 text-indigo-300 absolute -top-1 -left-1 opacity-40" />
                  <p className="text-xs sm:text-sm text-slate-700 pl-5 leading-relaxed font-normal">
                    {activeModalWork.owner_review}
                  </p>
                </div>

                {activeModalWork.savings_achieved && (
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Financial Impact:</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                      {activeModalWork.savings_achieved}
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom CTA in modal */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setActiveModalWork(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Close Gallery
                </button>
                <Link
                  href={isAuth ? "/events/new" : "/auth/sign-in?redirect=/events/new"}
                  onClick={(e) => {
                    setActiveModalWork(null);
                    handlePlanMyEventClick(e);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-700 hover:bg-indigo-800 shadow-md transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Plan My Celebration Like This</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. HOW PLANOVA WORKS IN 3 STEPS */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-700 bg-violet-100/70 px-3 py-1 rounded-full">
              Peace of Mind
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-3">
              How PLANOVA Works in 3 Simple Steps
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              Say goodbye to messy spreadsheets and forgotten vendors. From idea to execution in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-card hover:shadow-xl transition-all relative group">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-xl mb-6 group-hover:scale-110 transition-transform">
                01
              </div>
              <h3 className="text-xl font-bold text-slate-900">Define Your Event Vision</h3>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                Tell PLANOVA your celebration style, guest count, city, and target budget. Tailored for weddings, birthdays, or galas.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-card hover:shadow-xl transition-all relative group">
              <div className="w-14 h-14 rounded-2xl bg-violet-50 text-violet-700 flex items-center justify-center font-black text-xl mb-6 group-hover:scale-110 transition-transform">
                02
              </div>
              <h3 className="text-xl font-bold text-slate-900">Synthesize Complete Plan</h3>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                Receive an itemized budget with protected reserves, timeline milestones, vendor questionnaires, and dining menus.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-card hover:shadow-xl transition-all relative group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-xl mb-6 group-hover:scale-110 transition-transform">
                03
              </div>
              <h3 className="text-xl font-bold text-slate-900">Manage & Celebrate</h3>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                Track payments against limits, compare vendor proposals side-by-side, gather RSVPs, and consult your assistant.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRICING SECTION */}
      <section className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-700 bg-violet-100/70 px-3 py-1 rounded-full">
              Simple & Predictable
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-3">
              Plans for Every Celebration
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Start free today or unlock multi-day wedding and festival production capabilities.
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
                <p className="text-xs text-slate-500 mt-2">Essential features for single-day personal parties.</p>

                <ul className="mt-6 space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 1 Active Event Workspace</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Full Plan Synthesis</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Interactive Budget Tracker</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Up to 50 Guests RSVP</li>
                </ul>
              </div>
              <Link
                href={isAuth ? "/events/new" : "/auth/sign-in?redirect=/events/new"}
                onClick={handlePlanMyEventClick}
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
                <p className="text-xs text-violet-200 mt-2">Tailored for destination weddings, multi-day parties, and summits.</p>

                <ul className="mt-6 space-y-3 text-xs text-violet-100">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-300" /> Unlimited Plan Regenerations</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-300" /> Vendor Side-by-Side Comparison Matrix</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-300" /> Unlimited Guests & CSV Import/Export</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-300" /> Creative Studio Copywriting Tools</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-300" /> 24/7 Context-Aware Planning Assistant</li>
                </ul>
              </div>
              <Link
                href={isAuth ? "/events/new" : "/auth/sign-in?redirect=/events/new"}
                onClick={handlePlanMyEventClick}
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
                <p className="text-xs text-slate-500 mt-2">For event management firms, hotels, and college committees.</p>

                <ul className="mt-6 space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Unlimited Concurrent Events</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Team Collaboration & Permissions</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Printable PDF & CSV Exporting</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Priority Support Concierge</li>
                </ul>
              </div>
              <Link
                href="/pricing"
                className="mt-8 block text-center py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition"
              >
                Contact Concierge
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
            <p className="text-slate-600 text-sm mt-1">Everything you need to know about PLANOVA and event planning.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Why do I need to sign in before creating an event plan?",
                a: "Signing in ensures your event blueprints, vendor contracts, guest lists, and confidential budget numbers are securely saved and accessible only by you across all your devices.",
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
              href={isAuth ? "/events/new" : "/auth/sign-in?redirect=/events/new"}
              onClick={handlePlanMyEventClick}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-indigo-900 font-bold text-sm shadow-xl hover:bg-violet-50 transition"
            >
              Start Planning Now
            </Link>
            <Link
              href={isAuth ? "/dashboard" : "/auth/sign-in?redirect=/dashboard"}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-900/40 text-white border border-white/20 font-bold text-sm hover:bg-indigo-900/60 transition"
            >
              View Sample Workspaces
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
