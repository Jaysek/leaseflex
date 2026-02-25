import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

/** GET /api/outreach/unsubscribe?email=... — CAN-SPAM unsubscribe handler */
export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email');

  if (email && isSupabaseConfigured() && supabase) {
    await supabase
      .from('outreach_prospects')
      .update({ status: 'unsubscribed' })
      .eq('email', email.toLowerCase().trim());
  }

  return new NextResponse(
    `<html>
      <body style="font-family: -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #fafafa;">
        <div style="text-align: center; padding: 40px;">
          <h1 style="font-size: 20px; color: #171717; margin-bottom: 8px;">Unsubscribed</h1>
          <p style="font-size: 14px; color: #737373;">You won't receive any more emails from us.</p>
        </div>
      </body>
    </html>`,
    { headers: { 'Content-Type': 'text/html' } }
  );
}
