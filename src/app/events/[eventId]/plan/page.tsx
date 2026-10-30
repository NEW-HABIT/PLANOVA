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
  Copy,
  Check,
  DollarSign,
  Layers,
  Sparkle,
} from 'lucide-react';
import { PlanovaStore } from '@/lib/storage';
import { EventItem, GeneratedPlan } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { synthesizeCuratedEventPlan } from '@/lib/gemini';

export default function EventPlanPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  const [event, setEvent] = useState<EventItem | null>(null);
  const [regeneratingSection, setRegeneratingSection] = useState<string | null>(null);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);

  useEffect(() => {
    if (eventId) {
      const evt = PlanovaStore.getEventById(eventId);
      if (evt) {
        setEvent(evt);

        // Synthesize dynamic plan for event
        const defaultPlan = synthesizeCuratedEventPlan({
          title: evt.title,
          category: evt.category,
          date: evt.date,
          startTime: evt.start_time || '16:00',
          endTime: evt.end_time || '23:30',
          location: evt.location,
          city: evt.city,
          isIndoor: evt.is_indoor,
          expectedGuests: evt.expected_guests,
          totalBudget: evt.total_budget,
          currency: evt.currency,
          isBudgetStrict: evt.is_budget_strict,
          emergencyReservePercentage: evt.emergency_reserve_percentage || 8,
        });

        setPlan(defaultPlan);
      }
    }
  }, [eventId]);

  const handleRegenerate = async (sectionName: string) => {
    if (!event || !plan) return;
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

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!event || !plan) {
    return (
      <div className="p-12 text-center text-[#6B5560] flex flex-col items-center justify-center gap-3">
        <Sparkles className="w-8 h-8 text-[#9E8189] animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-wider">Loading Production Blueprint...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-[#E8D2C4] gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E8D2C4]/70 border border-[#C7A9A3]/60 text-[10px] font-bold text-[#3E3239] mb-1.5 shadow-xs">
            <Sparkle className="w-3 h-3 text-[#6B5560]" />
            Personalized Plan
          </div>
          <h2 className="text-2xl font-black text-[#3E3239] tracking-tight flex items-center gap-2">
            Master Celebration Blueprint
          </h2>
          <p className="text-xs text-[#6B5560] mt-0.5">
            Personalized concepts, itemized allocations, and run-of-show schedule for {event.title}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#3E3239] bg-white border border-[#E8D2C4] hover:bg-[#E8D2C4]/30 shadow-xs transition"
          >
            <Printer className="w-4 h-4 text-[#9E8189]" />
            <span>Printable Summary</span>
          </button>
        </div>
      </div>

      {/* Overview Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/90 border border-[#E8D2C4] shadow-card backdrop-blur-xl">
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#9E8189] mb-2 block flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#C7A9A3]" /> Executive Director Summary
        </span>
        <p className="text-sm sm:text-base text-[#3E3239] leading-relaxed font-normal">
          {plan.overview}
        </p>
      </div>

      {/* Theme & Concept */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/90 border border-[#E8D2C4] shadow-card relative backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#9E8189] flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-[#C7A9A3]" /> Theme & Visual Identity
          </span>
          <button
            onClick={() => handleRegenerate('theme_concept')}
            disabled={regeneratingSection === 'theme_concept'}
            className="text-xs font-bold text-[#3E3239] hover:text-[#6B5560] flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#E8D2C4]/50 border border-[#C7A9A3]/50 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${regeneratingSection === 'theme_concept' ? 'animate-spin' : ''}`} />
            Regenerate Theme
          </button>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-[#3E3239]">{plan.theme_concept.title}</h3>
        <p className="text-xs sm:text-sm text-[#6B5560] leading-relaxed font-normal">
          {plan.theme_concept.description}
        </p>

        <div className="pt-3 border-t border-[#E8D2C4] flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-[#3E3239]">Palette:</span>
          {plan.theme_concept.colors.map((c, i) => (
            <div
              key={i}
              onClick={() => copyHex(c)}
              className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border border-[#E8D2C4] bg-[#F7EFE7]/60 hover:bg-[#E8D2C4]/50 transition cursor-pointer"
              title="Click to copy hex"
            >
              <div className="w-5 h-5 rounded-lg shadow-xs border border-black/10" style={{ backgroundColor: c }} />
              <span className="text-xs font-mono font-bold text-[#3E3239]">{c}</span>
              {copiedHex === c ? (
                <Check className="w-3 h-3 text-emerald-600" />
              ) : (
                <Copy className="w-3 h-3 text-[#9E8189] opacity-40" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Target Budget Breakdown */}
      {plan.budget_breakdown && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white/90 border border-[#E8D2C4] shadow-card backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9E8189] flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-[#C7A9A3]" /> Target Budget Allocations
            </span>
            <span className="text-xs font-black text-[#3E3239]">
              Total Budget: {formatCurrency(event.total_budget, event.currency)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            {plan.budget_breakdown.map((b, i) => (
              <div key={i} className="p-4 rounded-2xl bg-[#F7EFE7]/60 border border-[#E8D2C4] space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#3E3239]">{b.category}</span>
                  <span className="font-black text-[#3E3239]">
                    {formatCurrency(b.amount, event.currency)} ({b.percentage}%)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#E8D2C4]/60 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#3E3239] to-[#6B5560] rounded-full" style={{ width: `${b.percentage}%` }} />
                </div>
                <span className="text-[11px] text-[#6B5560] block font-normal leading-relaxed">{b.rationale}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Day-of Schedule */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/90 border border-[#E8D2C4] shadow-card backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#9E8189] flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#C7A9A3]" /> Minute-By-Minute Run of Show
          </span>
          <button
            onClick={() => handleRegenerate('day_schedule')}
            disabled={regeneratingSection === 'day_schedule'}
            className="text-xs font-bold text-[#3E3239] hover:text-[#6B5560] flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#E8D2C4]/50 border border-[#C7A9A3]/50 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${regeneratingSection === 'day_schedule' ? 'animate-spin' : ''}`} />
            Regenerate Schedule
          </button>
        </div>

        <div className="space-y-2.5">
          {plan.day_schedule.map((slot, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-[#F7EFE7]/60 border border-[#E8D2C4] hover:bg-[#E8D2C4]/40 transition gap-2"
            >
              <div className="flex items-start sm:items-center gap-3">
                <span className="px-3 py-1 rounded-xl bg-[#3E3239] text-[#F7EFE7] font-mono text-xs font-bold shrink-0">
                  {slot.time}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-[#3E3239]">{slot.activity}</h4>
                  <span className="text-xs text-[#6B5560]">{slot.location_or_notes}</span>
                </div>
              </div>
              <span className="text-xs font-bold text-[#6B5560] px-3 py-1 rounded-xl bg-white border border-[#E8D2C4] w-fit shrink-0">
                {slot.responsibility}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Gourmet Menu */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/90 border border-[#E8D2C4] shadow-card backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#9E8189] flex items-center gap-1.5">
            <ChefHat className="w-4 h-4 text-[#C7A9A3]" /> Curated Gourmet Banquet
          </span>
          <button
            onClick={() => handleRegenerate('menu_suggestions')}
            disabled={regeneratingSection === 'menu_suggestions'}
            className="text-xs font-bold text-[#3E3239] hover:text-[#6B5560] flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#E8D2C4]/50 border border-[#C7A9A3]/50 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${regeneratingSection === 'menu_suggestions' ? 'animate-spin' : ''}`} />
            Regenerate Menu
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plan.menu_suggestions.map((m, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-[#F7EFE7]/60 border border-[#E8D2C4] space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#3E3239] block">
                {m.course}
              </span>
              <ul className="space-y-1 text-xs text-[#6B5560]">
                {m.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9E8189]"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {m.specialty_notes && (
                <p className="text-[11px] text-[#6B5560] font-medium pt-1 italic border-t border-[#E8D2C4]">
                  Note: {m.specialty_notes}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contingencies & Risk Mitigation */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#F7EFE7]/80 border border-[#C7A9A3]/60 shadow-card backdrop-blur-xl space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#3E3239] flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-[#9E8189]" /> Contingency & Risk Mitigation Matrix
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {plan.contingencies.map((c, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white border border-[#E8D2C4] shadow-xs space-y-1.5">
              <span className="text-xs font-bold text-[#3E3239] block">Risk: {c.risk}</span>
              <p className="text-xs text-[#6B5560] leading-relaxed">
                <span className="font-bold text-[#3E3239]">Mitigation:</span> {c.mitigation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
