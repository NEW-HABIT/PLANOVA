'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, ArrowRight, Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { PlanovaStore } from '@/lib/storage';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const result = await PlanovaStore.authenticate({ email, password });
      if (!result.success) {
        setErrorMessage(result.error || 'Invalid credentials. Please verify and try again.');
        setLoading(false);
        return;
      }

      // Successful login
      setLoading(false);
      router.push(redirectPath);
    } catch {
      setErrorMessage('An unexpected error occurred during sign in. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white border border-[#E8D2C4] shadow-2xl relative">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3E3239] via-[#6B5560] to-[#3E3239] flex items-center justify-center text-[#F7EFE7] mx-auto shadow-md mb-3">
            <Sparkles className="w-6 h-6 text-[#E8D2C4]" />
          </div>
          <h1 className="text-2xl font-black text-[#3E3239]">Sign In to PLANOVA</h1>
          <p className="text-xs text-[#6B5560] mt-1">Access your secure event blueprints, budgets, and guest lists</p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#3E3239] uppercase tracking-wider mb-1" htmlFor="email-input">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#9E8189] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="email-input"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8D2C4] text-sm focus:outline-none focus:ring-2 focus:ring-[#3E3239] focus:border-transparent font-medium text-[#3E3239]"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-[#3E3239] uppercase tracking-wider" htmlFor="password-input">
                Password
              </label>
              <Link href="/auth/forgot-password" className="text-xs text-[#6B5560] hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#9E8189] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-[#E8D2C4] text-sm focus:outline-none focus:ring-2 focus:ring-[#3E3239] focus:border-transparent font-medium text-[#3E3239]"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9E8189] hover:text-[#3E3239] transition p-0.5"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-sm font-bold text-[#F7EFE7] bg-gradient-to-r from-[#3E3239] via-[#6B5560] to-[#3E3239] hover:opacity-95 transition shadow-md flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 text-[#E8D2C4]" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#E8D2C4] text-center">
          <p className="text-xs text-[#6B5560]">
            Don't have an account?{' '}
            <Link
              href={redirectPath ? `/auth/sign-up?redirect=${encodeURIComponent(redirectPath)}` : "/auth/sign-up"}
              className="font-bold text-[#3E3239] hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#3E3239] border-t-transparent animate-spin"></div>
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
