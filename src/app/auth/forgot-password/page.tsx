'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white border border-[#E8D2C4] shadow-2xl relative">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3E3239] via-[#6B5560] to-[#3E3239] flex items-center justify-center text-[#F7EFE7] mx-auto shadow-md mb-3">
            <Sparkles className="w-6 h-6 text-[#E8D2C4]" />
          </div>
          <h2 className="text-2xl font-black text-[#3E3239]">Reset Password</h2>
          <p className="text-xs text-[#6B5560] mt-1">Enter your registered email address to receive recovery instructions</p>
        </div>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <CheckCircle2 className="w-12 h-12 text-[#9E8189] mx-auto" />
            <h3 className="text-base font-bold text-[#3E3239]">Recovery Instructions Sent</h3>
            <p className="text-xs text-[#6B5560]">
              If an account matches <span className="font-semibold text-[#3E3239]">{email}</span>, you will receive password reset instructions within 2 minutes.
            </p>
            <Link
              href="/auth/sign-in"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3E3239] hover:underline pt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#3E3239] uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#9E8189] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8D2C4] text-sm focus:outline-none focus:ring-2 focus:ring-[#3E3239] focus:border-transparent text-[#3E3239]"
                  placeholder="you@domain.com"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl text-sm font-bold text-[#F7EFE7] bg-gradient-to-r from-[#3E3239] via-[#6B5560] to-[#3E3239] hover:opacity-95 transition shadow-md"
            >
              Send Recovery Email
            </button>

            <div className="text-center pt-2">
              <Link
                href="/auth/sign-in"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B5560] hover:text-[#3E3239]"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
