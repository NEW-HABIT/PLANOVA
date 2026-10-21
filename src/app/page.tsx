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
} from 'lucide-react';
import { formatCurrency, calculateDaysRemaining } from '@/lib/utils';
import { PlanovaStore } from '@/lib/storage';

export default function LandingPage() {
  const router = useRouter();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [demoTab, setDemoTab] = useState<'theme' | 'budget' | 'schedule'>('theme');
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(PlanovaStore.isAuthenticated());
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

  const previousWorks = [
    {
      title: "Rohan & Ananya's Royal Palace Wedding",
      category: "Destination Wedding",
      location: "Jai Mahal Palace, Jaipur",
      guests: 350,
      budget: "₹25,00,000",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      highlight: "Delivered 100% on budget with zero contingency leak and 4.9★ vendor satisfaction.",
      tag: "Royal Heritage",
    },
    {
      title: "TechPulse Global AI & Cloud Summit",
      category: "Corporate Keynote & Gala",
      location: "Grand Hyatt, Mumbai",
      guests: 600,
      budget: "₹18,00,000",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
      highlight: "Orchestrated 2 stages, 6 keynote sessions, and 100% dietary personalized banquet.",
      tag: "Global Summit",
    },
    {
      title: "Aarav's 10th Intergalactic Superhero Birthday",
      category: "Kids Milestone Birthday",
      location: "Meadowlands Lawn, Bengaluru",
      guests: 45,
      budget: "₹85,000",
      image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80",
      highlight: "Custom cosmic decor, 3-tier cake, and live illusionist with rave guest reviews.",
      tag: "Milestone Celebration",
    },
    {
      title: "AURA National Cultural Festival",
      category: "College Festival & Concert",
      location: "Main University Arena, New Delhi",
      guests: 2500,
      budget: "₹12,00,000",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
      highlight: "Crowd management for 2,500+ attendees, multi-artist line-up, and vendor stalls.",
      tag: "Youth Festival",
    },
    {
      title: "Diya & Kabir's Sunset Vineyard Anniversary",
      category: "Silver Anniversary Soirée",
      location: "Sula Vineyards, Nashik",
      guests: 75,
      budget: "₹3,50,000",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
      highlight: "Candlelit pergolas, artisanal wine pairing dinner, and live acoustic quartet.",
      tag: "Romantic Elegance",
    },
    {
      title: "Vasant Utsav Community Spring Gala",
      category: "Community Gala",
      location: "Koramangala Club, Bengaluru",
      guests: 400,
      budget: "₹4,20,000",
      image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
      highlight: "Eco-friendly floral installations, local artisan food kiosks, and charity auction.",
      tag: "Cultural Harmony",
    },
  ];

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
      <section id="our-works" className="py-20 bg-white border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-700 bg-violet-100/70 px-3.5 py-1.5 rounded-full">
              Real Experiences & Accomplishments
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
              Our Previous Works
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              Explore how PLANOVA brought weddings, corporate summits, milestone parties, and cultural festivals to life with flawless precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {previousWorks.map((work, idx) => (
              <div
                key={idx}
                className="rounded-3xl overflow-hidden bg-[#FAFAFF] border border-slate-200/80 shadow-card hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="relative h-52 w-full overflow-hidden">
                  <Image
                    src={work.image}
                    alt={work.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 text-indigo-900 text-[11px] font-bold backdrop-blur-sm shadow-sm">
                    {work.tag}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="font-semibold">{work.location}</span>
                    <span className="font-bold text-amber-300">{work.budget}</span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                      {work.category}
                    </span>
                    <h4 className="text-base font-extrabold text-slate-900 mt-1 leading-snug">
                      {work.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {work.highlight}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" /> {work.guests} Guests
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Executed Flawlessly
                    </span>
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
              <span>Create Your Event Blueprint</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

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
