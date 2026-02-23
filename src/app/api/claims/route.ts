import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, offer_id, event_type, event_description, event_date } = await request.json();

    if (!email || !event_type || !event_description || !event_date) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const validTypes = ['job_relocation', 'job_loss', 'medical', 'domestic_violence', 'other'];
    if (!validTypes.includes(event_type)) {
      return NextResponse.json(
        { error: 'Invalid event type' },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured() && supabase) {
      // Find the subscription for this email
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('email', email.toLowerCase().trim())
        .eq('status', 'active')
        .single();

      const { data, error } = await supabase
        .from('claims')
        .insert({
          email: email.toLowerCase().trim(),
          offer_id: offer_id || null,
          subscription_id: subscription?.id || null,
          event_type,
          event_description,
          event_date,
          status: 'submitted',
        })
        .select()
        .single();

      if (error) {
        console.error('Claims insert error:', error);
        return NextResponse.json({ error: 'Failed to submit claim' }, { status: 500 });
      }

      return NextResponse.json({ success: true, claim_id: data.id });
    }

    // Fallback without Supabase
    console.log(`[CLAIM] ${email} — ${event_type} — ${event_date}`);
    return NextResponse.json({ success: true, claim_id: crypto.randomUUID() });
  } catch (err) {
    console.error('Claims error:', err);
    return NextResponse.json({ error: 'Failed to submit claim' }, { status: 500 });
  }
}
