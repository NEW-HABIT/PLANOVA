import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, error: 'Supabase database is not configured.' },
        { status: 500 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const client = supabaseAdmin || supabase;
    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Supabase database is not configured.' },
        { status: 500 }
      );
    }

    // Authenticate with Supabase Auth
    const { data: authData, error: authError } = await client.auth.signInWithPassword({
      email: cleanEmail,
      password: password,
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { success: false, error: authError?.message || 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const userId = authData.user.id;

    // Fetch user profile from public.profiles in Supabase
    let { data: profile } = await client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (!profile) {
      // Auto-create profile if missing
      const { data: newProfile } = await client
        .from('profiles')
        .upsert({
          id: userId,
          email: cleanEmail,
          full_name: authData.user.user_metadata?.full_name || cleanEmail.split('@')[0],
          preferred_language: 'English',
          currency: 'INR',
          region: 'India',
          planning_interests: [],
        })
        .select()
        .single();
      profile = newProfile;
    }

    return NextResponse.json({
      success: true,
      user: profile || {
        id: userId,
        email: cleanEmail,
        full_name: authData.user.user_metadata?.full_name || 'Host',
        preferred_language: 'English',
        currency: 'INR',
        region: 'India',
        planning_interests: [],
      },
      token: authData.session?.access_token,
    });
  } catch (err: any) {
    console.error('Login API error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Login failed' },
      { status: 500 }
    );
  }
}
