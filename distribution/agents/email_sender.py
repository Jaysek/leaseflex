"""
Agent 4 — Email Sender
Sends queued outreach emails via Resend.
Enforces daily send limit with warm-up ramp. Tracks delivery status.
"""

import sys
import os
import time
from datetime import datetime, timezone, date
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import resend
from utils.db import get_outreach_emails, update_outreach_email, update_contact, get_db
from utils.config import RESEND_API_KEY, FROM_EMAIL, DAILY_EMAIL_LIMIT

# Domain created on 2026-02-22 — warm up gradually
DOMAIN_BIRTH = date(2026, 2, 22)

# Warm-up schedule: (weeks_since_birth, max_daily_sends)
WARMUP_SCHEDULE = [
    (1, 15),   # Week 1: max 15/day
    (2, 25),   # Week 2: max 25/day
    (3, 40),   # Week 3: max 40/day
]
# After week 3: use full DAILY_EMAIL_LIMIT


def get_warmup_limit() -> int:
    """Get the current daily send limit based on domain age."""
    days_old = (date.today() - DOMAIN_BIRTH).days
    weeks_old = days_old / 7

    for week_threshold, limit in WARMUP_SCHEDULE:
        if weeks_old < week_threshold:
            return limit

    return DAILY_EMAIL_LIMIT


def get_today_send_count() -> int:
    """Count how many emails we've sent today."""
    db = get_db()
    today = datetime.now(timezone.utc).strftime('%Y-%m-%d')
    result = db.table('outreach_emails').select('id', count='exact').eq('status', 'sent').gte('sent_at', f'{today}T00:00:00Z').execute()
    return result.count or 0


def send_email(to: str, subject: str, body: str) -> dict:
    """Send an email via Resend."""
    resend.api_key = RESEND_API_KEY

    # Convert plain text body to simple HTML
    html_body = body.replace('\n\n', '</p><p>').replace('\n', '<br>')

    # Add signature
    signature = '''
    <div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #d4d4d4; font-family: Arial, Helvetica, sans-serif;">
        <p style="margin: 0 0 2px 0; font-size: 14px; font-weight: 600; color: #1a1a1a;">Justin Mendelson</p>
        <p style="margin: 0 0 10px 0; font-size: 12px; color: #666;">Founder</p>
        <table cellpadding="0" cellspacing="0" style="font-size: 12px; color: #555;">
            <tr>
                <td style="padding-right: 12px; border-right: 1px solid #d4d4d4;">
                    <a href="https://leaseflex.io" style="color: #1a1a1a; text-decoration: none; font-weight: 600;">LeaseFlex</a>
                </td>
                <td style="padding: 0 12px; border-right: 1px solid #d4d4d4;">
                    <a href="mailto:justin@leaseflex.io" style="color: #555; text-decoration: none;">justin@leaseflex.io</a>
                </td>
                <td style="padding: 0 12px; border-right: 1px solid #d4d4d4;">
                    <a href="tel:+12125551234" style="color: #555; text-decoration: none;">(212) 555-1234</a>
                </td>
                <td style="padding-left: 12px;">
                    <span style="color: #555;">200 West 67th St, New York, NY</span>
                </td>
            </tr>
        </table>
    </div>
    '''

    html_body = f'<div style="font-family: sans-serif; font-size: 14px; color: #333; line-height: 1.6;"><p>{html_body}</p>{signature}</div>'

    response = resend.Emails.send({
        'from': FROM_EMAIL,
        'to': [to],
        'subject': subject,
        'html': html_body,
    })
    return response


def queue_drafts():
    """Move all draft emails to queued status."""
    drafts = get_outreach_emails(status='draft')
    count = 0
    for draft in drafts:
        update_outreach_email(draft['id'], {'status': 'queued'})
        count += 1
    print(f"Queued {count} draft emails for sending")
    return count


def run(auto_queue: bool = False, dry_run: bool = False):
    """Send all queued emails, respecting daily limit."""
    if not RESEND_API_KEY:
        print("ERROR: RESEND_API_KEY not set. Add it to distribution/.env")
        return 0

    if auto_queue:
        queue_drafts()

    # Check daily limit (with warm-up)
    warmup_limit = get_warmup_limit()
    sent_today = get_today_send_count()
    remaining = warmup_limit - sent_today

    days_old = (date.today() - DOMAIN_BIRTH).days
    if warmup_limit < DAILY_EMAIL_LIMIT:
        print(f"Warm-up mode (domain is {days_old} days old): limit {warmup_limit}/day")

    if remaining <= 0:
        print(f"Daily limit reached ({warmup_limit} emails). Try again tomorrow.")
        return 0

    print(f"Sent today: {sent_today}/{warmup_limit}")
    print(f"Remaining capacity: {remaining}\n")

    # Get queued emails
    queued = get_outreach_emails(status='queued', limit=remaining)

    if not queued:
        print("No queued emails to send. Run outreach_writer first, then queue them.")
        return 0

    print(f"Sending {len(queued)} emails...\n")
    sent_count = 0

    for email in queued:
        contact = email.get('contacts') or {}
        to_email = contact.get('email')
        contact_name = contact.get('full_name', 'Unknown')

        if not to_email:
            print(f"  ✗ No email for contact, skipping")
            update_outreach_email(email['id'], {'status': 'draft'})
            continue

        if dry_run:
            print(f"  [DRY RUN] Would send to {contact_name} <{to_email}>: {email['subject']}")
            sent_count += 1
            continue

        try:
            result = send_email(to_email, email['subject'], email['body'])
            now = datetime.now(timezone.utc).isoformat()

            update_outreach_email(email['id'], {
                'status': 'sent',
                'sent_at': now,
            })
            update_contact(contact['id'], {'status': 'emailed'})

            print(f"  ✓ Sent to {contact_name} <{to_email}>")
            sent_count += 1

            # Rate limit: don't blast
            time.sleep(3)

        except Exception as e:
            error_str = str(e)
            if 'bounce' in error_str.lower() or 'invalid' in error_str.lower():
                update_outreach_email(email['id'], {'status': 'bounced'})
                print(f"  ✗ Bounced: {to_email}")
            else:
                print(f"  ✗ Error sending to {to_email}: {e}")

    print(f"\n{'='*50}")
    action = "Would have sent" if dry_run else "Sent"
    print(f"{action} {sent_count} emails")
    print(f"{'='*50}")
    return sent_count


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description='Email Sender — send queued outreach emails')
    parser.add_argument('--auto-queue', action='store_true', help='Auto-queue all drafts before sending')
    parser.add_argument('--dry-run', action='store_true', help='Preview sends without actually sending')
    args = parser.parse_args()
    run(auto_queue=args.auto_queue, dry_run=args.dry_run)
