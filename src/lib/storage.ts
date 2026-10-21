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
} from "@/types";
import {
  DEMO_USER,
  INITIAL_EVENTS,
  INITIAL_BUDGET_CATEGORIES,
  INITIAL_EXPENSES,
  INITIAL_TASKS,
  INITIAL_VENDORS,
  INITIAL_GUESTS,
  INITIAL_CREATIVE_ASSETS,
  INITIAL_AI_MESSAGES,
} from "./seed-data";

const STORAGE_KEYS = {
  USER: "planova_user",
  EVENTS: "planova_events",
  BUDGET_CATEGORIES: "planova_budget_categories",
  EXPENSES: "planova_expenses",
  TASKS: "planova_tasks",
  VENDORS: "planova_vendors",
  GUESTS: "planova_guests",
  CREATIVE_ASSETS: "planova_creative_assets",
  AI_MESSAGES: "planova_ai_messages",
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
  getUser(): UserProfile {
    return safeGet<UserProfile>(STORAGE_KEYS.USER, DEMO_USER);
  },

  setUser(user: UserProfile): void {
    safeSet(STORAGE_KEYS.USER, user);
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
};
