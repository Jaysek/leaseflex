import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }

  if (!isSupabaseConfigured() || !supabase) {
    return NextResponse.json({ subscription: null, claims: [] });
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Get subscription with offer details
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('id, status, current_period_end, offer_id')
    .eq('email', normalizedEmail)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  let subWithOffer = null;
  if (subscription) {
    const { data: offer } = await supabase
      .from('offers')
      .select('monthly_price, coverage_cap, waiting_period_days, address, city, state, flex_score, months_remaining')
      .eq('id', subscription.offer_id)
      .single();

    subWithOffer = {
      ...subscription,
      offer: offer || null,
    };
  }

  // Get claims
  const { data: claims } = await supabase
    .from('claims')
    .select('id, status, event_type, created_at')
    .eq('email', normalizedEmail)
    .order('created_at', { ascending: false });

  return NextResponse.json({
    subscription: subWithOffer,
    claims: claims || [],
  });
}
