'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, ArrowRight, Lock, Mail, User, ShieldCheck } from 'lucide-react';
import { PlanovaStore } from '@/lib/storage';

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const current = PlanovaStore.getUser();
      PlanovaStore.login({
        ...current,
        full_name: fullName || current.full_name,
        email: email || current.email,
      });
      setLoading(false);
      router.push(redirectPath);
    }, 400);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white border border-[#E8D2C4] shadow-2xl relative">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3E3239] via-[#6B5560] to-[#3E3239] flex items-center justify-center text-[#F7EFE7] mx-auto shadow-md mb-3">
            <Sparkles className="w-6 h-6 text-[#E8D2C4]" />
          </div>
          <h2 className="text-2xl font-black text-[#3E3239]">Create Your PLANOVA Account</h2>
          <p className="text-xs text-[#6B5560] mt-1">Start planning your dream celebration with confidence</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#3E3239] uppercase tracking-wider mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#9E8189] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8D2C4] text-sm focus:outline-none focus:ring-2 focus:ring-[#3E3239] focus:border-transparent font-medium text-[#3E3239]"
                placeholder="Aarav Sharma"
              />
            </div>
          </div>

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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8D2C4] text-sm focus:outline-none focus:ring-2 focus:ring-[#3E3239] focus:border-transparent font-medium text-[#3E3239]"
                placeholder="aarav@domain.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3E3239] uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#9E8189] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8D2C4] text-sm focus:outline-none focus:ring-2 focus:ring-[#3E3239] focus:border-transparent font-medium text-[#3E3239]"
                placeholder="At least 6 characters"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-sm font-bold text-[#F7EFE7] bg-gradient-to-r from-[#3E3239] via-[#6B5560] to-[#3E3239] hover:opacity-95 transition shadow-md flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <span>Create Account & Continue</span>
                <ArrowRight className="w-4 h-4 text-[#E8D2C4]" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#E8D2C4] text-center">
          <p className="text-xs text-[#6B5560]">
            Already have an account?{' '}
            <Link
              href={redirectPath ? `/auth/sign-in?redirect=${encodeURIComponent(redirectPath)}` : "/auth/sign-in"}
              className="font-bold text-[#3E3239] hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#3E3239] border-t-transparent animate-spin"></div>
        </div>
      }
    >
      <SignUpContent />
    </Suspense>
  );
}
