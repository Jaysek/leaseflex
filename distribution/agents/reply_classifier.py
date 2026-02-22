"""
Agent 6 — Reply Classifier
Uses Claude AI to classify incoming replies and take action:
  - interested    → mark contact as 'replied', suggest response
  - not_interested → mark contact as 'rejected', stop sequence
  - out_of_office  → keep in sequence, retry later
  - wrong_person   → mark contact as 'rejected', note reason
  - unsubscribe    → mark contact as 'unsubscribed', stop all
  - question       → mark as 'replied', draft an answer

Usage:
    python reply_classifier.py --email "their reply text here"
    python reply_classifier.py --check-inbox   # Check for new replies via IMAP
    python run.py classify                      # Run from main CLI
"""

import sys
import os
import json
from datetime import datetime, timezone
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import anthropic
from utils.db import get_db, update_contact, update_outreach_email
from utils.config import ANTHROPIC_API_KEY

CATEGORIES = {
    'interested': {
        'contact_status': 'replied',
        'email_status': 'replied',
        'stop_sequence': True,
        'description': 'Wants to learn more, open to a call, positive response',
    },
    'not_interested': {
        'contact_status': 'rejected',
        'email_status': 'replied',
        'stop_sequence': True,
        'description': 'Polite or firm decline, not relevant, bad timing',
    },
    'out_of_office': {
        'contact_status': 'emailed',  # keep in sequence
        'email_status': 'sent',       # don't change
        'stop_sequence': False,
        'description': 'Auto-reply, vacation, will return later',
    },
    'wrong_person': {
        'contact_status': 'rejected',
        'email_status': 'replied',
        'stop_sequence': True,
        'description': 'Not the right contact, referred elsewhere',
    },
    'unsubscribe': {
        'contact_status': 'unsubscribed',
        'email_status': 'replied',
        'stop_sequence': True,
        'description': 'Asked to be removed, do not contact',
    },
    'question': {
        'contact_status': 'replied',
        'email_status': 'replied',
        'stop_sequence': True,
        'description': 'Asking about pricing, details, how it works',
    },
}


def classify_reply(reply_text: str, original_subject: str = '', contact_name: str = '') -> dict:
    """Use Claude to classify a reply and suggest next action."""
    if not ANTHROPIC_API_KEY:
        print("ERROR: ANTHROPIC_API_KEY not set")
        return {'category': 'question', 'confidence': 0, 'summary': 'Could not classify'}

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

    category_descriptions = '\n'.join(
        f'  - {cat}: {info["description"]}'
        for cat, info in CATEGORIES.items()
    )

    prompt = f"""Classify this email reply into one of these categories:
{category_descriptions}

Context:
- We sent a cold outreach email about LeaseFlex (a lease flexibility product for renters)
- We pitched it as a zero-cost amenity for property managers that increases lease conversion
- Original subject: {original_subject}
- Contact name: {contact_name}

Their reply:
---
{reply_text}
---

Respond in JSON with:
- "category": one of [{', '.join(CATEGORIES.keys())}]
- "confidence": 0.0 to 1.0
- "summary": one sentence summary of their reply
- "suggested_response": if category is "interested" or "question", draft a short reply (2-3 sentences, casual founder tone). Otherwise null.
- "notes": any useful context (e.g. "referred to Sarah Johnson", "back March 5th")

JSON only, no other text."""

    try:
        response = client.messages.create(
            model='claude-haiku-4-5-20251001',
            max_tokens=500,
            messages=[{'role': 'user', 'content': prompt}],
        )

        text = response.content[0].text.strip()
        # Handle potential markdown code blocks
        if text.startswith('```'):
            text = text.split('\n', 1)[1].rsplit('```', 1)[0].strip()

        result = json.loads(text)

        # Validate category
        if result.get('category') not in CATEGORIES:
            result['category'] = 'question'

        return result

    except Exception as e:
        print(f"Classification error: {e}")
        return {
            'category': 'question',
            'confidence': 0,
            'summary': f'Classification failed: {e}',
            'suggested_response': None,
            'notes': None,
        }


