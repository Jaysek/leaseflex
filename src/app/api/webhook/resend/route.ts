import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET || '';

function getDb() {
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

function verifySignature(payload: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) return true; // Skip if not configured
  const expected = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payload)
    .digest('base64');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    // Verify webhook signature
    const signature = req.headers.get('svix-signature') || '';
    if (WEBHOOK_SECRET && !verifySignature(rawBody, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const body = JSON.parse(rawBody);
    const { type, data } = body;

    const db = getDb();
    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const toEmail = data?.to?.[0];

    console.log(`[Resend Webhook] ${type} — to: ${toEmail}`);

    switch (type) {
      case 'email.opened': {
        // Track open — find the outreach email by matching recipient
        if (toEmail) {
          const { data: contact } = await db
            .from('contacts')
            .select('id')
            .eq('email', toEmail)
            .single();

          if (contact) {
            // Update the most recent sent email to this contact
            const { data: emails } = await db
              .from('outreach_emails')
              .select('id')
              .eq('contact_id', contact.id)
              .eq('status', 'sent')
              .order('sent_at', { ascending: false })
              .limit(1);

            if (emails?.[0]) {
              await db
                .from('outreach_emails')
                .update({ status: 'opened' })
                .eq('id', emails[0].id);
              console.log(`  → Marked as opened for ${toEmail}`);
            }
          }
        }
        break;
      }

      case 'email.bounced': {
        if (toEmail) {
          const { data: contact } = await db
            .from('contacts')
            .select('id')
            .eq('email', toEmail)
            .single();

          if (contact) {
            // Mark email as bounced
            const { data: emails } = await db
              .from('outreach_emails')
              .select('id')
              .eq('contact_id', contact.id)
              .in('status', ['sent', 'queued'])
              .order('sent_at', { ascending: false })
              .limit(1);

            if (emails?.[0]) {
              await db
                .from('outreach_emails')
                .update({ status: 'bounced' })
                .eq('id', emails[0].id);
            }

            // Mark contact as rejected (bad email)
            await db
              .from('contacts')
              .update({ status: 'rejected' })
              .eq('id', contact.id);

            // Cancel any pending follow-ups
            await db
              .from('outreach_emails')
              .update({ status: 'draft' })
              .eq('contact_id', contact.id)
              .in('status', ['draft', 'queued']);

            console.log(`  → Bounced: ${toEmail} — contact rejected, follow-ups cancelled`);
          }
        }
        break;
      }

      case 'email.clicked': {
        console.log(`  → Click tracked for ${toEmail}`);
        // Could track which link was clicked via data.click.link
        break;
      }

      case 'email.complained': {
        // Spam complaint — immediately stop all outreach
        if (toEmail) {
          const { data: contact } = await db
            .from('contacts')
            .select('id')
            .eq('email', toEmail)
            .single();

          if (contact) {
            await db
              .from('contacts')
              .update({ status: 'unsubscribed' })
              .eq('id', contact.id);

            await db
              .from('outreach_emails')
              .update({ status: 'draft' })
              .eq('contact_id', contact.id)
              .in('status', ['draft', 'queued']);

            console.log(`  → Spam complaint from ${toEmail} — unsubscribed`);
          }
        }
        break;
      }

      case 'email.delivered': {
        console.log(`  → Delivered to ${toEmail}`);
        break;
      }

      default:
        console.log(`  → Unhandled event type: ${type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Resend Webhook] Error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
