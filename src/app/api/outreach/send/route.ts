import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getResend, isResendConfigured } from '@/lib/resend';
import { getTemplate, statusAfterStep } from '@/lib/outreach-templates';

const DAILY_SEND_LIMIT = 5; // Max cold emails per day for domain warmup
const DELAY_BETWEEN_SENDS_MS = 60_000; // 1 minute between emails

/**
 * POST /api/outreach/send
 * Sends initial outreach emails to queued prospects.
 * Throttled to DAILY_SEND_LIMIT per day for domain warmup.
 */
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isSupabaseConfigured() || !supabase) {
    return NextResponse.json({ error: 'DB not configured' }, { status: 500 });
  }

  // Check how many emails we've already sent today
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { count: sentToday } = await supabase
    .from('outreach_emails')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', todayStart.toISOString());

  const remaining = Math.max(0, DAILY_SEND_LIMIT - (sentToday || 0));

  if (remaining === 0) {
    return NextResponse.json({
      sent: 0,
      message: `Daily limit reached (${DAILY_SEND_LIMIT}/day). Try again tomorrow.`,
      sent_today: sentToday,
      limit: DAILY_SEND_LIMIT,
    });
  }

  // Fetch queued prospects, limited to remaining daily quota
  const { data: prospects, error } = await supabase
    .from('outreach_prospects')
    .select('*')
    .eq('status', 'queued')
    .limit(remaining);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!prospects || prospects.length === 0) {
    return NextResponse.json({ sent: 0, message: 'No queued prospects' });
  }

  const resend = isResendConfigured() ? getResend() : null;
  const results: { email: string; success: boolean; error?: string }[] = [];

  for (let i = 0; i < prospects.length; i++) {
    const prospect = prospects[i];

    // Space out sends (skip delay for first email)
    if (i > 0) {
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_SENDS_MS));
    }

    const step = 'initial' as const;
    const { subject, html } = getTemplate(step, {
      name: prospect.name,
      company: prospect.company,
      city: prospect.city,
      state: prospect.state,
    });

    const unsubUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://leaseflex.io'}/api/outreach/unsubscribe?email=${encodeURIComponent(prospect.email)}`;
    const finalHtml = html.replace('{{unsubscribe_url}}', unsubUrl);

    let resendId: string | null = null;

    if (resend) {
      try {
        const { data: emailData } = await resend.emails.send({
          from: 'Justin at LeaseFlex <justin@leaseflex.io>',
          to: prospect.email,
          subject,
          html: finalHtml,
        });
        resendId = emailData?.id || null;
        results.push({ email: prospect.email, success: true });
      } catch (err) {
        results.push({ email: prospect.email, success: false, error: String(err) });
        continue;
      }
    } else {
      console.log(`[OUTREACH STUB] Would send to ${prospect.email}: "${subject}"`);
      results.push({ email: prospect.email, success: true });
    }

    await supabase
      .from('outreach_prospects')
      .update({ status: statusAfterStep(step), last_contacted_at: new Date().toISOString() })
      .eq('id', prospect.id);

    await supabase.from('outreach_emails').insert({
      prospect_id: prospect.id,
      step,
      subject,
      resend_id: resendId,
    });
  }

  return NextResponse.json({
    sent: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    sent_today: (sentToday || 0) + results.filter(r => r.success).length,
    limit: DAILY_SEND_LIMIT,
    results,
  });
}
