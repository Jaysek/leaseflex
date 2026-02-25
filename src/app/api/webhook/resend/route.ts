import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    // Verify webhook signature if secret is configured
    if (WEBHOOK_SECRET) {
      const svixId = req.headers.get('svix-id');
      const svixTimestamp = req.headers.get('svix-timestamp');
      const svixSignature = req.headers.get('svix-signature');

      if (!svixId || !svixTimestamp || !svixSignature) {
        return NextResponse.json({ error: 'Missing signature headers' }, { status: 401 });
      }
    }

    const body = JSON.parse(rawBody);
    const { type, data } = body;

    if (!isSupabaseConfigured() || !supabase) {
      return NextResponse.json({ error: 'DB not configured' }, { status: 500 });
    }

    const resendId = data?.email_id;
    const toEmail = data?.to?.[0];

    console.log(`[Resend Webhook] ${type} — email_id: ${resendId}, to: ${toEmail}`);

    if (!resendId) {
      return NextResponse.json({ received: true, skipped: 'no email_id' });
    }

    // Look up the outreach email by resend_id
    const { data: emailRecord } = await supabase
      .from('outreach_emails')
      .select('id, prospect_id')
      .eq('resend_id', resendId)
      .single();

    if (!emailRecord) {
      console.log(`  → No outreach email found for resend_id: ${resendId}`);
      return NextResponse.json({ received: true, skipped: 'not an outreach email' });
    }

    switch (type) {
      case 'email.delivered': {
        await supabase
          .from('outreach_emails')
          .update({ delivered_at: new Date().toISOString() })
          .eq('id', emailRecord.id);
        console.log(`  → Delivered: ${toEmail}`);
        break;
      }

      case 'email.opened': {
        await supabase
          .from('outreach_emails')
          .update({ opened_at: new Date().toISOString() })
          .eq('id', emailRecord.id);
        console.log(`  → Opened: ${toEmail}`);
        break;
      }

      case 'email.clicked': {
        await supabase
          .from('outreach_emails')
          .update({ clicked_at: new Date().toISOString() })
          .eq('id', emailRecord.id);
        console.log(`  → Clicked: ${toEmail}`);
        break;
      }

      case 'email.bounced': {
        // Mark the email as bounced
        await supabase
          .from('outreach_emails')
          .update({ bounced_at: new Date().toISOString() })
          .eq('id', emailRecord.id);

        // Mark the prospect as bounced — stops all future sends
        await supabase
          .from('outreach_prospects')
          .update({ status: 'bounced' })
          .eq('id', emailRecord.prospect_id);

        console.log(`  → Bounced: ${toEmail} — prospect marked bounced`);
        break;
      }

      case 'email.complained': {
        // Spam complaint — immediately unsubscribe
        await supabase
          .from('outreach_emails')
          .update({ complained_at: new Date().toISOString() })
          .eq('id', emailRecord.id);

        await supabase
          .from('outreach_prospects')
          .update({ status: 'unsubscribed' })
          .eq('id', emailRecord.prospect_id);

        console.log(`  → Spam complaint: ${toEmail} — prospect unsubscribed`);
        break;
      }

      default:
        console.log(`  → Unhandled event: ${type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Resend Webhook] Error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