def process_reply(contact_email: str, reply_text: str) -> dict:
    """Classify a reply and update the database accordingly."""
    db = get_db()

    # Find the contact
    contact_result = db.table('contacts').select('*, buildings(*)').eq('email', contact_email).execute()
    if not contact_result.data:
        print(f"Contact not found: {contact_email}")
        return None

    contact = contact_result.data[0]
    building = contact.get('buildings') or {}

    # Find the most recent outreach email to this contact
    email_result = (db.table('outreach_emails')
        .select('*')
        .eq('contact_id', contact['id'])
        .eq('status', 'sent')
        .order('sent_at', desc=True)
        .limit(1)
        .execute())

    original_email = email_result.data[0] if email_result.data else {}
    original_subject = original_email.get('subject', '')

    # Classify
    print(f"\nClassifying reply from {contact.get('full_name', 'Unknown')} <{contact_email}>...")
    result = classify_reply(
        reply_text=reply_text,
        original_subject=original_subject,
        contact_name=contact.get('full_name', ''),
    )

    category = result['category']
    cat_config = CATEGORIES[category]

    print(f"  Category: {category} (confidence: {result.get('confidence', 'N/A')})")
    print(f"  Summary: {result.get('summary', 'N/A')}")

    # Update contact status
    contact_update = {'status': cat_config['contact_status']}
    if result.get('notes'):
        existing_notes = contact.get('notes') or ''
        contact_update['notes'] = f"{existing_notes}\n[{datetime.now().strftime('%Y-%m-%d')}] Reply classified as {category}: {result.get('notes')}".strip()

    update_contact(contact['id'], contact_update)
    print(f"  Contact status → {cat_config['contact_status']}")

    # Update outreach email status
    if original_email and cat_config['email_status'] != original_email.get('status'):
        update_outreach_email(original_email['id'], {'status': cat_config['email_status']})
        print(f"  Email status → {cat_config['email_status']}")

    # If stop sequence, mark any pending drafts/queued as cancelled
    if cat_config['stop_sequence']:
        pending = (db.table('outreach_emails')
            .select('id')
            .eq('contact_id', contact['id'])
            .in_('status', ['draft', 'queued'])
            .execute())
        for email in (pending.data or []):
            update_outreach_email(email['id'], {'status': 'draft'})
        if pending.data:
            print(f"  Cancelled {len(pending.data)} pending follow-ups")

    # Show suggested response
    if result.get('suggested_response'):
        print(f"\n  Suggested response:")
        print(f"  ---")
        for line in result['suggested_response'].split('\n'):
            print(f"  {line}")
        print(f"  ---")

    return result


def run_interactive():
    """Interactive mode: paste in a reply and classify it."""
    print("=" * 50)
    print("  Reply Classifier — Interactive Mode")
    print("=" * 50)

    contact_email = input("\nContact email: ").strip()
    if not contact_email:
        print("No email provided.")
        return

    print("Paste the reply (enter a blank line to finish):")
    lines = []
    while True:
        line = input()
        if line == '':
            break
        lines.append(line)

    reply_text = '\n'.join(lines)
    if not reply_text.strip():
        print("No reply text provided.")
        return

    result = process_reply(contact_email, reply_text)
    if result:
        print(f"\nDone. Category: {result['category']}")


def classify_from_text(contact_email: str, reply_text: str):
    """Non-interactive classification."""
    return process_reply(contact_email, reply_text)


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description='Reply Classifier — categorize incoming replies')
    parser.add_argument('--email', help='Contact email address')
    parser.add_argument('--reply', help='Reply text (or use interactive mode)')
    parser.add_argument('--interactive', action='store_true', help='Interactive paste mode')
    args = parser.parse_args()

    from dotenv import load_dotenv
    from pathlib import Path
    load_dotenv(Path(__file__).parent.parent / '.env')

    if args.email and args.reply:
        classify_from_text(args.email, args.reply)
    else:
        run_interactive()
