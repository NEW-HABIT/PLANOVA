'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import {
  Bot,
  Send,
  Sparkles,
  User,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { PlanovaStore } from '@/lib/storage';
import { EventItem, AIMessageItem } from '@/types';

export default function AssistantPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  const [event, setEvent] = useState<EventItem | null>(null);
  const [messages, setMessages] = useState<AIMessageItem[]>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (eventId) {
      const evt = PlanovaStore.getEventById(eventId);
      if (evt) setEvent(evt);
      setMessages(PlanovaStore.getAIMessages(eventId));
    }
  }, [eventId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (promptText?: string) => {
    const textToSend = promptText || inputPrompt;
    if (!textToSend.trim() || !event) return;

    // Add user message to UI & storage
    const userMsg = PlanovaStore.addAIMessage(eventId, {
      role: 'user',
      content: textToSend,
    });
    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event,
          messages: PlanovaStore.getAIMessages(eventId),
          userPrompt: textToSend,
        }),
      });

      if (!res.ok) throw new Error('Assistant API failed');
      const data = await res.json();

      const botMsg = PlanovaStore.addAIMessage(eventId, {
        role: 'assistant',
        content: data.content,
        action_type: data.action_type,
        action_payload: data.action_payload,
      });

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const fallbackMsg = PlanovaStore.addAIMessage(eventId, {
        role: 'assistant',
        content: `I have analyzed your request regarding **${event.title}**. To maintain your target budget and preserve your emergency fund, prioritize confirming vendor contracts with clear cancellation clauses. Let me know if you would like me to draft a task or re-allocate your budget categories.`,
      });
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteAction = (msg: AIMessageItem) => {
    if (msg.action_type === 'create_task') {
      const title = msg.action_payload?.title || 'Review pending event deliverables';
      PlanovaStore.addTask(eventId, {
        title,
        description: 'Auto-created via PLANOVA AI Assistant suggestion',
        due_date: event?.date || new Date().toISOString().split('T')[0],
        priority: msg.action_payload?.priority || 'high',
        status: 'todo',
        assignee: 'Aarav Sharma',
        is_completed: false,
        category: 'Assistant',
      });
      setActionNotice(`Task "${title}" added to your Timeline!`);
      setTimeout(() => setActionNotice(null), 3500);
    }
  };

  const examplePrompts = [
    'Reduce my current budget by 10% without affecting food quality.',
    'What tasks should I finish this week?',
    'Suggest elegant decorations using reusable materials.',
    'My photographer cancelled. Help me update my plan.',
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-700" />
            PLANOVA Copilot: {event?.title}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Context-aware event intelligence powered by Groq Llama 3.3.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Online & Aware
        </div>
      </div>

      {/* Action Execution Notice */}
      {actionNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {actionNotice}
        </div>
      )}

      {/* CHAT WINDOW */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-card flex flex-col h-[560px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((m) => {
            const isUser = m.role === 'user';

            return (
              <div
                key={m.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-sm ${
                    isUser
                      ? 'bg-slate-800'
                      : 'bg-gradient-to-br from-indigo-700 to-violet-600'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-indigo-700 text-white rounded-tr-none'
                      : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-none shadow-sm'
                  }`}
                >
                  {m.content}

                  {/* Action trigger button */}
                  {m.action_type === 'create_task' && (
                    <div className="mt-3 pt-3 border-t border-slate-200/80">
                      <button
                        onClick={() => handleExecuteAction(m)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-700 text-white font-bold text-xs hover:bg-indigo-800 shadow-sm"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        Add Suggested Task to Checklist
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-700 flex items-center justify-center text-white shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                Consulting Groq Llama 3.3 with event parameters...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Example prompts bar */}
        <div className="px-4 py-2 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-slate-400 font-bold shrink-0">Suggestions:</span>
          {examplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-700 text-slate-600 whitespace-nowrap transition"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input box */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && handleSendMessage()}
            placeholder={`Ask PLANOVA about ${event?.title || 'your event'}...`}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent font-medium"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={loading || !inputPrompt.trim()}
            className="p-2.5 rounded-xl bg-indigo-700 text-white hover:bg-indigo-800 disabled:opacity-50 transition shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
