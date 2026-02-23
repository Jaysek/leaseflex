import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return unauthorized();
  }

  if (!isSupabaseConfigured() || !supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  // Fetch all data in parallel
  const [offersRes, waitlistRes, subscriptionsRes, claimsRes, partnersRes] = await Promise.all([
    supabase.from('offers').select('id, created_at, full_name, email, rent, address, city, state, monthly_price, coverage_cap, flex_score, status').order('created_at', { ascending: false }).limit(100),
    supabase.from('waitlist').select('id, created_at, email, name, phone, offer_id, monthly_price, flex_score, coverage_cap, city, state, drip_step').order('created_at', { ascending: false }).limit(100),
    supabase.from('subscriptions').select('id, created_at, email, status, stripe_subscription_id, current_period_end').order('created_at', { ascending: false }).limit(100),
    supabase.from('claims').select('id, created_at, email, event_type, event_description, status, payout_amount').order('created_at', { ascending: false }).limit(100),
    supabase.from('partner_inquiries').select('id, created_at, name, email, company, units, message').order('created_at', { ascending: false }).limit(100),
  ]);

  return NextResponse.json({
    offers: offersRes.data || [],
    waitlist: waitlistRes.data || [],
    subscriptions: subscriptionsRes.data || [],
    claims: claimsRes.data || [],
    partners: partnersRes.data || [],
    counts: {
      offers: offersRes.data?.length || 0,
      waitlist: waitlistRes.data?.length || 0,
      subscriptions: subscriptionsRes.data?.length || 0,
      claims: claimsRes.data?.length || 0,
      partners: partnersRes.data?.length || 0,
    },
  });
}
