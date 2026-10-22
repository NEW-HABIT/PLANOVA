'use client';

import {
  EventItem,
  BudgetCategoryItem,
  ExpenseItem,
  TaskItem,
  VendorItem,
  GuestItem,
  CreativeAssetItem,
  AIMessageItem,
  UserProfile,
  CompletedEventReview,
} from "@/types";
import {
  INITIAL_EVENTS,
  INITIAL_BUDGET_CATEGORIES,
  INITIAL_EXPENSES,
  INITIAL_TASKS,
  INITIAL_VENDORS,
  INITIAL_GUESTS,
  INITIAL_CREATIVE_ASSETS,
  INITIAL_AI_MESSAGES,
} from "./seed-data";
import { PlanovaAuth } from "./auth";

const STORAGE_KEYS = {
  USER: "planova_user",
  AUTH_TOKEN: "planova_auth_token",
  EVENTS: "planova_events",
  BUDGET_CATEGORIES: "planova_budget_categories",
  EXPENSES: "planova_expenses",
  TASKS: "planova_tasks",
  VENDORS: "planova_vendors",
  GUESTS: "planova_guests",
  CREATIVE_ASSETS: "planova_creative_assets",
  AI_MESSAGES: "planova_ai_messages",
  COOKIE_CONSENT: "planova_cookie_consent",
  PREVIOUS_WORKS: "planova_previous_works",
};

function safeGet<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Failed to load ${key} from storage:`, e);
    return defaultValue;
  }
}

function safeSet<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save ${key} to storage:`, e);
  }
}

