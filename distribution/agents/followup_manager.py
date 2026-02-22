"""
Agent 5 — Follow-up Manager
Checks for contacts that were emailed but haven't replied.
Generates and queues follow-up emails based on timing rules.
"""

import sys
import os
from datetime import datetime, timezone, timedelta
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.db import get_contacts, get_outreach_emails, insert_outreach_email, update_contact, get_db
from templates.emails import SEQUENCE, get_template


def get_contacts_needing_followup() -> list:
    """Find contacts who were emailed but haven't replied and are due for next sequence."""
    db = get_db()

    # Get all contacts with status 'emailed'
    result = db.table('contacts').select('*, buildings(*)').eq('status', 'emailed').execute()
    contacts = result.data or []

    needs_followup = []

    for contact in contacts:
        # Get their outreach history
        emails = db.table('outreach_emails').select('*').eq('contact_id', contact['id']).order('sequence_number', desc=True).execute()
        email_history = emails.data or []

        if not email_history:
            continue

        # Skip if they replied to anything
        if any(e.get('status') == 'replied' for e in email_history):
            continue

        # Find the latest sequence number sent
        latest = max(e['sequence_number'] for e in email_history if e['status'] == 'sent')

        # Check if there's a next sequence
        next_seq = latest + 1
        next_template = get_template(next_seq)
        if not next_template:
            continue  # No more follow-ups in the sequence

        # Check if enough time has passed
        latest_email = next(e for e in email_history if e['sequence_number'] == latest and e['status'] == 'sent')
        sent_at = datetime.fromisoformat(latest_email['sent_at'].replace('Z', '+00:00'))
        delay_days = next_template['delay_days']
        due_date = sent_at + timedelta(days=delay_days)

        if datetime.now(timezone.utc) >= due_date:
            needs_followup.append({
                'contact': contact,
                'building': contact.get('buildings') or {},
                'next_sequence': next_seq,
                'last_sent': sent_at,
                'days_since': (datetime.now(timezone.utc) - sent_at).days,
            })

    return needs_followup


def run(dry_run: bool = False):
    """Check for and generate follow-up emails."""
    print("Checking for contacts needing follow-up...\n")

    needs_followup = get_contacts_needing_followup()

    if not needs_followup:
        print("No contacts need follow-up right now.")
        return 0

    print(f"Found {len(needs_followup)} contacts due for follow-up:\n")
    generated = 0

    for item in needs_followup:
        contact = item['contact']
        building = item['building']
        next_seq = item['next_sequence']
        days_since = item['days_since']

        name = contact.get('full_name', 'Unknown')
        email = contact.get('email', 'no email')
        building_name = building.get('name', 'their building')

        print(f"  {name} <{email}>")
        print(f"    Building: {building_name}")
        print(f"    Last email: {days_since} days ago")
        print(f"    Next: sequence #{next_seq}")

        if dry_run:
            print(f"    [DRY RUN] Would generate follow-up")
            generated += 1
            continue

        # Generate the follow-up (using template — outreach_writer can personalize later)
        template = get_template(next_seq)
        first_name = name.split()[0] if name != 'Unknown' else 'there'
        variables = {
            'first_name': first_name,
            'building_name': building_name,
        }

        try:
            subject = template['subject'].format(**variables)
            body = template['body'].format(**variables)

            insert_outreach_email({
                'contact_id': contact['id'],
                'building_id': building.get('id'),
                'sequence_number': next_seq,
                'subject': subject,
                'body': body,
                'status': 'draft',
            })
            generated += 1
            print(f"    ✓ Follow-up draft created")
        except Exception as e:
            print(f"    ✗ Error: {e}")

    # Check for contacts who've gone through the full sequence with no reply
    max_sequence = max(t['sequence_number'] for t in SEQUENCE)
    stale = [item for item in needs_followup if item['next_sequence'] > max_sequence]
    if stale:
        print(f"\n{len(stale)} contacts completed full sequence with no reply.")
        print("Consider manual outreach or removing them from the pipeline.")

    print(f"\n{'='*50}")
    action = "Would generate" if dry_run else "Generated"
    print(f"{action} {generated} follow-up drafts")
    print(f"{'='*50}")
    return generated


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description='Follow-up Manager — generate follow-up emails')
    parser.add_argument('--dry-run', action='store_true', help='Preview without generating drafts')
    args = parser.parse_args()
    run(dry_run=args.dry_run)
