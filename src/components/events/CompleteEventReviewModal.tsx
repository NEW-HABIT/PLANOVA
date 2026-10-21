'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  X,
  Star,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  Plus,
  ArrowRight,
  Award,
  Layers,
  HeartHandshake,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PlanovaStore } from '@/lib/storage';
import { EventItem, CompletedEventReview } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface CompleteEventReviewModalProps {
  event: EventItem;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CURATED_PHOTO_PACKS: Record<string, string[]> = {
  wedding: [
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1000&q=80',
  ],
  birthday: [
    'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1533294455009-a77b7557d2d1?auto=format&fit=crop&w=1000&q=80',
  ],
  corporate: [
    'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1000&q=80',
  ],
  festival: [
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1000&q=80',
  ],
  gala: [
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=1000&q=80',
  ],
};

export default function CompleteEventReviewModal({
  event,
  isOpen,
  onClose,
  onSuccess,
}: CompleteEventReviewModalProps) {
  const router = useRouter();
  const currentUser = PlanovaStore.getUser();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [ownerName, setOwnerName] = useState(currentUser.full_name || 'Celebration Host');
  const [highlight, setHighlight] = useState(
    'Delivered 100% on budget with zero contingency leak and 5.0★ vendor satisfaction.'
  );
  const [ownerReview, setOwnerReview] = useState(
    `PLANOVA transformed our celebration planning. The budget allocation kept us strictly on target, our vendors were coordinated without confusion, and our ${event.expected_guests} guests had an unforgettable experience.`
  );
  const [savingsAchieved, setSavingsAchieved] = useState('₹45,000 Saved via Vendor Optimization');
  const [galleryImages, setGalleryImages] = useState<string[]>(
    CURATED_PHOTO_PACKS[event.category as keyof typeof CURATED_PHOTO_PACKS] ||
      CURATED_PHOTO_PACKS.wedding
  );
  const [urlInput, setUrlInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setGalleryImages((prev) => [reader.result as string, ...prev]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddUrl = () => {
    if (urlInput.trim() && !galleryImages.includes(urlInput.trim())) {
      setGalleryImages((prev) => [urlInput.trim(), ...prev]);
      setUrlInput('');
    }
  };

  const handleRemovePhoto = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLoadPhotoPack = (packKey: keyof typeof CURATED_PHOTO_PACKS) => {
    setGalleryImages(CURATED_PHOTO_PACKS[packKey] || []);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Submit review to Previous Works
      PlanovaStore.submitEventReview({
        event_id: event.id,
        title: event.title,
        category: event.category.replace('_', ' ').toUpperCase(),
        tag: event.category === 'wedding' ? 'Royal Heritage' : event.category === 'corporate' ? 'Global Summit' : 'Milestone Celebration',
        location: `${event.location}, ${event.city}`,
        budget: formatCurrency(event.total_budget, event.currency),
        guests: event.expected_guests,
        owner_name: ownerName,
        owner_avatar: currentUser.avatar_url,
        owner_review: ownerReview,
        rating,
        highlight,
        savingsAchieved,
        gallery_images: galleryImages.length > 0 ? galleryImages : [
          'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
        ],
      });

      // 2. Trigger celebratory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      setIsSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 my-auto animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-indigo-50/80 via-white to-violet-50/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700">
                Celebration Completion
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {event.category.replace('_', ' ')} • {event.city}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Complete Celebration & Submit Review
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Share your celebration photos and owner review to showcase your successful event on PLANOVA.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 sm:p-10 text-center space-y-5 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900">
                Celebration Story Published! 🎉
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Your event <span className="font-bold text-slate-900">"{event.title}"</span> has been marked as{' '}
                <span className="font-bold text-emerald-600">Executed Flawlessly</span> and is now featured at the top of PLANOVA's Previous Works showcase!
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  router.push('/#previous-works');
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-indigo-700 hover:bg-indigo-800 shadow-md transition"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>View on Public Showcase</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Close & Return
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Event Summary Pill */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between text-xs gap-3">
              <div>
                <span className="font-bold text-slate-800 block">{event.title}</span>
                <span className="text-slate-500 text-[11px]">{event.location}, {event.city} • {event.expected_guests} Guests</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Planned Budget</span>
                <span className="font-black text-indigo-700">{formatCurrency(event.total_budget, event.currency)}</span>
              </div>
            </div>

            {/* Star Rating */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Overall Experience Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-slate-300 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        (hoverRating || rating) >= star
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-amber-600 ml-2">
                  {rating === 5 ? '5.0 — Executed Flawlessly' : `${rating}.0 / 5.0`}
                </span>
              </div>
            </div>

            {/* Host Name & One-Liner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Owner / Host Name & Title
                </label>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="e.g. Rohan & Ananya Verma"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Financial Savings Impact
                </label>
                <input
                  type="text"
                  value={savingsAchieved}
                  onChange={(e) => setSavingsAchieved(e.target.value)}
                  placeholder="e.g. ₹45,000 Saved on Consolidated Catering"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Highlight summary */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                One-Line Highlight (Shown on Previous Works Card)
              </label>
              <input
                type="text"
                required
                value={highlight}
                onChange={(e) => setHighlight(e.target.value)}
                placeholder="e.g. Delivered 100% on budget with zero contingency leak and 4.9★ vendor satisfaction."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
              />
            </div>

            {/* How PLANOVA Helped Review */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                How PLANOVA Helped Your Celebration (Owner Review)
              </label>
              <textarea
                required
                rows={4}
                value={ownerReview}
                onChange={(e) => setOwnerReview(e.target.value)}
                placeholder="Describe how PLANOVA helped you coordinate the event, keep the budget tight, and manage vendors and guests smoothly..."
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:outline-none leading-relaxed"
              ></textarea>
              <p className="text-[11px] text-slate-400 mt-1">
                Visitors on the landing page will read this testimonial to understand how PLANOVA helped organize your event.
              </p>
            </div>

            {/* Event Photos Section */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Event Photo Gallery ({galleryImages.length} Photos)
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Upload photos from your computer or select a curated photography preset.
                  </p>
                </div>

                {/* File upload trigger */}
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Photos</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Curated Presets shortcuts */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                <span className="text-slate-400 font-semibold whitespace-nowrap">Presets:</span>
                <button
                  type="button"
                  onClick={() => handleLoadPhotoPack('wedding')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 font-medium whitespace-nowrap text-slate-600"
                >
                  Royal Wedding
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadPhotoPack('corporate')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 font-medium whitespace-nowrap text-slate-600"
                >
                  Tech Summit
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadPhotoPack('birthday')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 font-medium whitespace-nowrap text-slate-600"
                >
                  Milestone Birthday
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadPhotoPack('festival')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 font-medium whitespace-nowrap text-slate-600"
                >
                  Concert & Fest
                </button>
              </div>

              {/* Add custom URL */}
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Or paste an image web link (https://...)"
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddUrl}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                >
                  Add URL
                </button>
              </div>

              {/* Gallery previews list */}
              {galleryImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {galleryImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative h-20 rounded-xl overflow-hidden border border-slate-200 group"
                    >
                      <Image src={img} alt={`Preview ${idx + 1}`} fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="absolute top-1 right-1 p-1 rounded-md bg-black/60 text-white hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      {idx === 0 && (
                        <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-bold text-amber-300">
                          Cover
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-700 hover:bg-indigo-800 shadow-md shadow-indigo-600/20 active:scale-95 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Publish to Previous Works</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
