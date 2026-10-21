'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Building2,
  PlusCircle,
  Phone,
  Mail,
  Globe,
  MapPin,
  Star,
  CheckCircle2,
  Trash2,
  DollarSign,
  Sparkles,
  HelpCircle,
  Filter,
  Layers,
  X,
  ExternalLink,
} from 'lucide-react';
import { PlanovaStore } from '@/lib/storage';
import { EventItem, VendorItem, VendorCategory, VendorBookingStatus } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function VendorsPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  const [event, setEvent] = useState<EventItem | null>(null);
  const [vendors, setVendors] = useState<VendorItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [aiQuestionsVendor, setAiQuestionsVendor] = useState<VendorItem | null>(null);

  const [newVendor, setNewVendor] = useState({
    name: '',
    category: 'venue' as VendorCategory,
    contact_phone: '',
    contact_email: '',
    website: '',
    location: '',
    price_estimate: 200000,
    quoted_price: 180000,
    services: '',
    notes: '',
    rating: 5,
    booking_status: 'shortlisted' as VendorBookingStatus,
    payment_terms: '50% advance, balance on event day',
  });

  useEffect(() => {
    if (eventId) {
      const evt = PlanovaStore.getEventById(eventId);
      if (evt) setEvent(evt);
      setVendors(PlanovaStore.getVendors(eventId));
    }
  }, [eventId]);

  const handleCreateVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendor.name) return;

    PlanovaStore.addVendor(eventId, {
      ...newVendor,
      services: newVendor.services ? newVendor.services.split(',').map((s) => s.trim()) : [],
      is_verified: true,
    });
    setVendors(PlanovaStore.getVendors(eventId));
    setShowAddVendor(false);
    setNewVendor({
      name: '',
      category: 'venue',
      contact_phone: '',
      contact_email: '',
      website: '',
      location: '',
      price_estimate: 100000,
      quoted_price: 90000,
      services: '',
      notes: '',
      rating: 5,
      booking_status: 'shortlisted',
      payment_terms: '',
    });
  };

  const handleDeleteVendor = (id: string) => {
    if (confirm('Remove this vendor listing?')) {
      PlanovaStore.deleteVendor(eventId, id);
      setVendors(PlanovaStore.getVendors(eventId));
      setCompareIds(compareIds.filter((cid) => cid !== id));
    }
  };

  const toggleCompare = (id: string) => {
    if (compareIds.includes(id)) {
      setCompareIds(compareIds.filter((cid) => cid !== id));
    } else {
      if (compareIds.length >= 3) {
        alert('You can compare up to 3 vendors simultaneously.');
        return;
      }
      setCompareIds([...compareIds, id]);
    }
  };

  const filteredVendors = vendors.filter(
    (v) => selectedCategory === 'all' || v.category === selectedCategory
  );

  const comparedVendorsList = vendors.filter((v) => compareIds.includes(v.id));

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-700" />
            Vendor Directory & Side-by-Side Comparison
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track contractual quotations, service agreements, and side-by-side matrices.
          </p>
        </div>

        <button
          onClick={() => setShowAddVendor(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-700 hover:bg-indigo-800 shadow-md"
        >
          <PlusCircle className="w-4 h-4" /> Add Vendor
        </button>
      </div>

      {/* CATEGORY FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[
          { key: 'all', label: 'All Vendors' },
          { key: 'venue', label: 'Venues' },
          { key: 'catering', label: 'Caterers' },
          { key: 'decoration', label: 'Decor & Floral' },
          { key: 'photography', label: 'Photo & Cinema' },
          { key: 'dj_entertainment', label: 'DJ & Music' },
          { key: 'makeup_artist', label: 'Styling & Beauty' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedCategory(tab.key)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedCategory === tab.key
                ? 'bg-indigo-700 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SIDE-BY-SIDE COMPARISON MATRIX (When 2 or more vendors selected) */}
      {comparedVendorsList.length >= 2 && (
        <div className="p-6 rounded-3xl bg-indigo-50/70 border border-indigo-200 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
              <h3 className="text-sm font-black text-indigo-950 uppercase tracking-wide">
                Side-by-Side Comparison Matrix ({comparedVendorsList.length} Selected)
              </h3>
            </div>
            <button
              onClick={() => setCompareIds([])}
              className="text-xs font-bold text-indigo-700 hover:underline"
            >
              Clear Comparison
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {comparedVendorsList.map((v) => (
              <div key={v.id} className="p-4 rounded-2xl bg-white border border-indigo-100 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                    {v.category}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{v.rating}</span>
                  </div>
                </div>

                <h4 className="font-extrabold text-slate-900 text-base">{v.name}</h4>

                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span>Quoted Price:</span>
                    <span className="font-bold text-indigo-900">
                      {v.quoted_price ? formatCurrency(v.quoted_price, event?.currency) : 'Pending'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price Estimate:</span>
                    <span className="font-medium text-slate-500">
                      {formatCurrency(v.price_estimate, event?.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-bold capitalize text-emerald-600">{v.booking_status}</span>
                  </div>
                </div>

                {v.services && v.services.length > 0 && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                      Included Services
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {v.services.map((s, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VENDOR CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.map((v) => {
          const isComparing = compareIds.includes(v.id);

          return (
            <div
              key={v.id}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card hover:shadow-xl transition-all duration-200 flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header & Category Badge */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700">
                    {v.category.replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{v.rating}</span>
                  </div>
                </div>

                {/* Name & Location */}
                <div className="mt-3">
                  <h3 className="font-extrabold text-slate-900 text-lg">{v.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{v.location}</span>
                  </div>
                </div>

                {/* Pricing Details */}
                <div className="mt-4 p-3 rounded-2xl bg-slate-50 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Quoted Price</span>
                    <span className="text-sm font-black text-slate-900">
                      {v.quoted_price ? formatCurrency(v.quoted_price, event?.currency) : 'Pending Quote'}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                      v.booking_status === 'booked'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {v.booking_status}
                  </span>
                </div>

                {/* Services list */}
                {v.services && v.services.length > 0 && (
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-1">
                      {v.services.slice(0, 3).map((s, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {s}
                        </span>
                      ))}
                      {v.services.length > 3 && (
                        <span className="text-[10px] px-1 text-slate-400">+{v.services.length - 3}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <Phone className="w-3 h-3 text-slate-400" /> {v.contact_phone}
                  </span>
                  <button
                    onClick={() => setAiQuestionsVendor(v)}
                    className="text-[11px] font-bold text-violet-700 hover:text-violet-900 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" /> AI Questions
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleCompare(v.id)}
                    className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold border transition ${
                      isComparing
                        ? 'bg-indigo-700 text-white border-indigo-700'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {isComparing ? 'Comparing ✓' : '+ Compare'}
                  </button>
                  <button
                    onClick={() => handleDeleteVendor(v.id)}
                    className="p-2 text-slate-400 hover:text-red-600 transition"
                    title="Remove Vendor"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI VENDOR QUESTIONS MODAL */}
      {aiQuestionsVendor && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Targeted Vendor Interview Checklist: {aiQuestionsVendor.name}
                </h3>
              </div>
              <button
                onClick={() => setAiQuestionsVendor(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Before signing contracts for <span className="font-bold">{aiQuestionsVendor.category}</span>, ask these
              high-priority contractual and operational questions:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 font-medium text-slate-800">
                1. What is your exact load-in setup timeline, and does your team handle municipal sound and fire permits?
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 font-medium text-slate-800">
                2. If weather or technical hardware fails on event day, what redundant backup gear is physically present?
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 font-medium text-slate-800">
                3. What are the cancellation terms, milestone refund schedules, and force-majeure clauses?
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 font-medium text-slate-800">
                4. Can we review a portfolio of recent events hosted specifically at {event?.location || 'this venue'}?
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setAiQuestionsVendor(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-700 hover:bg-indigo-800"
              >
                Close Checklist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD VENDOR MODAL */}
      {showAddVendor && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Add Vendor Listing</h3>
              <button
                onClick={() => setShowAddVendor(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVendor} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Vendor / Firm Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newVendor.name}
                    onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                    placeholder="e.g. Royal Palace Banquets"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Category *
                  </label>
                  <select
                    value={newVendor.category}
                    onChange={(e) => setNewVendor({ ...newVendor, category: e.target.value as VendorCategory })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                  >
                    <option value="venue">Venue & Staging</option>
                    <option value="catering">Catering & Dining</option>
                    <option value="decoration">Decor & Florals</option>
                    <option value="photography">Photo & Cinematography</option>
                    <option value="dj_entertainment">DJ & Entertainment</option>
                    <option value="makeup_artist">Makeup & Hair</option>
                    <option value="transportation">Transportation & Valet</option>
                    <option value="invitations">Invitations & Favors</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={newVendor.contact_phone}
                    onChange={(e) => setNewVendor({ ...newVendor, contact_phone: e.target.value })}
                    placeholder="+91 98290 12345"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Location / City
                  </label>
                  <input
                    type="text"
                    value={newVendor.location}
                    onChange={(e) => setNewVendor({ ...newVendor, location: e.target.value })}
                    placeholder="e.g. Civil Lines, Jaipur"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Estimated Price
                  </label>
                  <input
                    type="number"
                    value={newVendor.price_estimate}
                    onChange={(e) =>
                      setNewVendor({ ...newVendor, price_estimate: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Quoted Price
                  </label>
                  <input
                    type="number"
                    value={newVendor.quoted_price}
                    onChange={(e) =>
                      setNewVendor({ ...newVendor, quoted_price: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Services Included (comma-separated)
                </label>
                <input
                  type="text"
                  value={newVendor.services}
                  onChange={(e) => setNewVendor({ ...newVendor, services: e.target.value })}
                  placeholder="e.g. Lawn, AC Banquet, Bridal Suite, Valet (100 cars)"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddVendor(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-700 hover:bg-indigo-800 shadow-sm"
                >
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
