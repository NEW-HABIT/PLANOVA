'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  X,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building,
  ArrowRight,
  Download,
  Receipt,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SubscriptionTier, UserSubscription } from '@/types';
import { PlanovaStore } from '@/lib/storage';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: SubscriptionTier;
  billingCycle: 'monthly' | 'annual';
  onSuccess: (subscription: UserSubscription) => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  tier,
  billingCycle,
  onSuccess,
}: CheckoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [invoice, setInvoice] = useState<any>(null);

  if (!isOpen) return null;

  const user = PlanovaStore.getUser();

  const pricingMatrix: Record<
    SubscriptionTier,
    { name: string; monthlyBase: number; annualBase: number; perks: string[] }
  > = {
    starter: {
      name: 'Free Starter',
      monthlyBase: 0,
      annualBase: 0,
      perks: ['1 Active Celebration Workspace', 'Full AI Plan Generation', 'Core Budget Manager'],
    },
    pro: {
      name: 'Pro Planner',
      monthlyBase: 1499,
      annualBase: 14388,
      perks: [
        'Unlimited AI Blueprint Regenerations',
        'Multi-Vendor Price Comparison Matrix',
        'Unlimited Guests & CSV Export',
        'Dedicated 24/7 AI Event Concierge',
      ],
    },
    agency: {
      name: 'Studio / Agency',
      monthlyBase: 4999,
      annualBase: 47988,
      perks: [
        'Unlimited Concurrent Event Blueprints',
        'Team Collaborator Permissions',
        'White-Label PDF & Client Reports',
        'Priority 24/7 Dedicated Support',
      ],
    },
  };

  const plan = pricingMatrix[tier];
  const basePrice = billingCycle === 'annual' ? plan.annualBase : plan.monthlyBase;
  const gstRate = 0.18;
  const gstAmount = Math.round(basePrice * gstRate);
  const totalAmount = basePrice + gstAmount;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier,
          billingCycle,
          userId: user?.id,
          userEmail: user?.email,
          userName: user?.full_name,
          paymentMethod: paymentMethod.toUpperCase(),
        }),
      });

      const data = await res.json();
      if (data.success && data.subscription) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4338CA', '#8B5CF6', '#F59E0B', '#10B981'],
        });

        // Update local user state
        const updatedUser = {
          ...user,
          subscription: data.subscription,
        };
        PlanovaStore.setUser(updatedUser);

        setInvoice(data.invoice);
        onSuccess(data.subscription);
      } else {
        alert(data.error || 'Failed to process payment. Please try again.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('An unexpected error occurred during checkout.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3E3239] to-[#6B5560] text-[#F7EFE7] flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-[#E8D2C4]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                {invoice ? 'Payment Confirmed' : `Upgrade to ${plan.name}`}
              </h3>
              <p className="text-xs text-slate-500">
                {billingCycle === 'annual' ? 'Annual Billing (Save 20%)' : 'Monthly / Per Celebration'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Success View */}
        {invoice ? (
          <div className="py-6 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-black text-slate-900">Your Plan is Active!</h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Thank you for upgrading. All premium features for {plan.name} have been unlocked on your account.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
              <div className="flex items-center justify-between font-bold text-slate-700 border-b border-slate-200 pb-2">
                <span className="flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-slate-500" />
                  Tax Invoice
                </span>
                <span className="font-mono text-indigo-700">{invoice.invoiceId}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Plan</span>
                  <span className="font-bold text-slate-800">{invoice.tier}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Billing Cycle</span>
                  <span className="font-bold text-slate-800 capitalize">{invoice.billingCycle}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Base Fee</span>
                  <span className="font-semibold text-slate-800">₹{invoice.basePrice?.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">GST (18%)</span>
                  <span className="font-semibold text-slate-800">₹{invoice.gstAmount?.toLocaleString()}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm font-black text-slate-900">
                <span>Total Paid</span>
                <span className="text-indigo-700">₹{invoice.totalAmount?.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#3E3239] via-[#6B5560] to-[#3E3239] hover:opacity-95 shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Back to Dashboard</span>
              <ArrowRight className="w-4 h-4 text-[#E8D2C4]" />
            </button>
          </div>
        ) : (
          /* Checkout Form View */
          <form onSubmit={handlePay} className="py-5 space-y-5">
            {/* Plan Perks */}
            <div className="p-4 rounded-2xl bg-[#F7EFE7] border border-[#E8D2C4]">
              <span className="text-xs font-bold text-[#3E3239] block mb-2">Included In This Plan:</span>
              <ul className="grid grid-cols-1 gap-1.5 text-xs text-[#6B5560]">
                {plan.perks.map((p, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 border-t border-b border-slate-100 py-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subscription Base ({billingCycle})</span>
                <span className="font-bold text-slate-900">₹{basePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Standard Goods & Services Tax (GST 18%)</span>
                <span className="font-bold text-slate-900">₹{gstAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
                <span>Total Amount Due</span>
                <span className="text-indigo-700">₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Select Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                    paymentMethod === 'upi'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <QrCode className="w-5 h-5" />
                  <span>Instant UPI</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                    paymentMethod === 'card'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                    paymentMethod === 'netbanking'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Building className="w-5 h-5" />
                  <span>NetBanking</span>
                </button>
              </div>
            </div>

            {/* Payment Details Input */}
            {paymentMethod === 'upi' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">UPI ID / VPA</label>
                <input
                  type="text"
                  required
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="username@okhdfcbank"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Supports Google Pay, PhonePe, Paytm, CRED & BHIM
                </span>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    required
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4111 2222 3333 4444"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      required
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="12/28"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">CVV</label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="•••"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Bank</label>
                <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white">
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>State Bank of India (SBI)</option>
                  <option>Axis Bank</option>
                  <option>Kotak Mahindra Bank</option>
                </select>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-700 via-violet-600 to-indigo-800 hover:opacity-95 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 transition"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Verifying Payment with Bank...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-amber-300" />
                  <span>Pay ₹{totalAmount.toLocaleString()} & Activate</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-bit SSL encrypted. 100% money-back guarantee within 7 days.</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
