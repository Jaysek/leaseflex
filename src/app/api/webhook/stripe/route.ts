import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !sig) {
    return NextResponse.json({ error: 'Not configured' }, { status: 400 });
  }

  const stripe = new Stripe(stripeKey);

  let event: Stripe.Event;
  try {
    event = webhookSecret
      ? stripe.webhooks.constructEvent(body, sig, webhookSecret)
      : JSON.parse(body) as Stripe.Event;
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const db = isSupabaseConfigured() ? supabase : null;

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const offerId = session.metadata?.offer_id;
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;
      const email = session.customer_details?.email || session.customer_email;

      console.log(`[Stripe] Checkout completed: offer=${offerId} sub=${subscriptionId}`);

      if (db && offerId) {
        await db.from('offers').update({ status: 'started_checkout' }).eq('id', offerId);

        await db.from('subscriptions').upsert({
          offer_id: offerId,
          email: email || '',
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          status: 'active',
          current_period_start: new Date().toISOString(),
        }, { onConflict: 'stripe_subscription_id' });
      }
      break;
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as unknown as Record<string, unknown>;
      console.log(`[Stripe] Subscription updated: ${sub.id} status=${sub.status}`);

      if (db) {
        const status = sub.status === 'active' ? 'active'
          : sub.status === 'past_due' ? 'past_due'
          : sub.status === 'canceled' ? 'cancelled'
          : 'paused';

        const periodStart = typeof sub.current_period_start === 'number' ? new Date(sub.current_period_start * 1000).toISOString() : null;
        const periodEnd = typeof sub.current_period_end === 'number' ? new Date(sub.current_period_end * 1000).toISOString() : null;
        const cancelledAt = typeof sub.canceled_at === 'number' ? new Date(sub.canceled_at * 1000).toISOString() : null;

        await db.from('subscriptions').update({
          status,
          current_period_start: periodStart,
          current_period_end: periodEnd,
          cancelled_at: cancelledAt,
        }).eq('stripe_subscription_id', sub.id as string);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      console.log(`[Stripe] Subscription cancelled: ${sub.id}`);

      if (db) {
        await db.from('subscriptions').update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
        }).eq('stripe_subscription_id', sub.id);
      }
      break;
    }

    default:
      console.log(`[Stripe] Unhandled event: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
