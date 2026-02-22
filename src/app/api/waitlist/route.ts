import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, offer_id, monthly_price, flex_score, coverage_cap, city, state } = await request.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    let position = Math.floor(Math.random() * 200) + 247;

    if (isSupabaseConfigured() && supabase) {
      await supabase
        .from('waitlist')
        .upsert({
          email: email.toLowerCase().trim(),
          name: name?.trim() || null,
          phone: phone?.trim() || null,
          offer_id,
          monthly_price,
          flex_score,
          coverage_cap,
          city,
          state,
        }, { onConflict: 'email' });

      // Get approximate position
      const { count } = await supabase
        .from('waitlist')
        .select('*', { count: 'exact', head: true });
      if (count) position = count;
    }

    console.log(`[WAITLIST] ${name} (${email}) ${phone || ''} — ${city}, ${state} — Flex Score: ${flex_score} — $${monthly_price}/mo`);

    return NextResponse.json({ success: true, position });
  } catch (err) {
    console.error('Waitlist error:', err);
    return NextResponse.json(
      { error: 'Failed to join waitlist' },
      { status: 500 }
    );
  }
}
