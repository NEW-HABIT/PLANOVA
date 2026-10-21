'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  PieChart, 
  Clock, 
  Users, 
  Palette, 
  Bot, 
  FileSpreadsheet, 
  ShieldCheck, 
  ArrowRight 
} from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    {
      icon: Sparkles,
      title: "Generative Event Concept Wizard",
      description: "Synthesizes comprehensive event visions: curated color palettes, design concepts, stage themes, and spatial concepts in seconds.",
    },
    {
      icon: PieChart,
      title: "Dynamic Smart Budget Allocation",
      description: "Auto-balances venue, catering, and decor while strictly safeguarding an 8-10% Emergency Reserve without double-counting.",
    },
    {
      icon: Clock,
      title: "Timeline & Milestones Engine",
      description: "Backward-scheduled checklists from event day (T-0) up to 6 months prior, automatically adjusting whenever event dates change.",
    },
    {
      icon: Users,
      title: "Vendor Discovery & Comparison Matrix",
      description: "Compare quotes, rating histories, and contract deliverables side-by-side. Automatically generate tailored interview questions.",
    },
    {
      icon: Palette,
      title: "Creative Studio Copywriting",
      description: "Draft bilingual invitations (WhatsApp & formal email), emcee opening remarks, gourmet menus, and social announcements with 1-click copy.",
    },
    {
      icon: Bot,
      title: "Context-Aware Planning Assistant",
      description: "Your 24/7 copilot that knows your budget and guest count. Ask to cut costs by 10%, solve rain emergencies, or update task lists.",
    },
  ];

  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
          Capabilities
        </span>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mt-3">
          Engineered for Extraordinary Celebrations
        </h1>
        <p className="text-slate-600 mt-3 text-base">
          Discover how PLANOVA bridges Generative AI intelligence with precise production-grade event workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feat, idx) => (
          <div key={idx} className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-card hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-5">
              <feat.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{feat.title}</h3>
            <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
              {feat.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Link
          href="/events/new"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold text-white bg-indigo-700 hover:bg-indigo-800 shadow-md"
        >
          <span>Try All Features in an Event</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
