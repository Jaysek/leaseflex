import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

function auth(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  return secret && secret === process.env.ADMIN_SECRET;
}

/** GET — list all prospects */
export async function GET(request: NextRequest) {
  if (!auth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isSupabaseConfigured() || !supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 500 });

  const { data, error } = await supabase
    .from('outreach_prospects')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Fetch email tracking stats
  const { data: emails } = await supabase
    .from('outreach_emails')
    .select('prospect_id, step, delivered_at, opened_at, clicked_at, bounced_at, complained_at, created_at')
    .order('created_at', { ascending: false });

  // Aggregate stats per prospect
  const emailStats: Record<string, { sent: number; delivered: number; opened: number; clicked: number; bounced: number; last_step: string }> = {};
  for (const e of emails || []) {
    if (!emailStats[e.prospect_id]) {
      emailStats[e.prospect_id] = { sent: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0, last_step: e.step };
    }
    const s = emailStats[e.prospect_id];
    s.sent++;
    if (e.delivered_at) s.delivered++;
    if (e.opened_at) s.opened++;
    if (e.clicked_at) s.clicked++;
    if (e.bounced_at) s.bounced++;
  }

  // Global totals
  const allEmails = emails || [];
  const totals = {
    total_sent: allEmails.length,
    total_delivered: allEmails.filter(e => e.delivered_at).length,
    total_opened: allEmails.filter(e => e.opened_at).length,
    total_clicked: allEmails.filter(e => e.clicked_at).length,
    total_bounced: allEmails.filter(e => e.bounced_at).length,
    total_complained: allEmails.filter(e => e.complained_at).length,
  };

  return NextResponse.json({ prospects: data, emailStats, totals });
}

/** POST — add one or many prospects */
export async function POST(request: NextRequest) {
  if (!auth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isSupabaseConfigured() || !supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 500 });

  const body = await request.json();
  const prospects: { name: string; email: string; company?: string; city?: string; state?: string; units?: string; source?: string }[] =
    Array.isArray(body) ? body : [body];

  // Validate
  const valid = prospects.filter(p => p.name && p.email);
  if (valid.length === 0) {
    return NextResponse.json({ error: 'Each prospect needs at least name and email' }, { status: 400 });
  }

  const rows = valid.map(p => ({
    name: p.name,
    email: p.email.toLowerCase().trim(),
    company: p.company || null,
    city: p.city || null,
    state: p.state || null,
    units: p.units || null,
    source: p.source || 'manual',
    status: 'queued',
  }));

  const { data, error } = await supabase
    .from('outreach_prospects')
    .upsert(rows, { onConflict: 'email', ignoreDuplicates: true })
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ added: data?.length || 0, prospects: data });
}
