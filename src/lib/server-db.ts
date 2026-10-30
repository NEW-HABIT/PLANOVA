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
  UserSubscription,
} from '@/types';
import { supabaseAdmin, supabase, isSupabaseConfigured } from './supabase';

/**
 * Pure Supabase Database Service
 * Directly interacts with the production Supabase PostgreSQL tables:
 * - public.events
 * - public.tasks
 * - public.budget_categories
 * - public.expenses
 * - public.vendors
 * - public.guests
 * - public.profiles
 */

function getDbClient() {
  const client = supabaseAdmin || supabase;
  if (!client) {
    throw new Error('Supabase database is not configured in .env.local');
  }
  return client;
}

export const ServerDB = {
  /**
   * Fetch all events from Supabase
   */
  async getEvents(userId?: string): Promise<EventItem[]> {
    const client = getDbClient();
    let query = client.from('events').select('*').order('date', { ascending: true });
    
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Supabase getEvents error:', error);
      throw new Error(`Failed to load events from Supabase: ${error.message}`);
    }

    return (data || []) as EventItem[];
  },

  /**
   * Fetch a single event by ID from Supabase
   */
  async getEventById(id: string): Promise<EventItem | null> {
    const client = getDbClient();
    const { data, error } = await client
      .from('events')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Supabase getEventById error:', error);
      return null;
    }

    return data as EventItem | null;
  },

  /**
   * Save or update an event in Supabase
   */
  async saveEvent(event: Partial<EventItem> & { title: string }): Promise<EventItem> {
    const client = getDbClient();
    
    const payload: any = {
      ...event,
      updated_at: new Date().toISOString(),
    };

    // If ID is not a valid UUID format, omit it to let Supabase generate a proper UUID v4
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (payload.id && !isUUID.test(payload.id)) {
      delete payload.id;
    }

    // Ensure user_id satisfies foreign key constraint to public.profiles.id
    if (payload.user_id && !isUUID.test(payload.user_id)) {
      delete payload.user_id;
    }

    if (payload.user_id) {
      const { data: profile } = await client
        .from('profiles')
        .select('id')
        .eq('id', payload.user_id)
        .maybeSingle();

      if (!profile) {
        const { data: firstProfile } = await client
          .from('profiles')
          .select('id')
          .limit(1)
          .maybeSingle();
        if (firstProfile?.id) {
          payload.user_id = firstProfile.id;
        } else {
          delete payload.user_id;
        }
      }
    } else {
      const { data: firstProfile } = await client
        .from('profiles')
        .select('id')
        .limit(1)
        .maybeSingle();
      if (firstProfile?.id) {
        payload.user_id = firstProfile.id;
      }
    }

    // If still no user_id and supabaseAdmin is available, ensure a default host profile exists
    if (!payload.user_id && supabaseAdmin) {
      try {
        const { data: authData } = await supabaseAdmin.auth.admin.createUser({
          email: 'demo@planova.app',
          password: 'PlanovaPassword2026!',
          email_confirm: true,
          user_metadata: { full_name: 'Planova Host' },
        });
        if (authData?.user?.id) {
          await supabaseAdmin.from('profiles').upsert({
            id: authData.user.id,
            email: 'demo@planova.app',
            full_name: 'Planova Host',
            preferred_language: 'English',
            currency: 'INR',
            region: 'India',
            planning_interests: [],
            created_at: new Date().toISOString(),
          });
          payload.user_id = authData.user.id;
        }
      } catch {
        const { data: existingProfile } = await client
          .from('profiles')
          .select('id')
          .limit(1)
          .maybeSingle();
        if (existingProfile?.id) {
          payload.user_id = existingProfile.id;
        }
      }
    }

    // Ensure valid time formats for Postgres TIME columns (HH:MM:SS)
    if (payload.start_time && payload.start_time.length === 5) {
      payload.start_time = `${payload.start_time}:00`;
    }
    if (payload.end_time && payload.end_time.length === 5) {
      payload.end_time = `${payload.end_time}:00`;
    }

    const { data, error } = await client
      .from('events')
      .upsert(payload)
      .select()
      .single();

    if (error) {
      console.error('Supabase saveEvent error:', error);
      throw new Error(`Failed to save event to Supabase: ${error.message}`);
    }

    return data as EventItem;
  },

  /**
   * Permanently delete an event from Supabase (cascades to tasks, budget, vendors, guests)
   */
  async deleteEvent(id: string): Promise<{ success: boolean; deletedId: string }> {
    const client = getDbClient();
    const { error } = await client.from('events').delete().eq('id', id);

    if (error) {
      console.error('Supabase deleteEvent error:', error);
      throw new Error(`Failed to delete event from Supabase: ${error.message}`);
    }

    return { success: true, deletedId: id };
  },

  /**
   * Duplicate an event in Supabase
   */
  async duplicateEvent(id: string): Promise<EventItem | null> {
    const original = await this.getEventById(id);
    if (!original) return null;

    const duplicatePayload = {
      ...original,
      title: `${original.title} (Copy)`,
      status: 'planning' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    delete (duplicatePayload as any).id;

    const newEvent = await this.saveEvent(duplicatePayload);

    // Duplicate child tasks in Supabase
    const tasks = await this.getTasks(id);
    if (tasks.length > 0) {
      const duplicatedTasks = tasks.map((t) => {
        const copy = { ...t, event_id: newEvent.id, is_completed: false, status: 'todo' as const };
        delete (copy as any).id;
        return copy;
      });
      const client = getDbClient();
      await client.from('tasks').insert(duplicatedTasks);
    }

    return newEvent;
  },

  /**
   * Get all tasks for an event from Supabase
   */
  async getTasks(eventId: string): Promise<TaskItem[]> {
    const client = getDbClient();
    const { data, error } = await client
      .from('tasks')
      .select('*')
      .eq('event_id', eventId)
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Supabase getTasks error:', error);
      return [];
    }

    return (data || []) as TaskItem[];
  },

  /**
   * Add a task to Supabase and update event progress
   */
  async addTask(eventId: string, task: Omit<TaskItem, 'id' | 'event_id'>): Promise<{ task: TaskItem; updatedProgress: number }> {
    const client = getDbClient();
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    const taskPayload: any = {
      ...task,
      event_id: eventId,
    };
    if (taskPayload.id && !isUUID.test(taskPayload.id)) {
      delete taskPayload.id;
    }

    const { data: createdTask, error: insertError } = await client
      .from('tasks')
      .insert(taskPayload)
      .select()
      .single();

    if (insertError) {
      console.error('Supabase addTask error:', insertError);
      throw new Error(`Failed to add task to Supabase: ${insertError.message}`);
    }

    // Recalculate progress from Supabase
    const allTasks = await this.getTasks(eventId);
    const completedCount = allTasks.filter(t => t.is_completed || t.status === 'completed').length;
    const updatedProgress = allTasks.length > 0 ? Math.round((completedCount / allTasks.length) * 100) : 0;

    await client.from('events').update({ progress_percentage: updatedProgress }).eq('id', eventId);

    return { task: createdTask as TaskItem, updatedProgress };
  },

  /**
   * Update a task in Supabase
   */
  async updateTask(
    eventId: string,
    taskId: string,
    updates: Partial<TaskItem>
  ): Promise<{ task: TaskItem | null; updatedProgress: number }> {
    const client = getDbClient();
    const { data: updatedTask, error } = await client
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single();

    if (error) {
      console.error('Supabase updateTask error:', error);
      return { task: null, updatedProgress: 0 };
    }

    // Recalculate progress
    const allTasks = await this.getTasks(eventId);
    const completedCount = allTasks.filter(t => t.is_completed || t.status === 'completed').length;
    const updatedProgress = allTasks.length > 0 ? Math.round((completedCount / allTasks.length) * 100) : 0;

    await client.from('events').update({ progress_percentage: updatedProgress }).eq('id', eventId);

    return { task: updatedTask as TaskItem, updatedProgress };
  },

  /**
   * Delete a task from Supabase
   */
  async deleteTask(eventId: string, taskId: string): Promise<{ deletedId: string; updatedProgress: number }> {
    const client = getDbClient();
    const { error } = await client.from('tasks').delete().eq('id', taskId);
    if (error) {
      console.error('Supabase deleteTask error:', error);
    }

    // Recalculate progress
    const allTasks = await this.getTasks(eventId);
    const completedCount = allTasks.filter(t => t.is_completed || t.status === 'completed').length;
    const updatedProgress = allTasks.length > 0 ? Math.round((completedCount / allTasks.length) * 100) : 0;

    await client.from('events').update({ progress_percentage: updatedProgress }).eq('id', eventId);

    return { deletedId: taskId, updatedProgress };
  },

  /**
   * Get user profile from Supabase
   */
  async getProfile(userId: string): Promise<UserProfile | null> {
    const client = getDbClient();
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error || !data) return null;
    return data as UserProfile;
  },

  /**
   * Update subscription in Supabase profile
   */
  async updateSubscription(userId: string, subscription: UserSubscription): Promise<UserProfile> {
    const client = getDbClient();
    const { data, error } = await client
      .from('profiles')
      .update({ subscription, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Supabase updateSubscription error:', error);
      throw new Error(`Failed to update subscription in Supabase: ${error.message}`);
    }

    return data as UserProfile;
  },
};
