'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Palette,
  Sparkles,
  Copy,
  Check,
  PlusCircle,
  FileText,
  Mail,
  Share2,
  Mic,
  Smile,
  Shield,
  Layers,
} from 'lucide-react';
import { PlanovaStore } from '@/lib/storage';
import { EventItem, CreativeAssetItem } from '@/types';

export default function CreativeStudioPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  const [event, setEvent] = useState<EventItem | null>(null);
  const [assets, setAssets] = useState<CreativeAssetItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generatingType, setGeneratingType] = useState<string | null>(null);

  useEffect(() => {
    if (eventId) {
      const evt = PlanovaStore.getEventById(eventId);
      if (evt) setEvent(evt);
      setAssets(PlanovaStore.getCreativeAssets(eventId));
    }
  }, [eventId]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerateAsset = (type: CreativeAssetItem['asset_type']) => {
    if (!event) return;
    setGeneratingType(type);

    setTimeout(() => {
      let title = '';
      let content = '';
      let tags: string[] = [];

      if (type === 'invitation') {
        title = 'Bilingual Animated WhatsApp E-Invite';
        content = `✨ You are cordially invited to celebrate ✨\n\n${event.title}\n\nJoin us as we create everlasting memories together!\n\n📅 Date: ${event.date}\n⏰ Time: ${event.start_time} Onwards\n📍 Venue: ${event.location}, ${event.city}\n\nKindly confirm your presence by RSVPing here: https://planova.ai/rsvp/${event.id}\n\nDress Code: Festive Elegance\nWarm Regards,\nHost Family`;
        tags = ['WhatsApp', 'Friendly', 'Bilingual'];
      } else if (type === 'social_post') {
        title = 'Instagram & LinkedIn Countdown Announcement';
        content = `Mark your calendars! 🌟\n\nOnly a few weeks left until ${event.title} in the magnificent heritage grounds of ${event.city}.\n\nFrom curated gourmet feasts to live acoustic nights, get ready for an unforgettable celebration. Stay tuned for behind-the-scenes teasers!\n\n#PLANOVA #${event.category} #CelebrationVibes #${event.city.split(',')[0]}Diaries`;
        tags = ['Social', 'Instagram', 'Teaser'];
      } else if (type === 'speech') {
        title = 'Host Opening Welcome & Champagne Toast';
        content = `Good evening distinguished guests, beloved family, and friends!\n\nWelcome to ${event.title}. Standing here looking at every radiant smile in this room, our hearts are overflowing with gratitude.\n\nTonight is not just about marking a date on the calendar; it is about celebrating the bonds, dreams, and joy that bring us together. Please indulge in the banquet, let your hair down, and let's make tonight truly legendary.\n\nPlease raise your glasses with me: To love, laughter, and lifelong memories! Cheers! 🥂`;
        tags = ['Speech', 'Opening', 'Toast'];
      } else if (type === 'schedule') {
        title = 'VIP Emcee Cue Sheet & Transition Script';
        content = `[16:00] Soft background sitar/ambient music. Welcome team greets guests with Kesariya Thandai.\n[17:30] Emcee announcement: "Ladies and gentlemen, kindly take your seats in the Grand Pavilion."\n[17:45] Main ceremonial entry with soft amber spotlight sequence.\n[19:15] Dinner announcement and opening of the Live Banquet Theatres.\n[21:00] Couple & family celebratory dance sequence.\n[22:30] Closing photo memories and farewell favors dispatch.`;
        tags = ['Emcee', 'CueSheet', 'Production'];
      }

      const created = PlanovaStore.addCreativeAsset(eventId, {
        asset_type: type,
        title,
        content,
        tags,
      });

      setAssets(PlanovaStore.getCreativeAssets(eventId));
      setGeneratingType(null);
    }, 600);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Palette className="w-5 h-5 text-indigo-700" />
            Creative Studio & Copywriting
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            AI-powered copy for invitations, emcee scripts, social teasers, and welcoming remarks.
          </p>
        </div>
      </div>

      {/* QUICK GENERATION TOOLBAR */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-violet-900 to-indigo-950 text-white shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-300" />
          <h3 className="text-sm font-extrabold tracking-wide uppercase">
            Generate Creative Artifacts with Groq AI
          </h3>
        </div>
        <p className="text-xs text-violet-200 max-w-xl">
          One-click generator tailored for {event?.title}. All content respects your event category, location, and stylistic tone.
        </p>

        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <button
            onClick={() => handleGenerateAsset('invitation')}
            disabled={generatingType === 'invitation'}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-indigo-950 hover:bg-violet-50 transition shadow-sm flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5 text-indigo-600" />
            {generatingType === 'invitation' ? 'Drafting...' : '+ WhatsApp E-Invite'}
          </button>

          <button
            onClick={() => handleGenerateAsset('speech')}
            disabled={generatingType === 'speech'}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-indigo-950 hover:bg-violet-50 transition shadow-sm flex items-center gap-1.5"
          >
            <Mic className="w-3.5 h-3.5 text-indigo-600" />
            {generatingType === 'speech' ? 'Drafting...' : '+ Host Toast Speech'}
          </button>

          <button
            onClick={() => handleGenerateAsset('social_post')}
            disabled={generatingType === 'social_post'}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-indigo-950 hover:bg-violet-50 transition shadow-sm flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5 text-indigo-600" />
            {generatingType === 'social_post' ? 'Drafting...' : '+ Social Announcement'}
          </button>

          <button
            onClick={() => handleGenerateAsset('schedule')}
            disabled={generatingType === 'schedule'}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-indigo-950 hover:bg-violet-50 transition shadow-sm flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            {generatingType === 'schedule' ? 'Drafting...' : '+ Emcee Cue Sheet'}
          </button>
        </div>
      </div>

      {/* ASSETS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card hover:shadow-xl transition-all duration-200 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-50 text-violet-700">
                  {asset.asset_type}
                </span>
                <button
                  onClick={() => handleCopy(asset.id, asset.content)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-indigo-700 hover:bg-indigo-50 transition"
                >
                  {copiedId === asset.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>

              <h3 className="font-extrabold text-slate-900 text-base mt-3">{asset.title}</h3>

              <div className="mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed max-h-64 overflow-y-auto">
                {asset.content}
              </div>
            </div>

            {asset.tags && asset.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                {asset.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
