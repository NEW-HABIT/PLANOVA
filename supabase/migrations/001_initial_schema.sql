-- ==============================================================================
-- PLANOVA DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- File: supabase/migrations/001_initial_schema.sql
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  preferred_language TEXT DEFAULT 'English',
  currency TEXT DEFAULT 'INR',
  region TEXT DEFAULT 'India',
  planning_interests TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('wedding', 'birthday', 'anniversary', 'engagement', 'college_fest', 'corporate', 'community', 'other')),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  is_indoor BOOLEAN DEFAULT TRUE,
  expected_guests INTEGER NOT NULL DEFAULT 50,
  total_budget NUMERIC(12, 2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',
  is_budget_strict BOOLEAN DEFAULT TRUE,
  emergency_reserve_percentage NUMERIC(5, 2) DEFAULT 8.00,
  status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('draft', 'planning', 'confirmed', 'completed', 'archived')),
  progress_percentage INTEGER DEFAULT 0,
  cover_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. EVENT PREFERENCES
CREATE TABLE IF NOT EXISTS public.event_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL UNIQUE REFERENCES public.events(id) ON DELETE CASCADE,
  theme_preference TEXT,
  color_palette TEXT[] DEFAULT '{}',
  style TEXT DEFAULT 'elegant',
  food_preferences TEXT[] DEFAULT '{}',
  cultural_preferences TEXT,
  accessibility_requirements TEXT,
  special_requests TEXT,
  priorities JSONB DEFAULT '{"venue": 5, "food": 5, "decoration": 4, "photography": 4, "entertainment": 3}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BUDGET CATEGORIES
CREATE TABLE IF NOT EXISTS public.budget_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  allocated_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  percentage NUMERIC(5, 2) NOT NULL DEFAULT 0,
  spent_amount NUMERIC(12, 2) DEFAULT 0,
  color TEXT DEFAULT '#4338CA',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. EXPENSES
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.budget_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('paid', 'pending', 'partially_paid')),
  vendor_name TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TASKS
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'completed', 'blocked')),
  assignee TEXT,
  estimated_cost NUMERIC(12, 2),
  is_completed BOOLEAN DEFAULT FALSE,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. VENDORS & EVENT_VENDORS
CREATE TABLE IF NOT EXISTS public.vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  contact_phone TEXT,
  contact_email TEXT,
  website TEXT,
  location TEXT,
  price_estimate NUMERIC(12, 2) DEFAULT 0,
  quoted_price NUMERIC(12, 2),
  services TEXT[] DEFAULT '{}',
  notes TEXT,
  rating NUMERIC(2, 1) DEFAULT 5.0,
  booking_status TEXT NOT NULL DEFAULT 'researching' CHECK (booking_status IN ('researching', 'contacted', 'quoted', 'shortlisted', 'booked', 'declined')),
  payment_terms TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. GUESTS
CREATE TABLE IF NOT EXISTS public.guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  rsvp_status TEXT NOT NULL DEFAULT 'pending' CHECK (rsvp_status IN ('attending', 'declined', 'pending', 'maybe')),
  group_type TEXT DEFAULT 'general' CHECK (group_type IN ('family', 'friends', 'colleagues', 'vip', 'general')),
  dietary_requirements TEXT,
  accessibility TEXT,
  plus_one BOOLEAN DEFAULT FALSE,
  plus_one_name TEXT,
  attendance_count INTEGER DEFAULT 1,
  invitation_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. COLLABORATIONS
CREATE TABLE IF NOT EXISTS public.collaborations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('owner', 'editor', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- 10. GENERATED ASSETS (Creative Studio)
CREATE TABLE IF NOT EXISTS public.generated_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  asset_type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. AI MESSAGES & CONVERSATIONS
CREATE TABLE IF NOT EXISTS public.ai_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  action_type TEXT,
  action_payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_events_user_id ON public.events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);
CREATE INDEX IF NOT EXISTS idx_budget_categories_event_id ON public.budget_categories(event_id);
CREATE INDEX IF NOT EXISTS idx_expenses_event_id ON public.expenses(event_id);
CREATE INDEX IF NOT EXISTS idx_tasks_event_id ON public.tasks(event_id);
CREATE INDEX IF NOT EXISTS idx_vendors_event_id ON public.vendors(event_id);
CREATE INDEX IF NOT EXISTS idx_guests_event_id ON public.guests(event_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_event_id ON public.ai_messages(event_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper function: check if user is collaborator with minimum role
CREATE OR REPLACE FUNCTION public.check_user_event_access(p_event_id UUID, p_user_id UUID, p_required_role TEXT DEFAULT 'viewer')
RETURNS BOOLEAN AS $$
BEGIN
  -- If user is the event owner
  IF EXISTS (SELECT 1 FROM public.events WHERE id = p_event_id AND user_id = p_user_id) THEN
    RETURN TRUE;
  END IF;

  -- If user is collaborator
  IF p_required_role = 'viewer' THEN
    RETURN EXISTS (SELECT 1 FROM public.collaborations WHERE event_id = p_event_id AND user_id = p_user_id);
  ELSIF p_required_role = 'editor' THEN
    RETURN EXISTS (SELECT 1 FROM public.collaborations WHERE event_id = p_event_id AND user_id = p_user_id AND role IN ('editor', 'owner'));
  ELSIF p_required_role = 'owner' THEN
    RETURN EXISTS (SELECT 1 FROM public.collaborations WHERE event_id = p_event_id AND user_id = p_user_id AND role = 'owner');
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: users can read and update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Events: users can access events they own or collaborate on
CREATE POLICY "Users can view accessible events" ON public.events FOR SELECT USING (
  user_id = auth.uid() OR public.check_user_event_access(id, auth.uid(), 'viewer')
);
CREATE POLICY "Users can insert their own events" ON public.events FOR INSERT WITH CHECK (
  user_id = auth.uid()
);
CREATE POLICY "Owners and editors can update events" ON public.events FOR UPDATE USING (
  user_id = auth.uid() OR public.check_user_event_access(id, auth.uid(), 'editor')
);
CREATE POLICY "Only owners can delete events" ON public.events FOR DELETE USING (
  user_id = auth.uid()
);

-- Child tables policies (Budget, Tasks, Vendors, Guests, Creative Assets, AI Messages)
CREATE POLICY "Access budget categories" ON public.budget_categories FOR ALL USING (
  public.check_user_event_access(event_id, auth.uid(), 'viewer')
);

CREATE POLICY "Access expenses" ON public.expenses FOR ALL USING (
  public.check_user_event_access(event_id, auth.uid(), 'viewer')
);

CREATE POLICY "Access tasks" ON public.tasks FOR ALL USING (
  public.check_user_event_access(event_id, auth.uid(), 'viewer')
);

CREATE POLICY "Access vendors" ON public.vendors FOR ALL USING (
  public.check_user_event_access(event_id, auth.uid(), 'viewer')
);

CREATE POLICY "Access guests" ON public.guests FOR ALL USING (
  public.check_user_event_access(event_id, auth.uid(), 'viewer')
);

CREATE POLICY "Access creative assets" ON public.generated_assets FOR ALL USING (
  public.check_user_event_access(event_id, auth.uid(), 'viewer')
);

CREATE POLICY "Access AI messages" ON public.ai_messages FOR ALL USING (
  public.check_user_event_access(event_id, auth.uid(), 'viewer')
);

CREATE POLICY "Access notifications" ON public.notifications FOR ALL USING (
  user_id = auth.uid()
);