export const PlanovaStore = {
  isAuthenticated(): boolean {
    return PlanovaAuth.isAuthenticated();
  },

  login(user?: UserProfile): void {
    if (typeof window === "undefined") return;
    if (user) {
      PlanovaAuth.updateUserProfile(user);
    }
  },

  async register(params: { email: string; password: string; fullName: string }) {
    return PlanovaAuth.register(params);
  },

  async authenticate(params: { email: string; password: string }) {
    return PlanovaAuth.login(params);
  },

  logout(): void {
    PlanovaAuth.logout();
  },

  getCookieConsent(): boolean {
    return safeGet<boolean>(STORAGE_KEYS.COOKIE_CONSENT, false);
  },

  setCookieConsent(accepted: boolean): void {
    safeSet(STORAGE_KEYS.COOKIE_CONSENT, accepted);
  },

  getUser(): UserProfile {
    return PlanovaAuth.getUser() || PlanovaAuth.getSafeUser();
  },

  getAuthenticatedUser(): UserProfile | null {
    return PlanovaAuth.getUser();
  },

  setUser(user: UserProfile): void {
    PlanovaAuth.updateUserProfile(user);
  },

  getEvents(): EventItem[] {
    const events = safeGet<EventItem[]>(STORAGE_KEYS.EVENTS, []);
    if (!events || events.length === 0) {
      safeSet(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
      return INITIAL_EVENTS;
    }
    return events;
  },

  getEventById(id: string): EventItem | undefined {
    const events = this.getEvents();
    return events.find((e) => e.id === id);
  },

  saveEvent(event: EventItem): void {
    const events = this.getEvents();
    const index = events.findIndex((e) => e.id === event.id);
    if (index >= 0) {
      events[index] = { ...event, updated_at: new Date().toISOString() };
    } else {
      events.unshift({
        ...event,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
    safeSet(STORAGE_KEYS.EVENTS, events);
  },

  deleteEvent(id: string): void {
    const events = this.getEvents().filter((e) => e.id !== id);
    safeSet(STORAGE_KEYS.EVENTS, events);
  },

  duplicateEvent(id: string): EventItem | null {
    const event = this.getEventById(id);
    if (!event) return null;
    const newId = `evt_${Date.now()}`;
    const duplicate: EventItem = {
      ...event,
      id: newId,
      title: `${event.title} (Copy)`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.saveEvent(duplicate);

    // Duplicate categories
    const categories = this.getBudgetCategories(id);
    const newCategories = categories.map((c) => ({
      ...c,
      id: `cat_${newId}_${Math.random().toString(36).substring(2, 7)}`,
      event_id: newId,
      spent_amount: 0,
    }));
    this.saveBudgetCategories(newId, newCategories);

    return duplicate;
  },

  // Budget Categories
  getBudgetCategories(eventId: string): BudgetCategoryItem[] {
    const all = safeGet<Record<string, BudgetCategoryItem[]>>(
      STORAGE_KEYS.BUDGET_CATEGORIES,
      INITIAL_BUDGET_CATEGORIES
    );
    return all[eventId] || INITIAL_BUDGET_CATEGORIES[eventId] || [];
  },

  saveBudgetCategories(eventId: string, categories: BudgetCategoryItem[]): void {
    const all = safeGet<Record<string, BudgetCategoryItem[]>>(
      STORAGE_KEYS.BUDGET_CATEGORIES,
      INITIAL_BUDGET_CATEGORIES
    );
    all[eventId] = categories;
    safeSet(STORAGE_KEYS.BUDGET_CATEGORIES, all);
  },

  // Expenses
  getExpenses(eventId: string): ExpenseItem[] {
    const all = safeGet<Record<string, ExpenseItem[]>>(
      STORAGE_KEYS.EXPENSES,
      INITIAL_EXPENSES
    );
    return all[eventId] || INITIAL_EXPENSES[eventId] || [];
  },

  addExpense(eventId: string, expense: Omit<ExpenseItem, "id" | "event_id">): ExpenseItem {
    const all = safeGet<Record<string, ExpenseItem[]>>(
      STORAGE_KEYS.EXPENSES,
      INITIAL_EXPENSES
    );
    const list = all[eventId] || INITIAL_EXPENSES[eventId] || [];
    const newExpense: ExpenseItem = {
      ...expense,
      id: `exp_${Date.now()}`,
      event_id: eventId,
    };
    list.unshift(newExpense);
    all[eventId] = list;
    safeSet(STORAGE_KEYS.EXPENSES, all);
    return newExpense;
  },

  deleteExpense(eventId: string, expenseId: string): void {
    const all = safeGet<Record<string, ExpenseItem[]>>(
      STORAGE_KEYS.EXPENSES,
      INITIAL_EXPENSES
    );
    if (all[eventId]) {
      all[eventId] = all[eventId].filter((e) => e.id !== expenseId);
      safeSet(STORAGE_KEYS.EXPENSES, all);
    }
  },

  // Tasks
  getTasks(eventId: string): TaskItem[] {
    const all = safeGet<Record<string, TaskItem[]>>(
      STORAGE_KEYS.TASKS,
      INITIAL_TASKS
    );
    return all[eventId] || INITIAL_TASKS[eventId] || [];
  },

  saveTasks(eventId: string, tasks: TaskItem[]): void {
    const all = safeGet<Record<string, TaskItem[]>>(
      STORAGE_KEYS.TASKS,
      INITIAL_TASKS
    );
    all[eventId] = tasks;
    safeSet(STORAGE_KEYS.TASKS, all);
  },

  addTask(eventId: string, task: Omit<TaskItem, "id" | "event_id">): TaskItem {
    const tasks = this.getTasks(eventId);
    const newTask: TaskItem = {
      ...task,
      id: `tsk_${Date.now()}`,
      event_id: eventId,
    };
    tasks.unshift(newTask);
    this.saveTasks(eventId, tasks);
    return newTask;
  },

  toggleTaskCompleted(eventId: string, taskId: string): void {
    const tasks = this.getTasks(eventId);
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      task.is_completed = !task.is_completed;
      task.status = task.is_completed ? "completed" : "todo";
      this.saveTasks(eventId, tasks);
    }
  },

  deleteTask(eventId: string, taskId: string): void {
    const tasks = this.getTasks(eventId).filter((t) => t.id !== taskId);
    this.saveTasks(eventId, tasks);
  },

  // Vendors
  getVendors(eventId: string): VendorItem[] {
    const all = safeGet<Record<string, VendorItem[]>>(
      STORAGE_KEYS.VENDORS,
      INITIAL_VENDORS
    );
    return all[eventId] || INITIAL_VENDORS[eventId] || [];
  },

  saveVendors(eventId: string, vendors: VendorItem[]): void {
    const all = safeGet<Record<string, VendorItem[]>>(
      STORAGE_KEYS.VENDORS,
      INITIAL_VENDORS
    );
    all[eventId] = vendors;
    safeSet(STORAGE_KEYS.VENDORS, all);
  },

  addVendor(eventId: string, vendor: Omit<VendorItem, "id" | "event_id">): VendorItem {
    const vendors = this.getVendors(eventId);
    const newVendor: VendorItem = {
      ...vendor,
      id: `vnd_${Date.now()}`,
      event_id: eventId,
    };
    vendors.push(newVendor);
    this.saveVendors(eventId, vendors);
    return newVendor;
  },

  deleteVendor(eventId: string, vendorId: string): void {
    const vendors = this.getVendors(eventId).filter((v) => v.id !== vendorId);
    this.saveVendors(eventId, vendors);
  },

  // Guests
  getGuests(eventId: string): GuestItem[] {
    const all = safeGet<Record<string, GuestItem[]>>(
      STORAGE_KEYS.GUESTS,
      INITIAL_GUESTS
    );
    return all[eventId] || INITIAL_GUESTS[eventId] || [];
  },

  saveGuests(eventId: string, guests: GuestItem[]): void {
    const all = safeGet<Record<string, GuestItem[]>>(
      STORAGE_KEYS.GUESTS,
      INITIAL_GUESTS
    );
    all[eventId] = guests;
    safeSet(STORAGE_KEYS.GUESTS, all);
  },

  addGuest(eventId: string, guest: Omit<GuestItem, "id" | "event_id">): GuestItem {
    const guests = this.getGuests(eventId);
    const newGuest: GuestItem = {
      ...guest,
      id: `gst_${Date.now()}`,
      event_id: eventId,
    };
    guests.unshift(newGuest);
    this.saveGuests(eventId, guests);
    return newGuest;
  },

  deleteGuest(eventId: string, guestId: string): void {
    const guests = this.getGuests(eventId).filter((g) => g.id !== guestId);
    this.saveGuests(eventId, guests);
  },

  // Creative Assets
  getCreativeAssets(eventId: string): CreativeAssetItem[] {
    const all = safeGet<Record<string, CreativeAssetItem[]>>(
      STORAGE_KEYS.CREATIVE_ASSETS,
      INITIAL_CREATIVE_ASSETS
    );
    return all[eventId] || INITIAL_CREATIVE_ASSETS[eventId] || [];
  },

  addCreativeAsset(eventId: string, asset: Omit<CreativeAssetItem, "id" | "event_id" | "created_at">): CreativeAssetItem {
    const all = safeGet<Record<string, CreativeAssetItem[]>>(
      STORAGE_KEYS.CREATIVE_ASSETS,
      INITIAL_CREATIVE_ASSETS
    );
    const list = all[eventId] || INITIAL_CREATIVE_ASSETS[eventId] || [];
    const newAsset: CreativeAssetItem = {
      ...asset,
      id: `art_${Date.now()}`,
      event_id: eventId,
      created_at: new Date().toISOString(),
    };
    list.unshift(newAsset);
    all[eventId] = list;
    safeSet(STORAGE_KEYS.CREATIVE_ASSETS, all);
    return newAsset;
  },

  // AI Messages
  getAIMessages(eventId: string): AIMessageItem[] {
    const all = safeGet<Record<string, AIMessageItem[]>>(
      STORAGE_KEYS.AI_MESSAGES,
      INITIAL_AI_MESSAGES
    );
    return all[eventId] || INITIAL_AI_MESSAGES[eventId] || [];
  },

  addAIMessage(eventId: string, message: Omit<AIMessageItem, "id" | "event_id" | "created_at">): AIMessageItem {
    const all = safeGet<Record<string, AIMessageItem[]>>(
      STORAGE_KEYS.AI_MESSAGES,
      INITIAL_AI_MESSAGES
    );
    const list = all[eventId] || INITIAL_AI_MESSAGES[eventId] || [];
    const newMsg: AIMessageItem = {
      ...message,
      id: `msg_${Date.now()}`,
      event_id: eventId,
      created_at: new Date().toISOString(),
    };
    list.push(newMsg);
    all[eventId] = list;
    safeSet(STORAGE_KEYS.AI_MESSAGES, all);
    return newMsg;
  },

  // Previous Works & Completed Reviews
  getPreviousWorks(): CompletedEventReview[] {
    const saved = safeGet<CompletedEventReview[]>(STORAGE_KEYS.PREVIOUS_WORKS, []);
    if (!saved || saved.length === 0) {
      safeSet(STORAGE_KEYS.PREVIOUS_WORKS, INITIAL_PREVIOUS_WORKS);
      return INITIAL_PREVIOUS_WORKS;
    }
    return saved;
  },

  submitEventReview(review: Omit<CompletedEventReview, "id" | "created_at">): CompletedEventReview {
    const works = this.getPreviousWorks();
    const newWork: CompletedEventReview = {
      ...review,
      id: `work_${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    works.unshift(newWork);
    safeSet(STORAGE_KEYS.PREVIOUS_WORKS, works);

    // If linked to an active event, mark it as completed
    if (review.event_id) {
      const evt = this.getEventById(review.event_id);
      if (evt) {
        this.saveEvent({
          ...evt,
          status: "completed",
          progress_percentage: 100,
        });
      }
    }

    return newWork;
  },
};

export const INITIAL_PREVIOUS_WORKS: CompletedEventReview[] = [
  {
    id: "work_royal_wedding",
    event_id: "evt_royal_wedding",
    title: "Rohan & Ananya's Royal Palace Wedding",
    category: "Destination Wedding",
    tag: "Royal Heritage",
    location: "Jai Mahal Palace, Jaipur",
    budget: "₹25,00,000",
    guests: 350,
    highlight: "Delivered 100% on budget with zero contingency leak and 4.9★ vendor satisfaction.",
    owner_name: "Rohan & Ananya Verma",
    owner_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    owner_review:
      "PLANOVA transformed what felt like an impossible 3-day royal wedding into the most peaceful and breathtaking weekend of our lives. The smart budget manager kept our catering and venue costs exactly on target, and the Emergency Reserve stayed completely untouched! Our 350 guests couldn't stop raving about the live chaat counters and the seamless schedule.",
    rating: 5,
    savings_achieved: "₹3,40,000 Saved via Vendor Optimization",
    gallery_images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1000&q=80",
    ],
    created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
  {
    id: "work_tech_summit",
    event_id: "evt_tech_summit",
    title: "TechPulse Global AI & Cloud Summit",
    category: "Corporate Keynote & Gala",
    tag: "Global Summit",
    location: "Grand Hyatt, Mumbai",
    budget: "₹18,00,000",
    guests: 600,
    highlight: "Orchestrated 2 stages, 6 keynote sessions, and 100% dietary personalized banquet.",
    owner_name: "Tanvi Deshmukh (VP Events)",
    owner_avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    owner_review:
      "Executing a 600-person tech summit with simultaneous breakout rooms and live international keynotes was daunting. PLANOVA's minute-by-minute cue sheet generator gave our audiovisual technicians and stage crew clarity down to the second. Flawless execution and zero AV hiccups.",
    rating: 5,
    savings_achieved: "₹2,10,000 Saved on Consolidated AV Packages",
    gallery_images: [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80",
    ],
    created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
  },
  {
    id: "work_kids_birthday",
    event_id: "evt_kids_birthday",
    title: "Aarav's 10th Intergalactic Superhero Birthday",
    category: "Kids Milestone Birthday",
    tag: "Milestone Celebration",
    location: "Meadowlands Lawn, Bengaluru",
    budget: "₹85,000",
    guests: 45,
    highlight: "Custom cosmic decor, 3-tier cake, and live illusionist with rave guest reviews.",
    owner_name: "Pooja Sharma",
    owner_avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    owner_review:
      "Aarav declared this 'the best birthday in the universe'! The cosmic balloon arch, 3-tier rocket cake, and VR illusionist were booked through PLANOVA's vendor directory with complete price transparency. We finished under budget with ₹7,000 to spare for goodie bags!",
    rating: 5,
    savings_achieved: "Under Budget by ₹7,000",
    gallery_images: [
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1000&q=80",
    ],
    created_at: new Date(Date.now() - 40 * 86400000).toISOString(),
  },
  {
    id: "work_college_fest",
    event_id: "evt_college_fest",
    title: "AURA National Cultural Festival",
    category: "College Festival & Concert",
    tag: "Youth Festival",
    location: "Main University Arena, New Delhi",
    budget: "₹12,00,000",
    guests: 2500,
    highlight: "Crowd management for 2,500+ attendees, multi-artist line-up, and vendor stalls.",
    owner_name: "Devrath Banerjee (Fest Convenor)",
    owner_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    owner_review:
      "Managing 2,500 students, celebrity artist riders, stage sound clearance, and 30 vendor stalls felt terrifying until we put the plan in PLANOVA. The backwards milestone schedule kept our 40-student volunteer committee perfectly coordinated.",
    rating: 5,
    savings_achieved: "₹1,80,000 Saved on Stage Rigging & Truss",
    gallery_images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=80",
    ],
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
  {
    id: "work_vineyard_anniversary",
    title: "Diya & Kabir's Sunset Vineyard Anniversary",
    category: "Silver Anniversary Soirée",
    tag: "Romantic Elegance",
    location: "Sula Vineyards, Nashik",
    budget: "₹3,50,000",
    guests: 75,
    highlight: "Candlelit pergolas, artisanal wine pairing dinner, and live acoustic quartet.",
    owner_name: "Diya & Kabir Mehra",
    owner_avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    owner_review:
      "For our 25th anniversary, we wanted a sunset wine tasting followed by an intimate candlelit dinner. PLANOVA helped us write the personal toast speech, design bilingual digital invites with RSVP links, and negotiate a fantastic deal with the vineyard banqueting team.",
    rating: 5,
    savings_achieved: "₹45,000 Saved on Estate Wine Pairing",
    gallery_images: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=80",
    ],
    created_at: new Date(Date.now() - 75 * 86400000).toISOString(),
  },
  {
    id: "work_community_gala",
    title: "Vasant Utsav Community Spring Gala",
    category: "Community Gala",
    tag: "Cultural Harmony",
    location: "Koramangala Club, Bengaluru",
    budget: "₹4,20,000",
    guests: 400,
    highlight: "Eco-friendly floral installations, local artisan food kiosks, and charity auction.",
    owner_name: "Vikram Rathore (President)",
    owner_avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    owner_review:
      "We hosted over 400 community members for our spring charitable feast. PLANOVA made it so simple to track vegetarian and Jain dietary preferences and export the guest list directly for the registration desk. Highly recommended for community groups!",
    rating: 5,
    savings_achieved: "100% On-Target Financial Transparency",
    gallery_images: [
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=1000&q=80",
    ],
    created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
  },
];
