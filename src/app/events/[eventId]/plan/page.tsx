'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Sparkles,
  RefreshCw,
  Printer,
  Calendar,
  Clock,
  Palette,
  ChefHat,
  ShieldAlert,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { PlanovaStore } from '@/lib/storage';
import { EventItem, GeneratedPlan } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function EventPlanPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  const [event, setEvent] = useState<EventItem | null>(null);
  const [regeneratingSection, setRegeneratingSection] = useState<string | null>(null);

  // Fallback default plan data matching event specifics
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);

  useEffect(() => {
    if (eventId) {
      const evt = PlanovaStore.getEventById(eventId);
      if (evt) {
        setEvent(evt);

        // Build contextual plan presentation
        const reserveAmount = Math.round((evt.total_budget * (evt.emergency_reserve_percentage || 8)) / 100);
        const operationalBudget = evt.total_budget - reserveAmount;

        setPlan({
          overview: `An exquisite ${evt.category} designed for ${evt.expected_guests} guests at ${evt.location}, ${evt.city}. Blending seamless hospitality with captivating aesthetics, this event is curated to evoke lasting memories while strictly honoring the ${formatCurrency(evt.total_budget, evt.currency)} budget.`,
          theme_concept: {
            title: evt.category === 'wedding' ? 'Royal Rajputana Oasis & Starry Night' : 'Modern Horizon & Ambient Light',
            description: 'Opulent heritage grandeur blended with understated modern elegance. Deep indigo velvet drapery punctuated by antique brass urns, fragrant marigold garlands, and ambient warm amber uplighting under the open sky.',
            colors: ['#4338CA', '#7C3AED', '#D97706', '#FDF2F8'],
            style_keywords: ['Grandeur', 'Warm Ambient', 'High Touch', 'Memorable'],
          },
          budget_breakdown: [
            {
              category: 'Venue & Staging',
              percentage: 26,
              amount: Math.round(operationalBudget * 0.26),
              rationale: 'Primary halls, lawns, and staged lighting.',
            },
            {
              category: 'Catering & Dining',
              percentage: 30,
              amount: Math.round(operationalBudget * 0.30),
              rationale: 'Multi-course banquet with signature live counters.',
            },
            {
              category: 'Decor & Florals',
              percentage: 15,
              amount: Math.round(operationalBudget * 0.15),
              rationale: 'Stage archways, guest tables, and floral canopy.',
            },
            {
              category: 'Photography & Video',
              percentage: 12,
              amount: Math.round(operationalBudget * 0.12),
              rationale: '4K Cinematography, candid stills, and drone reel.',
            },
            {
              category: 'Emergency Reserve',
              percentage: evt.emergency_reserve_percentage || 8,
              amount: reserveAmount,
              rationale: 'Safeguarded against unforeseen logistics or surges.',
            },
          ],
          milestones: [
            {
              title: 'Lock Venue & Booking Clearance',
              due_week: 'T-6 Weeks',
              description: 'Confirm electrical loads and timing permits.',
              priority: 'urgent',
            },
            {
              title: 'Catering Tasting & Signature Menu',
              due_week: 'T-4 Weeks',
              description: 'Sample appetizers and finalize dietary choices.',
              priority: 'high',
            },
            {
              title: 'Invitations & Digital RSVP Dispatch',
              due_week: 'T-3 Weeks',
              description: 'Send animated WhatsApp & email cards.',
              priority: 'high',
            },
          ],
          vendor_selection_criteria: [
            {
              category: 'Catering',
              key_questions: [
                'Are live chaat items freshly fried on demand?',
                'Is pure ghee used for traditional sweets?',
              ],
              budget_range: `${formatCurrency(operationalBudget * 0.28, evt.currency)} - ${formatCurrency(operationalBudget * 0.32, evt.currency)}`,
            },
          ],
          task_checklist: [
            {
              title: 'Confirm stage dimensions with sound engineer',
              description: 'Ensure 32-channel sound board fits behind console.',
              priority: 'high',
              phase: 'Sound & Light',
            },
          ],
          day_schedule: [
            {
              time: evt.start_time || '16:00',
              activity: 'Grand Guest Arrival & Welcome Mocktails',
              responsibility: 'Hospitality Lead',
              location_or_notes: 'Welcome Archway',
            },
            {
              time: '18:00',
              activity: 'Main Ceremonial Program / Keynotes',
              responsibility: 'Emcee & Stage Manager',
              location_or_notes: 'Central Stage',
            },
            {
              time: '19:30',
              activity: 'Royal Feast & Live Musical Performances',
              responsibility: 'Catering Captain & Band',
              location_or_notes: 'Dining Pavilion',
            },
            {
              time: evt.end_time || '23:00',
              activity: 'Dessert Bar, Photographs & Farewell Favors',
              responsibility: 'Event Host',
              location_or_notes: 'Photo Zone',
            },
          ],
          menu_suggestions: [
            {
              course: 'Welcome Elixirs',
              items: ['Kesariya Thandai with crushed pistachio', 'Rose Petal Spritzer', 'Cucumber Mint Cooler'],
              specialty_notes: 'Served in chilled brass goblet glassware.',
            },
            {
              course: 'Live Appetizer Theatres',
              items: ['Jodhpur Mirchi Vada with mint coulis', 'Paneer Tikka Angara', 'Crispy Corn & Water Chestnut Baskets'],
              specialty_notes: 'Prepared fresh over live charcoal grills.',
            },
            {
              course: 'The Grand Feast',
              items: ['Laal Maas (or Jackfruit Dum Curry)', 'Paneer Kundan Kalian', 'Dal Maharani slow-simmered', 'Subz Dum Biryani'],
              specialty_notes: 'Presented in traditional hammered copper degchis.',
            },
            {
              course: 'Dessert Grandeur',
              items: ['Baked Malpua with Rabri Cannoli', 'Artisanal Paan Gelato', 'Kesar Jalebi'],
              specialty_notes: 'Garnished with 24k edible gold leaf.',
            },
          ],
          decor_concepts: [
            {
              zone: 'Grand Entrance Gateway',
              concept: 'Marigold and tuberose canopy with brass lamps and floating candles.',
              materials: 'Fresh florals, brass urli bowls, warm 2700K fairy lights.',
            },
            {
              zone: 'Stage Backdrop',
              concept: 'Multi-layer ombré floral arches with vintage mirror jali work.',
              materials: 'Velvet, blush roses, warm micro-pinspots.',
            },
          ],
          contingencies: [
            {
              risk: 'Sudden rain or excessive wind',
              mitigation: 'Weatherproof high-peak marquee on 1-hour standby from vendor.',
            },
            {
              risk: 'Surge in attendees (+15%)',
              mitigation: 'Catering reserve plate buffer pre-approved with kitchen head.',
            },
          ],
        });
      }
    }
  }, [eventId]);

  const handleRegenerate = async (sectionName: string) => {
    if (!plan || !event) return;
    setRegeneratingSection(sectionName);

    try {
      const res = await fetch('/api/ai/regenerate-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: sectionName,
          eventDetails: event,
          currentData: (plan as any)[sectionName],
        }),
      });

      if (res.ok) {
        const result = await res.json();
        setPlan({
          ...plan,
          [sectionName]: result.data,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRegeneratingSection(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!event || !plan) {
    return <div className="p-8 text-center text-slate-500">Loading plan...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            AI Production Blueprint
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Personalized concepts, schedules, and menus for {event.title}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Printable Summary</span>
          </button>
        </div>
      </div>

      {/* Overview Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Executive Summary</h3>
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
          {plan.overview}
        </p>
      </div>

      {/* Theme & Concept */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-50/60 via-violet-50/40 to-white border border-indigo-100 shadow-card relative">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
            <Palette className="w-4 h-4" /> Theme & Aesthetic Concept
          </span>
          <button
            onClick={() => handleRegenerate('theme_concept')}
            disabled={regeneratingSection === 'theme_concept'}
            className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-100/60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${regeneratingSection === 'theme_concept' ? 'animate-spin' : ''}`} />
            Regenerate Theme
          </button>
        </div>

        <h3 className="text-xl font-black text-slate-900">{plan.theme_concept.title}</h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
          {plan.theme_concept.description}
        </p>

        <div className="mt-5 pt-5 border-t border-indigo-100 flex flex-wrap items-center gap-4">
          <span className="text-xs font-bold text-slate-500">Color Palette:</span>
          {plan.theme_concept.colors.map((c, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg shadow-sm border border-slate-200" style={{ backgroundColor: c }} />
              <span className="text-xs font-mono text-slate-600">{c}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Day-of Schedule */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-violet-600" /> Minute-By-Minute Day Schedule
          </span>
          <button
            onClick={() => handleRegenerate('day_schedule')}
            disabled={regeneratingSection === 'day_schedule'}
            className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${regeneratingSection === 'day_schedule' ? 'animate-spin' : ''}`} />
            Regenerate Schedule
          </button>
        </div>

        <div className="space-y-3">
          {plan.day_schedule.map((slot, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/70 transition gap-2"
            >
              <div className="flex items-start sm:items-center gap-3">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-700 text-white font-mono text-xs font-bold">
                  {slot.time}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{slot.activity}</h4>
                  <span className="text-xs text-slate-500">{slot.location_or_notes}</span>
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-600 px-2.5 py-0.5 rounded-full bg-slate-200/80 w-fit">
                {slot.responsibility}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Gourmet Menu */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <ChefHat className="w-4 h-4 text-amber-600" /> Curated Dining Menu
          </span>
          <button
            onClick={() => handleRegenerate('menu_suggestions')}
            disabled={regeneratingSection === 'menu_suggestions'}
            className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${regeneratingSection === 'menu_suggestions' ? 'animate-spin' : ''}`} />
            Regenerate Menu
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plan.menu_suggestions.map((m, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-800 block">
                {m.course}
              </span>
              <ul className="space-y-1 text-xs sm:text-sm text-slate-700">
                {m.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-amber-800 font-medium pt-1 italic">
                Note: {m.specialty_notes}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Contingencies & Risk Mitigation */}
      <div className="p-6 sm:p-8 rounded-3xl bg-amber-50/50 border border-amber-200/70 shadow-card">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5 mb-4">
          <ShieldAlert className="w-4 h-4 text-amber-600" /> Contingency & Risk Safeguards
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {plan.contingencies.map((c, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white border border-amber-100 shadow-sm space-y-1.5">
              <span className="text-xs font-bold text-slate-900 block">Risk: {c.risk}</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                <span className="font-semibold text-emerald-700">Mitigation:</span> {c.mitigation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
