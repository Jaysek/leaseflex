import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getStripe, isStripeConfigured } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { offer_id, monthly_price, city, state } = await request.json();

    if (!offer_id) {
      return NextResponse.json(
        { error: 'offer_id is required' },
        { status: 400 }
      );
    }

    // Update status in Supabase
    if (isSupabaseConfigured() && supabase) {
      await supabase
        .from('offers')
        .update({ status: 'started_checkout' })
        .eq('id', offer_id);
    }

    // If Stripe is configured, create a real Checkout Session
    if (isStripeConfigured()) {
      const stripe = getStripe()!;
      const origin = request.headers.get('origin') || 'http://localhost:3000';
      const priceInCents = Math.round((monthly_price || 19) * 100);

      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              recurring: { interval: 'month' },
              product_data: {
                name: 'LeaseFlex Mobility Protection',
                description: city && state
                  ? `Lease flexibility coverage — ${city}, ${state}`
                  : 'Lease flexibility coverage',
              },
              unit_amount: priceInCents,
            },
            quantity: 1,
          },
        ],
        metadata: { offer_id },
        success_url: `${origin}/quote/${offer_id}?checkout=success`,
        cancel_url: `${origin}/quote/${offer_id}?checkout=cancelled`,
      });

      return NextResponse.json({
        success: true,
        checkout_url: session.url,
      });
    }

    // Fallback: no Stripe key configured
    console.log(`[STUB] Would create Stripe checkout for offer ${offer_id}`);

    return NextResponse.json({
      success: true,
      checkout_url: null,
      message: 'Checkout started (Stripe not configured — stub mode)',
    });
  } catch (err) {
    console.error('Checkout error:', err);
    return NextResponse.json(
      { error: 'Failed to start checkout' },
      { status: 500 }
    );
  }
}
