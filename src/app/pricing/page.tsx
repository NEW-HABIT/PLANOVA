'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Sparkles, HelpCircle, ShieldCheck, Zap, ArrowRight, Award } from 'lucide-react';
import { PlanovaStore } from '@/lib/storage';
import { SubscriptionTier, UserSubscription } from '@/types';
import CheckoutModal from '@/components/pricing/CheckoutModal';

export default function PricingPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeSubscription, setActiveSubscription] = useState<UserSubscription | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = PlanovaStore.isAuthenticated();
    setIsAuthenticated(auth);
    const user = PlanovaStore.getUser();
    if (user?.subscription) {
      setActiveSubscription(user.subscription);
    }
  }, []);

  const handleSelectPlan = (tier: SubscriptionTier) => {
    if (!PlanovaStore.isAuthenticated()) {
      router.push(`/auth/sign-in?redirect=${encodeURIComponent('/pricing')}`);
      return;
    }

    if (tier === 'starter') {
      // Free starter doesn't need checkout
      const freeSub: UserSubscription = {
        tier: 'starter',
        billing_cycle: 'one_time',
        status: 'active',
        current_period_end: new Date(Date.now() + 3650 * 86400000).toISOString(),
        plan_name: 'Free Starter',
        amount_paid: 0,
        currency: 'INR',
        activated_at: new Date().toISOString(),
      };
      const user = PlanovaStore.getUser();
      PlanovaStore.setUser({ ...user, subscription: freeSub });
      setActiveSubscription(freeSub);
      alert('You are now active on the Free Starter plan!');
      return;
    }

    setSelectedTier(tier);
    setIsCheckoutOpen(true);
  };

  const currentTier = activeSubscription?.tier || 'starter';

  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#3E3239] bg-[#E8D2C4]/50 border border-[#E8D2C4] px-4 py-1.5 rounded-full shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#6B5560]" />
          <span>Simple, Transparent Celebration Investment</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[#3E3239] tracking-tight">
          Invest in Unforgettable Celebrations
        </h1>
        <p className="text-[#6B5560] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Create complete AI blueprints, manage 5-figure budgets with zero contingency leaks, and coordinate vendors effortlessly.
        </p>

        {/* Billing Cycle Toggle */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-[#3E3239]' : 'text-[#6B5560]'}`}>
            Monthly / Per Celebration
          </span>
          <button
            type="button"
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
            className="w-14 h-7 rounded-full bg-[#3E3239] p-1 transition-colors relative focus:outline-none shadow-inner"
            aria-label="Toggle Billing Cycle"
          >
            <div
              className={`w-5 h-5 rounded-full bg-[#F7EFE7] shadow-md transition-transform duration-200 ${
                billingCycle === 'annual' ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-bold ${billingCycle === 'annual' ? 'text-[#3E3239]' : 'text-[#6B5560]'}`}>
              Annual Billing
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wide">
              Save 20%
            </span>
          </div>
        </div>
      </div>

      {/* Active Subscription Banner if upgraded */}
      {activeSubscription && activeSubscription.tier !== 'starter' && (
        <div className="max-w-3xl mx-auto p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-indigo-600 shrink-0" />
            <div>
              <span>You have an active <strong className="uppercase">{activeSubscription.tier}</strong> subscription.</span>
              <span className="block text-[11px] text-indigo-600 font-normal">
                Renews on {new Date(activeSubscription.current_period_end).toLocaleDateString()} (Invoice: {activeSubscription.invoice_id || 'N/A'})
              </span>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="px-3.5 py-1.5 rounded-xl bg-indigo-700 text-white text-xs hover:bg-indigo-800 transition"
          >
            Dashboard
          </Link>
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
        {/* Free Starter */}
        <div className="p-8 rounded-3xl bg-white border border-[#E8D2C4] shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#6B5560] uppercase tracking-wider">Free Starter</h3>
              {currentTier === 'starter' && (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                  Current Tier
                </span>
              )}
            </div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-black text-[#3E3239]">₹0</span>
              <span className="text-xs text-[#6B5560]">/ forever</span>
            </div>
            <p className="text-xs text-[#6B5560] mt-2">Essential AI tools for single-day personal parties and family milestones.</p>

            <ul className="mt-6 space-y-3 text-xs text-[#3E3239]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> 1 Active Celebration Workspace
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Full AI Timeline & Blueprint
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Dynamic Budget Manager & Alert
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Up to 50 Guests RSVP Tracking
              </li>
            </ul>
          </div>

          <button
            type="button"
            disabled={currentTier === 'starter'}
            onClick={() => handleSelectPlan('starter')}
            className={`mt-8 w-full py-3 px-4 rounded-xl text-xs font-bold transition text-center cursor-pointer ${
              currentTier === 'starter'
                ? 'bg-slate-100 text-slate-400 cursor-default'
                : 'bg-[#F7EFE7] text-[#3E3239] hover:bg-[#E8D2C4]'
            }`}
          >
            {currentTier === 'starter' ? 'Active Plan' : 'Select Free'}
          </button>
        </div>

        {/* Pro Planner */}
        <div className="p-8 rounded-3xl bg-gradient-to-b from-[#3E3239] via-[#4F3F48] to-[#2E242A] text-[#F7EFE7] shadow-2xl relative flex flex-col justify-between border-2 border-[#E8D2C4]">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-[#E8D2C4] text-[#3E3239] text-[10px] font-black uppercase tracking-wider shadow">
            Recommended For Grand Celebrations
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#E8D2C4] uppercase tracking-wider">Pro Planner</h3>
              {currentTier === 'pro' && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/40">
                  Active
                </span>
              )}
            </div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-black text-white">
                ₹{billingCycle === 'annual' ? '1,199' : '1,499'}
              </span>
              <span className="text-xs text-[#E8D2C4]">
                {billingCycle === 'annual' ? '/ month (billed annually)' : '/ celebration'}
              </span>
            </div>
            <p className="text-xs text-[#E8D2C4]/80 mt-2">Comprehensive suite for weddings, summits, and multi-day festivities.</p>

            <ul className="mt-6 space-y-3 text-xs text-[#F7EFE7]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E8D2C4] shrink-0" /> Unlimited AI Plan Regenerations
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E8D2C4] shrink-0" /> Multi-Vendor Comparison Matrix
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E8D2C4] shrink-0" /> Unlimited Guests & Dietary RSVP Export
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E8D2C4] shrink-0" /> AI Creative Studio Copywriting
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E8D2C4] shrink-0" /> Dedicated 24/7 AI Event Concierge
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => handleSelectPlan('pro')}
            className={`mt-8 w-full py-3.5 px-4 rounded-xl text-xs font-bold transition text-center shadow-lg cursor-pointer ${
              currentTier === 'pro'
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-gradient-to-r from-[#E8D2C4] to-[#D9BBAE] text-[#3E3239] hover:opacity-95'
            }`}
          >
            {currentTier === 'pro' ? 'Current Plan (Active)' : 'Upgrade to Pro Planner'}
          </button>
        </div>

        {/* Studio / Agency */}
        <div className="p-8 rounded-3xl bg-white border border-[#E8D2C4] shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#6B5560] uppercase tracking-wider">Studio / Agency</h3>
              {currentTier === 'agency' && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Active
                </span>
              )}
            </div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-black text-[#3E3239]">
                ₹{billingCycle === 'annual' ? '3,999' : '4,999'}
              </span>
              <span className="text-xs text-[#6B5560]">/ month</span>
            </div>
            <p className="text-xs text-[#6B5560] mt-2">For event management firms, hotel banquet sales, and luxury wedding planners.</p>

            <ul className="mt-6 space-y-3 text-xs text-[#3E3239]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Unlimited Concurrent Celebrations
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Team Collaborator Permissions
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> White-Label Client PDF Exporting
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Dedicated Concierge & Account Manager
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => handleSelectPlan('agency')}
            className={`mt-8 w-full py-3 px-4 rounded-xl text-xs font-bold transition text-center cursor-pointer ${
              currentTier === 'agency'
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-[#3E3239] text-[#F7EFE7] hover:opacity-95'
            }`}
          >
            {currentTier === 'agency' ? 'Current Plan (Active)' : 'Get Studio / Agency'}
          </button>
        </div>
      </div>

      {/* Trust & Guarantee */}
      <div className="pt-8 border-t border-[#E8D2C4] max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs text-[#6B5560]">
        <div className="flex flex-col items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
          <span className="font-bold text-[#3E3239]">100% Satisfaction Guarantee</span>
          <span>Risk-free 7-day money back guarantee on all plans.</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Zap className="w-6 h-6 text-amber-500" />
          <span className="font-bold text-[#3E3239]">Instant Feature Activation</span>
          <span>Upgrades take effect immediately on your active events.</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <HelpCircle className="w-6 h-6 text-indigo-600" />
          <span className="font-bold text-[#3E3239]">Compliant Tax Invoices</span>
          <span>Official GST invoices generated and emailed instantly.</span>
        </div>
      </div>

      {/* Checkout Modal */}
      {selectedTier && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          tier={selectedTier}
          billingCycle={billingCycle}
          onSuccess={(subscription) => {
            setActiveSubscription(subscription);
          }}
        />
      )}
    </div>
  );
}
