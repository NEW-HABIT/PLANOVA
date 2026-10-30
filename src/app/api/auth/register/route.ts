import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email, password, fullName } = await req.json();

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { success: false, error: 'Full name, email, and password are required.' },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured() || !supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: 'Supabase database is not configured.' },
        { status: 500 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();

    // 1. Create user in Supabase Auth (confirmed email)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: cleanEmail,
      password: password,
      email_confirm: true,
      user_metadata: { full_name: cleanName },
    });

    let userId = authData?.user?.id;

    if (authError) {
      if (authError.message.includes('already registered')) {
        return NextResponse.json(
          { success: false, error: 'An account with this email already exists in Supabase. Please sign in.' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { success: false, error: authError.message },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Failed to create user in Supabase.' },
        { status: 500 }
      );
    }

    // 2. Create Profile row in public.profiles table in Supabase
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: userId,
        email: cleanEmail,
        full_name: cleanName,
        preferred_language: 'English',
        currency: 'INR',
        region: 'India',
        planning_interests: ['wedding', 'birthday', 'corporate'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (profileError) {
      console.error('Supabase profile creation error:', profileError);
    }

    return NextResponse.json({
      success: true,
      user: profile || {
        id: userId,
        email: cleanEmail,
        full_name: cleanName,
        preferred_language: 'English',
        currency: 'INR',
        region: 'India',
        planning_interests: [],
        created_at: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error('Registration API error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Registration failed' },
      { status: 500 }
    );
  }
}

