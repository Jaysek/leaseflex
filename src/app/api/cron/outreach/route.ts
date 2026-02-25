import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getResend, isResendConfigured } from '@/lib/resend';
import { nextStep, getTemplate, statusAfterStep, daysBeforeStep } from '@/lib/outreach-templates';

const DAILY_SEND_LIMIT = 5; // Shared limit with manual sends
const DELAY_BETWEEN_SENDS_MS = 60_000; // 1 minute between emails

/**
 * GET /api/cron/outreach
 * Runs daily via Vercel Cron. Sends follow-up emails to prospects
 * who haven't replied, respecting daily send limits.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isSupabaseConfigured() || !supabase) {
    return NextResponse.json({ error: 'DB not configured' }, { status: 500 });
  }

  // Check daily send count
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { count: sentToday } = await supabase
    .from('outreach_emails')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', todayStart.toISOString());

  const remaining = Math.max(0, DAILY_SEND_LIMIT - (sentToday || 0));

  if (remaining === 0) {
    return NextResponse.json({ followed_up: 0, message: 'Daily limit reached' });
  }

  // Fetch prospects eligible for follow-up
  const { data: prospects, error } = await supabase
    .from('outreach_prospects')
    .select('*')
    .in('status', ['sent', 'followed_up_1'])
    .not('last_contacted_at', 'is', null)
    .limit(remaining);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!prospects || prospects.length === 0) {
    return NextResponse.json({ followed_up: 0, message: 'No prospects due for follow-up' });
  }

  const resend = isResendConfigured() ? getResend() : null;
  const now = new Date();
  let followedUp = 0;

  for (const prospect of prospects) {
    const step = nextStep(prospect.status);
    if (!step) continue;

    const lastContact = new Date(prospect.last_contacted_at);
    const daysSince = (now.getTime() - lastContact.getTime()) / (1000 * 60 * 60 * 24);
    const requiredDays = daysBeforeStep(step as 'follow_up_1' | 'follow_up_2');

    if (daysSince < requiredDays) continue;

    // Space out sends
    if (followedUp > 0) {
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_SENDS_MS));
    }

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
      } catch (err) {
        console.error(`[OUTREACH CRON] Failed to send to ${prospect.email}:`, err);
        continue;
      }
    } else {
      console.log(`[OUTREACH CRON STUB] Would follow up ${prospect.email}: "${subject}"`);
    }

    await supabase
      .from('outreach_prospects')
      .update({ status: statusAfterStep(step), last_contacted_at: now.toISOString() })
      .eq('id', prospect.id);

    await supabase.from('outreach_emails').insert({
      prospect_id: prospect.id,
      step,
      subject,
      resend_id: resendId,
    });

    followedUp++;
  }

  return NextResponse.json({ followed_up: followedUp, sent_today: (sentToday || 0) + followedUp, limit: DAILY_SEND_LIMIT });
}
