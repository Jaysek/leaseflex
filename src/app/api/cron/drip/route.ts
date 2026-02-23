import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getResend, isResendConfigured } from '@/lib/resend';

// Vercel Cron: runs daily
export const runtime = 'nodejs';

const DRIP_EMAILS = [
  {
    step: 1,
    delay_days: 1,
    subject: 'Welcome to LeaseFlex',
    html: (name: string) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
        <h1 style="font-size: 24px; font-weight: 700; color: #171717; margin: 0 0 16px;">Hey ${name || 'there'},</h1>
        <p style="font-size: 15px; color: #525252; line-height: 1.6; margin: 0 0 16px;">Thanks for checking out LeaseFlex. You took the first step toward protecting yourself from expensive lease-break penalties.</p>
        <p style="font-size: 15px; color: #525252; line-height: 1.6; margin: 0 0 16px;">We're building something renters have needed for a long time &mdash; the ability to move when life changes, without the financial hit.</p>
        <p style="font-size: 15px; color: #525252; line-height: 1.6; margin: 0 0 24px;">Your personalized offer is locked in. When we launch, you'll be first in line.</p>
        <p style="font-size: 15px; color: #171717; font-weight: 600;">— Justin, Founder of LeaseFlex</p>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5;">
          <p style="font-size: 11px; color: #a3a3a3;">LeaseFlex &mdash; Mobility protection for renters</p>
        </div>
      </div>
    `,
  },
  {
    step: 2,
    delay_days: 4,
    subject: 'Did you know the average lease break costs $4,200?',
    html: (name: string) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
        <h1 style="font-size: 24px; font-weight: 700; color: #171717; margin: 0 0 16px;">${name ? `${name}, here's` : "Here's"} what most renters don't realize</h1>
        <p style="font-size: 15px; color: #525252; line-height: 1.6; margin: 0 0 16px;">The average cost to break a lease in the U.S. is <strong style="color: #171717;">$4,200</strong>. That's 2&ndash;3 months of rent, plus termination fees, lost deposits, and legal costs.</p>
        <p style="font-size: 15px; color: #525252; line-height: 1.6; margin: 0 0 16px;">And it happens more often than you'd think. <strong style="color: #171717;">1 in 4 renters</strong> break their lease before it ends.</p>
        <div style="background: #fafafa; border-radius: 12px; padding: 20px; margin: 24px 0;">
          <p style="font-size: 14px; color: #525252; margin: 0;">LeaseFlex covers these costs starting at <strong style="color: #171717;">$9/month</strong> &mdash; price scales with your rent.</p>
        </div>
        <p style="font-size: 15px; color: #525252; line-height: 1.6;">We'll let you know the moment coverage is available in your area.</p>
        <p style="font-size: 15px; color: #171717; font-weight: 600; margin-top: 24px;">— Team LeaseFlex</p>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5;">
          <p style="font-size: 11px; color: #a3a3a3;">LeaseFlex &mdash; Mobility protection for renters</p>
        </div>
      </div>
    `,
  },
  {
    step: 3,
    delay_days: 10,
    subject: 'You\'re locked in — here\'s what happens next',
    html: (name: string, city?: string) => `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
        <h1 style="font-size: 24px; font-weight: 700; color: #171717; margin: 0 0 16px;">${name ? `${name}, you're` : "You're"} locked in</h1>
        <p style="font-size: 15px; color: #525252; line-height: 1.6; margin: 0 0 16px;">Quick update: we're getting close to launching${city ? ` in ${city}` : ''}.</p>
        <p style="font-size: 15px; color: #525252; line-height: 1.6; margin: 0 0 16px;">When we go live, here's what happens:</p>
        <div style="margin: 24px 0;">
          <div style="display: flex; gap: 12px; margin-bottom: 12px;">
            <div style="width: 24px; height: 24px; background: #171717; border-radius: 6px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-size: 11px; font-weight: 700;">1</span>
            </div>
            <p style="font-size: 14px; color: #525252; margin: 0; line-height: 1.6;">You'll get an email with your locked-in rate</p>
          </div>
          <div style="display: flex; gap: 12px; margin-bottom: 12px;">
            <div style="width: 24px; height: 24px; background: #171717; border-radius: 6px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-size: 11px; font-weight: 700;">2</span>
            </div>
            <p style="font-size: 14px; color: #525252; margin: 0; line-height: 1.6;">Activate protection in under 2 minutes</p>
          </div>
          <div style="display: flex; gap: 12px;">
            <div style="width: 24px; height: 24px; background: #171717; border-radius: 6px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-size: 11px; font-weight: 700;">3</span>
            </div>
            <p style="font-size: 14px; color: #525252; margin: 0; line-height: 1.6;">Coverage begins after your waiting period</p>
          </div>
        </div>
        <p style="font-size: 15px; color: #525252; line-height: 1.6;">No commitment, cancel anytime. We built this for people like you.</p>
        <p style="font-size: 15px; color: #171717; font-weight: 600; margin-top: 24px;">— Justin, Founder of LeaseFlex</p>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5;">
          <p style="font-size: 11px; color: #a3a3a3;">LeaseFlex &mdash; Mobility protection for renters</p>
        </div>
      </div>
    `,
  },
];

export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isSupabaseConfigured() || !supabase || !isResendConfigured()) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  const resend = getResend()!;
  let sent = 0;

  for (const drip of DRIP_EMAILS) {
    // Find waitlist entries that are ready for this step
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - drip.delay_days);

    const { data: recipients } = await supabase
      .from('waitlist')
      .select('email, name, city')
      .eq('drip_step', drip.step - 1)
      .lt('created_at', cutoffDate.toISOString())
      .limit(50);

    if (!recipients?.length) continue;

    for (const recipient of recipients) {
      try {
        await resend.emails.send({
          from: 'LeaseFlex <justin@leaseflex.io>',
          to: recipient.email,
          subject: drip.subject,
          html: drip.html(recipient.name, recipient.city),
        });

        await supabase
          .from('waitlist')
          .update({ drip_step: drip.step, last_drip_at: new Date().toISOString() })
          .eq('email', recipient.email);

        sent++;
      } catch (err) {
        console.error(`Drip email failed for ${recipient.email}:`, err);
      }
    }
  }

  console.log(`[Drip] Sent ${sent} emails`);
  return NextResponse.json({ success: true, sent });
}
