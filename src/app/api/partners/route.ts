import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { name, email, company, units, message } = await request.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    if (isSupabaseConfigured() && supabase) {
      await supabase.from('partner_inquiries').insert({
        name: name?.trim() || null,
        email: email.toLowerCase().trim(),
        company: company?.trim() || null,
        units: units || null,
        message: message?.trim() || null,
      });
    }

    console.log(`[PARTNER] ${name} (${email}) — ${company || 'No company'} — ${units || '?'} units`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Partner inquiry error:', err);
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}
