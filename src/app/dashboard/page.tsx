'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  PlusCircle,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Clock,
  CheckCircle2,
  Filter,
  Search,
  MoreVertical,
  Copy,
  Trash2,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Layers,
  Lock,
} from 'lucide-react';
import { PlanovaStore } from '@/lib/storage';
import { EventItem, EventCategory, EventStatus } from '@/types';
import { formatCurrency, formatDate, calculateDaysRemaining } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [user, setUser] = useState(PlanovaStore.getUser());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  useEffect(() => {
    const authStatus = PlanovaStore.isAuthenticated();
    setIsAuthenticated(authStatus);
    if (!authStatus) {
      router.push('/auth/sign-in?redirect=/dashboard');
      return;
    }
    setEvents(PlanovaStore.getEvents());
    setUser(PlanovaStore.getUser());
  }, [router]);

  if (isAuthenticated === false) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="p-8 max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Sign In Required</h2>
          <p className="text-xs text-slate-600">Please sign in to view your dashboard, budget analytics, and celebrations.</p>
          <Link
            href="/auth/sign-in?redirect=/dashboard"
            className="block w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-indigo-700 hover:bg-indigo-800"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      PlanovaStore.deleteEvent(id);
      setEvents(PlanovaStore.getEvents());
      setActiveMenuId(null);
    }
  };

  const handleDuplicate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const dup = PlanovaStore.duplicateEvent(id);
    if (dup) {
      setEvents(PlanovaStore.getEvents());
      setActiveMenuId(null);
    }
  };

  // Metrics calculations
  const totalPlannedBudget = events.reduce((sum, e) => sum + (e.total_budget || 0), 0);
  const activeEventsCount = events.filter((e) => e.status === 'planning' || e.status === 'draft').length;
  
  // Filter events
  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || e.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const currentDateFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Greeting Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-slate-200/80 gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            {currentDateFormatted}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Hello, {user.full_name} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            You have <span className="font-bold text-indigo-700">{activeEventsCount} active celebrations</span> in progress.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/events/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-indigo-700 via-violet-600 to-indigo-800 shadow-md shadow-indigo-600/20 hover:opacity-95 active:scale-[0.98] transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Event</span>
          </Link>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Active Events</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{activeEventsCount}</p>
          <span className="text-[11px] text-slate-400">Total {events.length} tracked events</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Planned Budget</span>
            <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{formatCurrency(totalPlannedBudget, 'INR')}</p>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Across all campaigns
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Expected Guests</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {events.reduce((sum, e) => sum + (e.expected_guests || 0), 0).toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400">Attending across all venues</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Planning Concierge</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-base font-black text-slate-900 mt-2 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Assistant Active
          </p>
          <span className="text-[11px] text-slate-500">24/7 Budget & Schedule Advice</span>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events by title, city, or venue..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            <option value="all">All Statuses</option>
            <option value="planning">In Planning</option>
            <option value="draft">Draft</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            <option value="all">All Categories</option>
            <option value="wedding">Weddings</option>
            <option value="birthday">Birthdays</option>
            <option value="corporate">Corporate</option>
            <option value="college_fest">College Fests</option>
            <option value="anniversary">Anniversaries</option>
          </select>
        </div>
      </div>

      {/* EVENTS GRID */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No events matched your filters</h3>
          <p className="text-xs text-slate-500 mt-1">Try resetting your search query or create a fresh celebration.</p>
          <Link
            href="/events/new"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-700 hover:bg-indigo-800"
          >
            <PlusCircle className="w-4 h-4" /> Create New Event
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => {
            const daysRemaining = calculateDaysRemaining(evt.date);
            const isPast = daysRemaining < 0;

            return (
              <div
                key={evt.id}
                className="rounded-3xl overflow-hidden bg-white border border-slate-200/90 shadow-card hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative"
              >
                {/* Event Image Banner */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <Image
                    src={evt.cover_image || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80'}
                    alt={evt.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/95 text-indigo-900 backdrop-blur-sm shadow-sm">
                    {evt.category.replace('_', ' ')}
                  </div>

                  {/* Context menu toggle */}
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === evt.id ? null : evt.id);
                      }}
                      className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition"
                      aria-label="Event Options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeMenuId === evt.id && (
                      <div className="absolute right-0 mt-1 w-36 rounded-xl bg-white border border-slate-200 shadow-xl py-1 z-20 text-xs">
                        <button
                          onClick={(e) => handleDuplicate(evt.id, e)}
                          className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-slate-50 text-slate-700"
                        >
                          <Copy className="w-3.5 h-3.5" /> Duplicate
                        </button>
                        <button
                          onClick={(e) => handleDelete(evt.id, e)}
                          className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-red-50 text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Countdown Badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="font-bold flex items-center gap-1.5 drop-shadow">
                      <Calendar className="w-3.5 h-3.5 text-amber-300" />
                      {formatDate(evt.date)}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-black/50 text-[11px] font-semibold backdrop-blur-sm">
                      {isPast ? 'Completed' : `${daysRemaining} days left`}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg leading-tight line-clamp-1 group-hover:text-indigo-700 transition">
                      {evt.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{evt.city || evt.location}</span>
                      <span>•</span>
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{evt.expected_guests} guests</span>
                    </div>
                  </div>

                  {/* Budget & Progress */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Planned Budget:</span>
                      <span className="font-bold text-slate-900">
                        {formatCurrency(evt.total_budget, evt.currency)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between items-center text-[11px] font-medium text-slate-600 mb-1">
                        <span>Planning Progress</span>
                        <span className="text-indigo-700 font-bold">{evt.progress_percentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-500"
                          style={{ width: `${evt.progress_percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2">
                    <Link
                      href={`/events/${evt.id}/plan`}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 flex items-center justify-center gap-2 group-hover:bg-indigo-700 group-hover:text-white transition-all shadow-sm"
                    >
                      <span>Open Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
