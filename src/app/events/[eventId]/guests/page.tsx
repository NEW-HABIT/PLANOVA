'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  UserCheck,
  PlusCircle,
  Download,
  Upload,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
  Users,
  Trash2,
  Phone,
  Mail,
  X,
  UserPlus,
} from 'lucide-react';
import { PlanovaStore } from '@/lib/storage';
import { EventItem, GuestItem, RSVPStatus } from '@/types';

export default function GuestsPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  const [event, setEvent] = useState<EventItem | null>(null);
  const [guests, setGuests] = useState<GuestItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [showAddGuest, setShowAddGuest] = useState(false);

  const [newGuest, setNewGuest] = useState({
    full_name: '',
    email: '',
    phone: '',
    rsvp_status: 'attending' as RSVPStatus,
    group: 'family' as 'family' | 'friends' | 'colleagues' | 'vip' | 'general',
    dietary_requirements: '',
    accessibility: '',
    plus_one: false,
    plus_one_name: '',
    attendance_count: 1,
    invitation_sent: true,
  });

  useEffect(() => {
    if (eventId) {
      const evt = PlanovaStore.getEventById(eventId);
      if (evt) setEvent(evt);
      setGuests(PlanovaStore.getGuests(eventId));
    }
  }, [eventId]);

  const handleCreateGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuest.full_name) return;

    PlanovaStore.addGuest(eventId, {
      ...newGuest,
      attendance_count: newGuest.plus_one ? 2 : 1,
    });
    setGuests(PlanovaStore.getGuests(eventId));
    setShowAddGuest(false);
    setNewGuest({
      full_name: '',
      email: '',
      phone: '',
      rsvp_status: 'attending',
      group: 'family',
      dietary_requirements: '',
      accessibility: '',
      plus_one: false,
      plus_one_name: '',
      attendance_count: 1,
      invitation_sent: true,
    });
  };

  const handleDeleteGuest = (id: string) => {
    if (confirm('Remove this guest from list?')) {
      PlanovaStore.deleteGuest(eventId, id);
      setGuests(PlanovaStore.getGuests(eventId));
    }
  };

  // RSVP Status changer
  const handleUpdateStatus = (id: string, status: RSVPStatus) => {
    const updated = guests.map((g) => (g.id === id ? { ...g, rsvp_status: status } : g));
    PlanovaStore.saveGuests(eventId, updated);
    setGuests(updated);
  };

  // CSV Export
  const handleExportCSV = () => {
    let csv = 'data:text/csv;charset=utf-8,';
    csv += 'Full Name,Email,Phone,RSVP Status,Group,Dietary,Accessibility,Plus One,Attendance Count\n';

    guests.forEach((g) => {
      csv += `"${g.full_name}","${g.email || ''}","${g.phone || ''}","${g.rsvp_status}","${g.group}","${g.dietary_requirements || ''}","${g.accessibility || ''}",${g.plus_one},${g.attendance_count}\n`;
    });

    const encodedUri = encodeURI(csv);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${event?.title.replace(/\s+/g, '_')}_Guest_List.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics
  const attendingCount = guests
    .filter((g) => g.rsvp_status === 'attending')
    .reduce((sum, g) => sum + (g.attendance_count || 1), 0);
  const declinedCount = guests.filter((g) => g.rsvp_status === 'declined').length;
  const pendingCount = guests.filter((g) => g.rsvp_status === 'pending' || g.rsvp_status === 'maybe').length;

  const filteredGuests = guests.filter((g) => {
    const matchesSearch =
      g.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || g.rsvp_status === statusFilter;
    const matchesGroup = groupFilter === 'all' || g.group === groupFilter;
    return matchesSearch && matchesStatus && matchesGroup;
  });

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-700" />
            Guest List & RSVP Manager
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track confirmed attendance, dietary preferences, accessibility requests, and table groupings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddGuest(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-700 hover:bg-indigo-800 shadow-md"
          >
            <PlusCircle className="w-4 h-4" /> Add Guest
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" /> Export CSV
          </button>
        </div>
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-card">
          <span className="text-xs font-bold text-slate-500 uppercase">Confirmed Attending</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{attendingCount}</p>
          <span className="text-[11px] text-slate-400">Headcount with plus-ones</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-card">
          <span className="text-xs font-bold text-slate-500 uppercase">Awaiting Response</span>
          <p className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</p>
          <span className="text-[11px] text-slate-400">Pending & maybe replies</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-card">
          <span className="text-xs font-bold text-slate-500 uppercase">Declined</span>
          <p className="text-2xl font-black text-slate-400 mt-1">{declinedCount}</p>
          <span className="text-[11px] text-slate-400">Unable to attend</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-card">
          <span className="text-xs font-bold text-slate-500 uppercase">Target Venue Capacity</span>
          <p className="text-2xl font-black text-indigo-700 mt-1">{event?.expected_guests || 0}</p>
          <span className="text-[11px] text-slate-400">Target guest invitations</span>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by guest name, email, or phone..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none"
          >
            <option value="all">All RSVP Statuses</option>
            <option value="attending">Attending</option>
            <option value="pending">Pending</option>
            <option value="maybe">Maybe</option>
            <option value="declined">Declined</option>
          </select>

          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none"
          >
            <option value="all">All Groups</option>
            <option value="family">Family</option>
            <option value="friends">Friends</option>
            <option value="colleagues">Colleagues</option>
            <option value="vip">VIP</option>
          </select>
        </div>
      </div>

      {/* GUEST TABLE */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                <th className="p-4">Guest Name</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Group</th>
                <th className="p-4">RSVP Status</th>
                <th className="p-4">Dietary & Accessibility</th>
                <th className="p-4">Seats</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No guests matched your filters.
                  </td>
                </tr>
              ) : (
                filteredGuests.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4">
                      <span className="font-bold text-slate-900 block">{g.full_name}</span>
                      {g.plus_one && (
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <UserPlus className="w-3 h-3 text-indigo-500" />
                          +1: {g.plus_one_name || 'Accompanied Guest'}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-slate-500 text-[11px] space-y-0.5">
                      {g.email && <div className="truncate max-w-[150px]">{g.email}</div>}
                      {g.phone && <div className="font-mono">{g.phone}</div>}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                        {g.group}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={g.rsvp_status}
                        onChange={(e) => handleUpdateStatus(g.id, e.target.value as RSVPStatus)}
                        className={`px-2 py-1 rounded text-xs font-bold border-0 focus:ring-1 focus:ring-indigo-600 ${
                          g.rsvp_status === 'attending'
                            ? 'bg-emerald-100 text-emerald-800'
                            : g.rsvp_status === 'declined'
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        <option value="attending">Attending</option>
                        <option value="pending">Pending</option>
                        <option value="maybe">Maybe</option>
                        <option value="declined">Declined</option>
                      </select>
                    </td>
                    <td className="p-4 text-slate-600 text-[11px] max-w-[200px]">
                      {g.dietary_requirements && (
                        <div>
                          <span className="font-semibold text-slate-700">Diet:</span>{' '}
                          {g.dietary_requirements}
                        </div>
                      )}
                      {g.accessibility && (
                        <div>
                          <span className="font-semibold text-amber-800">Access:</span>{' '}
                          {g.accessibility}
                        </div>
                      )}
                      {!g.dietary_requirements && !g.accessibility && 'Standard'}
                    </td>
                    <td className="p-4 font-bold text-slate-900">{g.attendance_count}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteGuest(g.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 transition"
                        title="Remove Guest"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD GUEST MODAL */}
      {showAddGuest && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Add Guest</h3>
              <button
                onClick={() => setShowAddGuest(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGuest} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Full Name / Family Name *
                </label>
                <input
                  type="text"
                  required
                  value={newGuest.full_name}
                  onChange={(e) => setNewGuest({ ...newGuest, full_name: e.target.value })}
                  placeholder="e.g. Vikramaditya Rathore"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newGuest.email}
                    onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                    placeholder="guest@domain.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={newGuest.phone}
                    onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
                    placeholder="+91 98290 12345"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Group Type
                  </label>
                  <select
                    value={newGuest.group}
                    onChange={(e) =>
                      setNewGuest({ ...newGuest, group: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                  >
                    <option value="family">Family</option>
                    <option value="friends">Friends</option>
                    <option value="colleagues">Colleagues</option>
                    <option value="vip">VIP</option>
                    <option value="general">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    RSVP Status
                  </label>
                  <select
                    value={newGuest.rsvp_status}
                    onChange={(e) =>
                      setNewGuest({ ...newGuest, rsvp_status: e.target.value as RSVPStatus })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                  >
                    <option value="attending">Attending</option>
                    <option value="pending">Pending</option>
                    <option value="maybe">Maybe</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={newGuest.plus_one}
                    onChange={(e) => setNewGuest({ ...newGuest, plus_one: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600"
                  />
                  <span className="text-xs font-semibold text-slate-700">Allow +1 Plus-One</span>
                </label>
              </div>

              {newGuest.plus_one && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Plus-One Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={newGuest.plus_one_name}
                    onChange={(e) => setNewGuest({ ...newGuest, plus_one_name: e.target.value })}
                    placeholder="e.g. Gayatri Rathore"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Dietary / Accessibility Notes
                </label>
                <input
                  type="text"
                  value={newGuest.dietary_requirements}
                  onChange={(e) =>
                    setNewGuest({ ...newGuest, dietary_requirements: e.target.value })
                  }
                  placeholder="e.g. Jain food, Vegan, Wheelchair ramp"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddGuest(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-700 hover:bg-indigo-800 shadow-sm"
                >
                  Save Guest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
