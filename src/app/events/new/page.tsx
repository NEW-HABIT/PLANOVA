'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
} from 'lucide-react';
import { EventCategory, Currency, GeneratedPlan } from '@/types';
import { PlanovaStore } from '@/lib/storage';
import { generateInitialBudgetCategories } from '@/lib/budget-calc';
import { formatCurrency } from '@/lib/utils';

export default function NewEventWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [regeneratingSection, setRegeneratingSection] = useState<string | null>(null);

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
    foodPreferences: ['Multi-cuisine', 'Vegetarian Options'],
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
  const [isMockResult, setIsMockResult] = useState<boolean>(false);

  // Trigger AI Plan Generation
  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    setCurrentStep(5);

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

      if (!res.ok) throw new Error('Generation failed');
      const data = await res.json();
      setGeneratedPlan(data.plan);
      setIsMockResult(data.isMock);
    } catch (err) {
      console.error(err);
      alert('AI plan synthesis encountered an issue. Loading contextual recommendation.');
    } finally {
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

      if (res.ok) {
        const result = await res.json();
        setGeneratedPlan({
          ...generatedPlan,
          [sectionName]: result.data,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRegeneratingSection(null);
    }
  };

  // Save Event to Store & Redirect
  const handleSaveAndLaunch = () => {
    const newEventId = `evt_${Date.now()}`;
    const user = PlanovaStore.getUser();

    // Default cover images by category
    const coverImages: Record<EventCategory, string> = {
      wedding: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      birthday: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80',
      anniversary: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
      engagement: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
      college_fest: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
      corporate: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
      community: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80',
      other: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    };

    PlanovaStore.saveEvent({
      id: newEventId,
      user_id: user.id,
      title: details.title || `My ${details.category.replace('_', ' ')} Celebration`,
      category: details.category,
      date: details.date,
      start_time: details.startTime,
      end_time: details.endTime,
      location: details.location || 'TBD Venue',
      city: details.city || 'My City',
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

    // Generate initial budget categories
    const initialCategories = generateInitialBudgetCategories(
      newEventId,
      budget.totalBudget,
      details.category,
      budget.emergencyReservePercentage
    );
    PlanovaStore.saveBudgetCategories(newEventId, initialCategories);

    // Save initial tasks from plan
    if (generatedPlan?.task_checklist) {
      const initialTasks = generatedPlan.task_checklist.map((t, idx) => ({
        id: `tsk_${newEventId}_${idx + 1}`,
        event_id: newEventId,
        title: t.title,
        description: t.description,
        due_date: details.date,
        priority: t.priority,
        status: 'todo' as const,
        assignee: user.full_name,
        is_completed: false,
        category: t.phase,
      }));
      PlanovaStore.saveTasks(newEventId, initialTasks);
    }

    // Save creative theme asset
    if (generatedPlan?.theme_concept) {
      PlanovaStore.addCreativeAsset(newEventId, {
        asset_type: 'theme',
        title: generatedPlan.theme_concept.title,
        content: generatedPlan.theme_concept.description,
        tags: generatedPlan.theme_concept.style_keywords,
      });
    }

    // Redirect to newly created event plan workspace
    router.push(`/events/${newEventId}/plan`);
  };

  return (
    <div className="py-8 md:py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-violet-600" />
          <span>Multi-Step AI Planner</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Create Your Next Event
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Follow 4 simple steps to let Groq Llama 3.3 synthesize a complete production blueprint.
        </p>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between mb-8 px-2 max-w-2xl mx-auto">
        {[
          { num: 1, label: 'Details' },
          { num: 2, label: 'Budget' },
          { num: 3, label: 'Style & Taste' },
          { num: 4, label: 'Priorities' },
          { num: 5, label: 'AI Blueprint' },
        ].map((s) => (
          <div key={s.num} className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                currentStep === s.num
                  ? 'bg-indigo-700 text-white ring-4 ring-indigo-100 shadow-md scale-105'
                  : currentStep > s.num
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {currentStep > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
            </div>
            <span
              className={`text-[11px] font-semibold mt-1.5 hidden sm:block ${
                currentStep === s.num ? 'text-indigo-700 font-bold' : 'text-slate-400'
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* FORM CARD */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-8">
        {/* STEP 1: EVENT DETAILS */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
              Step 1: Event Details
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Event Name / Working Title *
              </label>
              <input
                type="text"
                value={details.title}
                onChange={(e) => setDetails({ ...details, title: e.target.value })}
                placeholder="e.g. Siddharth & Rhea's Sunset Wedding / TechConf 2027"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Category *
                </label>
                <select
                  value={details.category}
                  onChange={(e) => setDetails({ ...details, category: e.target.value as EventCategory })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                >
                  <option value="wedding">Wedding / Reception</option>
                  <option value="birthday">Birthday Party</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="engagement">Engagement Celebration</option>
                  <option value="corporate">Corporate Summit / Gala</option>
                  <option value="college_fest">College Cultural Fest</option>
                  <option value="community">Community Gathering</option>
                  <option value="other">Other Occasion</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Event Date *
                </label>
                <input
                  type="date"
                  value={details.date}
                  onChange={(e) => setDetails({ ...details, date: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={details.startTime}
                  onChange={(e) => setDetails({ ...details, startTime: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={details.endTime}
                  onChange={(e) => setDetails({ ...details, endTime: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Expected Guests
                </label>
                <input
                  type="number"
                  min={5}
                  max={10000}
                  value={details.expectedGuests}
                  onChange={(e) => setDetails({ ...details, expectedGuests: parseInt(e.target.value) || 10 })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  City / Region *
                </label>
                <input
                  type="text"
                  value={details.city}
                  onChange={(e) => setDetails({ ...details, city: e.target.value })}
                  placeholder="e.g. Udaipur, Mumbai, Bengaluru, Delhi"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Venue Setting
                </label>
                <div className="flex items-center gap-4 pt-2">
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="setting"
                      checked={details.isIndoor}
                      onChange={() => setDetails({ ...details, isIndoor: true })}
                      className="text-indigo-600"
                    />
                    Indoor (Banquet/Hall)
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="setting"
                      checked={!details.isIndoor}
                      onChange={() => setDetails({ ...details, isIndoor: false })}
                      className="text-indigo-600"
                    />
                    Outdoor / Lawn / Beach
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: BUDGET & CONTINGENCY */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
              Step 2: Budget Allocation & Reserve
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Total Budget Amount *
                </label>
                <input
                  type="number"
                  min={1000}
                  step={5000}
                  value={budget.totalBudget}
                  onChange={(e) => setBudget({ ...budget, totalBudget: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-base font-bold text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Currency
                </label>
                <select
                  value={budget.currency}
                  onChange={(e) => setBudget({ ...budget, currency: e.target.value as Currency })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                >
                  <option value="INR">INR (₹) - Indian Rupee</option>
                  <option value="USD">USD ($) - US Dollar</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="GBP">GBP (£) - British Pound</option>
                  <option value="AED">AED (AED) - UAE Dirham</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-indigo-950 block">
                    Emergency Contingency Reserve ({budget.emergencyReservePercentage}%)
                  </span>
                  <span className="text-[11px] text-indigo-700">
                    Safeguarded fund for unanticipated last-minute surges or weather contingencies.
                  </span>
                </div>
                <span className="text-sm font-bold text-indigo-900">
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
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0% (Tight)</span>
                <span>8% (Recommended)</span>
                <span>20% (Conservative)</span>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={budget.isBudgetStrict}
                  onChange={(e) => setBudget({ ...budget, isBudgetStrict: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600"
                />
                <span className="text-xs font-semibold text-slate-700">
                  Strict Budget Cap (Alert me immediately if quotes or expenses exceed planned category targets)
                </span>
              </label>
            </div>
          </div>
        )}

        {/* STEP 3: STYLE & PREFERENCES */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
              Step 3: Style, Theme & Cultural Preferences
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Visual & Aesthetic Style
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {['elegant', 'traditional', 'luxury', 'modern', 'minimalist', 'fun', 'formal'].map((styleOpt) => (
                  <button
                    key={styleOpt}
                    type="button"
                    onClick={() => setStylePrefs({ ...stylePrefs, style: styleOpt as any })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all border ${
                      stylePrefs.style === styleOpt
                        ? 'bg-indigo-700 text-white border-indigo-700 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {styleOpt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Theme / Atmosphere Inspiration
              </label>
              <input
                type="text"
                value={stylePrefs.themePreference}
                onChange={(e) => setStylePrefs({ ...stylePrefs, themePreference: e.target.value })}
                placeholder="e.g. Celestial Starlight, Vintage Heritage, Neon Galaxy, Pastel Floral"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Cultural / Regional Traditions (Optional)
                </label>
                <input
                  type="text"
                  value={stylePrefs.culturalPreferences}
                  onChange={(e) => setStylePrefs({ ...stylePrefs, culturalPreferences: e.target.value })}
                  placeholder="e.g. Rajasthani Rajput, Bengali, South Indian, Contemporary Christian"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Accessibility & Dietary Needs
                </label>
                <input
                  type="text"
                  value={stylePrefs.accessibilityRequirements}
                  onChange={(e) => setStylePrefs({ ...stylePrefs, accessibilityRequirements: e.target.value })}
                  placeholder="e.g. Wheelchair access, Jain counter, Nut-free cake"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: PRIORITIES */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
              Step 4: Planning Priorities
            </h2>
            <p className="text-xs text-slate-500">
              Where should PLANOVA focus the greatest budget weight and attention?
            </p>

            <div className="space-y-4">
              {[
                { key: 'food', label: 'Catering & Beverages Quality' },
                { key: 'venue', label: 'Venue Grandeur & Scenic Atmosphere' },
                { key: 'decoration', label: 'Floral & Lighting Staging' },
                { key: 'photography', label: 'Cinematography & Pre-shoots' },
                { key: 'entertainment', label: 'Live Bands, DJ & Emcee' },
              ].map((p) => (
                <div key={p.key} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>{p.label}</span>
                    <span className="text-indigo-600">{(priorities as any)[p.key]}/5</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={(priorities as any)[p.key]}
                    onChange={(e) =>
                      setPriorities({ ...priorities, [p.key]: parseInt(e.target.value) || 3 })
                    }
                    className="w-full accent-indigo-600"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: AI BLUEPRINT REVIEW */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  AI Blueprint Review
                </h2>
                <span className="text-xs text-slate-500">
                  {isMockResult ? 'Demo Mode (Fast Synthesis)' : 'Generated via Groq Llama 3.3 70B'}
                </span>
              </div>

              {generatedPlan && !isGenerating && (
                <button
                  onClick={handleSaveAndLaunch}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Save & Launch Workspace
                </button>
              )}
            </div>

            {isGenerating ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
                <h3 className="text-base font-bold text-slate-800">
                  Synthesizing Blueprint with Groq AI...
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Calculating venue sizing, plate ratios, contingency reserves, and minute-by-minute day schedules.
                </p>
              </div>
            ) : generatedPlan ? (
              <div className="space-y-6">
                {/* Overview Card */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <span className="font-bold text-slate-900 block mb-1">Executive Summary</span>
                  {generatedPlan.overview}
                </div>

                {/* Theme Concept */}
                <div className="p-5 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/40 to-violet-50/30 relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                      Theme & Design Concept
                    </span>
                    <button
                      onClick={() => handleRegenerateSection('theme_concept')}
                      disabled={regeneratingSection === 'theme_concept'}
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <RefreshCw
                        className={`w-3 h-3 ${regeneratingSection === 'theme_concept' ? 'animate-spin' : ''}`}
                      />
                      Regenerate
                    </button>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900">
                    {generatedPlan.theme_concept.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {generatedPlan.theme_concept.description}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    {generatedPlan.theme_concept.colors.map((c, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <div className="w-5 h-5 rounded-md shadow-sm border border-slate-200" style={{ backgroundColor: c }} />
                        <span className="text-[10px] font-mono text-slate-500">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Day Schedule Preview */}
                <div className="p-5 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Day Schedule Run-Through
                    </span>
                    <button
                      onClick={() => handleRegenerateSection('day_schedule')}
                      disabled={regeneratingSection === 'day_schedule'}
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <RefreshCw
                        className={`w-3 h-3 ${regeneratingSection === 'day_schedule' ? 'animate-spin' : ''}`}
                      />
                      Regenerate
                    </button>
                  </div>
                  <div className="space-y-2">
                    {generatedPlan.day_schedule.map((slot, i) => (
                      <div key={i} className="flex items-start gap-3 p-2 rounded-xl bg-slate-50 text-xs">
                        <span className="font-bold text-indigo-700 w-14 shrink-0">{slot.time}</span>
                        <div>
                          <span className="font-bold text-slate-900 block">{slot.activity}</span>
                          <span className="text-slate-500 text-[11px]">{slot.location_or_notes}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Menu Preview */}
                <div className="p-5 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Curated Gourmet Menu
                    </span>
                    <button
                      onClick={() => handleRegenerateSection('menu_suggestions')}
                      disabled={regeneratingSection === 'menu_suggestions'}
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <RefreshCw
                        className={`w-3 h-3 ${regeneratingSection === 'menu_suggestions' ? 'animate-spin' : ''}`}
                      />
                      Regenerate
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {generatedPlan.menu_suggestions.map((m, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-50 text-xs space-y-1">
                        <span className="font-bold text-indigo-900 block">{m.course}</span>
                        <p className="text-slate-600 text-[11px]">{m.items.join(' • ')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* BOTTOM NAVIGATION BUTTONS */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
          {currentStep > 1 && currentStep <= 4 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-700 hover:bg-indigo-800 shadow-md"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : currentStep === 4 ? (
            <button
              type="button"
              onClick={handleGeneratePlan}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-700 to-violet-600 shadow-lg hover:shadow-indigo-600/30"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Synthesize Blueprint with AI</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSaveAndLaunch}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md ml-auto"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Launch Workspace</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
