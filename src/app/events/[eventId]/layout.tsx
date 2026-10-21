'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useParams } from 'next/navigation';
import {
  Sparkles,
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  PieChart,
  CheckSquare,
  Building2,
  UserCheck,
  Palette,
  Bot,
  FileText,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { PlanovaStore } from '@/lib/storage';
import { EventItem } from '@/types';
import { formatDate, calculateDaysRemaining, formatCurrency } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import CompleteEventReviewModal from '@/components/events/CompleteEventReviewModal';

export default function EventWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const eventId = params.eventId as string;

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [event, setEvent] = useState<EventItem | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    const authStatus = PlanovaStore.isAuthenticated();
    setIsAuthenticated(authStatus);
    if (!authStatus) {
      router.push(`/auth/sign-in?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (eventId) {
      const evt = PlanovaStore.getEventById(eventId);
      if (evt) setEvent(evt);
    }
  }, [eventId, pathname, router]);

  if (isAuthenticated === false) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="p-8 max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Sign In Required</h2>
          <p className="text-xs text-slate-600">Please sign in to access and edit this celebration workspace, budget records, and guest lists.</p>
          <Link
            href={`/auth/sign-in?redirect=${encodeURIComponent(pathname)}`}
            className="block w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-indigo-700 hover:bg-indigo-800"
          >
            Sign In to Continue
          </Link>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-500 text-sm">Loading event workspace...</p>
        <Link href="/dashboard" className="text-xs font-bold text-indigo-700 mt-2 inline-block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const daysRemaining = calculateDaysRemaining(event.date);

  const tabs = [
    { label: 'Event Plan', href: `/events/${eventId}/plan`, icon: FileText },
    { label: 'Smart Budget', href: `/events/${eventId}/budget`, icon: PieChart },
    { label: 'Timeline & Tasks', href: `/events/${eventId}/timeline`, icon: CheckSquare },
    { label: 'Vendor Directory', href: `/events/${eventId}/vendors`, icon: Building2 },
    { label: 'Guest List & RSVP', href: `/events/${eventId}/guests`, icon: UserCheck },
    { label: 'Creative Studio', href: `/events/${eventId}/creative-studio`, icon: Palette },
    { label: 'AI Assistant', href: `/events/${eventId}/assistant`, icon: Bot },
  ];

  return (
    <div className="min-h-screen pb-16 bg-[#FAFAFF]">
      {/* Event Header Banner */}
      <div className="relative bg-slate-900 text-white">
        <div className="relative h-48 md:h-60 w-full overflow-hidden">
          <Image
            src={event.cover_image || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'}
            alt={event.title}
            fill
            className="object-cover opacity-40 blur-[1px]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 absolute inset-0 flex flex-col justify-between py-6">
          {/* Top back bar */}
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-xs font-semibold backdrop-blur-md transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-violet-500/80 text-white backdrop-blur-md">
                {event.category.replace('_', ' ')}
              </span>

              {event.status === 'completed' ? (
                <>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/90 text-white backdrop-blur-md flex items-center gap-1 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" /> Executed Flawlessly
                  </span>
                  <Link
                    href="/#previous-works"
                    className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/20 text-white hover:bg-white/30 backdrop-blur-md transition flex items-center gap-1"
                  >
                    <span>View in Previous Works Showcase →</span>
                  </Link>
                </>
              ) : (
                <>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-md">
                    {daysRemaining < 0 ? 'Past Date' : `${daysRemaining} Days to go`}
                  </span>
                  <button
                    onClick={() => setIsReviewModalOpen(true)}
                    className="px-3.5 py-1 rounded-full text-[11px] font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-md backdrop-blur-md transition flex items-center gap-1.5 active:scale-95"
                  >
                    <Sparkles className="w-3 h-3 text-slate-950" />
                    <span>Complete Event & Submit Review</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Event title & meta */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white drop-shadow-md">
                {event.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-2 font-medium">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-300" />
                  {formatDate(event.date)} ({event.start_time} - {event.end_time})
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-300" />
                  {event.location}, {event.city}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-300" />
                  {event.expected_guests} Guests
                </span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15">
              <span className="text-[10px] text-slate-300 uppercase font-bold block">Allocated Budget</span>
              <span className="text-xl font-black text-white">{formatCurrency(event.total_budget, event.currency)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-indigo-700 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {children}
      </div>

      {/* Complete Event Review & Photo Modal */}
      {event && (
        <CompleteEventReviewModal
          event={event}
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          onSuccess={() => {
            const updated = PlanovaStore.getEventById(eventId);
            if (updated) setEvent(updated);
          }}
        />
      )}
    </div>
  );
}
