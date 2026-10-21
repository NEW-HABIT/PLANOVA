export type EventCategory =
  | 'wedding'
  | 'birthday'
  | 'anniversary'
  | 'engagement'
  | 'college_fest'
  | 'corporate'
  | 'community'
  | 'other';

export type EventStatus = 'draft' | 'planning' | 'confirmed' | 'completed' | 'archived';

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'blocked';

export type RSVPStatus = 'attending' | 'declined' | 'pending' | 'maybe';

export type VendorCategory =
  | 'venue'
  | 'catering'
  | 'decoration'
  | 'photography'
  | 'videography'
  | 'makeup_artist'
  | 'dj_entertainment'
  | 'transportation'
  | 'accommodation'
  | 'invitations'
  | 'gifts'
  | 'other';

export type VendorBookingStatus =
  | 'researching'
  | 'contacted'
  | 'quoted'
  | 'shortlisted'
  | 'booked'
  | 'declined';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  preferred_language: string;
  currency: Currency;
  region: string;
  planning_interests: EventCategory[];
  created_at: string;
}

export interface EventItem {
  id: string;
  user_id: string;
  title: string;
  category: EventCategory;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  city: string;
  is_indoor: boolean;
  expected_guests: number;
  total_budget: number;
  currency: Currency;
  is_budget_strict: boolean;
  emergency_reserve_percentage: number;
  status: EventStatus;
  progress_percentage: number;
  cover_image: string;
  created_at: string;
  updated_at: string;
}

export interface EventPreferences {
  event_id: string;
  theme_preference: string;
  color_palette: string[];
  style: 'formal' | 'elegant' | 'traditional' | 'modern' | 'minimalist' | 'fun' | 'luxury';
  food_preferences: string[];
  cultural_preferences: string;
  accessibility_requirements: string;
  special_requests: string;
  priorities: {
    food: number;
    venue: number;
    decoration: number;
    photography: number;
    entertainment: number;
    guest_experience: number;
    sustainability: number;
  };
}

export interface BudgetCategoryItem {
  id: string;
  event_id: string;
  name: string;
  category: VendorCategory | 'emergency_reserve' | 'miscellaneous';
  allocated_amount: number;
  percentage: number;
  spent_amount: number;
  color: string;
}

export interface ExpenseItem {
  id: string;
  event_id: string;
  category_id: string;
  title: string;
  amount: number;
  date: string;
  payment_status: 'paid' | 'pending' | 'partially_paid';
  vendor_name?: string;
  notes?: string;
}

export interface TaskItem {
  id: string;
  event_id: string;
  title: string;
  description: string;
  due_date: string;
  priority: Priority;
  status: TaskStatus;
  assignee: string;
  estimated_cost?: number;
  is_completed: boolean;
  category?: string;
}

export interface VendorItem {
  id: string;
  event_id: string;
  name: string;
  category: VendorCategory;
  contact_phone: string;
  contact_email: string;
  website?: string;
  location: string;
  price_estimate: number;
  quoted_price?: number;
  services: string[];
  notes?: string;
  rating: number; // 1-5
  booking_status: VendorBookingStatus;
  payment_terms?: string;
  is_verified?: boolean;
}

export interface GuestItem {
  id: string;
  event_id: string;
  full_name: string;
  email: string;
  phone: string;
  rsvp_status: RSVPStatus;
  group: 'family' | 'friends' | 'colleagues' | 'vip' | 'general';
  dietary_requirements?: string;
  accessibility?: string;
  plus_one: boolean;
  plus_one_name?: string;
  attendance_count: number;
  invitation_sent: boolean;
}

export interface CreativeAssetItem {
  id: string;
  event_id: string;
  asset_type:
    | 'theme'
    | 'invitation'
    | 'menu'
    | 'decor'
    | 'speech'
    | 'social_post'
    | 'schedule';
  title: string;
  content: string;
  tags: string[];
  created_at: string;
}

export interface AIMessageItem {
  id: string;
  event_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  action_type?: 'create_task' | 'update_budget' | 'suggest_vendor';
  action_payload?: any;
  created_at: string;
}

export interface CompletedEventReview {
  id: string;
  event_id?: string;
  title: string;
  category: string;
  tag?: string;
  location: string;
  budget: string;
  guests: number;
  owner_name: string;
  owner_avatar?: string;
  owner_review: string;
  rating: number; // 1-5
  savings_achieved?: string;
  highlight?: string;
  gallery_images: string[];
  created_at: string;
}

export interface GeneratedPlan {
  overview: string;
  theme_concept: {
    title: string;
    description: string;
    colors: string[];
    style_keywords: string[];
  };
  budget_breakdown: Array<{
    category: string;
    percentage: number;
    amount: number;
    rationale: string;
  }>;
  milestones: Array<{
    title: string;
    due_week: string;
    description: string;
    priority: Priority;
  }>;
  vendor_selection_criteria: Array<{
    category: string;
    key_questions: string[];
    budget_range: string;
  }>;
  task_checklist: Array<{
    title: string;
    description: string;
    priority: Priority;
    phase: string;
  }>;
  day_schedule: Array<{
    time: string;
    activity: string;
    responsibility: string;
    location_or_notes: string;
  }>;
  menu_suggestions: Array<{
    course: string;
    items: string[];
    specialty_notes: string;
  }>;
  decor_concepts: Array<{
    zone: string;
    concept: string;
    materials: string;
  }>;
  contingencies: Array<{
    risk: string;
    mitigation: string;
  }>;
}
