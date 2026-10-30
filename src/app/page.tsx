'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Users,
  Clock,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Star,
  Layers,
  X,
  ChevronLeft,
  ChevronRight,
  Quote,
  Shield,
  Sparkle,
} from 'lucide-react';
import { PlanovaStore } from '@/lib/storage';
import { CompletedEventReview } from '@/types';

export default function LandingPage() {
  const router = useRouter();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [previousWorks, setPreviousWorks] = useState<CompletedEventReview[]>([]);
  const [activeModalWork, setActiveModalWork] = useState<CompletedEventReview | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);

  // Parallax scroll hooks for cinematic ambient depth
  const { scrollY } = useScroll();
  const orbY1 = useTransform(scrollY, [0, 1000], [0, 220]);
  const orbY2 = useTransform(scrollY, [0, 1000], [0, -180]);
  const orbOpacity = useTransform(scrollY, [0, 600, 1200], [0.8, 0.5, 0.3]);

  useEffect(() => {
    // Professional post-login architecture:
    // If the user is already authenticated, take them directly to their production dashboard
    if (PlanovaStore.isAuthenticated()) {
      router.replace('/dashboard');
      return;
    }
    setIsCheckingAuth(false);
    setPreviousWorks(PlanovaStore.getPreviousWorks());
  }, [router]);

  // If redirecting authenticated user to dashboard, show luxury transient loading veil
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7EFE7]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3E3239] via-[#6B5560] to-[#3E3239] flex items-center justify-center text-[#F7EFE7] shadow-xl animate-pulse">
            <Sparkles className="w-6 h-6 text-[#E8D2C4]" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#6B5560]">
            Entering Planova Workspace...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-[#F7EFE7] text-[#3E3239]">
      {/* Cinematic Ambient Parallax Glows */}
      <motion.div
        style={{ y: orbY1, opacity: orbOpacity }}
        className="absolute top-10 left-1/4 w-[34rem] h-[34rem] bg-[#E8D2C4]/60 rounded-full blur-[120px] pointer-events-none -z-10"
      />
      <motion.div
        style={{ y: orbY2, opacity: orbOpacity }}
        className="absolute top-48 right-1/4 w-[28rem] h-[28rem] bg-[#C7A9A3]/40 rounded-full blur-[130px] pointer-events-none -z-10"
      />
      <div className="absolute top-[48rem] left-1/3 w-96 h-96 bg-[#9E8189]/20 rounded-full blur-[110px] pointer-events-none -z-10 animate-float-slow" />

      {/* 1. HERO SECTION */}
      <section className="pt-16 pb-24 md:pt-28 md:pb-36 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Aesthetic Pill badge */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 border border-[#C7A9A3]/60 text-[#3E3239] text-xs font-bold mb-8 shadow-xs backdrop-blur-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#9E8189] animate-pulse" />
              <span>Intelligent Event Planning & Design</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#6B5560]"></span>
              <span className="text-[#6B5560]">Crafted for Unforgettable Celebrations</span>
            </motion.div>

            {/* Cinematic Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#3E3239] tracking-tight leading-[1.12]"
            >
              Your Event. Your Vision.{' '}
              <span className="bg-gradient-to-r from-[#3E3239] via-[#6B5560] to-[#9E8189] bg-clip-text text-transparent">
                Perfected by AI.
              </span>
            </motion.h1>

            {/* Supporting text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="mt-6 text-lg sm:text-xl text-[#6B5560] leading-relaxed max-w-2xl mx-auto font-normal"
            >
              Meet your personal event director. Generate complete budgets with protected emergency reserves,
              curated vendor criteria, and schedule-perfect run-of-show in seconds.
            </motion.p>

            {/* Cinematic Glass Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/auth/sign-in?redirect=/events/new"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-bold text-[#F7EFE7] bg-gradient-to-r from-[#3E3239] via-[#6B5560] to-[#3E3239] hover:from-[#6B5560] hover:to-[#3E3239] shadow-xl shadow-[#3E3239]/20 hover:shadow-2xl hover:shadow-[#6B5560]/30 hover:-translate-y-0.5 active:scale-[0.98] transition-all"
              >
                <Sparkles className="w-5 h-5 text-[#E8D2C4]" />
                <span>Create New Blueprint</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#previous-works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold text-[#3E3239] bg-white/80 border border-[#C7A9A3]/60 hover:bg-[#E8D2C4]/40 hover:border-[#9E8189] hover:-translate-y-0.5 active:scale-[0.98] shadow-sm backdrop-blur-md transition-all"
              >
                <span>Explore Real Works</span>
                <ArrowRight className="w-4 h-4 text-[#9E8189]" />
              </a>
            </motion.div>

            <p className="mt-5 text-xs font-semibold text-[#9E8189] tracking-wider uppercase">
              "Every Great Moment Starts with a Plan."
            </p>
          </div>
        </div>
      </section>

      {/* 2. REAL PREVIOUS WORKS SHOWCASE SECTION */}
      <section id="previous-works" className="py-24 bg-[#F7EFE7] border-y border-[#E8D2C4] scroll-mt-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3E3239] bg-[#E8D2C4] border border-[#C7A9A3]/60 px-3.5 py-1.5 rounded-full">
              Real Experiences & Accomplishments
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#3E3239] tracking-tight mt-3">
              Curated Celebration Showcase
            </h2>
            <p className="text-[#6B5560] mt-2 text-sm sm:text-base">
              Explore actual celebrations planned and executed with PLANOVA blueprints. Click any card to inspect gallery photos, owner reviews, and exact budget figures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {previousWorks.map((work, idx) => (
              <motion.div
                key={work.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => {
                  setActiveModalWork(work);
                  setActivePhotoIdx(0);
                }}
                className="rounded-3xl overflow-hidden bg-white/90 border border-[#E8D2C4] shadow-card hover:shadow-2xl hover:shadow-[#3E3239]/15 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between group cursor-pointer backdrop-blur-md"
              >
                {/* Image Header with Pills */}
                <div className="relative h-60 w-full overflow-hidden bg-slate-900">
                  <Image
                    src={work.gallery_images?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'}
                    alt={work.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3E3239]/90 via-black/20 to-black/10 pointer-events-none" />

                  {/* Top-Left Category Tag */}
                  <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-[#F7EFE7]/90 text-[#3E3239] border border-[#E8D2C4] text-xs font-bold shadow-md tracking-tight backdrop-blur-md">
                    {work.tag || work.category}
                  </div>

                  {/* Top-Right Photo Count */}
                  <div className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full bg-[#3E3239]/80 text-[#F7EFE7] text-[11px] font-bold backdrop-blur-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#E8D2C4]" />
                    <span>{work.gallery_images?.length || 1} Photos</span>
                  </div>

                  {/* Bottom info on image */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[#F7EFE7] text-xs drop-shadow">
                    <span className="font-bold truncate max-w-[65%]">{work.location}</span>
                    <span className="font-extrabold text-[#E8D2C4] shrink-0">{work.budget}</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[11px] font-bold text-[#9E8189] tracking-wider uppercase block">
                      {work.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-[#3E3239] mt-1 leading-snug group-hover:text-[#6B5560] transition-colors">
                      {work.title}
                    </h3>
                    <p className="text-xs text-[#6B5560] mt-2 leading-relaxed line-clamp-2 font-normal">
                      {work.highlight || work.owner_review}
                    </p>
                  </div>

                  {/* Divider and Footer */}
                  <div className="pt-3 border-t border-[#E8D2C4]/70 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-[#9E8189] font-medium">
                      <Users className="w-3.5 h-3.5 text-[#C7A9A3]" />
                      <span>{work.guests} Guests</span>
                    </div>

                    <div className="flex items-center gap-1.5 font-bold text-[#6B5560]">
                      <CheckCircle2 className="w-4 h-4 text-[#9E8189]" />
                      <span>Executed Flawlessly</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/auth/sign-in?redirect=/events/new"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-sm font-bold text-[#F7EFE7] bg-gradient-to-r from-[#3E3239] via-[#6B5560] to-[#3E3239] hover:shadow-xl hover:shadow-[#6B5560]/25 active:scale-95 transition"
            >
              <Sparkles className="w-4 h-4 text-[#E8D2C4]" />
              <span>Create Your Event Blueprint</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* INTERACTIVE PREVIOUS WORK MODAL (Animated Photo Gallery & Owner Review) */}
      {activeModalWork && (
        <div
          className="fixed inset-0 z-50 bg-[#3E3239]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setActiveModalWork(null)}
        >
          <div
            className="bg-[#F7EFE7] rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#C7A9A3]/50 my-auto animate-in zoom-in-95 duration-200 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-[#E8D2C4] flex items-start justify-between gap-4 bg-gradient-to-r from-[#F7EFE7] via-white to-[#E8D2C4]/50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E8D2C4] text-[#3E3239]">
                    {activeModalWork.tag || activeModalWork.category}
                  </span>
                  <span className="text-xs text-[#6B5560] font-medium">
                    {activeModalWork.location}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#3E3239] mt-1">
                  {activeModalWork.title}
                </h3>
              </div>

              <button
                onClick={() => setActiveModalWork(null)}
                className="p-2 rounded-xl text-[#9E8189] hover:text-[#3E3239] hover:bg-[#E8D2C4]/50 transition shrink-0"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Active Photo */}
            <div className="relative h-64 sm:h-84 md:h-96 w-full bg-slate-900 overflow-hidden">
              <motion.div
                key={activePhotoIdx}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
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
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#3E3239]/70 text-[#F7EFE7] hover:bg-[#3E3239] active:scale-95 transition backdrop-blur-sm z-10"
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#3E3239]/70 text-[#F7EFE7] hover:bg-[#3E3239] active:scale-95 transition backdrop-blur-sm z-10"
                    title="Next Photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Photo position badge */}
              <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-[#3E3239]/70 text-[#F7EFE7] text-[11px] font-bold backdrop-blur-sm z-10">
                Photo {activePhotoIdx + 1} of {activeModalWork.gallery_images?.length || 1}
              </div>
            </div>

            {/* Thumbnail selector strip */}
            {activeModalWork.gallery_images && activeModalWork.gallery_images.length > 1 && (
              <div className="flex items-center gap-2 p-3 bg-[#F7EFE7] border-b border-[#E8D2C4] overflow-x-auto">
                {activeModalWork.gallery_images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePhotoIdx(i)}
                    className={`relative w-16 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activePhotoIdx === i
                        ? 'border-[#3E3239] scale-105 shadow-md ring-2 ring-[#C7A9A3]'
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
                <div className="p-3 rounded-2xl bg-white border border-[#E8D2C4] text-center">
                  <span className="text-[10px] uppercase font-bold text-[#9E8189] block">Total Budget</span>
                  <span className="text-sm font-black text-[#3E3239]">{activeModalWork.budget}</span>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-[#E8D2C4] text-center">
                  <span className="text-[10px] uppercase font-bold text-[#9E8189] block">Attendance</span>
                  <span className="text-sm font-black text-[#6B5560]">{activeModalWork.guests} Guests</span>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-[#E8D2C4] text-center">
                  <span className="text-[10px] uppercase font-bold text-[#9E8189] block">Execution Outcome</span>
                  <span className="text-sm font-black text-[#6B5560]">100% On-Budget</span>
                </div>
              </div>

              {/* Owner Testimonial Card */}
              <div className="p-5 rounded-2xl bg-white border border-[#E8D2C4] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-[#3E3239] to-[#6B5560] text-[#F7EFE7] flex items-center justify-center font-bold text-sm relative shadow-sm">
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
                      <h4 className="text-sm font-bold text-[#3E3239]">{activeModalWork.owner_name}</h4>
                      <span className="text-[11px] text-[#6B5560] font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#9E8189]" /> Verified Celebration Host
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
                  <Quote className="w-5 h-5 text-[#C7A9A3] absolute -top-1 -left-1 opacity-50" />
                  <p className="text-xs sm:text-sm text-[#3E3239] pl-5 leading-relaxed font-normal">
                    {activeModalWork.owner_review}
                  </p>
                </div>

                {activeModalWork.savings_achieved && (
                  <div className="pt-2 border-t border-[#E8D2C4] flex items-center justify-between text-xs">
                    <span className="text-[#6B5560] font-medium">Financial Impact:</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E8D2C4] text-[#3E3239] font-bold text-[11px]">
                      {activeModalWork.savings_achieved}
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom CTA in modal */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setActiveModalWork(null)}
                  className="px-4 py-2 text-xs font-bold text-[#9E8189] hover:text-[#3E3239]"
                >
                  Close Gallery
                </button>
                <Link
                  href="/auth/sign-in?redirect=/events/new"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-[#F7EFE7] bg-gradient-to-r from-[#3E3239] to-[#6B5560] hover:shadow-md transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#E8D2C4]" />
                  <span>Plan My Celebration Like This</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. HOW PLANOVA WORKS IN 3 STEPS */}
      <section className="py-24 bg-[#F7EFE7] border-y border-[#E8D2C4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3E3239] bg-[#E8D2C4] px-3.5 py-1.5 rounded-full border border-[#C7A9A3]/50">
              Peace of Mind
            </span>
            <h2 className="text-3xl font-black text-[#3E3239] tracking-tight mt-3">
              How PLANOVA Works in 3 Simple Steps
            </h2>
            <p className="text-[#6B5560] mt-2 text-sm sm:text-base">
              Say goodbye to messy spreadsheets and forgotten vendors. From idea to execution in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <motion.div
              whileHover={{ y: -6 }}
              className="p-8 rounded-3xl bg-white/90 border border-[#E8D2C4] shadow-card hover:shadow-xl transition-all relative group backdrop-blur-md"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#E8D2C4] text-[#3E3239] flex items-center justify-center font-black text-xl mb-6 group-hover:scale-110 transition-transform shadow-xs">
                01
              </div>
              <h3 className="text-xl font-bold text-[#3E3239]">Define Your Event Vision</h3>
              <p className="text-[#6B5560] text-sm mt-3 leading-relaxed">
                Tell PLANOVA your celebration style, guest count, city, and target budget. Tailored for weddings, birthdays, or galas.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              whileHover={{ y: -6 }}
              className="p-8 rounded-3xl bg-white/90 border border-[#E8D2C4] shadow-card hover:shadow-xl transition-all relative group backdrop-blur-md"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#C7A9A3]/60 text-[#3E3239] flex items-center justify-center font-black text-xl mb-6 group-hover:scale-110 transition-transform shadow-xs">
                02
              </div>
              <h3 className="text-xl font-bold text-[#3E3239]">Synthesize Complete Plan</h3>
              <p className="text-[#6B5560] text-sm mt-3 leading-relaxed">
                Receive an itemized budget with protected reserves, timeline milestones, vendor questionnaires, and dining menus.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              whileHover={{ y: -6 }}
              className="p-8 rounded-3xl bg-white/90 border border-[#E8D2C4] shadow-card hover:shadow-xl transition-all relative group backdrop-blur-md"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#E8D2C4] text-[#3E3239] flex items-center justify-center font-black text-xl mb-6 group-hover:scale-110 transition-transform shadow-xs">
                03
              </div>
              <h3 className="text-xl font-bold text-[#3E3239]">Manage & Celebrate</h3>
              <p className="text-[#6B5560] text-sm mt-3 leading-relaxed">
                Track payments against limits, compare vendor proposals side-by-side, gather RSVPs, and consult your assistant.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. PRICING SECTION */}
      <section className="py-24 bg-white/80 border-t border-[#E8D2C4] backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3E3239] bg-[#E8D2C4] border border-[#C7A9A3]/50 px-3.5 py-1.5 rounded-full">
              Simple & Transparent
            </span>
            <h2 className="text-3xl font-black text-[#3E3239] tracking-tight mt-3">
              Plans for Every Celebration
            </h2>
            <p className="text-[#6B5560] text-sm mt-2">
              Start free today or unlock multi-day wedding and grand celebration planning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="p-8 rounded-3xl bg-[#F7EFE7]/80 border border-[#E8D2C4] flex flex-col justify-between shadow-card backdrop-blur-sm">
              <div>
                <span className="text-xs font-bold text-[#9E8189] uppercase tracking-wider">Free Starter</span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-[#3E3239]">₹0</span>
                  <span className="text-xs text-[#6B5560]">/ forever</span>
                </div>
                <p className="text-xs text-[#6B5560] mt-2">Essential features for single-day personal parties.</p>

                <ul className="mt-6 space-y-3 text-xs text-[#3E3239]">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#9E8189]" /> 1 Active Event Workspace</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#9E8189]" /> Complete Event Blueprint & Theme</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#9E8189]" /> Interactive Budget Tracker</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#9E8189]" /> Up to 50 Guests RSVP</li>
                </ul>
              </div>
              <Link
                href="/auth/sign-in?redirect=/events/new"
                className="mt-8 block text-center py-3 px-4 rounded-xl text-xs font-bold text-[#3E3239] bg-[#E8D2C4] hover:bg-[#C7A9A3]/50 transition shadow-xs"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Planner (Featured) */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-[#3E3239] to-[#6B5560] text-[#F7EFE7] shadow-2xl relative flex flex-col justify-between border border-[#C7A9A3]/50 transform md:-translate-y-2">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#C7A9A3] to-[#E8D2C4] text-[#3E3239] text-[10px] font-black uppercase tracking-wider shadow">
                Most Popular
              </div>
              <div>
                <span className="text-xs font-bold text-[#E8D2C4] uppercase tracking-wider">Pro Planner</span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-[#F7EFE7]">₹1,499</span>
                  <span className="text-xs text-[#C7A9A3]">/ event</span>
                </div>
                <p className="text-xs text-[#E8D2C4] mt-2">Tailored for destination weddings, multi-day parties, and summits.</p>

                <ul className="mt-6 space-y-3 text-xs text-[#F7EFE7]">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#E8D2C4]" /> Unlimited Plan Regenerations</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#E8D2C4]" /> Vendor Comparison Matrix</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#E8D2C4]" /> Unlimited Guests & CSV Import</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#E8D2C4]" /> Creative Studio Copywriting</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#E8D2C4]" /> 24/7 Context Planning Assistant</li>
                </ul>
              </div>
              <Link
                href="/auth/sign-in?redirect=/pricing"
                className="mt-8 block text-center py-3.5 px-4 rounded-xl text-xs font-bold text-[#3E3239] bg-[#E8D2C4] hover:bg-[#F7EFE7] shadow-md transition"
              >
                Unlock Pro Planner
              </Link>
            </div>

            {/* Agency Studio */}
            <div className="p-8 rounded-3xl bg-[#F7EFE7]/80 border border-[#E8D2C4] flex flex-col justify-between shadow-card backdrop-blur-sm">
              <div>
                <span className="text-xs font-bold text-[#9E8189] uppercase tracking-wider">Studio & Enterprise</span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-[#3E3239]">₹4,999</span>
                  <span className="text-xs text-[#6B5560]">/ month</span>
                </div>
                <p className="text-xs text-[#6B5560] mt-2">For event management firms, hotels, and college committees.</p>

                <ul className="mt-6 space-y-3 text-xs text-[#3E3239]">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#9E8189]" /> Unlimited Concurrent Events</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#9E8189]" /> Team Collaboration & Permissions</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#9E8189]" /> Printable PDF & CSV Exporting</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#9E8189]" /> Priority Support Concierge</li>
                </ul>
              </div>
              <Link
                href="/pricing"
                className="mt-8 block text-center py-3 px-4 rounded-xl text-xs font-bold text-[#3E3239] bg-white border border-[#C7A9A3] hover:bg-[#E8D2C4]/30 transition shadow-xs"
              >
                Contact Concierge
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ ACCORDION */}
      <section className="py-24 bg-[#F7EFE7] border-t border-[#E8D2C4]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-[#3E3239]">Frequently Asked Questions</h2>
            <p className="text-[#6B5560] text-sm mt-1">Everything you need to know about PLANOVA and event planning.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Why do I need to sign in before creating an event plan?",
                a: "Signing in ensures your event blueprints, vendor contracts, guest lists, and confidential budget numbers are securely saved and accessible only by you across all your devices.",
              },
              {
                q: "Can I regenerate just one part of my plan, like the menu or budget?",
                a: "Yes! Every event workspace includes 'Update Section' actions. You can keep your theme and timeline intact while refreshing only the dining menu, budget allocation, or decor concepts whenever you like.",
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
                className="bg-white/90 rounded-2xl border border-[#E8D2C4] overflow-hidden shadow-xs hover:border-[#C7A9A3] transition-colors backdrop-blur-sm"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-[#3E3239] hover:text-[#6B5560] transition"
                >
                  <span>{item.q}</span>
                  {activeFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-[#6B5560]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#9E8189]" />
                  )}
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-[#6B5560] leading-relaxed border-t border-[#E8D2C4]/60 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FINAL BOTTOM CTA BANNER */}
      <section className="py-20 bg-gradient-to-r from-[#3E3239] via-[#6B5560] to-[#3E3239] text-[#F7EFE7] relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Ready to Plan an Unforgettable Celebration?
          </h2>
          <p className="mt-4 text-[#E8D2C4] text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Join thousands of smart planners who simplify budgets, vendors, and timelines with PLANOVA.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/sign-in?redirect=/events/new"
              className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-[#F7EFE7] text-[#3E3239] font-bold text-sm shadow-xl hover:bg-[#E8D2C4] hover:scale-105 active:scale-95 transition-all"
            >
              Start Planning Now
            </Link>
            <a
              href="#previous-works"
              className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-white/10 text-[#F7EFE7] border border-white/20 font-bold text-sm hover:bg-white/20 transition inline-flex items-center justify-center gap-2"
            >
              <span>Explore Previous Works</span>
              <ArrowRight className="w-4 h-4 text-[#E8D2C4]" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
