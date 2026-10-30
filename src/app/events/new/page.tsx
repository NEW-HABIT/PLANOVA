'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Palette,
  Sliders,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  Layers,
  ChefHat,
  Shield,
  Lock,
  Sparkle,
  Copy,
  Check,
} from 'lucide-react';
import { EventCategory, Currency, GeneratedPlan } from '@/types';
import { PlanovaStore } from '@/lib/storage';
import { generateInitialBudgetCategories } from '@/lib/budget-calc';
import { formatCurrency } from '@/lib/utils';

export default function NewEventWizard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStepText, setGenerationStepText] = useState<string>('Preparing your celebration plan...');
  const [regeneratingSection, setRegeneratingSection] = useState<string | null>(null);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  useEffect(() => {
    setIsAuthenticated(PlanovaStore.isAuthenticated());
  }, []);

  // Form State
  const [details, setDetails] = useState({
    title: '',
    category: 'wedding' as EventCategory,
    date: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
    startTime: '16:00',
    endTime: '23:30',
    location: '',
    city: '',
    isIndoor: false,
    expectedGuests: 150,
  });

  const [budget, setBudget] = useState({
    totalBudget: 800000,
    currency: 'INR' as Currency,
    isBudgetStrict: true,
    emergencyReservePercentage: 8,
  });

  const [stylePrefs, setStylePrefs] = useState({
    themePreference: '',
    style: 'elegant' as 'formal' | 'elegant' | 'traditional' | 'modern' | 'minimalist' | 'fun' | 'luxury',
    foodPreferences: ['Multi-cuisine', 'Artisanal Canapés', 'Vegetarian Options'],
    culturalPreferences: '',
    accessibilityRequirements: '',
    specialRequests: '',
  });

  const [priorities, setPriorities] = useState({
    venue: 4,
    food: 5,
    decoration: 4,
    photography: 4,
    entertainment: 3,
    guestExperience: 5,
    sustainability: 3,
  });

  // Generated Plan
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // If not authenticated, show luxury prompt requiring sign in
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#F7EFE7]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-8 rounded-3xl bg-white/90 border border-[#E8D2C4] shadow-2xl text-center space-y-6 backdrop-blur-xl"
        >
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#3E3239] via-[#6B5560] to-[#3E3239] flex items-center justify-center text-[#F7EFE7] mx-auto shadow-xl">
            <Lock className="w-7 h-7 text-[#E8D2C4]" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-[#3E3239]">Sign In to Plan Your Celebration</h2>
            <p className="text-xs text-[#6B5560] mt-2 leading-relaxed">
              Your customized event blueprints, budget breakdowns, and vendor contacts are securely saved to your private workspace.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href="/auth/sign-in?redirect=/events/new"
              className="w-full py-3.5 px-4 rounded-2xl text-xs font-bold text-[#F7EFE7] bg-gradient-to-r from-[#3E3239] via-[#6B5560] to-[#3E3239] hover:opacity-95 shadow-lg flex items-center justify-center gap-2 transition active:scale-95"
            >
              <span>Sign In to Your Account</span>
              <ArrowRight className="w-4 h-4 text-[#E8D2C4]" />
            </Link>

            <Link
              href="/auth/sign-up?redirect=/events/new"
              className="w-full block py-3 px-4 rounded-2xl text-xs font-bold text-[#3E3239] bg-[#E8D2C4]/40 hover:bg-[#E8D2C4]/70 border border-[#C7A9A3]/50 transition"
            >
              Don't have an account? Sign Up Free
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Trigger AI Plan Generation with animated progress steps
  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    setCurrentStep(5);

    const stepIntervals = [
      'Gathering design inspiration...',
      'Crafting color palette & atmosphere...',
      'Structuring budget & safety buffer...',
      'Organizing timeline & banquet details...',
      'Putting your event plan together...',
    ];

    let stepIdx = 0;
    const intervalTimer = setInterval(() => {
      stepIdx++;
      if (stepIdx < stepIntervals.length) {
        setGenerationStepText(stepIntervals[stepIdx]);
      }
    }, 900);

    try {
      const res = await fetch('/api/ai/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...details,
          ...budget,
          ...stylePrefs,
          priorities,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong while generating your plan.');
      }

      setGeneratedPlan(data.plan);
    } catch (err: any) {
      console.error('Plan generation error:', err);
      setGenerationError('Something went wrong while generating your plan. Please try again.');
    } finally {
      clearInterval(intervalTimer);
      setIsGenerating(false);
    }
  };

  // Regenerate Section
  const handleRegenerateSection = async (sectionName: string) => {
    if (!generatedPlan) return;
    setRegeneratingSection(sectionName);

    try {
      const res = await fetch('/api/ai/regenerate-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: sectionName,
          eventDetails: { ...details, ...budget },
          currentData: (generatedPlan as any)[sectionName],
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        alert('Something went wrong while updating this section. Please try again.');
        return;
      }

      setGeneratedPlan({
        ...generatedPlan,
        [sectionName]: result.data,
      });
    } catch (e: any) {
      console.error('Regenerate section error:', e);
      alert('Something went wrong while updating this section. Please try again.');
    } finally {
      setRegeneratingSection(null);
    }
  };

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  // Save Event to Store & Redirect
  const handleSaveAndLaunch = () => {
    const newEventId =
      typeof window !== 'undefined' && window.crypto?.randomUUID
        ? window.crypto.randomUUID()
        : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          });
    const user = PlanovaStore.getUser();

    const coverImages: Record<EventCategory, string> = {
      wedding: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      birthday: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80',
      anniversary: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
      engagement: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
      college_fest: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
      corporate: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
      community: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80',
      other: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    };

    PlanovaStore.saveEvent({
      id: newEventId,
      user_id: user.id,
      title: details.title || `${details.category.toUpperCase()} Celebration`,
      category: details.category,
      date: details.date,
      start_time: details.startTime,
      end_time: details.endTime,
      location: details.location || 'Bespoke Venue',
      city: details.city || 'Metropolitan City',
      is_indoor: details.isIndoor,
      expected_guests: details.expectedGuests,
      total_budget: budget.totalBudget,
      currency: budget.currency,
      is_budget_strict: budget.isBudgetStrict,
      emergency_reserve_percentage: budget.emergencyReservePercentage,
      status: 'planning',
      progress_percentage: 15,
      cover_image: coverImages[details.category],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    // Populate budget categories
    const initialCats = generateInitialBudgetCategories(
      newEventId,
      budget.totalBudget,
      details.category,
      budget.emergencyReservePercentage
    );
    PlanovaStore.saveBudgetCategories(newEventId, initialCats);

    // Populate initial tasks from generated plan or defaults
    if (generatedPlan?.task_checklist) {
      generatedPlan.task_checklist.forEach((t) => {
        PlanovaStore.addTask(newEventId, {
          title: t.title,
          description: t.description,
          due_date: details.date,
          priority: t.priority,
          status: 'todo',
          assignee: user.full_name,
          is_completed: false,
          category: t.phase,
        });
      });
    }

    // Save Theme asset
    if (generatedPlan?.theme_concept) {
      PlanovaStore.addCreativeAsset(newEventId, {
        asset_type: 'theme',
        title: `Design Theme: ${generatedPlan.theme_concept.title}`,
        content: `${generatedPlan.theme_concept.description}\n\nColors: ${generatedPlan.theme_concept.colors.join(', ')}\nKeywords: ${generatedPlan.theme_concept.style_keywords.join(', ')}`,
        tags: ['theme', details.category],
      });
    }

    router.push(`/events/${newEventId}/plan`);
  };

  const steps = [
    { num: 1, label: 'Details', icon: Calendar },
    { num: 2, label: 'Budget', icon: DollarSign },
    { num: 3, label: 'Style', icon: Palette },
    { num: 4, label: 'Priorities', icon: Sliders },
    { num: 5, label: 'Blueprint', icon: Sparkles },
  ];

  return (
    <div className="py-10 md:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Wizard Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E8D2C4]/70 border border-[#C7A9A3]/60 text-xs font-bold text-[#3E3239] mb-3 shadow-xs">
          <Sparkle className="w-3.5 h-3.5 text-[#6B5560]" />
          Event Planning Studio
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#3E3239] tracking-tight">
          Create Your Celebration Blueprint
        </h1>
        <p className="text-sm text-[#6B5560] mt-2">
          Step-by-step guidance tailored to your vision, atmosphere, and financial limits.
        </p>
      </div>

      {/* STEP INDICATORS */}
      <div className="mb-10">
        <div className="flex items-center justify-between relative max-w-3xl mx-auto">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[#E8D2C4]/60 -z-0" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-[#3E3239] to-[#6B5560] transition-all duration-500 -z-0"
            style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
          />

          {steps.map((s) => {
            const Icon = s.icon;
            const isCompleted = currentStep > s.num;
            const isActive = currentStep === s.num;

            return (
              <div key={s.num} className="flex flex-col items-center z-10">
                <button
                  type="button"
                  onClick={() => {
                    if (s.num < currentStep) setCurrentStep(s.num);
                  }}
                  disabled={s.num > currentStep}
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-xs transition-all shadow-sm ${
                    isActive
                      ? 'bg-[#3E3239] text-[#F7EFE7] ring-4 ring-[#C7A9A3]/50 scale-110 shadow-md'
                      : isCompleted
                      ? 'bg-[#6B5560] text-[#F7EFE7]'
                      : 'bg-[#F7EFE7] text-[#9E8189] border border-[#C7A9A3]/60'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5 text-[#E8D2C4]" /> : <Icon className="w-4 h-4" />}
                </button>
                <span
                  className={`text-[11px] font-bold mt-2 uppercase tracking-wider ${
                    isActive ? 'text-[#3E3239]' : 'text-[#9E8189]'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* MAIN WIZARD CONTAINER */}
      <div className="bg-white/90 border border-[#E8D2C4] rounded-3xl p-6 sm:p-10 shadow-card backdrop-blur-xl relative overflow-hidden">
        {/* STEP 1: EVENT DETAILS */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-[#E8D2C4]">
              <h2 className="text-xl font-black text-[#3E3239]">
                Step 1: Event Fundamentals
              </h2>
              <p className="text-xs text-[#6B5560] mt-0.5">Define your core celebration details and estimated audience.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3E3239] uppercase tracking-wider mb-1.5">
                  Event Title / Couple / Host Name *
                </label>
                <input
                  type="text"
                  required
                  value={details.title}
                  onChange={(e) => setDetails({ ...details, title: e.target.value })}
                  placeholder="e.g. Rohan & Ananya's Royal Palace Wedding"
                  className="w-full px-4 py-3 rounded-2xl border border-[#C7A9A3]/60 bg-[#F7EFE7]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E3239]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#3E3239] uppercase tracking-wider mb-1.5">
                    Celebration Category
                  </label>
                  <select
                    value={details.category}
                    onChange={(e) => setDetails({ ...details, category: e.target.value as EventCategory })}
                    className="w-full px-4 py-3 rounded-2xl border border-[#C7A9A3]/60 bg-[#F7EFE7]/40 text-sm font-semibold text-[#3E3239] focus:outline-none focus:ring-2 focus:ring-[#3E3239]"
                  >
                    <option value="wedding">Royal & Destination Wedding</option>
                    <option value="birthday">Milestone Birthday</option>
                    <option value="anniversary">Anniversary Celebration</option>
                    <option value="engagement">Engagement Ceremony</option>
                    <option value="corporate">Corporate Gala & Summit</option>
                    <option value="college_fest">College / Cultural Fest</option>
                    <option value="community">Community Banquet</option>
                    <option value="other">Bespoke Celebration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3E3239] uppercase tracking-wider mb-1.5">
                    Celebration Date
                  </label>
                  <input
                    type="date"
                    value={details.date}
                    onChange={(e) => setDetails({ ...details, date: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-[#C7A9A3]/60 bg-[#F7EFE7]/40 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#3E3239]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#3E3239] uppercase tracking-wider mb-1.5">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={details.startTime}
                    onChange={(e) => setDetails({ ...details, startTime: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-[#C7A9A3]/60 bg-[#F7EFE7]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E3239]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3E3239] uppercase tracking-wider mb-1.5">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={details.endTime}
                    onChange={(e) => setDetails({ ...details, endTime: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-[#C7A9A3]/60 bg-[#F7EFE7]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E3239]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3E3239] uppercase tracking-wider mb-1.5">
                    Expected Guests
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={details.expectedGuests}
                    onChange={(e) => setDetails({ ...details, expectedGuests: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-3 rounded-2xl border border-[#C7A9A3]/60 bg-[#F7EFE7]/40 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#3E3239]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#3E3239] uppercase tracking-wider mb-1.5">
                    Destination City / Region
                  </label>
                  <input
                    type="text"
                    value={details.city}
                    onChange={(e) => setDetails({ ...details, city: e.target.value })}
                    placeholder="e.g. Jaipur / Mumbai / Bengaluru"
                    className="w-full px-4 py-3 rounded-2xl border border-[#C7A9A3]/60 bg-[#F7EFE7]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E3239]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3E3239] uppercase tracking-wider mb-1.5">
                    Venue Name or Style
                  </label>
                  <input
                    type="text"
                    value={details.location}
                    onChange={(e) => setDetails({ ...details, location: e.target.value })}
                    placeholder="e.g. Jai Mahal Palace Grounds"
                    className="w-full px-4 py-3 rounded-2xl border border-[#C7A9A3]/60 bg-[#F7EFE7]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E3239]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: BUDGET & CONTINGENCY */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-[#E8D2C4]">
              <h2 className="text-xl font-black text-[#3E3239]">
                Step 2: Financial Precision & Safeguards
              </h2>
              <p className="text-xs text-[#6B5560] mt-0.5">Establish your maximum spend and lock an automatic emergency reserve.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#3E3239] uppercase tracking-wider mb-1.5">
                  Total Budget Limit
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#6B5560]">
                    {budget.currency === 'INR' ? '₹' : '$'}
                  </span>
                  <input
                    type="number"
                    min={10000}
                    step={10000}
                    value={budget.totalBudget}
                    onChange={(e) => setBudget({ ...budget, totalBudget: parseInt(e.target.value) || 0 })}
                    className="w-full pl-9 pr-4 py-3 rounded-2xl border border-[#C7A9A3]/60 bg-[#F7EFE7]/40 text-lg font-black text-[#3E3239] focus:outline-none focus:ring-2 focus:ring-[#3E3239]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3E3239] uppercase tracking-wider mb-1.5">
                  Currency
                </label>
                <select
                  value={budget.currency}
                  onChange={(e) => setBudget({ ...budget, currency: e.target.value as Currency })}
                  className="w-full px-4 py-3 rounded-2xl border border-[#C7A9A3]/60 bg-[#F7EFE7]/40 text-sm font-bold text-[#3E3239] focus:outline-none focus:ring-2 focus:ring-[#3E3239]"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="AED">AED (د.إ)</option>
                </select>
              </div>
            </div>

            {/* Emergency Reserve Slider Card */}
            <div className="p-5 rounded-2xl bg-[#F7EFE7]/80 border border-[#C7A9A3]/60 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-black uppercase text-[#3E3239] block">
                    Protected Emergency Reserve: {budget.emergencyReservePercentage}%
                  </span>
                  <span className="text-[11px] text-[#6B5560]">
                    Safeguarded reserve for unforeseen surges or sudden weather accommodations.
                  </span>
                </div>
                <span className="text-sm font-extrabold text-[#3E3239] bg-white px-3 py-1 rounded-xl border border-[#E8D2C4] shadow-xs">
                  {formatCurrency(
                    Math.round((budget.totalBudget * budget.emergencyReservePercentage) / 100),
                    budget.currency
                  )}
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={20}
                value={budget.emergencyReservePercentage}
                onChange={(e) =>
                  setBudget({ ...budget, emergencyReservePercentage: parseInt(e.target.value) || 0 })
                }
                className="w-full accent-[#3E3239] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#9E8189] font-bold">
                <span>0% (Tight)</span>
                <span>8% (Recommended)</span>
                <span>20% (Conservative)</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E8D2C4]">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={budget.isBudgetStrict}
                  onChange={(e) => setBudget({ ...budget, isBudgetStrict: e.target.checked })}
                  className="w-4 h-4 rounded text-[#3E3239] accent-[#3E3239]"
                />
                <span className="text-xs font-bold text-[#3E3239]">
                  Strict Budget Cap (Alert me if vendor quotes or receipts approach category limits)
                </span>
              </label>
            </div>
          </div>
        )}

        {/* STEP 3: STYLE & PREFERENCES */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-[#E8D2C4]">
              <h2 className="text-xl font-black text-[#3E3239]">
                Step 3: Style, Theme & Atmosphere
              </h2>
              <p className="text-xs text-[#6B5560] mt-0.5">Direct the visual mood, sensory cues, and culinary tastes.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3E3239] uppercase tracking-wider mb-2">
                Aesthetic & Visual Direction
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {['elegant', 'traditional', 'luxury', 'modern', 'minimalist', 'fun', 'formal'].map((styleOpt) => (
                  <button
                    key={styleOpt}
                    type="button"
                    onClick={() => setStylePrefs({ ...stylePrefs, style: styleOpt as any })}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold capitalize transition-all border ${
                      stylePrefs.style === styleOpt
                        ? 'bg-[#3E3239] text-[#F7EFE7] border-[#3E3239] shadow-md'
                        : 'bg-white text-[#3E3239] border-[#C7A9A3]/50 hover:bg-[#E8D2C4]/40'
                    }`}
                  >
                    {styleOpt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3E3239] uppercase tracking-wider mb-1.5">
                Atmosphere & Inspiration
              </label>
              <input
                type="text"
                value={stylePrefs.themePreference}
                onChange={(e) => setStylePrefs({ ...stylePrefs, themePreference: e.target.value })}
                placeholder="e.g. Warm candlelight, jasmine florals, ambient amber lanterns, open skies"
                className="w-full px-4 py-3 rounded-2xl border border-[#C7A9A3]/60 bg-[#F7EFE7]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E3239]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3E3239] uppercase tracking-wider mb-1.5">
                Cultural or Traditional Nuances
              </label>
              <input
                type="text"
                value={stylePrefs.culturalPreferences}
                onChange={(e) => setStylePrefs({ ...stylePrefs, culturalPreferences: e.target.value })}
                placeholder="e.g. Royal Marwari rituals, Sangeet choreography stage, late-night tea service"
                className="w-full px-4 py-3 rounded-2xl border border-[#C7A9A3]/60 bg-[#F7EFE7]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E3239]"
              />
            </div>
          </div>
        )}

        {/* STEP 4: PRIORITIES */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-[#E8D2C4]">
              <h2 className="text-xl font-black text-[#3E3239]">
                Step 4: Celebration Priorities
              </h2>
              <p className="text-xs text-[#6B5560] mt-0.5">Choose which areas to prioritize for your budget.</p>
            </div>

            <div className="space-y-4">
              {[
                { key: 'food', label: 'Catering & Gourmet Dining Excellence' },
                { key: 'venue', label: 'Venue Grandeur & Architectural Staging' },
                { key: 'decoration', label: 'Decor, Florals & Ambient Light' },
                { key: 'photography', label: 'Cinematography & Candid Portraits' },
                { key: 'entertainment', label: 'Live Bands, DJ & Emcee Atmosphere' },
              ].map((p) => (
                <div key={p.key} className="p-3.5 rounded-2xl bg-[#F7EFE7]/70 border border-[#C7A9A3]/40 space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-[#3E3239]">
                    <span>{p.label}</span>
                    <span className="text-[#6B5560] font-black">{(priorities as any)[p.key]}/5</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={(priorities as any)[p.key]}
                    onChange={(e) =>
                      setPriorities({ ...priorities, [p.key]: parseInt(e.target.value) || 3 })
                    }
                    className="w-full accent-[#3E3239] cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: BLUEPRINT REVIEW */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8D2C4]">
              <div>
                <h2 className="text-xl font-black text-[#3E3239] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#9E8189]" />
                  Master Blueprint Review
                </h2>
                <span className="text-xs text-[#6B5560]">
                  Customized for your celebration
                </span>
              </div>

              {generatedPlan && !isGenerating && (
                <button
                  onClick={handleSaveAndLaunch}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#F7EFE7] bg-gradient-to-r from-[#3E3239] to-[#6B5560] hover:shadow-lg flex items-center gap-1.5 transition active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#E8D2C4]" /> Save & View Event Plan
                </button>
              )}
            </div>

            {/* Aesthetic Loading Animation */}
            {isGenerating ? (
              <div className="py-24 text-center space-y-6">
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-[#C7A9A3]/30 animate-ping" />
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#3E3239] via-[#6B5560] to-[#E8D2C4] animate-spin flex items-center justify-center p-1 shadow-2xl">
                    <div className="w-full h-full bg-[#F7EFE7] rounded-full flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-[#3E3239] animate-pulse" />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#3E3239]">
                    {generationStepText}
                  </h3>
                  <p className="text-xs text-[#6B5560] max-w-sm mx-auto mt-1 leading-relaxed">
                    Balancing budget categories, calculating guest needs, and organizing schedules.
                  </p>
                </div>
              </div>
            ) : generatedPlan ? (
              <div className="space-y-6">
                {/* Executive Overview Card */}
                <div className="p-6 rounded-2xl bg-[#F7EFE7]/80 border border-[#C7A9A3]/60 text-xs sm:text-sm text-[#3E3239] leading-relaxed font-normal shadow-xs">
                  <span className="font-extrabold text-[#3E3239] text-xs uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#9E8189]" /> Celebration Overview
                  </span>
                  {generatedPlan.overview}
                </div>

                {/* Theme & Palette with Interactive Hex Swatches */}
                <div className="p-6 rounded-2xl border border-[#E8D2C4] bg-white shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#9E8189]">
                      Curated Theme & Visual Identity
                    </span>
                    <button
                      onClick={() => handleRegenerateSection('theme_concept')}
                      disabled={regeneratingSection === 'theme_concept'}
                      className="text-xs font-bold text-[#6B5560] hover:text-[#3E3239] flex items-center gap-1 transition"
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 ${regeneratingSection === 'theme_concept' ? 'animate-spin' : ''}`}
                      />
                      Regenerate Theme
                    </button>
                  </div>

                  <h3 className="text-lg font-black text-[#3E3239]">
                    {generatedPlan.theme_concept.title}
                  </h3>
                  <p className="text-xs text-[#6B5560] leading-relaxed font-normal">
                    {generatedPlan.theme_concept.description}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    {generatedPlan.theme_concept.colors.map((c, i) => (
                      <div
                        key={i}
                        onClick={() => copyToClipboard(c)}
                        className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border border-[#E8D2C4] bg-[#F7EFE7]/50 hover:bg-[#E8D2C4]/40 transition cursor-pointer"
                        title="Click to copy hex code"
                      >
                        <div className="w-5 h-5 rounded-lg shadow-xs border border-black/10" style={{ backgroundColor: c }} />
                        <span className="text-[11px] font-mono font-bold text-[#3E3239]">{c}</span>
                        {copiedHex === c ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3 text-[#9E8189] opacity-50" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Itemized Budget Breakdown Card */}
                {generatedPlan.budget_breakdown && (
                  <div className="p-6 rounded-2xl border border-[#E8D2C4] bg-white shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#9E8189]">
                        Target Budget Allocation
                      </span>
                      <span className="text-xs font-extrabold text-[#3E3239]">
                        Total: {formatCurrency(budget.totalBudget, budget.currency)}
                      </span>
                    </div>

                    <div className="space-y-2.5 pt-2">
                      {generatedPlan.budget_breakdown.map((b, i) => (
                        <div key={i} className="p-3 rounded-xl bg-[#F7EFE7]/60 border border-[#E8D2C4] space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-[#3E3239]">{b.category}</span>
                            <span className="font-extrabold text-[#3E3239]">
                              {formatCurrency(b.amount, budget.currency)} ({b.percentage}%)
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-[#E8D2C4]/60 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#3E3239] to-[#6B5560] rounded-full" style={{ width: `${b.percentage}%` }} />
                          </div>
                          <span className="text-[10px] text-[#6B5560] block font-normal">{b.rationale}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Day Schedule Preview */}
                <div className="p-6 rounded-2xl border border-[#E8D2C4] bg-white shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#9E8189]">
                      Day-of Schedule Run-Through
                    </span>
                    <button
                      onClick={() => handleRegenerateSection('day_schedule')}
                      disabled={regeneratingSection === 'day_schedule'}
                      className="text-xs font-bold text-[#6B5560] hover:text-[#3E3239] flex items-center gap-1 transition"
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 ${regeneratingSection === 'day_schedule' ? 'animate-spin' : ''}`}
                      />
                      Regenerate Schedule
                    </button>
                  </div>

                  <div className="space-y-2 pt-1">
                    {generatedPlan.day_schedule.map((slot, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[#F7EFE7]/60 border border-[#E8D2C4] text-xs">
                        <span className="font-black text-[#3E3239] w-14 shrink-0">{slot.time}</span>
                        <div className="flex-1">
                          <span className="font-bold text-[#3E3239] block">{slot.activity}</span>
                          <span className="text-[#6B5560] text-[11px] block mt-0.5">{slot.location_or_notes}</span>
                        </div>
                        <span className="text-[10px] font-bold text-[#9E8189] bg-white px-2 py-0.5 rounded-md border border-[#E8D2C4] shrink-0">
                          {slot.responsibility}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gourmet Dining Menu Suggestions */}
                <div className="p-6 rounded-2xl border border-[#E8D2C4] bg-white shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#9E8189]">
                      Curated Banquet Menu Concept
                    </span>
                    <button
                      onClick={() => handleRegenerateSection('menu_suggestions')}
                      disabled={regeneratingSection === 'menu_suggestions'}
                      className="text-xs font-bold text-[#6B5560] hover:text-[#3E3239] flex items-center gap-1 transition"
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 ${regeneratingSection === 'menu_suggestions' ? 'animate-spin' : ''}`}
                      />
                      Regenerate Menu
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {generatedPlan.menu_suggestions.map((m, i) => (
                      <div key={i} className="p-4 rounded-xl bg-[#F7EFE7]/60 border border-[#E8D2C4] text-xs space-y-1.5">
                        <span className="font-extrabold text-[#3E3239] block">{m.course}</span>
                        <p className="text-[#6B5560] text-xs leading-relaxed font-normal">{m.items.join(' • ')}</p>
                        {m.specialty_notes && (
                          <span className="text-[10px] italic text-[#9E8189] block pt-1 border-t border-[#E8D2C4]/70">
                            Chef Note: {m.specialty_notes}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Decor Concepts */}
                {generatedPlan.decor_concepts && (
                  <div className="p-6 rounded-2xl border border-[#E8D2C4] bg-white shadow-xs space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#9E8189]">
                      Floral & Decor Architecture
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      {generatedPlan.decor_concepts.map((d, i) => (
                        <div key={i} className="p-3.5 rounded-xl bg-[#F7EFE7]/60 border border-[#E8D2C4] text-xs space-y-1">
                          <span className="font-extrabold text-[#3E3239] block">{d.zone}</span>
                          <p className="text-[#6B5560] text-[11px] font-medium leading-relaxed">{d.concept}</p>
                          <span className="text-[10px] text-[#9E8189] block pt-1">Materials: {d.materials}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : generationError ? (
              <div className="p-8 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-rose-900">Notice</h3>
                  <p className="text-xs text-rose-700 mt-1 max-w-md mx-auto">{generationError}</p>
                </div>
                <button
                  type="button"
                  onClick={handleGeneratePlan}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#3E3239] hover:bg-[#6B5560] shadow-sm inline-flex items-center gap-1.5 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Try Again
                </button>
              </div>
            ) : null}
          </div>
        )}

        {/* BOTTOM NAVIGATION BUTTONS */}
        <div className="mt-10 pt-6 border-t border-[#E8D2C4] flex items-center justify-between">
          {currentStep > 1 && currentStep <= 4 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-[#6B5560] hover:bg-[#E8D2C4]/40 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-[#F7EFE7] bg-gradient-to-r from-[#3E3239] to-[#6B5560] hover:shadow-lg transition active:scale-95 ml-auto"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : currentStep === 4 ? (
            <button
              type="button"
              onClick={handleGeneratePlan}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-xs font-bold text-[#F7EFE7] bg-gradient-to-r from-[#3E3239] via-[#6B5560] to-[#3E3239] shadow-lg hover:shadow-xl transition active:scale-95 ml-auto"
            >
              <Sparkles className="w-4 h-4 text-[#E8D2C4]" />
              <span>Create My Event Plan</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSaveAndLaunch}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-xs font-bold text-[#F7EFE7] bg-gradient-to-r from-[#3E3239] to-[#6B5560] hover:shadow-xl transition active:scale-95 ml-auto"
            >
              <CheckCircle2 className="w-4 h-4 text-[#E8D2C4]" />
              <span>Save & View Event Plan</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
