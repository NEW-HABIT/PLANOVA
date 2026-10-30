'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Menu, 
  X, 
  PlusCircle, 
  LayoutDashboard, 
  LogOut,
  Calendar,
  Layers,
  Sparkle,
} from 'lucide-react';
import { PlanovaStore } from '@/lib/storage';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [currentUser, setCurrentUser] = useState(PlanovaStore.getUser());

  useEffect(() => {
    setIsAuth(PlanovaStore.isAuthenticated());
    setCurrentUser(PlanovaStore.getUser());
  }, [pathname]);

  const handleSignOut = () => {
    PlanovaStore.logout();
    setIsAuth(false);
    router.push('/');
  };

  const isAuthPage = pathname.startsWith('/auth');

  return (
    <header className="sticky top-0 z-50 glass-nav transition-all border-b border-[#E8D2C4]/80 backdrop-blur-xl bg-[#F7EFE7]/85">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - routes to Dashboard if logged in, otherwise Landing */}
          <Link href={isAuth ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3E3239] via-[#6B5560] to-[#3E3239] flex items-center justify-center text-[#F7EFE7] shadow-sm group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
              <div className="relative">
                <Sparkles className="w-5 h-5 text-[#E8D2C4] animate-pulse" />
                <div className="absolute -inset-1 border border-[#E8D2C4]/40 rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-[#3E3239] via-[#6B5560] to-[#3E3239] bg-clip-text text-transparent">
                PLANOVA
              </span>
              <span className="text-[9px] font-bold tracking-widest text-[#6B5560] -mt-1 uppercase">
                {isAuth ? 'Event Control Center' : 'Premier Event Director'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {!isAuthPage && (
            <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#6B5560]">
              {isAuth ? (
                <>
                  <Link 
                    href="/dashboard" 
                    className={`flex items-center gap-1.5 transition-colors hover:text-[#3E3239] ${pathname === '/dashboard' ? 'text-[#3E3239] font-bold' : ''}`}
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#9E8189]" />
                    Dashboard
                  </Link>
                  <Link 
                    href="/events/new" 
                    className={`flex items-center gap-1.5 transition-colors hover:text-[#3E3239] ${pathname === '/events/new' ? 'text-[#3E3239] font-bold' : ''}`}
                  >
                    <PlusCircle className="w-4 h-4 text-[#9E8189]" />
                    Create Event
                  </Link>
                  <Link 
                    href="/pricing" 
                    className={`transition-colors hover:text-[#3E3239] ${pathname === '/pricing' ? 'text-[#3E3239] font-bold' : ''}`}
                  >
                    Subscription
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    href="/#previous-works" 
                    className="transition-colors hover:text-[#3E3239]"
                  >
                    Our Work
                  </Link>
                  <Link 
                    href="/features" 
                    className={`transition-colors hover:text-[#3E3239] ${pathname === '/features' ? 'text-[#3E3239] font-bold' : ''}`}
                  >
                    Features
                  </Link>
                  <Link 
                    href="/pricing" 
                    className={`transition-colors hover:text-[#3E3239] ${pathname === '/pricing' ? 'text-[#3E3239] font-bold' : ''}`}
                  >
                    Pricing
                  </Link>
                </>
              )}

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8D2C4]/70 text-[#3E3239] text-xs font-semibold border border-[#C7A9A3]/60 shadow-xs">
                <Sparkle className="w-3 h-3 text-[#6B5560]" />
                Smart Planning
              </div>
            </nav>
          )}

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {!isAuthPage && (
              <>
                {isAuth ? (
                  <div className="flex items-center gap-3">
                    <Link
                      href="/settings/profile"
                      className="flex items-center gap-2 text-xs font-bold text-[#3E3239] hover:text-[#6B5560] transition px-3 py-1.5 rounded-xl hover:bg-[#E8D2C4]/40 border border-[#E8D2C4]"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#3E3239] to-[#6B5560] text-[#F7EFE7] flex items-center justify-center text-[10px] font-bold">
                        {currentUser?.full_name?.charAt(0) || 'U'}
                      </div>
                      <span className="truncate max-w-[110px]">{currentUser?.full_name?.split(' ')[0] || 'Account'}</span>
                      {currentUser?.subscription?.tier && currentUser.subscription.tier !== 'starter' && (
                        <span className="px-1.5 py-0.5 rounded-md bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-xs">
                          {currentUser.subscription.tier}
                        </span>
                      )}
                    </Link>

                    <button
                      onClick={handleSignOut}
                      className="p-2 text-[#9E8189] hover:text-rose-700 hover:bg-rose-50 transition rounded-xl border border-transparent hover:border-rose-200"
                      title="Sign Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      href="/auth/sign-in"
                      className="px-4 py-2 text-sm font-bold text-[#3E3239] hover:text-[#6B5560] transition rounded-xl hover:bg-[#E8D2C4]/30"
                    >
                      Sign In
                    </Link>

                    <Link
                      href="/auth/sign-in?redirect=/events/new"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-[#F7EFE7] bg-gradient-to-r from-[#3E3239] via-[#6B5560] to-[#3E3239] hover:from-[#6B5560] hover:to-[#3E3239] shadow-md shadow-[#3E3239]/20 hover:shadow-lg active:scale-[0.98] transition-all"
                    >
                      <Sparkles className="w-4 h-4 text-[#E8D2C4]" />
                      <span>Plan My Event</span>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href={isAuth ? "/events/new" : "/auth/sign-in?redirect=/events/new"}
              className="p-2 text-[#F7EFE7] bg-[#3E3239] rounded-xl shadow-xs"
              title="New Event"
            >
              <PlusCircle className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#3E3239] hover:text-[#6B5560] rounded-xl hover:bg-[#E8D2C4]/40"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-[#3E3239]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-[#E8D2C4] px-4 pt-3 pb-5 space-y-3 shadow-2xl bg-[#F7EFE7]/95">
          {isAuth ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-base font-semibold text-[#3E3239] rounded-xl hover:bg-[#E8D2C4]/50"
              >
                <LayoutDashboard className="w-5 h-5 text-[#6B5560]" />
                Dashboard
              </Link>
              <Link
                href="/events/new"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-base font-semibold text-[#3E3239] rounded-xl hover:bg-[#E8D2C4]/50"
              >
                <PlusCircle className="w-5 h-5 text-[#6B5560]" />
                Create New Event
              </Link>
              <Link
                href="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-base font-semibold text-[#3E3239] rounded-xl hover:bg-[#E8D2C4]/50"
              >
                Subscription
              </Link>
              <Link
                href="/settings/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-base font-semibold text-[#3E3239] rounded-xl hover:bg-[#E8D2C4]/50"
              >
                Profile & Settings
              </Link>
              <button
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-base font-semibold text-rose-700 rounded-xl hover:bg-rose-50 text-left"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/#previous-works"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-base font-semibold text-[#3E3239] rounded-xl hover:bg-[#E8D2C4]/50"
              >
                Our Work
              </Link>
              <Link
                href="/features"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-base font-semibold text-[#3E3239] rounded-xl hover:bg-[#E8D2C4]/50"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-base font-semibold text-[#3E3239] rounded-xl hover:bg-[#E8D2C4]/50"
              >
                Pricing
              </Link>
              <Link
                href="/auth/sign-in"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-base font-semibold text-[#3E3239] rounded-xl hover:bg-[#E8D2C4]/50"
              >
                Sign In
              </Link>
              <Link
                href="/auth/sign-in?redirect=/events/new"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-[#F7EFE7] font-bold bg-gradient-to-r from-[#3E3239] to-[#6B5560] shadow-md mt-2"
              >
                <Sparkles className="w-4 h-4 text-[#E8D2C4]" />
                Plan My Event
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
