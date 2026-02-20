import { NextRequest, NextResponse } from 'next/server';
import { generateOffer } from '@/lib/quote';
import { validateQuoteInput } from '@/lib/types';
import type { QuoteInput } from '@/lib/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as QuoteInput;

    const errors = validateQuoteInput(body);
    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const offer = generateOffer(body);

    // Save to Supabase if configured
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('offers')
        .insert({
          monthly_rent: offer.monthly_rent,
          address: offer.address,
          city: offer.city,
          state: offer.state,
          lease_start_date: offer.lease_start_date,
          lease_end_date: offer.lease_end_date,
          months_remaining: offer.months_remaining,
          termination_fee_known: offer.termination_fee_known,
          termination_fee_amount: offer.termination_fee_amount,
          sublet_allowed: offer.sublet_allowed,
          risk_score: offer.risk_score,
          flex_score: offer.flex_score,
          monthly_price: offer.monthly_price,
          coverage_cap: offer.coverage_cap,
          deductible: offer.deductible,
          waiting_period_days: offer.waiting_period_days,
          status: offer.status,
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
      } else if (data) {
        offer.id = data.id;
        offer.created_at = data.created_at;
      }
    } else {
      // Generate a local ID for dev without Supabase
      offer.id = crypto.randomUUID();
      offer.created_at = new Date().toISOString();
    }

    return NextResponse.json(offer);
  } catch (err) {
    console.error('Quote API error:', err);
    return NextResponse.json(
      { error: 'Failed to generate offer' },
      { status: 500 }
    );
  }
}
