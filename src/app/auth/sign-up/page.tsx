'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, ArrowRight, Lock, Mail, User, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PlanovaStore } from '@/lib/storage';

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Password strength check
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify and re-enter.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long for account security.');
      return;
    }

    setLoading(true);

    try {
      const result = await PlanovaStore.register({
        fullName,
        email,
        password,
      });

      if (!result.success) {
        setErrorMessage(result.error || 'Failed to create account. Please try again.');
        setLoading(false);
        return;
      }

      setLoading(false);
      router.push(redirectPath);
    } catch {
      setErrorMessage('An unexpected error occurred during registration. Please try again.');
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
          <h1 className="text-2xl font-black text-[#3E3239]">Create Your PLANOVA Account</h1>
          <p className="text-xs text-[#6B5560] mt-1">Start planning your dream celebration with confidence</p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#3E3239] uppercase tracking-wider mb-1" htmlFor="signup-name">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#9E8189] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="signup-name"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8D2C4] text-sm focus:outline-none focus:ring-2 focus:ring-[#3E3239] focus:border-transparent font-medium text-[#3E3239]"
                placeholder="Your Full Name"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3E3239] uppercase tracking-wider mb-1" htmlFor="signup-email">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#9E8189] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="signup-email"
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
            <label className="block text-xs font-bold text-[#3E3239] uppercase tracking-wider mb-1" htmlFor="signup-password">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#9E8189] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-[#E8D2C4] text-sm focus:outline-none focus:ring-2 focus:ring-[#3E3239] focus:border-transparent font-medium text-[#3E3239]"
                placeholder="At least 8 characters"
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
            {password && (
              <div className="flex items-center gap-3 mt-1.5 text-[11px] text-[#6B5560]">
                <span className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-700 font-bold' : ''}`}>
                  <CheckCircle2 className="w-3 h-3" /> 8+ chars
                </span>
                <span className={`flex items-center gap-1 ${hasLetter ? 'text-emerald-700 font-bold' : ''}`}>
                  <CheckCircle2 className="w-3 h-3" /> letters
                </span>
                <span className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-700 font-bold' : ''}`}>
                  <CheckCircle2 className="w-3 h-3" /> numbers
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3E3239] uppercase tracking-wider mb-1" htmlFor="signup-confirm-password">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#9E8189] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="signup-confirm-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8D2C4] text-sm focus:outline-none focus:ring-2 focus:ring-[#3E3239] focus:border-transparent font-medium text-[#3E3239]"
                placeholder="Re-enter password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-sm font-bold text-[#F7EFE7] bg-gradient-to-r from-[#3E3239] via-[#6B5560] to-[#3E3239] hover:opacity-95 transition shadow-md flex items-center justify-center gap-2 mt-2 disabled:opacity-70 cursor-pointer"
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
