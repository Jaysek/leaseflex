import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'Missing offer ID' }, { status: 400 });
  }

  if (!isSupabaseConfigured() || !supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const { data, error } = await supabase
    .from('offers')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
  }

  // Map DB columns to OfferPayload shape
  return NextResponse.json({
    id: data.id,
    created_at: data.created_at,
    monthly_rent: data.monthly_rent,
    address: data.address,
    city: data.city,
    state: data.state,
    lease_start_date: data.lease_start_date,
    lease_end_date: data.lease_end_date,
    months_remaining: data.months_remaining,
    termination_fee_known: data.termination_fee_known,
    termination_fee_amount: data.termination_fee_amount,
    sublet_allowed: data.sublet_allowed,
    risk_score: data.risk_score,
    flex_score: data.flex_score,
    monthly_price: data.monthly_price,
    coverage_cap: data.coverage_cap,
    deductible: data.deductible,
    waiting_period_days: data.waiting_period_days,
    status: data.status,
    requires_manual_review: data.months_remaining <= 3,
    requires_concierge: data.monthly_rent >= 15000,
  });
}
